

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useDirectMessages, useSendDirectMessage } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import { formatDate } from '../../utils';
// import type { Message } from '../../types';

// // Modern dark theme colors
// const colors = {
//   background: '#0f172a',
//   card: '#1e293b',
//   cardLight: '#334155',
//   primary: '#667eea',
//   secondary: '#764ba2',
//   accent: '#f093fb',
//   success: '#4ade80',
//   warning: '#fbbf24',
//   text: '#f1f5f9',
//   textSecondary: '#cbd5e1',
//   textTertiary: '#94a3b8',
//   messageBubbleOwn: '#667eea',
//   messageBubbleOther: '#334155',
// };

// export default function DirectMessageScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   // @ts-ignore
//   const { userId, userName } = route.params;
//   const { user } = useAuthStore();
//   const [message, setMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const flatListRef = useRef<FlatList>(null);
//   const typingAnimation = useRef(new Animated.Value(0)).current;

//   const { data: messages, isLoading, refetch } = useDirectMessages(userId);
//   const sendMessage = useSendDirectMessage();

//   // Auto-refresh messages every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetch();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [refetch]);

//   // Typing indicator animation
//   useEffect(() => {
//     if (isTyping) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(typingAnimation, {
//             toValue: 1,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//           Animated.timing(typingAnimation, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     }
//   }, [isTyping, typingAnimation]);

//   const handleSend = async () => {
//     if (!message.trim()) return;

//     const messageText = message.trim();
//     setMessage('');
//     setIsTyping(false);

//     try {
//       await sendMessage.mutateAsync({
//         receiverId: userId,
//         data: { content: messageText },
//       });
//       refetch();
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   const handleTyping = (text: string) => {
//     setMessage(text);
//     setIsTyping(text.length > 0);
//   };

//   // Compute a responsive tab-bar / input spacing so input sits above
//   // the floating tab bar across device sizes. This mirrors the logic
//   // used in the navigator for bar height.
//   const safeBottom = insets?.bottom || 0;
//   const barHeight = Math.min(86, 64 + Math.round(safeBottom));
//   const inputAreaHeight = 64; // approximate input wrapper height
//   // Use a smaller, clamped margin so the input doesn't float too high.
//   // Keep a small margin above the system inset so the input stays near
//   // the bottom but still clears the tab bar / home indicator.
//   const computedMargin = Math.max(8, Math.round(safeBottom + 8));
//   // when input is absolutely positioned at the bottom, add padding equal
//   // to the input area height + safe inset so list content isn't hidden.
//   const listPaddingBottom = inputAreaHeight + safeBottom + 24;

//   const formatMessageTime = (date: string) => {
//     const messageDate = new Date(date);
//     const now = new Date();
//     const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / 36e5;

//     if (diffInHours < 24) {
//       return messageDate.toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//       });
//     }
//     return formatDate(date);
//   };

//   const renderMessage = ({ item, index }: { item: Message; index: number }) => {
//     const isOwnMessage = item.senderId === user?.id;
//     const prevMessage = messages && index < messages.length - 1 ? messages[index + 1] : null;
//     const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;

//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isOwnMessage ? styles.messageContainerOwn : styles.messageContainerOther,
//         ]}
//       >
//         {!isOwnMessage && showAvatar && (
//           <View style={styles.avatarContainer}>
//             <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
//               <Text style={styles.avatarText}>
//                 {userName?.charAt(0).toUpperCase() || 'U'}
//               </Text>
//             </View>
//           </View>
//         )}
//         {!isOwnMessage && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
//         <View
//           style={[
//             styles.messageBubble,
//             isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther,
//           ]}
//         >
//           <Text
//             style={[
//               styles.messageText,
//               isOwnMessage ? styles.messageTextOwn : styles.messageTextOther,
//             ]}
//           >
//             {item.content}
//           </Text>
//           <View style={styles.messageFooter}>
//             <Text
//               style={[
//                 styles.messageTime,
//                 isOwnMessage ? styles.messageTimeOwn : styles.messageTimeOther,
//               ]}
//             >
//               {formatMessageTime(String(item.createdAt))}
//             </Text>
//             {isOwnMessage && (
//               <Ionicons
//                 name="checkmark-done"
//                 size={14}
//                 color="rgba(255, 255, 255, 0.7)"
//                 style={styles.readIcon}
//               />
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };
// // 
//  const renderEmptyState = () => (
//   <View style={styles.emptyState}>
//     <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
//       <Ionicons name="chatbubbles-outline" size={48} color={colors.primary} />
//     </View>
//     <Text style={styles.emptyTitle}>Start a conversation</Text>
//     <Text style={styles.emptySubtitle}>
//       Send a message to {userName} to get started
//     </Text>
//   </View>
// );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         {/* Modern Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={24} color={colors.text} />
//           </TouchableOpacity>
          
//           <View style={styles.headerCenter}>
//             <View style={styles.headerAvatarContainer}>
//               <View style={[styles.headerAvatar, { backgroundColor: colors.accent }]}>
//                 <Text style={styles.headerAvatarText}>
//                   {userName?.charAt(0).toUpperCase() || 'U'}
//                 </Text>
//               </View>
//               <View style={[styles.onlineStatus, { backgroundColor: colors.success }]} />
//             </View>
//             <View style={styles.headerInfo}>
//               <Text style={styles.headerTitle}>{userName}</Text>
//               <Text style={styles.headerSubtitle}>Active now</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity style={styles.headerButton}>
//             <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
//           </TouchableOpacity>
//         </View>

//         {/* Messages List */}
//         {isLoading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.primary} />
//             <Text style={styles.loadingText}>Loading messages...</Text>
//           </View>
//         ) : (
//           <FlatList
//             ref={flatListRef}
//             data={messages || []}
//             renderItem={renderMessage}
//             keyExtractor={(item) => item.id}
//               contentContainerStyle={[
//                 styles.messagesList,
//                 (!messages || messages.length === 0) && styles.messagesListEmpty,
//                 // ensure list leaves room for the input area and floating tab bar
//                 { paddingBottom: listPaddingBottom },
//               ]}
//             inverted
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={renderEmptyState}
//           />
//         )}

//         {/* Typing Indicator */}
//         {isTyping && (
//           <View style={styles.typingIndicatorContainer}>
//             <View style={styles.typingBubble}>
//               <Animated.View
//                 style={[
//                   styles.typingDot,
//                   {
//                     opacity: typingAnimation.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [0.3, 1],
//                     }),
//                   },
//                 ]}
//               />
//               <Animated.View
//                 style={[
//                   styles.typingDot,
//                   {
//                     opacity: typingAnimation.interpolate({
//                       inputRange: [0, 0.5, 1],
//                       outputRange: [0.3, 1, 0.3],
//                     }),
//                   },
//                 ]}
//               />
//               <Animated.View
//                 style={[
//                   styles.typingDot,
//                   {
//                     opacity: typingAnimation.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [1, 0.3],
//                     }),
//                   },
//                 ]}
//               />
//             </View>
//           </View>
//         )}

//         {/* Message Input */} 
//         {/*  */}
//         <View style={[
//           styles.inputWrapper,
//           // add bottom safe area padding so the send button isn't covered
//           // and set a responsive bottom margin so the input sits above
//           // the floating tab bar regardless of device.


          
          
//           {
//             // Remove absolute positioning for better keyboard handling
//             // and place input above tab bar with a small gap
//             marginBottom: barHeight / 2,
//             paddingBottom: safeBottom,
//             elevation: 12,
//             zIndex: 12,
//           },
//         ]}>
//           <View style={styles.inputContainer}>
//             <TouchableOpacity style={styles.attachButton}>
//               <Ionicons name="add-circle" size={28} color={colors.primary} />
//             </TouchableOpacity>
            
//             <View style={styles.inputBox}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Type a message..."
//                 placeholderTextColor={colors.textTertiary}
//                 value={message}
//                 onChangeText={handleTyping}
//                 multiline
//                 maxLength={1000}
//               />
//             </View>
            
//             <TouchableOpacity
//               style={[
//                 styles.sendButton,
//                 !message.trim() && styles.sendButtonDisabled,
//               ]}
//               onPress={handleSend}
//               disabled={!message.trim() || sendMessage.isPending}
//             >
//               {sendMessage.isPending ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Ionicons 
//                   name={message.trim() ? "send" : "mic"} 
//                   size={20} 
//                   color="#fff" 
//                 />
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: colors.card,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.cardLight,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.cardLight,
//     marginRight: 12,
//   },
//   headerCenter: {
//     flex: 1, 
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerAvatarContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   headerAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerAvatarText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   onlineStatus: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: colors.card,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: 2,
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: colors.success,
//   },
//   headerButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.cardLight,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: colors.textSecondary,
//     fontWeight: '500',
//   },
//   messagesList: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   messagesListEmpty: {
//     flex: 1,
//     justifyContent: 'center',
//   },


// emptyState: {
//   alignItems: 'center',
//   justifyContent: 'center',
//   paddingVertical: 60,
//   flex: 1,
// },
// emptyIcon: {
//   width: 96,
//   height: 96,
//   borderRadius: 48,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 20,
// },
// emptyTitle: {
//   fontSize: 20,
//   fontWeight: '700',
//   color: colors.text,
//   marginBottom: 8,
//   textAlign: 'center',
// },
// emptySubtitle: {
//   fontSize: 14,
//   fontWeight: '400',
//   color: colors.textSecondary,
//   textAlign: 'center',
//   paddingHorizontal: 40,
// },
//   messageContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   messageContainerOwn: {
//     justifyContent: 'flex-end',
//   },
//   messageContainerOther: {
//     justifyContent: 'flex-start',
//   },
//   avatarContainer: {
//     marginRight: 8,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   avatarPlaceholder: {
//     width: 32,
//     marginRight: 8,
//   },
//   messageBubble: {
//     maxWidth: '75%',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   messageBubbleOwn: {
//     backgroundColor: colors.messageBubbleOwn,
//     borderBottomRightRadius: 4,
//   },
//   messageBubbleOther: {
//     backgroundColor: colors.messageBubbleOther,
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     fontSize: 15,
//     lineHeight: 20,
//     fontWeight: '400',
//   },
//   messageTextOwn: {
//     color: '#fff',
//   },
//   messageTextOther: {
//     color: colors.text,
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   messageTime: {
//     fontSize: 11,
//     fontWeight: '500',
//   },
//   messageTimeOwn: {
//     color: 'rgba(255, 255, 255, 0.7)',
//   },
//   messageTimeOther: {
//     color: colors.textTertiary,
//   },
//   readIcon: {
//     marginLeft: 4,
//   },
//   typingIndicatorContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   typingBubble: {
//     flexDirection: 'row',
//     alignSelf: 'flex-start',
//     backgroundColor: colors.cardLight,
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 4,
//   },
//   typingDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: colors.textTertiary,
//   },
//   inputWrapper: {
//     backgroundColor: colors.card,
//     borderTopWidth: 1,
//     borderTopColor: colors.cardLight,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 8,
//   },
//   attachButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputBox: {
//     flex: 1,
//     backgroundColor: colors.cardLight,
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     maxHeight: 100,
//   },
//   input: {
//     fontSize: 15,
//     color: colors.text,
//     fontWeight: '400',
//     paddingVertical: 4,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.4,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   sendButtonDisabled: {
//     backgroundColor: colors.cardLight,
//     shadowOpacity: 0,
//   },
// });



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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDirectMessages, useSendDirectMessage } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import { formatDate } from '../../utils';
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
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const { data: messages, isLoading, refetch } = useDirectMessages(userId);
  const sendMessage = useSendDirectMessage();

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

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

  const handleSend = async () => {
    if (!message.trim()) return;

    const messageText = message.trim();
    setMessage('');
    setIsTyping(false);

    try {
      await sendMessage.mutateAsync({
        receiverId: userId,
        data: { content: messageText },
      });
      refetch();
    } catch (error) {
      console.error('Failed to send message:', error);
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

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === user?.id;
    const prevMessage = messages && index < messages.length - 1 ? messages[index + 1] : null;
    const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;

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
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isOwnMessage ? styles.messageTimeOwn : styles.messageTimeOther,
              ]}
            >
              {formatMessageTime(String(item.createdAt))}
            </Text>
            {isOwnMessage && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color="rgba(255, 255, 255, 0.7)"
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
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
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
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons 
                  name={message.trim() ? "send" : "mic"} 
                  size={20} 
                  color="#fff" 
                />
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