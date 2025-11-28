import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export interface DownloadFile {
  url: string;
  fileName: string;
  fileType?: string;
}

export interface DownloadResult {
  uri: string;
  fileName: string;
}

/**
 * Download a file from URL with progress tracking.
 * Saves to device downloads folder and optionally to media library.
 */
export async function downloadWithProgress(
  file: DownloadFile,
  onProgress?: (percent: number) => void
): Promise<DownloadResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = file.fileName || `download_${Date.now()}`;
      const fileUri = `${FileSystem.DocumentDirectory}/${fileName}`;

      // Download file with progress
      const downloadResumable = FileSystem.createDownloadResumable(
        file.url,
        fileUri,
        {},
        (downloadProgress) => {
          const percent = Math.round(
            (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
          );
          if (typeof onProgress === 'function') {
            onProgress(percent);
          }
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (!result || !result.uri) {
        reject(new Error('Download failed: No URI returned'));
        return;
      }

      // Try to save to media library if it's an image or video
      if (file.fileType && (file.fileType.startsWith('image/') || file.fileType.startsWith('video/'))) {
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            await MediaLibrary.createAssetAsync(result.uri);
            console.log('[download] Saved to media library:', fileName);
          }
        } catch (e) {
          console.warn('[download] Could not save to media library:', e);
          // Don't fail the download, just warn
        }
      }

      resolve({
        uri: result.uri,
        fileName: fileName,
      });
    } catch (error) {
      console.error('[download] Download failed:', error);
      reject(error);
    }
  });
}

/**
 * Share a file (open share sheet or file picker)
 */
export async function shareFile(fileUri: string, fileName: string): Promise<void> {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing is not available on this device');
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/octet-stream',
      dialogTitle: `Share ${fileName}`,
    });
  } catch (error) {
    console.error('[share] Share failed:', error);
    throw error;
  }
}
