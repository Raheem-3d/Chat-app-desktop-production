// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useChannelMessages, useSendChannelMessage } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import theme from '../../theme';
// import { formatDate } from '../../utils';
// import { Message } from '../../types';

// type RouteParams = {
//   channelId: string;
//   channelName: string;
// };

// export default function ChannelChatScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { channelId, channelName } = (route.params as RouteParams) || {};
//   const { user } = useAuthStore();
//   const [messageText, setMessageText] = useState('');
//   const flatListRef = useRef<FlatList>(null);

//   const { data: messages, isLoading, refetch } = useChannelMessages(channelId);

//   const sendMessage = useSendChannelMessage();

//   // Auto-refresh messages every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetch();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [refetch]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim()) return;

//     const text = messageText.trim();
//     setMessageText('');

//     try {
//       await sendMessage.mutateAsync({
//         channelId,
//         data: { content: text },
//       });
//       refetch();
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   const renderMessage = ({ item }: { item: Message }) => {
//     const isOwnMessage = item.senderId === user?.id;

//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
//         ]}
//       >
//         {!isOwnMessage && (
//           <Text style={styles.senderName}>{item.sender?.name || 'Unknown'}</Text>
//         )}
//         <View
//           style={[
//             styles.messageBubble,
//             isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
//           ]}
//         >
//           <Text
//             style={[
//               styles.messageText,
//               isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
//             ]}
//           >
//             {item.content}
//           </Text>
//         </View>
//         <Text style={styles.messageTime}>{formatDate(item.createdAt)}</Text>
//       </View>
//     );
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.loading}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       </SafeAreaView>
//     );
//   }




//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle}>#{channelName}</Text>
//         </View>
//       </View>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={styles.chatContainer}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         {/* Messages List */}
//         <FlatList
//           ref={flatListRef}
//           data={messages || []}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.messagesList}
//           inverted={false}
//           onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//           ListEmptyComponent={
//             <View style={styles.emptyMessages}>
//               <Text style={styles.emptyText}>No messages yet</Text>
//               <Text style={styles.emptySubtext}>Start the conversation!</Text>
//             </View>
//           }
//         />

//         {/* Message Input */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             placeholderTextColor={theme.colors.text.secondary}
//             value={messageText}
//             onChangeText={setMessageText}
//             multiline
//             maxLength={1000}
//           />
//           <TouchableOpacity
//             style={[
//               styles.sendButton,
//               !messageText.trim() && styles.sendButtonDisabled,
//             ]}
//             onPress={handleSendMessage}
//             disabled={!messageText.trim() || sendMessage.isPending}
//           >
//             {sendMessage.isPending ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Ionicons name="send" size={20} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     backgroundColor: theme.colors.background.paper,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   backButton: {
//     padding: theme.spacing.xs,
//     marginRight: theme.spacing.sm,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   headerTitle: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   chatContainer: {
//     flex: 1,
//   },
//   messagesList: {
//     padding: theme.spacing.md,
//     flexGrow: 1,
//   },
//   messageContainer: {
//     marginBottom: theme.spacing.md,
//     maxWidth: '80%',
//   },
//   ownMessageContainer: {
//     alignSelf: 'flex-end',
//     alignItems: 'flex-end',
//   },
//   otherMessageContainer: {
//     alignSelf: 'flex-start',
//     alignItems: 'flex-start',
//   },
//   senderName: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//     marginBottom: 4,
//     marginLeft: theme.spacing.sm,
//   },
//   messageBubble: {
//     borderRadius: 16,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//   },
//   ownMessageBubble: {
//     backgroundColor: theme.colors.primary[500],
//     borderBottomRightRadius: 4,
//   },
//   otherMessageBubble: {
//     backgroundColor: theme.colors.gray[200],
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     ...theme.typography.body1,
//   },
//   ownMessageText: {
//     color: '#fff',
//   },
//   otherMessageText: {
//     color: theme.colors.text.primary,
//   },
//   messageTime: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//     marginTop: 4,
//     marginHorizontal: theme.spacing.sm,
//   },
//   emptyMessages: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: theme.spacing.xxl,
//   },
//   emptyText: {
//     ...theme.typography.h4,
//     color: theme.colors.text.secondary,
//   },
//   emptySubtext: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     marginTop: theme.spacing.xs,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     backgroundColor: theme.colors.background.paper,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.border.light,
//   },
//   input: {
//     flex: 1,
//     ...theme.typography.body1,
//     backgroundColor: theme.colors.background.default,
//     borderRadius: 20,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     marginRight: theme.spacing.sm,
//     maxHeight: 100,
//     color: theme.colors.text.primary,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.primary[500],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonDisabled: {
//     opacity: 0.5,
//   },
// });


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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useChannelMessages, useSendChannelMessage } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import { formatDate } from '../../utils';
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

// Avatar color palette
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
  const flatListRef = useRef<FlatList>(null);

  const { data: messages, isLoading, refetch } = useChannelMessages(channelId);
  const sendMessage = useSendChannelMessage();

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sendMessage.isPending) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      await sendMessage.mutateAsync({
        channelId,
        data: { content: text },
      });
      await refetch();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(text);
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
          </View>
          
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {formatMessageTime(item.createdAt)}
            </Text>
            {isOwnMessage && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color="rgba(255, 255, 255, 0.5)"
                style={styles.readIcon}
              />
            )}
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
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
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
                (!messageText.trim() || sendMessage.isPending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
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
});