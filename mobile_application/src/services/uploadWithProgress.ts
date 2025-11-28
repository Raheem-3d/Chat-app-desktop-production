import { apiClient } from './api';

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export interface UploadResult {
  url: string;
}

/**
 * Upload a file using XMLHttpRequest to provide progress callbacks.
 * Returns an object with `url` (uploaded file URL) on success.
 */
export function uploadWithProgress(
  file: UploadFile,
  onProgress?: (percent: number) => void,
  timeout = 60000
): Promise<UploadResult> {
  return new Promise(async (resolve, reject) => {
    try {
      // Resolve API endpoint
      const url = '/upload';
      
      // CRITICAL: Ensure token is loaded and set on axios defaults BEFORE making the request
      let token = apiClient.getInMemoryToken();
      if (!token) {
        token = await apiClient.getStoredToken();
        if (token) {
          // Apply token to axios defaults so all subsequent requests have it
          (apiClient as any).client.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      }

      const xhr = new XMLHttpRequest();
      const formData: any = new FormData();

      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      let didFinish = false;

      const fullUrl = (apiClient as any).client?.defaults?.baseURL ? (apiClient as any).client.defaults.baseURL + url : url;
      try {
        // minimal diagnostic: token presence (masking actual value)
        const tokenPreview = token ? ('***' + String(token).slice(-6)) : 'none';
        const axiosHeader = apiClient.getAxiosAuthHeader();
        const axiosHeaderPreview = axiosHeader ? ('***' + String(axiosHeader).slice(-6)) : 'none';
        // eslint-disable-next-line no-console
        console.log('[upload] POST', fullUrl, 'token:', token ? tokenPreview : 'none', 'axiosHeader:', axiosHeaderPreview);
      } catch (e) {
        // ignore logging errors
      }

      xhr.open('POST', fullUrl);

      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.onload = () => {
        didFinish = true;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            // Backend returns { success, files: [{ fileUrl, fileName, fileType, ... }], failed: [] }
            let fileUrl = '';
            if (res.files && res.files.length > 0) {
              fileUrl = res.files[0].fileUrl || '';
            } else if (res.url) {
              // Fallback for single-file response format
              fileUrl = res.url;
            } else if (res.fileUrl) {
              // Another fallback
              fileUrl = res.fileUrl;
            }
            if (!fileUrl) {
              reject(new Error('No file URL in upload response'));
            } else {
              resolve({ url: fileUrl });
            }
          } catch (e) {
            // If backend returns plain string
            resolve({ url: xhr.responseText });
          }
        } else {
          try {
            // eslint-disable-next-line no-console
            console.warn('[upload] failed status', xhr.status, 'response:', xhr.responseText);
          } catch (e) {
            // ignore
          }

          // If we received 401, try a one-off axios-based fallback upload which
          // uses apiClient (it may have auth headers set differently).
          if (xhr.status === 401) {
            (async () => {
              try {
                try {
                  // eslint-disable-next-line no-console
                  console.log('[upload][fallback] attempting axios fallback; axiosAuthHeader present:', !!(apiClient.getAxiosAuthHeader && apiClient.getAxiosAuthHeader()));
                } catch (e) {}

                const axiosRes = await apiClient.uploadFile(url, {
                  uri: file.uri,
                  name: file.name,
                  type: file.type,
                });

                let fileUrl = '';
                if (axiosRes && axiosRes.files && axiosRes.files.length > 0) fileUrl = axiosRes.files[0].fileUrl || '';
                else if (axiosRes && axiosRes.url) fileUrl = axiosRes.url;
                else if (axiosRes && axiosRes.fileUrl) fileUrl = axiosRes.fileUrl;

                if (fileUrl) {
                  resolve({ url: fileUrl });
                  return;
                }
              } catch (e) {
                try { console.warn('[upload][fallback] axios fallback failed:', e); } catch (ee) {}
              }
              // fallback didn't work — reject with original status
              reject(new Error(`Upload failed with status ${xhr.status}`));
            })();
            return;
          }

          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        if (!didFinish) reject(new Error('Network error during upload'));
      };

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgress === 'function') {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      // Timeout handling
      const to = setTimeout(() => {
        if (!didFinish) {
          try {
            xhr.abort();
          } catch (e) {
            // ignore
          }
          reject(new Error('Upload timed out'));
        }
      }, timeout);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          clearTimeout(to);
        }
      };

      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}
