// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useOrganizationMembers } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import theme from '../../theme';
// import type { User } from '../../types';

// export default function PeopleScreen() {
//   const navigation = useNavigation();
//   const { user } = useAuthStore();
//   const [searchQuery, setSearchQuery] = useState('');

//   const { data: members, isLoading, refetch, isRefetching } = useOrganizationMembers(
//     user?.organizationId || ''
//   );

//   const filteredMembers = members?.filter((member: User) =>
//     member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.email?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleMemberPress = (member: User) => {
//     // @ts-ignore
//     navigation.navigate('DirectMessage', {
//       userId: member.id,
//       userName: member.name,
//     });
//   };

//   const renderMember = ({ item }: { item: User }) => (
//     <TouchableOpacity
//       style={styles.memberCard}
//       onPress={() => handleMemberPress(item)}
//     >
//       <View style={styles.avatar}>
//         <Text style={styles.avatarText}>
//           {item.name?.charAt(0).toUpperCase() || 'U'}
//         </Text>
//       </View>
//       <View style={styles.memberInfo}>
//         <View style={styles.nameRow}>
//           <Text style={styles.memberName}>{item.name}</Text>
//           {item.role && (
//             <View style={[styles.roleBadge, getRoleBadgeStyle(item.role)]}>
//               <Text style={styles.roleBadgeText}>{item.role}</Text>
//             </View>
//           )}
//         </View>
//         <Text style={styles.memberEmail}>{item.email}</Text>
//       </View>
//       <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Ionicons name="people-outline" size={64} color={theme.colors.text.secondary} />
//       <Text style={styles.emptyTitle}>No people found</Text>
//       <Text style={styles.emptySubtitle}>
//         {searchQuery ? 'Try a different search query' : 'No members in your organization'}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>People</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search people..."
//           placeholderTextColor={theme.colors.text.secondary}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
//           </TouchableOpacity>
//         )}
//       </View>
       

//       {/* Member List */}
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       ) : (
//         <FlatList
//           data={filteredMembers || []}
//           renderItem={renderMember}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={[
//             styles.listContainer,
//             (!filteredMembers || filteredMembers.length === 0) && styles.listContainerEmpty,
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

// function getRoleBadgeStyle(role: string) {
//   switch (role) {
//     case 'ADMIN':
//       return { backgroundColor: '#fee2e2', borderColor: theme.colors.error.main };
//     case 'MANAGER':
//       return { backgroundColor: '#fef3c7', borderColor: theme.colors.warning.main };
//     default:
//       return { backgroundColor: theme.colors.gray[100], borderColor: theme.colors.gray[400] };
//   }
// }



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
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     marginHorizontal: theme.spacing.lg,
//     marginTop: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//   },
//   searchInput: {
//     flex: 1,
//     ...theme.typography.body1,
//     marginLeft: theme.spacing.sm,
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
//   memberCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     ...theme.shadows.sm,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: theme.colors.primary[500],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.md,
//   },
//   avatarText: {
//     ...theme.typography.h3,
//     color: '#fff',
//   },
//   memberInfo: {
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//     marginBottom: 4,
//   },
//   memberName: {
//     ...theme.typography.body1,
//     fontWeight: '600',
//     color: theme.colors.text.primary,
//   },
//   roleBadge: {
//     paddingHorizontal: theme.spacing.xs,
//     paddingVertical: 2,
//     borderRadius: 4,
//     borderWidth: 1,
//   },
//   roleBadgeText: {
//     ...theme.typography.caption,
//     fontWeight: '600',
//     fontSize: 10,
//     textTransform: 'uppercase',
//   },
//   memberEmail: {
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
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useOrganizationMembers } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import type { User } from '../../types';

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

// Avatar color palette
const avatarColors = [
  '#667eea', '#764ba2', '#f093fb', '#4ade80', 
  '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'
];

export default function PeopleScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: members, isLoading, refetch, isRefetching } = useOrganizationMembers(
    user?.organizationId || ''
  );

  const filteredMembers = members?.filter((member: User) =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberPress = (member: User) => {
    // @ts-ignore
    navigation.navigate('DirectMessage', {
      userId: member.id,
      userName: member.name,
    });
  };

  const getAvatarColor = (name: string) => {
    const charCode = name?.charCodeAt(0) || 0;
    return avatarColors[charCode % avatarColors.length];
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { 
          color: colors.danger, 
          bg: colors.danger + '20',
          icon: 'shield-checkmark' as const,
          label: 'Admin'
        };
      case 'MANAGER':
        return { 
          color: colors.warning, 
          bg: colors.warning + '20',
          icon: 'star' as const,
          label: 'Manager'
        };
      case 'MEMBER':
        return { 
          color: colors.info, 
          bg: colors.info + '20',
          icon: 'person' as const,
          label: 'Member'
        };
      default:
        return { 
          color: colors.textTertiary, 
          bg: colors.cardLight,
          icon: 'person' as const,
          label: role
        };
    }
  };

  const renderMember = ({ item, index }: { item: User; index: number }) => {
    const roleConfig = getRoleConfig(item.role || 'MEMBER');
    const isCurrentUser = item.id === user?.id;
    
    return (
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => !isCurrentUser && handleMemberPress(item)}
        activeOpacity={isCurrentUser ? 1 : 0.7}
      >
        <View style={styles.memberLeft}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name || '') }]}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
            {isCurrentUser && (
              <View style={[styles.currentUserBadge, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            )}
          </View>
          
          <View style={styles.memberInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.memberName} numberOfLines={1}>
                {item.name}
                {isCurrentUser && <Text style={styles.youText}> (You)</Text>}
              </Text>
            </View>
            
            <Text style={styles.memberEmail} numberOfLines={1}>
              {item.email}
            </Text>
            
            {item.role && (
              <View style={styles.roleContainer}>
                <View style={[styles.roleBadge, { backgroundColor: roleConfig.bg }]}>
                  <Ionicons name={roleConfig.icon} size={12} color={roleConfig.color} />
                  <Text style={[styles.roleBadgeText, { color: roleConfig.color }]}>
                    {roleConfig.label}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        
        {!isCurrentUser && (
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => handleMemberPress(item)}
          >
            <Ionicons name="chatbubble" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="people" size={24} color={colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{members?.length || 0}</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
        </View>
        
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {members?.filter(m => m.id !== user?.id).length || 0}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="people-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No people yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try searching with a different name or email'
          : 'Team members will appear here when they join'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Team</Text>
            <Text style={styles.headerSubtitle}>
              {members?.length || 0} {members?.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
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

      {/* Member List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading team members...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMembers || []}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            (!filteredMembers || filteredMembers.length === 0) && styles.listContainerEmpty,
          ]}
          ListHeaderComponent={
            members && members.length > 0 && !searchQuery ? renderHeader : null
          }
          ListEmptyComponent={renderEmptyState}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContainer: {
    padding: 20,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  memberCard: {
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
  memberLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  currentUserBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  youText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  memberEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  roleContainer: {
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
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
  },
});