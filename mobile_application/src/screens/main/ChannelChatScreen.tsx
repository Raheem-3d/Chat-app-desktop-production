

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useChannelMessages, useSendChannelMessage } from '../../hooks/useApi';
import useOptimisticSend from '../../hooks/useOptimisticSend';
import { useAuthStore } from '../../stores';
import { formatDate } from '../../utils';
import { downloadWithProgress, shareFile } from '../../services/downloadWithProgress';
import { Message } from '../../types';

// Modern dark theme colors
const colors = {
  background: '#0f172a',
  card: '#1e293b',
  cardLight: '#334155',
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#4ade80',
  warning: '#fbbf24',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  messageBubbleOwn: '#667eea',
  messageBubbleOther: '#334155',
};


type RouteParams = {
  channelId: string;
  channelName: string;
};



// **Web/Desktop:**

// 1. Upload the code to the server.
// 2. Build the desktop application.
// 3. Upload the project to GitHub and deploy it on rumzz.com.

// **Mobile App:**

// 1. Create a message list component.

const avatarColors = [
  '#667eea', '#764ba2', '#f093fb', '#4ade80', 
  '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'
];

export default function ChannelChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { channelId, channelName } = (route.params as RouteParams) || {};
  const { user } = useAuthStore();
  const [messageText, setMessageText] = useState('');
  const [attachmentsToSend, setAttachmentsToSend] = useState<Array<{ uri: string; name: string; type: string; size?: number }>>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const { data: messages, isLoading, refetch } = useChannelMessages(channelId);
  const { sendChannel } = useOptimisticSend();

  // Auto-refresh messages every 5 seconds but avoid overwriting optimistic pending messages
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const hasPending = Array.isArray(messages) && messages.some((m: any) => m && m.__status === 'pending');
        if (!hasPending) {
          refetch();
        }
      } catch (e) {
        refetch();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch, messages]);

  const handleSendMessage = async () => {
    // Allow sending if there's text OR attachments
    if (!messageText.trim() && attachmentsToSend.length === 0) return;

    const text = messageText.trim();
    setMessageText('');
    try {
      await sendChannel({ channelId, content: text, files: attachmentsToSend.map(a => ({ uri: a.uri, name: a.name, type: a.type })) });
      setAttachmentsToSend([]);
      await refetch();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(text);
    }
  };

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.8 });
      if (!res.canceled && res.assets && res.assets[0]) {
        const asset = res.assets[0];
        const mimeType = asset.type === 'video' ? 'video/mp4' : 'image/jpeg';
        const fileName = asset.fileName || `media_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`;
        setAttachmentsToSend((prev) => [...prev, { uri: asset.uri, name: fileName, type: mimeType, size: asset.fileSize }]);
      }
    } catch (e) {
      console.warn('pickImage failed', e);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      // expo-document-picker returns { type: 'success'|'cancel', uri, name, size, mimeType }
      if (res && (res as any).type === 'success') {
        const doc: any = res;
        setAttachmentsToSend((prev) => [...prev, { uri: doc.uri, name: doc.name, type: doc.mimeType || 'application/octet-stream', size: doc.size }]);
      }
    } catch (e) {
      console.warn('pickDocument failed', e);
    }
  };

  const getAvatarColor = (name: string) => {
    const charCode = name?.charCodeAt(0) || 0;
    return avatarColors[charCode % avatarColors.length];
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / 36e5;

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return formatDate(date);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === user?.id;
    const prevMessage = messages && index > 0 ? messages[index - 1] : null;
    const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;
    const senderName = item.sender?.name || 'Unknown User';
    const statusIndicator = isOwnMessage
      ? ( (item as any).__status === 'pending'
          ? <ActivityIndicator size="small" color="rgba(255,255,255,0.9)" />
          : ( (item as any).__status === 'error'
              ? <Ionicons name="alert-circle" size={14} color={colors.warning} style={styles.readIcon} />
              : <Ionicons name="checkmark-done" size={14} color="rgba(255, 255, 255, 0.5)" style={styles.readIcon} />
            )
        )
      : null;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isOwnMessage && showAvatar && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(senderName) }]}>
              <Text style={styles.avatarText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        )}
        {!isOwnMessage && !showAvatar && <View style={styles.avatarPlaceholder} />}

        <View style={styles.messageContent}>
          {!isOwnMessage && showAvatar && (
            <Text style={styles.senderName}>{senderName}</Text>
          )}
          
          <View
            style={[
              styles.messageBubble,
              isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {item.content}
            </Text>
            {item.attachments && item.attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {item.attachments.map((att: any, ai: number) => {
                  const attachmentId = `${item.id}:att:${ai}`;
                  const isDownloading = downloadingId === attachmentId;
                  return (
                    <View key={attachmentId} style={styles.attachmentItem}>
                      {att.fileType && att.fileType.startsWith('image/') ? (
                        <Image source={{ uri: att.fileUrl || att.fileUrl }} style={styles.attachmentImage} />
                      ) : (
                        <View style={styles.attachmentFilePlaceholder}>
                          <Text style={styles.attachmentFileName}>{att.fileName || 'file'}</Text>
                        </View>
                      )}
                      {typeof att.progress === 'number' && att.progress >= 0 && att.progress < 100 && (
                        <View style={styles.attachmentProgressWrap}>
                          <View style={[styles.attachmentProgressFill, { width: `${att.progress}%` }]} />
                        </View>
                      )}
                      {typeof att.progress === 'number' && att.progress === -1 && (
                        <Ionicons name="alert-circle" size={18} color={colors.warning} />
                      )}
                      {/* Download & Share Buttons */}
                      <View style={styles.attachmentButtonsContainer}>
                        <TouchableOpacity
                          style={styles.attachmentButton}
                          onPress={async () => {
                            try {
                              setDownloadingId(attachmentId);
                              setDownloadProgress(0);
                              await downloadWithProgress(
                                {
                                  url: att.fileUrl,
                                  fileName: att.fileName,
                                  fileType: att.fileType,
                                },
                                (percent) => setDownloadProgress(percent)
                              );
                              alert('✅ Download complete!');
                            } catch (e) {
                              console.error('Download failed:', e);
                              alert('❌ Download failed');
                            } finally {
                              setDownloadingId(null);
                              setDownloadProgress(0);
                            }
                          }}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                          ) : (
                            <Ionicons name="download" size={16} color={colors.primary} />
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.attachmentButton}
                          onPress={async () => {
                            try {
                              await shareFile(att.fileUrl, att.fileName);
                            } catch (e) {
                              console.error('Share failed:', e);
                              alert('❌ Share failed');
                            }
                          }}
                        >
                          <Ionicons name="share-social" size={16} color={colors.accent} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {formatMessageTime(String(item.createdAt))}
            </Text>
            {statusIndicator}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="chatbubbles-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to start the conversation in #{channelName}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.channelIcon, { backgroundColor: colors.primary + '30' }]}>
            <Text style={styles.channelHash}>#</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{channelName}</Text>
            <Text style={styles.headerSubtitle}>
              {messages?.length || 0} messages
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages || []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            (!messages || messages.length === 0) && styles.messagesListEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onContentSizeChange={() => {
            if (messages && messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />

        {/* Message Input */}
        <View style={styles.inputWrapper}>
          {/* Selected attachments preview */}
          {attachmentsToSend.length > 0 && (
            <View style={styles.selectedAttachmentsRow}>
              {attachmentsToSend.map((a, idx) => (
                <View key={a.uri + idx} style={styles.selectedAttachmentItem}>
                  <Image source={{ uri: a.uri }} style={styles.selectedAttachmentImage} />
                  <TouchableOpacity onPress={() => setAttachmentsToSend((prev) => prev.filter((_, i) => i !== idx))} style={styles.removeAttachmentButton}>
                    <Ionicons name="close-circle" size={20} color={colors.warning} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={28} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
              <Ionicons name="document-text-outline" size={28} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={colors.textTertiary}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={1000}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!messageText.trim() && attachmentsToSend.length === 0) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() && attachmentsToSend.length === 0}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelHash: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '75%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageBubble: {
    backgroundColor: colors.messageBubbleOwn,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  otherMessageBubble: {
    backgroundColor: colors.messageBubbleOther,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  readIcon: {
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    backgroundColor: colors.cardLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
    paddingVertical: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textTertiary,
    shadowOpacity: 0.2,
    opacity: 0.5,
  },
  attachmentsContainer: {
    marginTop: 8,
    gap: 8,
  },
  attachmentItem: {
    marginTop: 6,
  },
  attachmentImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginTop: 6,
  },
  attachmentButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  attachmentFilePlaceholder: {
    width: 160,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  attachmentFileName: {
    color: colors.textSecondary,
  },
  attachmentProgressWrap: {
    height: 6,
    backgroundColor: colors.cardLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  attachmentProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  selectedAttachmentsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  selectedAttachmentItem: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.cardLight,
  },
  selectedAttachmentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
});