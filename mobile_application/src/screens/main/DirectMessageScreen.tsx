
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDirectMessages, useSendDirectMessage } from '../../hooks/useApi';
import useOptimisticSend from '../../hooks/useOptimisticSend';
import { useAuthStore } from '../../stores';
import { formatDate } from '../../utils';
import { downloadWithProgress, shareFile } from '../../services/downloadWithProgress';
import type { Message } from '../../types';

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

export default function DirectMessageScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  // @ts-ignore
  const { userId, userName } = route.params;
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState<Array<{ uri: string; name: string; type: string; size?: number }>>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const { data: messages, isLoading, refetch } = useDirectMessages(userId);
  const { sendDirect } = useOptimisticSend();

  // Auto-refresh messages every 5 seconds, but avoid overwriting optimistic
  // pending messages while uploads are in progress.
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const hasPending = Array.isArray(messages) && messages.some((m: any) => m && m.__status === 'pending');
        if (!hasPending) {
          refetch();
        }
      } catch (e) {
        // defensive: still attempt refetch on unexpected error
        refetch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch, messages]);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isTyping, typingAnimation]);
//
  const handleSend = async () => {
    // Allow sending if there's text OR attachments
    if (!message.trim() && attachmentsToSend.length === 0) return;

    const messageText = message.trim();
    setMessage('');
    setIsTyping(false);

    try {
      // Use optimistic send which inserts a pending message into cache
      await sendDirect({ receiverId: userId, content: messageText, files: attachmentsToSend.map(a => ({ uri: a.uri, name: a.name, type: a.type })) });
      // clear attachments after initiating send
      setAttachmentsToSend([]);
      // refetch to reconcile with server state  
      refetch();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
//
  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const ok = await requestImagePermission();
    if (!ok) return;
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
        setAttachmentsToSend((prev) => [
          ...prev,
          { uri: doc.uri, name: doc.name, type: doc.mimeType || 'application/octet-stream', size: doc.size },
        ]);
      }
    } catch (e) {
      console.warn('pickDocument failed', e);
    }
  };

  const handleTyping = (text: string) => {
    setMessage(text);
    setIsTyping(text.length > 0);
  };

  // Compute a responsive tab-bar / input spacing so input sits above
  // the floating tab bar across device sizes. This mirrors the logic
  // used in the navigator for bar height.
  const safeBottom = insets?.bottom || 0;
  const barHeight = Math.min(86, 64 + Math.round(safeBottom));
  const inputAreaHeight = 64; // approximate input wrapper height
  // Use a smaller, clamped margin so the input doesn't float too high.
  // Keep a small margin above the system inset so the input stays near
  // the bottom but still clears the tab bar / home indicator.
  const computedMargin = Math.max(8, Math.round(safeBottom + 8));
  // when input is absolutely positioned at the bottom, add padding equal
  // to the input area height + safe inset so list content isn't hidden.
  const listPaddingBottom = inputAreaHeight + safeBottom + 24;

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
// 
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === user?.id;
    const prevMessage = messages && index < messages.length - 1 ? messages[index + 1] : null;
    const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;
    const statusIndicator = isOwnMessage
      ? ( (item as any).__status === 'pending'
          ? <ActivityIndicator size="small" color="rgba(255,255,255,0.9)" />
          : ( (item as any).__status === 'error'
              ? <Ionicons name="alert-circle" size={14} color={colors.warning} style={styles.readIcon} />
              : <Ionicons name="checkmark-done" size={14} color="rgba(255, 255, 255, 0.7)" style={styles.readIcon} />
            )
        )
      : null;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.messageContainerOwn : styles.messageContainerOther,
        ]}
      >
        {!isOwnMessage && showAvatar && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>
                {userName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
        )}
        {!isOwnMessage && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.messageTextOwn : styles.messageTextOther,
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
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isOwnMessage ? styles.messageTimeOwn : styles.messageTimeOther,
              ]}
            >
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
        <Ionicons name="chatbubbles-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>Start a conversation</Text>
      <Text style={styles.emptySubtitle}>
        Send a message to {userName} to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatarContainer}>
              <View style={[styles.headerAvatar, { backgroundColor: colors.accent }]}>
                <Text style={styles.headerAvatarText}>
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={[styles.onlineStatus, { backgroundColor: colors.success }]} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{userName}</Text>
              <Text style={styles.headerSubtitle}>Active now</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages || []}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.messagesList,
                (!messages || messages.length === 0) && styles.messagesListEmpty,
                // ensure list leaves room for the input area and floating tab bar
                { paddingBottom: listPaddingBottom },
              ]}
            inverted
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicatorContainer}>
            <View style={styles.typingBubble}>
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.3],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Message Input */} 
        <View style={[
          styles.inputWrapper,
          {
            marginBottom: barHeight / 2,
            paddingBottom: safeBottom,
            elevation: 12,
            zIndex: 12,
          },
        ]}>
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
                value={message}
                onChangeText={handleTyping}
                multiline
                maxLength={1000}
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!message.trim() && attachmentsToSend.length === 0) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim() && attachmentsToSend.length === 0}
            >
              <Ionicons
                name={(message.trim() || attachmentsToSend.length > 0) ? "send" : "mic"}
                size={20}
                color="#fff"
              />
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
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.card,
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
    color: colors.success,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
  },
  loadingContainer: {
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
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messagesListEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
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
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  selectedAttachmentItem: {
    position: 'relative',
  },
  selectedAttachmentImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageContainerOwn: {
    justifyContent: 'flex-end',
  },
  messageContainerOther: {
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
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleOwn: {
    backgroundColor: colors.messageBubbleOwn,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: colors.messageBubbleOther,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  messageTextOwn: {
    color: '#fff',
  },
  messageTextOther: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  messageTimeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: colors.textTertiary,
  },
  readIcon: {
    marginLeft: 4,
  },
  typingIndicatorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.cardLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
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
    backgroundColor: colors.cardLight,
    shadowOpacity: 0,
  },
});