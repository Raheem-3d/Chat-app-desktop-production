import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useApi';
import { useAuthStore } from '../stores';
import { userService } from '../services/user.service';
import { socketService } from '../services/socket.service';
import { apiClient } from '../services/api';
import type { Message, Attachment } from '../types';
import { uploadWithProgress, UploadFile } from '../services/uploadWithProgress';

function makeClientId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function useOptimisticSend() {
  const qc = useQueryClient();
  const { user } = useAuthStore();

  const sendDirect = useCallback(
    async (opts: { receiverId: string; content: string; files?: { uri: string; name: string; type: string }[] }) => {
      // CRITICAL: Ensure token is loaded before attempting to send/upload
      const storedToken = await apiClient.getStoredToken();
      if (storedToken && !apiClient.getInMemoryToken()) {
        (apiClient as any).client.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      }

      const { receiverId, content, files } = opts;
      const clientId = makeClientId();

      const localMsg: any = {
        id: clientId,
        clientId,
        content,
        senderId: user?.id || 'unknown',
        receiverId,
        channelId: null,
        organizationId: null,
        isPinned: false,
        attachments: files
          ? files.map((f) => ({ fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: 0 }))
          : [],
        fileUrl: null,
        fileName: null,
        fileType: null,
        seenBy: null,
        reactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        pinnedMessageId: null,
        __status: 'pending',
      } as Message & { __status?: string };

      // Insert optimistic message into cache
      qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
        const arr = Array.isArray(old) ? old : [];
        return [localMsg, ...arr];
      });

      try {
        // If there are files, upload them first with progress updates
        let attachments: Attachment[] | undefined = undefined;
        if (files && files.length > 0) {
          attachments = [];
          // Insert placeholders into the optimistic message attachments with progress 0
          qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
            const arr = Array.isArray(old) ? old : [];
            return arr.map((m: any) => (m.clientId === clientId ? { ...m, attachments: files.map((f) => ({ fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: 0 })) } : m));
          });

          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            try {
              const uploadRes = await uploadWithProgress({ uri: f.uri, name: f.name, type: f.type } as UploadFile, (percent) => {
                // update progress for this attachment in cache
                qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
                  const arr = Array.isArray(old) ? old : [];
                  return arr.map((m: any) => {
                    if (m.clientId !== clientId) return m;
                    const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                    if (!atts[i]) atts[i] = { fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: percent };
                    else atts[i] = { ...atts[i], progress: percent };
                    return { ...m, attachments: atts };
                  });
                });

              });

              if (uploadRes.url) {
                attachments.push({ fileUrl: uploadRes.url, fileName: f.name, fileType: f.type });
              }

              // update attachment to final url
              qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
                const arr = Array.isArray(old) ? old : [];
                return arr.map((m: any) => {
                  if (m.clientId !== clientId) return m;
                  const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                  if (atts[i]) atts[i] = { ...atts[i], fileUrl: uploadRes.url || '', progress: 100 };
                  return { ...m, attachments: atts };
                });
              });

            } catch (e) {
              // ignore upload error per-file, will fall back to sending without attachment
              // mark attachment as error
              qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
                const arr = Array.isArray(old) ? old : [];
                return arr.map((m: any) => {
                  if (m.clientId !== clientId) return m;
                  const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                  if (atts[i]) atts[i] = { ...atts[i], progress: -1 };
                  return { ...m, attachments: atts };
                });
              });
              // eslint-disable-next-line no-console
              console.warn('[useOptimisticSend] upload failed for file', f, e);
            }
          }
        }

        // Try socket emit with ack
        try {
          const ack = await socketService.emit('message:send', { receiverId, content, attachments }, 5000);
          if (ack && ack.message) {
            const serverMsg = ack.message as Message;
            // Replace local message with server message
            qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
              const arr = Array.isArray(old) ? old : [];
              return [serverMsg, ...arr.filter((m: any) => m.id !== clientId)];
            });
            return serverMsg;
          }
        } catch (e) {
          // socket failed; fall back to REST below
          // eslint-disable-next-line no-console
          console.warn('[useOptimisticSend] socket emit failed, falling back to REST', e);
        }

        // REST fallback
        // Allow send if: (1) user typed content, OR (2) user selected files (even if uploads failed).
        // This prevents messages from vanishing when attachment uploads fail due to auth issues.
        const hasContent = content.trim().length > 0;
        const hasValidFiles = Array.isArray(attachments) && attachments.length > 0 && attachments.some(f => f.fileUrl);
        const userSelectedFiles = files && files.length > 0;
        
        if (!hasContent && !hasValidFiles && !userSelectedFiles) {
          throw new Error('No content or files to send');
        }

        const sent = await userService.sendDirectMessage(receiverId, { 
          content: content.trim() || '', 
          files: attachments 
        });

        // Replace local message
        qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
          const arr = Array.isArray(old) ? old : [];
          return [sent, ...arr.filter((m: any) => m.id !== clientId)];
        });

        return sent;
      } catch (err) {
        // mark message as error in cache
        qc.setQueryData(queryKeys.directMessages(receiverId), (old: any) => {
          const arr = Array.isArray(old) ? old : [];
          return arr.map((m: any) => (m.id === clientId ? { ...m, __status: 'error' } : m));
        });
        throw err;
      }
    },
    [qc, user]
  );

  const sendChannel = useCallback(
    async (opts: { channelId: string; content: string; files?: { uri: string; name: string; type: string }[] }) => {
      // CRITICAL: Ensure token is loaded before attempting to send/upload
      const storedToken = await apiClient.getStoredToken();
      if (storedToken && !apiClient.getInMemoryToken()) {
        (apiClient as any).client.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      }

      const { channelId, content, files } = opts;
      const clientId = makeClientId();

      const localMsg: any = {
        id: clientId,
        clientId,
        content,
        senderId: user?.id || 'unknown',
        receiverId: null,
        channelId,
        organizationId: null,
        isPinned: false,
        attachments: files
          ? files.map((f) => ({ fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: 0 }))
          : [],
        fileUrl: null,
        fileName: null,
        fileType: null,
        seenBy: null,
        reactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        pinnedMessageId: null,
        __status: 'pending',
      } as Message & { __status?: string };

      // Insert optimistic message into cache
      qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
        const arr = Array.isArray(old) ? old : [];
        return [localMsg, ...arr];
      });

      try {
        let attachments: Attachment[] | undefined = undefined;
        if (files && files.length > 0) {
          attachments = [];
          // insert placeholders with progress 0
          qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
            const arr = Array.isArray(old) ? old : [];
            return arr.map((m: any) => (m.clientId === clientId ? { ...m, attachments: files.map((f) => ({ fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: 0 })) } : m));
          });

          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            try {
              const uploadRes = await uploadWithProgress({ uri: f.uri, name: f.name, type: f.type } as UploadFile, (percent) => {
                qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
                  const arr = Array.isArray(old) ? old : [];
                  return arr.map((m: any) => {
                    if (m.clientId !== clientId) return m;
                    const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                    if (!atts[i]) atts[i] = { fileUrl: f.uri, fileName: f.name, fileType: f.type, progress: percent };
                    else atts[i] = { ...atts[i], progress: percent };
                    return { ...m, attachments: atts };
                  });
                });
              });

              if (uploadRes.url) {
                attachments.push({ fileUrl: uploadRes.url, fileName: f.name, fileType: f.type });
              }

              qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
                const arr = Array.isArray(old) ? old : [];
                return arr.map((m: any) => {
                  if (m.clientId !== clientId) return m;
                  const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                  if (atts[i]) atts[i] = { ...atts[i], fileUrl: uploadRes.url || '', progress: 100 };
                  return { ...m, attachments: atts };
                });
              });

            } catch (e) {
              qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
                const arr = Array.isArray(old) ? old : [];
                return arr.map((m: any) => {
                  if (m.clientId !== clientId) return m;
                  const atts = Array.isArray(m.attachments) ? m.attachments.slice() : [];
                  if (atts[i]) atts[i] = { ...atts[i], progress: -1 };
                  return { ...m, attachments: atts };
                });
              });
              // eslint-disable-next-line no-console
              console.warn('[useOptimisticSend] upload failed for file', f, e);
            }
          }
        }

        try {
          const ack = await socketService.emit('channel:message:send', { channelId, content, attachments }, 5000);
          if (ack && ack.message) {
            const serverMsg = ack.message as Message;
            qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
              const arr = Array.isArray(old) ? old : [];
              return [serverMsg, ...arr.filter((m: any) => m.id !== clientId)];
            });
            return serverMsg;
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[useOptimisticSend] socket channel emit failed, falling back to REST', e);
        }

        // REST fallback via userService or channelService
        // channelService is used elsewhere; import lazily to avoid circular deps
        const hasContent = content.trim().length > 0;
        const hasValidFiles = Array.isArray(attachments) && attachments.length > 0 && attachments.some(f => f.fileUrl);
        const userSelectedFiles = files && files.length > 0;
        
        if (!hasContent && !hasValidFiles && !userSelectedFiles) {
          throw new Error('No content or files to send');
        }

        const { channelService } = await import('../services/channel.service');
        const res = await channelService.sendChannelMessage(channelId, { 
          content: content.trim() || '', 
          files: attachments 
        });

        qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
          const arr = Array.isArray(old) ? old : [];
          return [res, ...arr.filter((m: any) => m.id !== clientId)];
        });

        return res;
      } catch (err) {
        qc.setQueryData(queryKeys.channelMessages(channelId), (old: any) => {
          const arr = Array.isArray(old) ? old : [];
          return arr.map((m: any) => (m.id === clientId ? { ...m, __status: 'error' } : m));
        });
        throw err;
      }
    },
    [qc, user]
  );

  return { sendDirect, sendChannel };
}
