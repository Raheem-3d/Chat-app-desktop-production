// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useChannels } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import theme from '../../theme';
// import { Channel } from '../../types';

// export default function ChannelsScreen() {
//   const navigation = useNavigation();
//   const { user } = useAuthStore();
//   const organizationId = user?.organizationId;

//   const { data: channels, isLoading, refetch, isRefetching } = useChannels();

//   const renderChannelItem = ({ item }: { item: Channel }) => (
//     <TouchableOpacity
//       style={styles.channelCard}
//       onPress={() => {
//         // @ts-ignore
//         navigation.navigate('ChannelChat', { channelId: item.id, channelName: item.name });
//       }}
//     >
//       <View style={styles.channelIcon}>
//         <Ionicons
//           name={item.type === 'PRIVATE' ? 'lock-closed' : 'people'}
//           size={24}
//           color={theme.colors.primary[500]}
//         />
//       </View>
//       <View style={styles.channelInfo}>
//         <Text style={styles.channelName}>#{item.name}</Text>
//         {item.description && (
//           <Text style={styles.channelDescription} numberOfLines={1}>
//             {item.description}
//           </Text>
//         )}
//       </View>
//       <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.secondary} />
//       <Text style={styles.emptyTitle}>No channels yet</Text>
//       <Text style={styles.emptySubtitle}>Channels will appear here</Text>
//     </View>
//   );

//   if (!organizationId) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.errorState}>
//           <Text style={styles.errorText}>No organization found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Channels</Text>
//       </View>

//       {/* Channel List */}
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       ) : (
//         <FlatList
//           data={channels || []}
//           renderItem={renderChannelItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={[
//             styles.listContainer,
//             (!channels || channels.length === 0) && styles.listContainerEmpty,
//           ]}
//           ListEmptyComponent={renderEmptyState}
//           refreshControl={
//             <RefreshControl
//               refreshing={isRefetching}
//               onRefresh={refetch}
//               tintColor={theme.colors.primary[500]}
//             />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// // import { theme } from '../../theme';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   header: {
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     backgroundColor: theme.colors.background.paper,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   headerTitle: {
//     ...theme.typography.h2,
//     color: theme.colors.text.primary,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: theme.spacing.lg,
//   },
//   listContainerEmpty: {
//     flexGrow: 1,
//   },
//   channelCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     ...theme.shadows.sm,
//   },
//   channelIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: theme.colors.primary[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.md,
//   },
//   channelInfo: {
//     flex: 1,
//   },
//   channelName: {
//     ...theme.typography.h4,
//     color: theme.colors.text.primary,
//     marginBottom: 2,
//   },
//   channelDescription: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing.xl,
//   },
//   emptyTitle: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//     marginTop: theme.spacing.md,
//   },
//   emptySubtitle: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     textAlign: 'center',
//     marginTop: theme.spacing.xs,
//   },
//   errorState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     ...theme.typography.body1,
//     color: theme.colors.error.main,
//   },
// });



import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useChannels } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import { Channel } from '../../types';

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
  danger: '#f87171',
  info: '#3b82f6',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
};

export default function ChannelsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const organizationId = user?.organizationId;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: channels, isLoading, refetch, isRefetching } = useChannels();

  const filteredChannels = channels?.filter((channel: Channel) =>
    channel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publicChannels = filteredChannels?.filter(ch => ch.type !== 'PRIVATE') || [];
  const privateChannels = filteredChannels?.filter(ch => ch.type === 'PRIVATE') || [];

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'PRIVATE':
        return { name: 'lock-closed' as const, color: colors.warning };
      case 'ANNOUNCEMENT':
        return { name: 'megaphone' as const, color: colors.danger };
      default:
        return { name: 'people' as const, color: colors.primary };
    }
  };

  const renderChannelItem = ({ item }: { item: Channel }) => {
    const iconConfig = getChannelIcon(item.type || 'PUBLIC');
    
    return (
      <TouchableOpacity
        style={styles.channelCard}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('ChannelChat', { 
            channelId: item.id, 
            channelName: item.name 
          });
        }}
      >
        <View style={styles.channelLeft}>
          <View style={[styles.channelIconBox, { backgroundColor: iconConfig.color + '20' }]}>
            <Ionicons
              name={iconConfig.name}
              size={24}
              color={iconConfig.color}
            />
          </View>
          
          <View style={styles.channelInfo}>
            <View style={styles.channelNameRow}>
              <Text style={styles.channelHash}>#</Text>
              <Text style={styles.channelName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.type === 'PRIVATE' && (
                <View style={[styles.typeBadge, { backgroundColor: colors.warning + '20' }]}>
                  <Ionicons name="lock-closed" size={10} color={colors.warning} />
                  <Text style={[styles.typeBadgeText, { color: colors.warning }]}>
                    Private
                  </Text>
                </View>
              )}
            </View>
            
            {item.description && (
              <Text style={styles.channelDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            
            <View style={styles.channelMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color={colors.textTertiary} />
                <Text style={styles.metaText}>
                  {item.memberCount || 0} members
                </Text>
              </View>
              {item.lastMessageAt && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>Active</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string, count: number, icon: string) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Ionicons name={icon as any} size={20} color={colors.text} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      </View>
    </View>
  );

  const renderChannelList = () => (
    <>
      {publicChannels.length > 0 && (
        <>
          {renderSectionHeader('Public Channels', publicChannels.length, 'people')}
          {publicChannels.map(channel => (
            <View key={channel.id}>
              {renderChannelItem({ item: channel })}
            </View>
          ))}
        </>
      )}
      
      {privateChannels.length > 0 && (
        <>
          {renderSectionHeader('Private Channels', privateChannels.length, 'lock-closed')}
          {privateChannels.map(channel => (
            <View key={channel.id}>
              {renderChannelItem({ item: channel })}
            </View>
          ))}
        </>
      )}
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="chatbubbles-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No channels found' : 'No channels yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try searching with a different name'
          : 'Channels will appear here when created'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create Channel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!organizationId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorState}>
          <View style={[styles.errorIcon, { backgroundColor: colors.danger + '20' }]}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
          </View>
          <Text style={styles.errorText}>No organization found</Text>
          <Text style={styles.errorSubtext}>Please contact your administrator</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Channels</Text>
            <Text style={styles.headerSubtitle}>
              {channels?.length || 0} {channels?.length === 1 ? 'channel' : 'channels'}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search channels..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Channel List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading channels...</Text>
        </View>
      ) : (
        <FlatList
          data={[{ id: 'dummy' }]} // Dummy data for FlatList
          renderItem={() => (
            <View style={styles.listContent}>
              {filteredChannels && filteredChannels.length > 0 ? (
                renderChannelList()
              ) : (
                renderEmptyState()
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
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
  listContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.cardLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  channelLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  channelIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelInfo: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  channelHash: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  channelName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  channelDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  channelMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
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
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});