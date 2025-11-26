import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { User, Organization, Role } from '../../types';
import { organizationService } from '../../services/organization.service';
import { getRoleDisplayName, getRoleDescription } from '../../utils/permissions';

export default function OrganizationEmployeesScreen() {
  const { theme } = useTheme();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');

  const roles: Array<Role | 'ALL'> = [
    'ALL',
    'SUPER_ADMIN',
    'ORG_ADMIN',
    'MANAGER',
    'EMPLOYEE',
    'ORG_MEMBER',
    'CLIENT',
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.default,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.text.secondary,
      marginTop: 16,
    },
    header: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text.primary,
    },
    orgName: {
      fontSize: 16,
      color: theme.text.secondary,
      marginTop: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.paper,
      borderRadius: 8,
      margin: 24,
      paddingHorizontal: 16,
      height: 48,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text.primary,
    },
    roleFilterContainer: {
      paddingHorizontal: 24,
      marginBottom: 16,
    },
    roleFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.background.paper,
      borderWidth: 1,
      borderColor: theme.border.light,
      marginRight: 8,
    },
    roleFilterButtonActive: {
      backgroundColor: theme.primary[500],
      borderColor: theme.primary[500],
    },
    roleFilterText: {
      fontSize: 14,
      color: theme.text.secondary,
      fontWeight: '600',
    },
    roleFilterTextActive: {
      color: '#fff',
    },
    countContainer: {
      paddingHorizontal: 24,
      paddingBottom: 8,
    },
    countText: {
      fontSize: 14,
      color: theme.text.secondary,
    },
    listContent: {
      padding: 24,
      paddingTop: 8,
    },
    employeeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.paper,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    employeeAvatar: {
      marginRight: 16,
    },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
    },
    employeeInfo: {
      flex: 1,
    },
    employeeName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: 2,
    },
    employeeEmail: {
      fontSize: 14,
      color: theme.text.secondary,
      marginBottom: 4,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.background.default,
      marginTop: 4,
    },
    roleText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    departmentText: {
      fontSize: 12,
      color: theme.text.secondary,
      marginTop: 4,
    },
    detailsButton: {
      padding: 8,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 20,
      color: theme.text.secondary,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.text.secondary,
      marginTop: 4,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, selectedRole]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [orgData, employeesData] = await Promise.all([
        organizationService.getMyOrganization(),
        organizationService.getOrganizationEmployees(),
      ]);
      setOrganization(orgData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by role
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter((emp) => emp.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      );
    }

    setFilteredEmployees(filtered);
  };

  const getRoleIcon = (role: Role): any => {
    const icons: Record<Role, any> = {
      SUPER_ADMIN: 'shield-checkmark',
      ORG_ADMIN: 'shield',
      MANAGER: 'briefcase',
      EMPLOYEE: 'person',
      ORG_MEMBER: 'people',
      CLIENT: 'person-circle',
    };
    return icons[role] || 'person';
  };

  const getRoleColor = (role: Role): string => {
    const colors: Record<Role, string> = {
      SUPER_ADMIN: theme.primary[500],
      ORG_ADMIN: theme.secondary[500],
      MANAGER: theme.info?.main || theme.primary[400],
      EMPLOYEE: theme.success?.main || theme.primary[600],
      ORG_MEMBER: theme.warning?.main || theme.primary[300],
      CLIENT: theme.error?.main || theme.secondary[500],
    };
    return colors[role] || theme.text.secondary;
  };

  const renderRoleFilter = () => (
    <View style={styles.roleFilterContainer}>
      <FlatList
        horizontal
        data={roles}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.roleFilterButton,
              selectedRole === item && styles.roleFilterButtonActive,
            ]}
            onPress={() => setSelectedRole(item)}
          >
            <Text
              style={[
                styles.roleFilterText,
                selectedRole === item && styles.roleFilterTextActive,
              ]}
            >
              {item === 'ALL' ? 'All' : getRoleDisplayName(item as Role)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderEmployeeCard = ({ item }: { item: User }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeAvatar}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      </View>

      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name || 'No Name'}</Text>
        <Text style={styles.employeeEmail}>{item.email}</Text>

        <View style={styles.roleBadge}>
          <Ionicons
            name={getRoleIcon(item.role)}
            size={14}
            color={getRoleColor(item.role)}
          />
          <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
            {getRoleDisplayName(item.role)}
          </Text>
        </View>

        {item.departmentId && (
          <Text style={styles.departmentText}>
            Department: {item.departmentId}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.text.secondary}
        />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary[500]} />
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Organization Employees</Text>
        {organization && (
          <Text style={styles.orgName}>{organization.name}</Text>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={theme.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Role Filter */}
      {renderRoleFilter()}

      {/* Employee Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
          {selectedRole !== 'ALL' && ` (${getRoleDisplayName(selectedRole as Role)})`}
        </Text>
      </View>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployeeCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={theme.text.secondary}
            />
            <Text style={styles.emptyText}>No employees found</Text>
            {searchQuery && (
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
