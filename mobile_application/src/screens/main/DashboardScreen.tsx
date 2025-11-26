// // // // // Dashboard screen
// // // // import React from 'react';
// // // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import theme from '../../theme';
// // // // import { useTasks, useChannels } from '../../hooks/useApi';
// // // // import { useAuthStore } from '../../stores';

// // // // export default function DashboardScreen({ navigation }: any) {
// // // //   const user = useAuthStore((state) => state.user);
// // // //   const { data: tasks, isLoading: tasksLoading } = useTasks();
// // // //   const { data: channels, isLoading: channelsLoading } = useChannels();

// // // //   const completedTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;
// // // //   const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;

// // // //   return (
// // // //     <SafeAreaView style={styles.container} edges={['top']}>
// // // //       <ScrollView style={styles.content}>
// // // //         {/* Header */}
// // // //         <View style={styles.header}>
// // // //           <View>
// // // //             <Text style={styles.greeting}>Good day,</Text>
// // // //             <Text style={styles.userName}>{user?.name || 'User'}!</Text>
// // // //           </View>
// // // //           <TouchableOpacity
// // // //             onPress={() => navigation.navigate('Notifications')}
// // // //             style={styles.notificationButton}
// // // //           >
// // // //             <Ionicons
// // // //               name="notifications-outline"
// // // //               size={24}
// // // //               color={theme.colors.text.primary}
// // // //             />
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {/* Stats Cards .*/}
// // // //         <View style={styles.statsContainer}>
// // // //           <View style={[styles.statCard, { backgroundColor: theme.colors.primary[50] }]}>
// // // //             <Ionicons name="briefcase" size={32} color={theme.colors.primary[600]} />
// // // //             <Text style={styles.statValue}>{tasks?.length || 0}</Text>
// // // //             <Text style={styles.statLabel}>Total Tasks</Text>
// // // //           </View>
// // // //           <View style={[styles.statCard, { backgroundColor: theme.colors.success.light }]}>
// // // //             <Ionicons name="checkmark-circle" size={32} color={theme.colors.success.dark} />
// // // //             <Text style={styles.statValue}>{completedTasks}</Text>
// // // //             <Text style={styles.statLabel}>Completed</Text>
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.statsContainer}>
// // // //           <View style={[styles.statCard, { backgroundColor: theme.colors.info.light }]}>
// // // //             <Ionicons name="time" size={32} color={theme.colors.info.dark} />
// // // //             <Text style={styles.statValue}>{inProgressTasks}</Text>
// // // //             <Text style={styles.statLabel}>In Progress</Text>
// // // //           </View>
// // // //           <View style={[styles.statCard, { backgroundColor: theme.colors.secondary[50] }]}>
// // // //             <Ionicons name="chatbubbles" size={32} color={theme.colors.secondary[600]} />
// // // //             <Text style={styles.statValue}>{channels?.length || 0}</Text>
// // // //             <Text style={styles.statLabel}>Channels</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Recent Tasks */}
// // // //         <View style={styles.section}>
// // // //           <View style={styles.sectionHeader}>
// // // //             <Text style={styles.sectionTitle}>Recent Tasks</Text>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
// // // //               <Text style={styles.sectionLink}>View All</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //           {tasksLoading ? (
// // // //             <Text style={styles.emptyText}>Loading...</Text>
// // // //           ) : tasks && tasks.length > 0 ? (
// // // //             tasks.slice(0, 5).map((task) => (
// // // //               <TouchableOpacity
// // // //                 key={task.id}
// // // //                 style={styles.taskCard}
// // // //                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
// // // //               >
// // // //                 <View style={styles.taskHeader}>
// // // //                   <Text style={styles.taskTitle}>{task.title}</Text>
// // // //                   <View
// // // //                     style={[
// // // //                       styles.statusBadge,
// // // //                       {
// // // //                         backgroundColor:
// // // //                           task.status === 'DONE'
// // // //                             ? theme.colors.success.light
// // // //                             : task.status === 'IN_PROGRESS'
// // // //                             ? theme.colors.info.light
// // // //                             : theme.colors.gray[100],
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <Text style={styles.statusText}>{task.status.replace('_', ' ')}</Text>
// // // //                   </View>
// // // //                 </View>
// // // //                 {task.description && (
// // // //                   <Text style={styles.taskDescription} numberOfLines={2}>
// // // //                     {task.description}
// // // //                   </Text>
// // // //                 )}
// // // //               </TouchableOpacity>
// // // //             ))
// // // //           ) : (
// // // //             <Text style={styles.emptyText}>No tasks yet</Text>
// // // //           )}
// // // //         </View>
// // // //       </ScrollView>
// // // //     </SafeAreaView>
// // // //   );
// // // // }



// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: theme.colors.background.paper,
// // // //   },
// // // //   content: {
// // // //     flex: 1,
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     padding: theme.spacing.lg,
// // // //     backgroundColor: theme.colors.background.default,
// // // //   },
// // // //   greeting: {
// // // //     ...theme.typography.body1,
// // // //     color: theme.colors.text.secondary,
// // // //   },
// // // //   userName: {
// // // //     ...theme.typography.h3,
// // // //     color: theme.colors.text.primary,
// // // //     marginTop: theme.spacing.xs,
// // // //   },
// // // //   notificationButton: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: theme.borderRadius.full,
// // // //     backgroundColor: theme.colors.gray[100],
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   statsContainer: {
// // // //     flexDirection: 'row',
// // // //     gap: theme.spacing.md,
// // // //     paddingHorizontal: theme.spacing.lg,
// // // //     marginTop: theme.spacing.md,
// // // //   },
// // // //   statCard: {
// // // //     flex: 1,
// // // //     padding: theme.spacing.lg,
// // // //     borderRadius: theme.borderRadius.lg,
// // // //     alignItems: 'center',
// // // //     ...theme.shadows.sm,
// // // //   },
// // // //   statValue: {
// // // //     ...theme.typography.h2,
// // // //     color: theme.colors.text.primary,
// // // //     marginTop: theme.spacing.sm,
// // // //   },
// // // //   statLabel: {
// // // //     ...theme.typography.caption,
// // // //     color: theme.colors.text.secondary,
// // // //     marginTop: theme.spacing.xs,
// // // //   },
// // // //   section: {
// // // //     marginTop: theme.spacing.xl,
// // // //     padding: theme.spacing.lg,
// // // //     backgroundColor: theme.colors.background.default,
// // // //   },
// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: theme.spacing.md,
// // // //   },
// // // //   sectionTitle: {
// // // //     ...theme.typography.h4,
// // // //     color: theme.colors.text.primary,
// // // //   },
// // // //   sectionLink: {
// // // //     ...theme.typography.body2,
// // // //     color: theme.colors.primary[600],
// // // //     fontWeight: '600',
// // // //   },
// // // //   taskCard: {
// // // //     backgroundColor: theme.colors.background.paper,
// // // //     padding: theme.spacing.md,
// // // //     borderRadius: theme.borderRadius.md,
// // // //     marginBottom: theme.spacing.sm,
// // // //     borderWidth: 1,
// // // //     borderColor: theme.colors.border.light,
// // // //   },
// // // //   taskHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: theme.spacing.xs,
// // // //   },
// // // //   taskTitle: {
// // // //     ...theme.typography.body1,
// // // //     fontWeight: '600',
// // // //     color: theme.colors.text.primary,
// // // //     flex: 1,
// // // //   },
// // // //   statusBadge: {
// // // //     paddingHorizontal: theme.spacing.sm,
// // // //     paddingVertical: 4,
// // // //     borderRadius: theme.borderRadius.sm,
// // // //     marginLeft: theme.spacing.sm,
// // // //   },
// // // //   statusText: {
// // // //     ...theme.typography.caption,
// // // //     fontWeight: '600',
// // // //     color: theme.colors.text.primary,
// // // //     textTransform: 'capitalize',
// // // //   },
// // // //   taskDescription: {
// // // //     ...theme.typography.body2,
// // // //     color: theme.colors.text.secondary,
// // // //   },
// // // //   emptyText: {
// // // //     ...theme.typography.body1,
// // // //     color: theme.colors.text.secondary,
// // // //     textAlign: 'center',
// // // //     paddingVertical: theme.spacing.lg,
// // // //   },
// // // // });


// // // // DashboardScreen.tsx
// // // import React, {useState} from 'react';
// // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { SafeAreaView } from 'react-native-safe-area-context';

// // // // Color palette options
// // // const colorPalettes = {
// // //   // Option 1: Professional Blue (Default)
// // //   professional: {
// // //     primary: {
// // //       50: '#EFF6FF',
// // //       100: '#DBEAFE',
// // //       500: '#3B82F6',
// // //       600: '#2563EB',
// // //     },
// // //     secondary: {
// // //       50: '#F8FAFC',
// // //       100: '#F1F5F9',
// // //     },
// // //     accent: '#10B981',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#F8FAFC',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#F59E0B',
// // //       completed: '#10B981',
// // //     }
// // //   },

// // //   // Option 2: Minimal Gray
// // //   minimal: {
// // //     primary: {
// // //       50: '#F8FAFC',
// // //       100: '#F1F5F9',
// // //       500: '#64748B',
// // //       600: '#475569',
// // //     },
// // //     secondary: {
// // //       50: '#FFFFFF',
// // //       100: '#F8FAFC',
// // //     },
// // //     accent: '#6366F1',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#F8FAFC',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#F59E0B',
// // //       completed: '#10B981',
// // //     }
// // //   },

// // //   // Option 3: Warm Professional
// // //   warm: {
// // //     primary: {
// // //       50: '#FFFBEB',
// // //       100: '#FEF3C7',
// // //       500: '#F59E0B',
// // //       600: '#D97706',
// // //     },
// // //     secondary: {
// // //       50: '#FEFCE8',
// // //       100: '#FEF9C3',
// // //     },
// // //     accent: '#DC2626',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#FFFBEB',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#2563EB',
// // //       completed: '#059669',
// // //     }
// // //   }
// // // };

// // // type ColorPalette = keyof typeof colorPalettes;

// // // export default function DashboardScreen({ navigation }: any) {
// // //   const [currentPalette, setCurrentPalette] = useState<ColorPalette>('professional');
// // //   const colors = colorPalettes[currentPalette];

// // //   // Mock data - replace with your actual data
// // //   const user = { name: 'Sarah' };
// // //   const stats = {
// // //     totalCourses: 12,
// // //     inProgress: 3,
// // //     completed: 5,
// // //     upcoming: 2
// // //   };

// // //   const recentCourses = [
// // //     { id: 1, title: 'UI Design', progress: 75, duration: '23h', lessons: 12 },
// // //     { id: 2, title: 'Webflow', progress: 45, duration: '15h', lessons: 8 },
// // //     { id: 3, title: '3D Design', progress: 20, duration: '30h', lessons: 15 },
// // //   ];

// // //   const ongoingCourses = [
// // //     { id: 1, title: 'Business Analytics', progress: 52, duration: '2h 16m', lessons: 17 },
// // //   ];

// // //   return (
// // //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
// // //       {/* Color Palette Selector - For demo purposes */}
// // //       <View style={styles.paletteSelector}>
// // //         <TouchableOpacity 
// // //           style={[styles.paletteButton, currentPalette === 'professional' && styles.paletteButtonActive]}
// // //           onPress={() => setCurrentPalette('professional')}
// // //         >
// // //           <Text style={styles.paletteButtonText}>Blue</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity 
// // //           style={[styles.paletteButton, currentPalette === 'minimal' && styles.paletteButtonActive]}
// // //           onPress={() => setCurrentPalette('minimal')}
// // //         >
// // //           <Text style={styles.paletteButtonText}>Gray</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity 
// // //           style={[styles.paletteButton, currentPalette === 'warm' && styles.paletteButtonActive]}
// // //           onPress={() => setCurrentPalette('warm')}
// // //         >
// // //           <Text style={styles.paletteButtonText}>Warm</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <View>
// // //             <Text style={[styles.greeting, { color: colors.text.secondary }]}>Hi,</Text>
// // //             <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
// // //             <Text style={[styles.memberStatus, { color: colors.text.tertiary }]}>Basic Member</Text>
// // //           </View>
// // //           <TouchableOpacity
// // //             onPress={() => navigation.navigate('Notifications')}
// // //             style={[styles.notificationButton, { backgroundColor: colors.secondary[100] }]}
// // //           >
// // //             <Ionicons
// // //               name="notifications-outline"
// // //               size={24}
// // //               color={colors.text.primary}
// // //             />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* Search Bar */}
// // //         <TouchableOpacity 
// // //           style={[styles.searchBar, { backgroundColor: colors.background.paper }]}
// // //           onPress={() => navigation.navigate('Search')}
// // //         >
// // //           <Ionicons name="search" size={20} color={colors.text.tertiary} />
// // //           <Text style={[styles.searchText, { color: colors.text.tertiary }]}>Search Course</Text>
// // //         </TouchableOpacity>

// // //         {/* Quick Access Courses */}
// // //         <View style={styles.section}>
// // //           <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Let's Learn Now!</Text>
// // //           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
// // //             {recentCourses.map((course) => (
// // //               <TouchableOpacity 
// // //                 key={course.id}
// // //                 style={[styles.courseCard, { backgroundColor: colors.primary[50] }]}
// // //               >
// // //                 <Text style={[styles.courseTitle, { color: colors.text.primary }]}>{course.title}</Text>
// // //                 <Text style={[styles.courseMeta, { color: colors.text.secondary }]}>{course.duration}</Text>
// // //                 <View style={styles.progressBar}>
// // //                   <View 
// // //                     style={[
// // //                       styles.progressFill, 
// // //                       { 
// // //                         width: `${course.progress}%`,
// // //                         backgroundColor: colors.primary[500]
// // //                       }
// // //                     ]} 
// // //                   />
// // //                 </View>
// // //               </TouchableOpacity>
// // //             ))}
// // //           </ScrollView>
// // //         </View>

// // //         {/* Ongoing Course Highlight */}
// // //         <View style={styles.section}>
// // //           <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Continue Learning</Text>
// // //           {ongoingCourses.map((course) => (
// // //             <TouchableOpacity 
// // //               key={course.id}
// // //               style={[styles.ongoingCard, { backgroundColor: colors.background.paper }]}
// // //             >
// // //               <View style={styles.ongoingHeader}>
// // //                 <Text style={[styles.ongoingTitle, { color: colors.text.primary }]}>{course.title}</Text>
// // //                 <View style={styles.badge}>
// // //                   <Text style={[styles.badgeText, { color: colors.primary[500] }]}>Ongoing</Text>
// // //                 </View>
// // //               </View>
// // //               <Text style={[styles.ongoingSubtitle, { color: colors.text.secondary }]}>
// // //                 From Basics to Breakthroughs
// // //               </Text>
// // //               <View style={styles.courseMeta}>
// // //                 <Text style={[styles.metaText, { color: colors.text.secondary }]}>{course.duration}</Text>
// // //                 <Text style={[styles.metaText, { color: colors.text.secondary }]}>{course.lessons} Lessons</Text>
// // //               </View>
// // //               <View style={styles.progressSection}>
// // //                 <View style={styles.progressInfo}>
// // //                   <Text style={[styles.progressLabel, { color: colors.text.primary }]}>Progress</Text>
// // //                   <Text style={[styles.progressPercent, { color: colors.primary[500] }]}>{course.progress}%</Text>
// // //                 </View>
// // //                 <View style={styles.progressBar}>
// // //                   <View 
// // //                     style={[
// // //                       styles.progressFill, 
// // //                       { 
// // //                         width: `${course.progress}%`,
// // //                         backgroundColor: colors.primary[500]
// // //                       }
// // //                     ]} 
// // //                   />
// // //                 </View>
// // //               </View>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>

// // //         {/* Recent Items */}
// // //         <View style={styles.section}>
// // //           <View style={styles.sectionHeader}>
// // //             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Items</Text>
// // //             <TouchableOpacity>
// // //               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See all</Text>
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           <View style={styles.recentItem}>
// // //             <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// // //               <Ionicons name="map-outline" size={20} color={colors.primary[500]} />
// // //             </View>
// // //             <View style={styles.recentContent}>
// // //               <Text style={[styles.recentTitle, { color: colors.text.primary }]}>Customer journey map</Text>
// // //               <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>5 Lessons • Search Writings</Text>
// // //             </View>
// // //             <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// // //           </View>

// // //           <View style={styles.recentItem}>
// // //             <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// // //               <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
// // //             </View>
// // //             <View style={styles.recentContent}>
// // //               <Text style={[styles.recentTitle, { color: colors.text.primary }]}>October 2025</Text>
// // //               <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>Calendar</Text>
// // //             </View>
// // //             <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// // //           </View>
// // //         </View>

// // //         {/* Stats Overview */}
// // //         <View style={styles.statsGrid}>
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.totalCourses}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Courses</Text>
// // //           </View>
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Text style={[styles.statValue, { color: colors.status.progress }]}>{stats.inProgress}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>In Progress</Text>
// // //           </View>
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Text style={[styles.statValue, { color: colors.status.completed }]}>{stats.completed}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Completed</Text>
// // //           </View>
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Text style={[styles.statValue, { color: colors.primary[500] }]}>{stats.upcoming}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Upcoming</Text>
// // //           </View>
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     paddingHorizontal: 20,
// // //   },
// // //   paletteSelector: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     paddingVertical: 10,
// // //     gap: 8,
// // //   },
// // //   paletteButton: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#F1F5F9',
// // //   },
// // //   paletteButtonActive: {
// // //     backgroundColor: '#3B82F6',
// // //   },
// // //   paletteButtonText: {
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //     color: '#64748B',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     paddingVertical: 24,
// // //   },
// // //   greeting: {
// // //     fontSize: 16,
// // //     fontWeight: '400',
// // //   },
// // //   userName: {
// // //     fontSize: 28,
// // //     fontWeight: '700',
// // //     marginTop: 4,
// // //   },
// // //   memberStatus: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //     marginTop: 2,
// // //   },
// // //   notificationButton: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   searchBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderRadius: 12,
// // //     marginBottom: 24,
// // //     gap: 12,
// // //   },
// // //   searchText: {
// // //     fontSize: 16,
// // //     fontWeight: '400',
// // //     flex: 1,
// // //   },
// // //   section: {
// // //     marginBottom: 24,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //   },
// // //   seeAllText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   horizontalScroll: {
// // //     marginHorizontal: -20,
// // //     paddingHorizontal: 20,
// // //   },
// // //   courseCard: {
// // //     width: 140,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginRight: 12,
// // //   },
// // //   courseTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     marginBottom: 4,
// // //   },
// // //   courseMeta: {
// // //     fontSize: 12,
// // //     fontWeight: '400',
// // //     marginBottom: 12,
// // //   },
// // //   ongoingCard: {
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#F1F5F9',
// // //   },
// // //   ongoingHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 8,
// // //   },
// // //   ongoingTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     flex: 1,
// // //   },
// // //   badge: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //     backgroundColor: '#EFF6FF',
// // //     marginLeft: 8,
// // //   },
// // //   badgeText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   ongoingSubtitle: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //     marginBottom: 12,
// // //   },
// // //   courseMeta: {
// // //     flexDirection: 'row',
// // //     gap: 16,
// // //     marginBottom: 16,
// // //   },
// // //   metaText: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //   },
// // //   progressSection: {
// // //     marginTop: 8,
// // //   },
// // //   progressInfo: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   progressLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   progressPercent: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   progressBar: {
// // //     height: 6,
// // //     backgroundColor: '#F1F5F9',
// // //     borderRadius: 3,
// // //     overflow: 'hidden',
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     borderRadius: 3,
// // //   },
// // //   recentItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //     gap: 12,
// // //   },
// // //   recentIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   recentContent: {
// // //     flex: 1,
// // //   },
// // //   recentTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '500',
// // //     marginBottom: 2,
// // //   },
// // //   recentSubtitle: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //     color: '#64748B',
// // //   },
// // //   statsGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 12,
// // //     marginBottom: 32,
// // //   },
// // //   statItem: {
// // //     flex: 1,
// // //     minWidth: '45%',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#F1F5F9',
// // //   },
// // //   statValue: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     marginBottom: 4,
// // //   },
// // //   statLabel: {
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //     textAlign: 'center',
// // //   },
// // // });





// // // // DashboardScreen.tsx
// // // import React, { useState } from 'react';
// // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { useTasks, useChannels } from '../../hooks/useApi';
// // // import { useAuthStore } from '../../stores';

// // // // Color palette options
// // // const colorPalettes = {
// // //   professional: {
// // //     primary: {
// // //       50: '#EFF6FF',
// // //       100: '#DBEAFE',
// // //       500: '#3B82F6',
// // //       600: '#2563EB',
// // //     },
// // //     secondary: {
// // //       50: '#F8FAFC',
// // //       100: '#F1F5F9',
// // //     },
// // //     accent: '#10B981',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#F8FAFC',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#F59E0B',
// // //       completed: '#10B981',
// // //     }
// // //   },
// // //   minimal: {
// // //     primary: {
// // //       50: '#F8FAFC',
// // //       100: '#F1F5F9',
// // //       500: '#64748B',
// // //       600: '#475569',
// // //     },
// // //     secondary: {
// // //       50: '#FFFFFF',
// // //       100: '#F8FAFC',
// // //     },
// // //     accent: '#6366F1',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#F8FAFC',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#F59E0B',
// // //       completed: '#10B981',
// // //     }
// // //   },
// // //   warm: {
// // //     primary: {
// // //       50: '#FFFBEB',
// // //       100: '#FEF3C7',
// // //       500: '#F59E0B',
// // //       600: '#D97706',
// // //     },
// // //     secondary: {
// // //       50: '#FEFCE8',
// // //       100: '#FEF9C3',
// // //     },
// // //     accent: '#DC2626',
// // //     background: {
// // //       default: '#FFFFFF',
// // //       paper: '#FFFBEB',
// // //     },
// // //     text: {
// // //       primary: '#1E293B',
// // //       secondary: '#64748B',
// // //       tertiary: '#94A3B8',
// // //     },
// // //     status: {
// // //       progress: '#2563EB',
// // //       completed: '#059669',
// // //     }
// // //   }
// // // };

// // // type ColorPalette = keyof typeof colorPalettes;

// // // export default function DashboardScreen({ navigation }: any) {
// // //   const [currentPalette, setCurrentPalette] = useState<ColorPalette>('professional');
// // //   const colors = colorPalettes[currentPalette];

// // //   // Real data from your hooks and stores
// // //   const user = useAuthStore((state) => state.user);
// // //   const { data: tasks, isLoading: tasksLoading } = useTasks();
// // //   const { data: channels, isLoading: channelsLoading } = useChannels();

// // //   // Calculate stats from real data
// // //   const completedTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;
// // //   const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
// // //   const totalTasks = tasks?.length || 0;
// // //   const totalChannels = channels?.length || 0;

// // //   // Get recent tasks for display
// // //   const recentTasks = tasks?.slice(0, 3) || [];

// // //   // Get ongoing tasks (in progress)
// // //   const ongoingTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').slice(0, 2) || [];

// // //   return (
// // //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      
// // //       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <View>
// // //             <Text style={[styles.greeting, { color: colors.text.secondary }]}>Good day,</Text>
// // //             <Text style={[styles.userName, { color: colors.text.primary }]}>
// // //               {user?.name || 'User'}!
// // //             </Text>
// // //             <Text style={[styles.memberStatus, { color: colors.text.tertiary }]}>
// // //               {user?.role || 'Member'}
// // //             </Text>
// // //           </View>
// // //           <TouchableOpacity
// // //             onPress={() => navigation.navigate('Notifications')}
// // //             style={[styles.notificationButton, { backgroundColor: colors.secondary[100] }]}
// // //           >
// // //             <Ionicons
// // //               name="notifications-outline"
// // //               size={24}
// // //               color={colors.text.primary}
// // //             />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* Search Bar */}
// // //         <TouchableOpacity 
// // //           style={[styles.searchBar, { backgroundColor: colors.background.paper }]}
// // //           onPress={() => navigation.navigate('Search')}
// // //         >
// // //           <Ionicons name="search" size={20} color={colors.text.tertiary} />
// // //           <Text style={[styles.searchText, { color: colors.text.tertiary }]}>
// // //             Search Tasks & Channels
// // //           </Text>
// // //         </TouchableOpacity>

// // //         {/* Stats Overview */}
// // //         <View style={styles.statsGrid}>
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Ionicons name="briefcase-outline" size={24} color={colors.primary[500]} />
// // //             <Text style={[styles.statValue, { color: colors.text.primary }]}>{totalTasks}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Tasks</Text>
// // //           </View>
          
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Ionicons name="time-outline" size={24} color={colors.status.progress} />
// // //             <Text style={[styles.statValue, { color: colors.status.progress }]}>{inProgressTasks}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>In Progress</Text>
// // //           </View>
          
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Ionicons name="checkmark-circle-outline" size={24} color={colors.status.completed} />
// // //             <Text style={[styles.statValue, { color: colors.status.completed }]}>{completedTasks}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Completed</Text>
// // //           </View>
          
// // //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// // //             <Ionicons name="chatbubbles-outline" size={24} color={colors.primary[500]} />
// // //             <Text style={[styles.statValue, { color: colors.text.primary }]}>{totalChannels}</Text>
// // //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Channels</Text>
// // //           </View>
// // //         </View>

// // //         {/* Ongoing Tasks */}
// // //         {ongoingTasks.length > 0 && (
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
// // //                 Ongoing Tasks
// // //               </Text>
// // //               <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
// // //                 <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>View All</Text>
// // //               </TouchableOpacity>
// // //             </View>
            
// // //             {ongoingTasks.map((task) => (
// // //               <TouchableOpacity 
// // //                 key={task.id}
// // //                 style={[styles.ongoingCard, { backgroundColor: colors.background.paper }]}
// // //                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
// // //               >
// // //                 <View style={styles.ongoingHeader}>
// // //                   <Text style={[styles.ongoingTitle, { color: colors.text.primary }]}>
// // //                     {task.title}
// // //                   </Text>
// // //                   <View style={[styles.badge, { backgroundColor: colors.primary[50] }]}>
// // //                     <Text style={[styles.badgeText, { color: colors.primary[500] }]}>
// // //                       In Progress
// // //                     </Text>
// // //                   </View>
// // //                 </View>
                
// // //                 {task.description && (
// // //                   <Text style={[styles.ongoingSubtitle, { color: colors.text.secondary }]} 
// // //                         numberOfLines={2}>
// // //                     {task.description}
// // //                   </Text>
// // //                 )}
                
// // //                 <View style={styles.progressSection}>
// // //                   <View style={styles.progressInfo}>
// // //                     <Text style={[styles.progressLabel, { color: colors.text.primary }]}>
// // //                       Progress
// // //                     </Text>
// // //                     <Text style={[styles.progressPercent, { color: colors.primary[500] }]}>
// // //                       {task.progress || 0}%
// // //                     </Text>
// // //                   </View>
// // //                   <View style={styles.progressBar}>
// // //                     <View 
// // //                       style={[
// // //                         styles.progressFill, 
// // //                         { 
// // //                           width: `${task.progress || 0}%`,
// // //                           backgroundColor: colors.primary[500]
// // //                         }
// // //                       ]} 
// // //                     />
// // //                   </View>
// // //                 </View>
// // //               </TouchableOpacity>
// // //             ))}
// // //           </View>
// // //         )}

// // //         {/* Recent Tasks */}
// // //         <View style={styles.section}>
// // //           <View style={styles.sectionHeader}>
// // //             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
// // //               Recent Tasks
// // //             </Text>
// // //             <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
// // //               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>View All</Text>
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           {tasksLoading ? (
// // //             <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Loading tasks...</Text>
// // //           ) : recentTasks.length > 0 ? (
// // //             recentTasks.map((task) => (
// // //               <TouchableOpacity 
// // //                 key={task.id}
// // //                 style={[styles.recentItem, { backgroundColor: colors.background.paper }]}
// // //                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
// // //               >
// // //                 <View style={[styles.recentIcon, { 
// // //                   backgroundColor: task.status === 'DONE' ? colors.status.completed + '20' : 
// // //                                   task.status === 'IN_PROGRESS' ? colors.status.progress + '20' : 
// // //                                   colors.primary[50] 
// // //                 }]}>
// // //                   <Ionicons 
// // //                     name={task.status === 'DONE' ? 'checkmark-circle' : 
// // //                           task.status === 'IN_PROGRESS' ? 'time' : 'document-text'} 
// // //                     size={20} 
// // //                     color={task.status === 'DONE' ? colors.status.completed : 
// // //                           task.status === 'IN_PROGRESS' ? colors.status.progress : 
// // //                           colors.primary[500]} 
// // //                   />
// // //                 </View>
                
// // //                 <View style={styles.recentContent}>
// // //                   <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
// // //                     {task.title}
// // //                   </Text>
// // //                   <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
// // //                     {task.status.replace('_', ' ')} • {task.category || 'General'}
// // //                   </Text>
// // //                 </View>
                
// // //                 <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// // //               </TouchableOpacity>
// // //             ))
// // //           ) : (
// // //             <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
// // //               No tasks available
// // //             </Text>
// // //           )}
// // //         </View>

// // //         {/* Channels Section */}
// // //         <View style={styles.section}>
// // //           <View style={styles.sectionHeader}>
// // //             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
// // //               Your Channels
// // //             </Text>
// // //             <TouchableOpacity onPress={() => navigation.navigate('Channels')}>
// // //               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>View All</Text>
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           {channelsLoading ? (
// // //             <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Loading channels...</Text>
// // //           ) : channels && channels.length > 0 ? (
// // //             channels.slice(0, 3).map((channel) => (
// // //               <TouchableOpacity 
// // //                 key={channel.id}
// // //                 style={[styles.recentItem, { backgroundColor: colors.background.paper }]}
// // //                 onPress={() => navigation.navigate('ChannelDetail', { channelId: channel.id })}
// // //               >
// // //                 <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// // //                   <Ionicons name="chatbubbles-outline" size={20} color={colors.primary[500]} />
// // //                 </View>
                
// // //                 <View style={styles.recentContent}>
// // //                   <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
// // //                     {channel.name}
// // //                   </Text>
// // //                   <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
// // //                     {channel.memberCount || 0} members • {channel.type || 'Channel'}
// // //                   </Text>
// // //                 </View>
                
// // //                 <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// // //               </TouchableOpacity>
// // //             ))
// // //           ) : (
// // //             <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
// // //               No channels available
// // //             </Text>
// // //           )}
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     paddingHorizontal: 20,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     paddingVertical: 24,
// // //   },
// // //   greeting: {
// // //     fontSize: 16,
// // //     fontWeight: '400',
// // //   },
// // //   userName: {
// // //     fontSize: 28,
// // //     fontWeight: '700',
// // //     marginTop: 4,
// // //   },
// // //   memberStatus: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //     marginTop: 2,
// // //   },
// // //   notificationButton: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   searchBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderRadius: 12,
// // //     marginBottom: 24,
// // //     gap: 12,
// // //   },
// // //   searchText: {
// // //     fontSize: 16,
// // //     fontWeight: '400',
// // //     flex: 1,
// // //   },
// // //   statsGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 12,
// // //     marginBottom: 24,
// // //   },
// // //   statItem: {
// // //     flex: 1,
// // //     minWidth: '45%',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#F1F5F9',
// // //   },
// // //   statValue: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     marginTop: 8,
// // //     marginBottom: 4,
// // //   },
// // //   statLabel: {
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //     textAlign: 'center',
// // //   },
// // //   section: {
// // //     marginBottom: 24,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //   },
// // //   seeAllText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   ongoingCard: {
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#F1F5F9',
// // //     marginBottom: 12,
// // //   },
// // //   ongoingHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 8,
// // //   },
// // //   ongoingTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     flex: 1,
// // //   },
// // //   badge: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //     marginLeft: 8,
// // //   },
// // //   badgeText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   ongoingSubtitle: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //     marginBottom: 12,
// // //   },
// // //   progressSection: {
// // //     marginTop: 8,
// // //   },
// // //   progressInfo: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   progressLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   progressPercent: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   progressBar: {
// // //     height: 6,
// // //     backgroundColor: '#F1F5F9',
// // //     borderRadius: 3,
// // //     overflow: 'hidden',
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     borderRadius: 3,
// // //   },
// // //   recentItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginBottom: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#F1F5F9',
// // //   },
// // //   recentIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   recentContent: {
// // //     flex: 1,
// // //   },
// // //   recentTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '500',
// // //     marginBottom: 2,
// // //   },
// // //   recentSubtitle: {
// // //     fontSize: 14,
// // //     fontWeight: '400',
// // //   },
// // //   emptyText: {
// // //     fontSize: 16,
// // //     fontWeight: '400',
// // //     textAlign: 'center',
// // //     paddingVertical: 20,
// // //   },
// // // });






// // // DashboardScreen.tsx
// // import React, {useState} from 'react';
// // import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useTasks, useChannels } from '../../hooks/useApi';
// // import { useAuthStore } from '../../stores';

// // // Color palette options
// // const colorPalettes = {
// //   // Option 1: Professional Blue (Default)
// //   professional: {
// //     primary: {
// //       50: '#EFF6FF',
// //       100: '#DBEAFE',
// //       500: '#3B82F6',
// //       600: '#2563EB',
// //     },
// //     secondary: {
// //       50: '#F8FAFC',
// //       100: '#F1F5F9',
// //     },
// //     accent: '#10B981',
// //     background: {
// //       default: '#FFFFFF',
// //       paper: '#F8FAFC',
// //     },
// //     text: {
// //       primary: '#1E293B',
// //       secondary: '#64748B',
// //       tertiary: '#94A3B8',
// //     },
// //     status: {
// //       progress: '#F59E0B',
// //       completed: '#10B981',
// //     }
// //   },

// //   // Option 2: Minimal Gray
// //   minimal: {
// //     primary: {
// //       50: '#F8FAFC',
// //       100: '#F1F5F9',
// //       500: '#64748B',
// //       600: '#475569',
// //     },
// //     secondary: {
// //       50: '#FFFFFF',
// //       100: '#F8FAFC',
// //     },
// //     accent: '#6366F1',
// //     background: {
// //       default: '#FFFFFF',
// //       paper: '#F8FAFC',
// //     },
// //     text: {
// //       primary: '#1E293B',
// //       secondary: '#64748B',
// //       tertiary: '#94A3B8',
// //     },
// //     status: {
// //       progress: '#F59E0B',
// //       completed: '#10B981',
// //     }
// //   },

// //   // Option 3: Warm Professional
// //   warm: {
// //     primary: {
// //       50: '#FFFBEB',
// //       100: '#FEF3C7',
// //       500: '#F59E0B',
// //       600: '#D97706',
// //     },
// //     secondary: {
// //       50: '#FEFCE8',
// //       100: '#FEF9C3',
// //     },
// //     accent: '#DC2626',
// //     background: {
// //       default: '#FFFFFF',
// //       paper: '#FFFBEB',
// //     },
// //     text: {
// //       primary: '#1E293B',
// //       secondary: '#64748B',
// //       tertiary: '#94A3B8',
// //     },
// //     status: {
// //       progress: '#2563EB',
// //       completed: '#059669',
// //     }
// //   }
// // };

// // type ColorPalette = keyof typeof colorPalettes;

// // export default function DashboardScreen({ navigation }: any) {
// //   const [currentPalette, setCurrentPalette] = useState<ColorPalette>('professional');
// //   const colors = colorPalettes[currentPalette];

// //   // Real data from your API hooks
// //   const user = useAuthStore((state) => state.user);
// //   const { data: tasks, isLoading: tasksLoading } = useTasks();
// //   const { data: channels, isLoading: channelsLoading } = useChannels();

// //   // Calculate stats from real data
// //   const completedTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;
// //   const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
// //   const totalTasks = tasks?.length || 0;
// //   const totalChannels = channels?.length || 0;

// //   // Get recent tasks for quick access (first 3 tasks)
// //   const recentTasks = tasks?.slice(0, 3) || [];

// //   // Get ongoing tasks (in progress) for continue learning section
// //   const ongoingTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').slice(0, 1) || [];

// //   // Format progress percentage for tasks
// //   const getTaskProgress = (task: any) => {
// //     return task.progress || (task.status === 'DONE' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0);
// //   };

// //   return (
// //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
// //       {/* Color Palette Selector - For demo purposes */}
// //       <View style={styles.paletteSelector}>
// //         <TouchableOpacity 
// //           style={[styles.paletteButton, currentPalette === 'professional' && styles.paletteButtonActive]}
// //           onPress={() => setCurrentPalette('professional')}
// //         >
// //           <Text style={styles.paletteButtonText}>Blue</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity 
// //           style={[styles.paletteButton, currentPalette === 'minimal' && styles.paletteButtonActive]}
// //           onPress={() => setCurrentPalette('minimal')}
// //         >
// //           <Text style={styles.paletteButtonText}>Gray</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity 
// //           style={[styles.paletteButton, currentPalette === 'warm' && styles.paletteButtonActive]}
// //           onPress={() => setCurrentPalette('warm')}
// //         >
// //           <Text style={styles.paletteButtonText}>Warm</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// //         {/* Header */}
// //         {/* <View style={styles.header}>
// //           <View>
// //             <Text style={[styles.greeting, { color: colors.text.secondary }]}>Good day,</Text>
// //             <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.name || 'User'}!</Text>
// //             <Text style={[styles.memberStatus, { color: colors.text.tertiary }]}>
// //               {user?.role ? `${user.role} Member` : 'Basic Member'}
// //             </Text>
// //           </View>
// //           <TouchableOpacity
// //             onPress={() => navigation.navigate('Notifications')}
// //             style={[styles.notificationButton, { backgroundColor: colors.secondary[100] }]}
// //           >
// //             <Ionicons
// //               name="notifications-outline"
// //               size={24}
// //               color={colors.text.primary}
// //             />
// //           </TouchableOpacity>
// //         </View> */}

// //         <View style={styles.header}>
// //   <View>
// //     <Text style={[styles.greeting, { color: colors.text.secondary }]}>Good day,</Text>
// //     <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.name || 'User'}!</Text>
// //     <Text style={[styles.memberStatus, { color: colors.text.tertiary }]}>
// //       {user?.role ? `${user.role} Member` : 'Basic Member'}
// //     </Text>
// //   </View>
  
// //   <View style={styles.headerButtons}>
// //     {/* Theme Selector Button */}
// //     <TouchableOpacity
// //       onPress={() => {
// //         // Show theme selection modal or dropdown
// //         const themes: ColorPalette[] = ['professional', 'minimal', 'warm'];
// //         const currentIndex = themes.indexOf(currentPalette);
// //         const nextIndex = (currentIndex + 1) % themes.length;
// //         setCurrentPalette(themes[nextIndex]);
// //       }}
// //       style={[styles.themeButton, { backgroundColor: colors.secondary[100] }]}
// //     >
// //       <Ionicons
// //         name="color-palette-outline"
// //         size={24}
// //         color={colors.text.primary}
// //       />
// //     </TouchableOpacity>

// //     {/* Notification Button */}
// //     <TouchableOpacity
// //       onPress={() => navigation.navigate('Notifications')}
// //       style={[styles.notificationButton, { backgroundColor: colors.secondary[100] }]}
// //     >
// //       <Ionicons
// //         name="notifications-outline"
// //         size={24}
// //         color={colors.text.primary}
// //       />
// //     </TouchableOpacity>
// //   </View>
// // </View>

// //         {/* Search Bar */}
// //         <TouchableOpacity 
// //           style={[styles.searchBar, { backgroundColor: colors.background.paper }]}
// //           onPress={() => navigation.navigate('Search')}
// //         >
// //           <Ionicons name="search" size={20} color={colors.text.tertiary} />
// //           <Text style={[styles.searchText, { color: colors.text.tertiary }]}>Search Tasks</Text>
// //         </TouchableOpacity>

// //         {/* Quick Access Tasks - Let's Learn Now! Section */}
// //         <View style={styles.section}>
// //           <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Let's Work Now!</Text>
// //           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
// //             {recentTasks.map((task) => (
// //               <TouchableOpacity 
// //                 key={task.id}
// //                 style={[styles.courseCard, { backgroundColor: colors.primary[50] }]}
// //                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
// //               >
// //                 <Text style={[styles.courseTitle, { color: colors.text.primary }]}>{task.title}</Text>
// //                 <Text style={[styles.courseMeta, { color: colors.text.secondary }]}>
// //                   {task.category || 'Task'} • {getTaskProgress(task)}%
// //                 </Text>
// //                 <View style={styles.progressBar}>
// //                   <View 
// //                     style={[
// //                       styles.progressFill, 
// //                       { 
// //                         width: `${getTaskProgress(task)}%`,
// //                         backgroundColor: colors.primary[500]
// //                       }
// //                     ]} 
// //                   />
// //                 </View>
// //               </TouchableOpacity>
// //             ))}
// //             {recentTasks.length === 0 && !tasksLoading && (
// //               <View style={[styles.courseCard, { backgroundColor: colors.primary[50] }]}>
// //                 <Text style={[styles.courseTitle, { color: colors.text.primary }]}>No Tasks</Text>
// //                 <Text style={[styles.courseMeta, { color: colors.text.secondary }]}>Create your first task</Text>
// //               </View>
// //             )}
// //           </ScrollView>
// //         </View>

// //         {/* Ongoing Task Highlight - Continue Learning Section */}
// //         <View style={styles.section}>
// //           <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Continue Working</Text>
// //           {ongoingTasks.map((task) => (
// //             <TouchableOpacity 
// //               key={task.id}
// //               style={[styles.ongoingCard, { backgroundColor: colors.background.paper }]}
// //               onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
// //             >
// //               <View style={styles.ongoingHeader}>
// //                 <Text style={[styles.ongoingTitle, { color: colors.text.primary }]}>{task.title}</Text>
// //                 <View style={[styles.badge, { backgroundColor: colors.primary[50] }]}>
// //                   <Text style={[styles.badgeText, { color: colors.primary[500] }]}>
// //                     {task.status.replace('_', ' ')}
// //                   </Text>
// //                 </View>
// //               </View>
// //               {task.description && (
// //                 <Text style={[styles.ongoingSubtitle, { color: colors.text.secondary }]} numberOfLines={2}>
// //                   {task.description}
// //                 </Text>
// //               )}
// //               <View style={styles.courseMeta}>
// //                 <Text style={[styles.metaText, { color: colors.text.secondary }]}>
// //                   {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
// //                 </Text>
// //                 <Text style={[styles.metaText, { color: colors.text.secondary }]}>
// //                   {task.priority || 'Normal'} Priority
// //                 </Text>
// //               </View>
// //               <View style={styles.progressSection}>
// //                 <View style={styles.progressInfo}>
// //                   <Text style={[styles.progressLabel, { color: colors.text.primary }]}>Progress</Text>
// //                   <Text style={[styles.progressPercent, { color: colors.primary[500] }]}>{getTaskProgress(task)}%</Text>
// //                 </View>
// //                 <View style={styles.progressBar}>
// //                   <View 
// //                     style={[
// //                       styles.progressFill, 
// //                       { 
// //                         width: `${getTaskProgress(task)}%`,
// //                         backgroundColor: colors.primary[500]
// //                       }
// //                     ]} 
// //                   />
// //                 </View>
// //               </View>
// //             </TouchableOpacity>
// //           ))}
// //           {ongoingTasks.length === 0 && !tasksLoading && (
// //             <View style={[styles.ongoingCard, { backgroundColor: colors.background.paper }]}>
// //               <View style={styles.ongoingHeader}>
// //                 <Text style={[styles.ongoingTitle, { color: colors.text.primary }]}>No Ongoing Tasks</Text>
// //               </View>
// //               <Text style={[styles.ongoingSubtitle, { color: colors.text.secondary }]}>
// //                 Start a new task to see it here
// //               </Text>
// //             </View>
// //           )}
// //         </View>

// //         {/* Recent Items */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
// //             <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
// //               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See all</Text>
// //             </TouchableOpacity>
// //           </View>
          
// //           {/* Recent Task Item */}
// //           {tasks && tasks.length > 0 && (
// //             <View style={styles.recentItem}>
// //               <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// //                 <Ionicons name="document-text-outline" size={20} color={colors.primary[500]} />
// //               </View>
// //               <View style={styles.recentContent}>
// //                 <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
// //                   {tasks[0]?.title || 'Recent Task'}
// //                 </Text>
// //                 <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
// //                   {tasks[0]?.status.replace('_', ' ') || 'Status'} • {tasks[0]?.category || 'General'}
// //                 </Text>
// //               </View>
// //               <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// //             </View>
// //           )}

// //           {/* Channels Item */}
// //           {channels && channels.length > 0 && (
// //             <View style={styles.recentItem}>
// //               <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// //                 <Ionicons name="chatbubbles-outline" size={20} color={colors.primary[500]} />
// //               </View>
// //               <View style={styles.recentContent}>
// //                 <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
// //                   {channels[0]?.name || 'Recent Channel'}
// //                 </Text>
// //                 <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
// //                   {channels[0]?.memberCount || 0} members • {channels[0]?.type || 'Channel'}
// //                 </Text>
// //               </View>
// //               <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
// //             </View>
// //           )}

// //           {(tasks?.length === 0 && channels?.length === 0) && !tasksLoading && !channelsLoading && (
// //             <View style={styles.recentItem}>
// //               <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
// //                 <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
// //               </View>
// //               <View style={styles.recentContent}>
// //                 <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
// //                   No Recent Activity
// //                 </Text>
// //                 <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
// //                   Complete tasks to see activity here
// //                 </Text>
// //               </View>
// //             </View>
// //           )}
// //         </View>

// //         {/* Stats Overview */}
// //         <View style={styles.statsGrid}>
// //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// //             <Text style={[styles.statValue, { color: colors.text.primary }]}>{totalTasks}</Text>
// //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Tasks</Text>
// //           </View>
// //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// //             <Text style={[styles.statValue, { color: colors.status.progress }]}>{inProgressTasks}</Text>
// //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>In Progress</Text>
// //           </View>
// //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// //             <Text style={[styles.statValue, { color: colors.status.completed }]}>{completedTasks}</Text>
// //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Completed</Text>
// //           </View>
// //           <View style={[styles.statItem, { backgroundColor: colors.background.paper }]}>
// //             <Text style={[styles.statValue, { color: colors.primary[500] }]}>{totalChannels}</Text>
// //             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Channels</Text>
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   content: {
// //     flex: 1,
// //     paddingHorizontal: 20,
// //   },
// //   paletteSelector: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     paddingVertical: 10,
// //     gap: 8,
// //   },
// //   paletteButton: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     backgroundColor: '#F1F5F9',
// //   },
// //   paletteButtonActive: {
// //     backgroundColor: '#3B82F6',
// //   },
// //   paletteButtonText: {
// //     fontSize: 12,
// //     fontWeight: '500',
// //     color: '#64748B',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     paddingVertical: 24,
// //   },
// //   greeting: {
// //     fontSize: 16,
// //     fontWeight: '400',
// //   },
// //   userName: {
// //     fontSize: 28,
// //     fontWeight: '700',
// //     marginTop: 4,
// //   },
// //   memberStatus: {
// //     fontSize: 14,
// //     fontWeight: '400',
// //     marginTop: 2,
// //   },
// //   notificationButton: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   searchBar: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //     marginBottom: 24,
// //     gap: 12,
// //   },
// //   searchText: {
// //     fontSize: 16,
// //     fontWeight: '400',
// //     flex: 1,
// //   },
// //   section: {
// //     marginBottom: 24,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //   },
// //   seeAllText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   horizontalScroll: {
// //     marginHorizontal: -20,
// //     paddingHorizontal: 20,
// //   },
// //   courseCard: {
// //     width: 140,
// //     padding: 16,
// //     borderRadius: 12,
// //     marginRight: 12,
// //   },
// //   courseTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   courseMeta: {
// //     fontSize: 12,
// //     fontWeight: '400',
// //     marginBottom: 12,
// //   },
// //   ongoingCard: {
// //     padding: 20,
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: '#F1F5F9',
// //   },
// //   ongoingHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     marginBottom: 8,
// //   },
// //   ongoingTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     flex: 1,
// //   },
// //   badge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //     marginLeft: 8,
// //   },
// //   badgeText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   ongoingSubtitle: {
// //     fontSize: 14,
// //     fontWeight: '400',
// //     marginBottom: 12,
// //   },
// //   courseMeta: {
// //     flexDirection: 'row',
// //     gap: 16,
// //     marginBottom: 16,
// //   },
// //   metaText: {
// //     fontSize: 14,
// //     fontWeight: '400',
// //   },
// //   progressSection: {
// //     marginTop: 8,
// //   },
// //   progressInfo: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   progressLabel: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   progressPercent: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   progressBar: {
// //     height: 6,
// //     backgroundColor: '#F1F5F9',
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //   },
// //   progressFill: {
// //     height: '100%',
// //     borderRadius: 3,
// //   },
// //   recentItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     gap: 12,
// //   },
// //   recentIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   recentContent: {
// //     flex: 1,
// //   },
// //   recentTitle: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     marginBottom: 2,
// //   },
// //   recentSubtitle: {
// //     fontSize: 14,
// //     fontWeight: '400',
// //     color: '#64748B',
// //   },
// //   statsGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 12,
// //     marginBottom: 32,
// //   },
// //   statItem: {
// //     flex: 1,
// //     minWidth: '45%',
// //     padding: 16,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#F1F5F9',
// //   },
// //   statValue: {
// //     fontSize: 24,
// //     fontWeight: '700',
// //     marginBottom: 4,
// //   },
// //   statLabel: {
// //     fontSize: 12,
// //     fontWeight: '500',
// //     textAlign: 'center',
// //   },
// // });






// // DashboardScreen.tsx
// import React, {useState} from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTasks, useChannels } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';

// // Enhanced Color palette options
// const colorPalettes = {
//   // Option 1: Professional Blue (Default)
//   professional: {
//     primary: {
//       50: '#EFF6FF',
//       100: '#DBEAFE',
//       500: '#3B82F6',
//       600: '#2563EB',
//       700: '#1D4ED8',
//     },
//     secondary: {
//       50: '#F8FAFC',
//       100: '#F1F5F9',
//       200: '#E2E8F0',
//     },
//     accent: '#10B981',
//     background: {
//       default: '#FFFFFF',
//       paper: '#F8FAFC',
//     },
//     text: {
//       primary: '#1E293B',
//       secondary: '#64748B',
//       tertiary: '#94A3B8',
//     },
//     status: {
//       progress: '#F59E0B',
//       completed: '#10B981',
//     },
//     gradient: {
//       start: '#3B82F6',
//       end: '#1D4ED8',
//     }
//   },

//   // Option 2: Minimal Gray
//   minimal: {
//     primary: {
//       50: '#F8FAFC',
//       100: '#F1F5F9',
//       500: '#64748B',
//       600: '#475569',
//       700: '#334155',
//     },
//     secondary: {
//       50: '#FFFFFF',
//       100: '#F8FAFC',
//       200: '#E2E8F0',
//     },
//     accent: '#6366F1',
//     background: {
//       default: '#FFFFFF',
//       paper: '#F8FAFC',
//     },
//     text: {
//       primary: '#1E293B',
//       secondary: '#64748B',
//       tertiary: '#94A3B8',
//     },
//     status: {
//       progress: '#F59E0B',
//       completed: '#10B981',
//     },
//     gradient: {
//       start: '#64748B',
//       end: '#475569',
//     }
//   },

//   // Option 3: Warm Professional
//   warm: {
//     primary: {
//       50: '#FFFBEB',
//       100: '#FEF3C7',
//       500: '#F59E0B',
//       600: '#D97706',
//       700: '#B45309',
//     },
//     secondary: {
//       50: '#FEFCE8',
//       100: '#FEF9C3',
//       200: '#FEF08A',
//     },
//     accent: '#DC2626',
//     background: {
//       default: '#FFFFFF',
//       paper: '#FFFBEB',
//     },
//     text: {
//       primary: '#1E293B',
//       secondary: '#64748B',
//       tertiary: '#94A3B8',
//     },
//     status: {
//       progress: '#2563EB',
//       completed: '#059669',
//     },
//     gradient: {
//       start: '#F59E0B',
//       end: '#D97706',
//     }
//   }
// };

// type ColorPalette = keyof typeof colorPalettes;

// export default function DashboardScreen({ navigation }: any) {
//   const [currentPalette, setCurrentPalette] = useState<ColorPalette>('professional');
//   const colors = colorPalettes[currentPalette];

//   // Real data from your API hooks
//   const user = useAuthStore((state) => state.user);
//   const { data: tasks, isLoading: tasksLoading } = useTasks();
//   const { data: channels, isLoading: channelsLoading } = useChannels();

//   // Calculate stats from real data
//   const completedTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;
//   const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
//   const totalTasks = tasks?.length || 0;
//   const totalChannels = channels?.length || 0;

//   // Get recent tasks for quick access (first 3 tasks)
//   const recentTasks = tasks?.slice(0, 3) || [];

//   // Get ongoing tasks (in progress) for continue learning section
//   const ongoingTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').slice(0, 1) || [];

//   // Format progress percentage for tasks
//   const getTaskProgress = (task: any) => {
//     return task.progress || (task.status === 'DONE' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0);
//   };

//   // Cycle through themes
//   const cycleTheme = () => {
//     const themes: ColorPalette[] = ['professional', 'minimal', 'warm'];
//     const currentIndex = themes.indexOf(currentPalette);
//     const nextIndex = (currentIndex + 1) % themes.length;
//     setCurrentPalette(themes[nextIndex]);
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerTextContainer}>
//             <Text style={[styles.greeting, { color: colors.text.secondary }]}>Good day,</Text>
//             <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.name || 'User'}!</Text>
//             <Text style={[styles.memberStatus, { color: colors.text.tertiary }]}>
//               {user?.role ? `${user.role} Member` : 'Basic Member'}
//             </Text>
//           </View>
          
//           <View style={styles.headerButtons}>
//             {/* Theme Selector Button */}
//             <TouchableOpacity
//               onPress={cycleTheme}
//               style={[styles.iconButton, { backgroundColor: colors.secondary[100] }]}
//             >
//               <Ionicons
//                 name="color-palette-outline"
//                 size={20}
//                 color={colors.text.primary}
//               />
//             </TouchableOpacity>

//             {/* Notification Button */}
//             <TouchableOpacity
//               onPress={() => navigation.navigate('Notifications')}
//               style={[styles.iconButton, { backgroundColor: colors.secondary[100] }]}
//             >
//               <Ionicons
//                 name="notifications-outline"
//                 size={20}
//                 color={colors.text.primary}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Search Bar */}
//         <TouchableOpacity 
//           style={[styles.searchBar, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}
//           onPress={() => navigation.navigate('Search')}
//         >
//           <Ionicons name="search" size={20} color={colors.text.tertiary} />
//           <Text style={[styles.searchText, { color: colors.text.tertiary }]}>Search tasks, channels...</Text>
//         </TouchableOpacity>

//         {/* Stats Overview */}
//         <View style={styles.statsGrid}>
//           <View style={[styles.statItem, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//             <View style={[styles.statIcon, { backgroundColor: colors.primary[50] }]}>
//               <Ionicons name="document-text-outline" size={16} color={colors.primary[500]} />
//             </View>
//             <Text style={[styles.statValue, { color: colors.text.primary }]}>{totalTasks}</Text>
//             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Tasks</Text>
//           </View>
          
//           <View style={[styles.statItem, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//             <View style={[styles.statIcon, { backgroundColor: colors.status.progress + '20' }]}>
//               <Ionicons name="time-outline" size={16} color={colors.status.progress} />
//             </View>
//             <Text style={[styles.statValue, { color: colors.status.progress }]}>{inProgressTasks}</Text>
//             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>In Progress</Text>
//           </View>
          
//           <View style={[styles.statItem, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//             <View style={[styles.statIcon, { backgroundColor: colors.status.completed + '20' }]}>
//               <Ionicons name="checkmark-circle-outline" size={16} color={colors.status.completed} />
//             </View>
//             <Text style={[styles.statValue, { color: colors.status.completed }]}>{completedTasks}</Text>
//             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Completed</Text>
//           </View>
          
//           <View style={[styles.statItem, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//             <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
//               <Ionicons name="chatbubbles-outline" size={16} color={colors.accent} />
//             </View>
//             <Text style={[styles.statValue, { color: colors.accent }]}>{totalChannels}</Text>
//             <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Channels</Text>
//           </View>
//         </View>

//         {/* Quick Access Tasks - Let's Work Now! Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Let's Work Now!</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
//               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See all</Text>
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false} 
//             style={styles.horizontalScroll}
//             contentContainerStyle={styles.horizontalScrollContent}
//           >
//             {recentTasks.map((task) => (
//               <TouchableOpacity 
//                 key={task.id}
//                 style={[styles.taskCard, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}
//                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
//               >
//                 <View style={styles.taskCardHeader}>
//                   <View style={[styles.taskIcon, { backgroundColor: colors.primary[50] }]}>
//                     <Ionicons name="document-text-outline" size={20} color={colors.primary[500]} />
//                   </View>
//                   <View style={[styles.badge, { backgroundColor: colors.primary[50] }]}>
//                     <Text style={[styles.badgeText, { color: colors.primary[500] }]}>
//                       {getTaskProgress(task)}%
//                     </Text>
//                   </View>
//                 </View>
                
//                 <Text style={[styles.taskTitle, { color: colors.text.primary }]} numberOfLines={2}>
//                   {task.title}
//                 </Text>
//                 <Text style={[styles.taskMeta, { color: colors.text.secondary }]} numberOfLines={1}>
//                   {task.category || 'Task'} • {task.status.replace('_', ' ')}
//                 </Text>
                
//                 <View style={styles.progressSection}>
//                   <View style={styles.progressInfo}>
//                     <Text style={[styles.progressLabel, { color: colors.text.tertiary }]}>Progress</Text>
//                     <Text style={[styles.progressPercent, { color: colors.primary[500] }]}>{getTaskProgress(task)}%</Text>
//                   </View>
//                   <View style={styles.progressBar}>
//                     <View 
//                       style={[
//                         styles.progressFill, 
//                         { 
//                           width: `${getTaskProgress(task)}%`,
//                           backgroundColor: colors.primary[500]
//                         }
//                       ]} 
//                     />
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
            
//             {recentTasks.length === 0 && !tasksLoading && (
//               <View style={[styles.taskCard, styles.emptyCard, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//                 <View style={[styles.taskIcon, { backgroundColor: colors.primary[50] }]}>
//                   <Ionicons name="add-outline" size={24} color={colors.primary[500]} />
//                 </View>
//                 <Text style={[styles.taskTitle, { color: colors.text.primary }]}>No Tasks</Text>
//                 <Text style={[styles.taskMeta, { color: colors.text.secondary }]}>Create your first task to get started</Text>
//               </View>
//             )}
//           </ScrollView>
//         </View>

//         {/* Ongoing Task Highlight - Continue Working Section */}
//         {ongoingTasks.length > 0 && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Continue Working</Text>
//             </View>
            
//             {ongoingTasks.map((task) => (
//               <TouchableOpacity 
//                 key={task.id}
//                 style={[styles.ongoingCard, { backgroundColor: colors.background.paper, borderLeftColor: colors.primary[500] }]}
//                 onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
//               >
//                 <View style={styles.ongoingHeader}>
//                   <View style={styles.ongoingTitleContainer}>
//                     <Text style={[styles.ongoingTitle, { color: colors.text.primary }]}>{task.title}</Text>
//                     <View style={[styles.badge, { backgroundColor: colors.primary[50] }]}>
//                       <Text style={[styles.badgeText, { color: colors.primary[500] }]}>
//                         {task.status.replace('_', ' ')}
//                       </Text>
//                     </View>
//                   </View>
//                   <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
//                 </View>
                
//                 {task.description && (
//                   <Text style={[styles.ongoingSubtitle, { color: colors.text.secondary }]} numberOfLines={2}>
//                     {task.description}
//                   </Text>
//                 )}
                
//                 <View style={styles.taskMetaRow}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
//                     <Text style={[styles.metaText, { color: colors.text.secondary }]}>
//                       {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
//                     </Text>
//                   </View>
                  
//                   <View style={styles.metaItem}>
//                     <Ionicons name="flag-outline" size={14} color={colors.text.tertiary} />
//                     <Text style={[styles.metaText, { color: colors.text.secondary }]}>
//                       {task.priority || 'Normal'} Priority
//                     </Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.progressSection}>
//                   <View style={styles.progressInfo}>
//                     <Text style={[styles.progressLabel, { color: colors.text.primary }]}>Progress</Text>
//                     <Text style={[styles.progressPercent, { color: colors.primary[500] }]}>{getTaskProgress(task)}%</Text>
//                   </View>
//                   <View style={styles.progressBar}>
//                     <View 
//                       style={[
//                         styles.progressFill, 
//                         { 
//                           width: `${getTaskProgress(task)}%`,
//                           backgroundColor: colors.primary[500]
//                         }
//                       ]} 
//                     />
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Recent Activity */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
//               <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>See all</Text>
//             </TouchableOpacity>
//           </View>
          
//           <View style={[styles.recentContainer, { backgroundColor: colors.background.paper, borderColor: colors.secondary[200] }]}>
//             {/* Recent Task Item */}
//             {tasks && tasks.length > 0 && (
//               <TouchableOpacity style={styles.recentItem}>
//                 <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
//                   <Ionicons name="document-text-outline" size={18} color={colors.primary[500]} />
//                 </View>
//                 <View style={styles.recentContent}>
//                   <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
//                     {tasks[0]?.title || 'Recent Task'}
//                   </Text>
//                   <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
//                     {tasks[0]?.status.replace('_', ' ') || 'Status'} • {tasks[0]?.category || 'General'}
//                   </Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
//               </TouchableOpacity>
//             )}

//             {/* Channels Item */}
//             {channels && channels.length > 0 && (
//               <TouchableOpacity style={styles.recentItem}>
//                 <View style={[styles.recentIcon, { backgroundColor: colors.accent + '20' }]}>
//                   <Ionicons name="chatbubbles-outline" size={18} color={colors.accent} />
//                 </View>
//                 <View style={styles.recentContent}>
//                   <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
//                     {channels[0]?.name || 'Recent Channel'}
//                   </Text>
//                   <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
//                     {channels[0]?.memberCount || 0} members • {channels[0]?.type || 'Channel'}
//                   </Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
//               </TouchableOpacity>
//             )}

//             {(tasks?.length === 0 && channels?.length === 0) && !tasksLoading && !channelsLoading && (
//               <View style={styles.recentItem}>
//                 <View style={[styles.recentIcon, { backgroundColor: colors.primary[50] }]}>
//                   <Ionicons name="time-outline" size={18} color={colors.primary[500]} />
//                 </View>
//                 <View style={styles.recentContent}>
//                   <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
//                     No Recent Activity
//                   </Text>
//                   <Text style={[styles.recentSubtitle, { color: colors.text.secondary }]}>
//                     Complete tasks to see activity here
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingVertical: 24,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   iconButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   greeting: {
//     fontSize: 16,
//     fontWeight: '400',
//     marginBottom: 4,
//   },
//   userName: {
//     fontSize: 28,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   memberStatus: {
//     fontSize: 14,
//     fontWeight: '400',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderRadius: 16,
//     marginBottom: 24,
//     gap: 12,
//     borderWidth: 1,
//   },
//   searchText: {
//     fontSize: 16,
//     fontWeight: '400',
//     flex: 1,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 32,
//   },
//   statItem: {
//     flex: 1,
//     minWidth: '45%',
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     alignItems: 'flex-start',
//   },
//   statIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   section: {
//     marginBottom: 32,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   seeAllText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   horizontalScroll: {
//     marginHorizontal: -20,
//   },
//   horizontalScrollContent: {
//     paddingHorizontal: 20,
//     paddingVertical: 4,
//   },
//   taskCard: {
//     width: 280,
//     padding: 20,
//     borderRadius: 16,
//     marginRight: 16,
//     borderWidth: 1,
//   },
//   emptyCard: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   taskCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   taskIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   taskTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     lineHeight: 22,
//   },
//   taskMeta: {
//     fontSize: 13,
//     fontWeight: '400',
//     marginBottom: 16,
//   },
//   taskMetaRow: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 16,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   metaText: {
//     fontSize: 13,
//     fontWeight: '400',
//   },
//   ongoingCard: {
//     padding: 20,
//     borderRadius: 16,
//     borderLeftWidth: 4,
//     borderRightWidth: 1,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderRightColor: '#F1F5F9',
//     borderTopColor: '#F1F5F9',
//     borderBottomColor: '#F1F5F9',
//   },
//   ongoingHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   ongoingTitleContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   ongoingTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     flex: 1,
//   },
//   ongoingSubtitle: {
//     fontSize: 14,
//     fontWeight: '400',
//     marginBottom: 16,
//     lineHeight: 20,
//   },
//   progressSection: {
//     marginTop: 8,
//   },
//   progressInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   progressLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   progressPercent: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: '#F1F5F9',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   recentContainer: {
//     borderRadius: 16,
//     borderWidth: 1,
//     overflow: 'hidden',
//   },
//   recentItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F1F5F9',
//   },
//   recentIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   recentContent: {
//     flex: 1,
//   },
//   recentTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   recentSubtitle: {
//     fontSize: 13,
//     fontWeight: '400',
//   },
// });



// DashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks, useChannels } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Modern gradient color schemes
const colorThemes = {
  oceanic: {
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    background: '#0f172a',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
  },
  sunset: {
    gradient: ['#fa709a', '#fee140', '#30cfd0'],
    primary: '#fa709a',
    secondary: '#fee140',
    accent: '#30cfd0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: '#18181b',
    card: '#27272a',
    cardLight: '#3f3f46',
    text: '#fafafa',
    textSecondary: '#e4e4e7',
    textTertiary: '#a1a1aa',
  },
  forest: {
    gradient: ['#11998e', '#38ef7d', '#eef2f3'],
    primary: '#11998e',
    secondary: '#38ef7d',
    accent: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: '#0c1415',
    card: '#1a2425',
    cardLight: '#2d3f41',
    text: '#f0fdfa',
    textSecondary: '#ccfbf1',
    textTertiary: '#5eead4',
  },
  neon: {
    gradient: ['#f72585', '#7209b7', '#3a0ca3'],
    primary: '#f72585',
    secondary: '#7209b7',
    accent: '#3a0ca3',
    success: '#06ffa5',
    warning: '#ffbe0b',
    danger: '#ff006e',
    background: '#03071e',
    card: '#1a0b2e',
    cardLight: '#2d1b4e',
    text: '#ffffff',
    textSecondary: '#e0aaff',
    textTertiary: '#c77dff',
  },
};

type ThemeName = keyof typeof colorThemes;

// Donut Chart Component
const DonutChart = ({ percentage, size = 120, strokeWidth = 12, colors }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.cardLight}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.primary}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${center}, ${center}`}
      />
      {/* Center text */}
      <SvgText
        x={center}
        y={center + 5}
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill={colors.text}
      >
        {percentage}%
      </SvgText>
    </Svg>
  );
};

// Mini Bar Chart Component
const MiniBarChart = ({ data, colors }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.value), 1);
  
  return (
    <View style={styles.miniBarChartContainer}>
      {data.map((item: any, index: number) => {
        const height = (item.value / maxValue) * 40;
        return (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: height || 4,
                  backgroundColor: item.color || colors.primary,
                },
              ]}
            />
            <Text style={[styles.barLabel, { color: colors.textTertiary }]}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function DashboardScreen({ navigation }: any) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('oceanic');
  const colors = colorThemes[currentTheme];

  const user = useAuthStore((state) => state.user);
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: channels, isLoading: channelsLoading } = useChannels();

  const completedTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;
  const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
  const totalTasks = tasks?.length || 0;
  const totalChannels = channels?.length || 0;

  const recentTasks = tasks?.slice(0, 3) || [];
  const ongoingTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').slice(0, 2) || [];

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTaskProgress = (task: any) => {
    return task.progress || (task.status === 'DONE' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0);
  };

  const cycleTheme = () => {
    const themes: ThemeName[] = ['oceanic', 'sunset', 'forest', 'neon'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };

  // Chart data
  const weeklyData = [
    { label: 'Mon', value: completedTasks > 0 ? 3 : 0, color: colors.primary },
    { label: 'Tue', value: completedTasks > 0 ? 5 : 0, color: colors.primary },
    { label: 'Wed', value: completedTasks > 0 ? 2 : 0, color: colors.secondary },
    { label: 'Thu', value: completedTasks > 0 ? 7 : 0, color: colors.primary },
    { label: 'Fri', value: inProgressTasks > 0 ? 4 : 0, color: colors.accent },
    { label: 'Sat', value: 0, color: colors.primary },
    { label: 'Sun', value: 0, color: colors.primary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <View style={styles.headerWrapper}>
          <View style={[styles.gradientHeader, { backgroundColor: colors.card }]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.greeting, { color: colors.textTertiary }]}>
                    Welcome back,
                  </Text>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {user?.name || 'User'}
                  </Text>
                </View>
              </View>

              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={cycleTheme}
                  style={[styles.iconButton, { backgroundColor: colors.cardLight }]}
                >
                  <Ionicons name="color-palette" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                  style={[styles.iconButton, { backgroundColor: colors.cardLight }]}
                >
                  <Ionicons name="notifications" size={20} color={colors.accent} />
                  <View style={[styles.notificationDot, { backgroundColor: colors.danger }]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards with Donut Chart */}
        <View style={styles.statsSection}>
          {/* Main Completion Card */}
          <View style={[styles.completionCard, { backgroundColor: colors.card }]}>
            <View style={styles.completionLeft}>
              <Text style={[styles.completionTitle, { color: colors.text }]}>
                Overall Progress
              </Text>
              <Text style={[styles.completionSubtitle, { color: colors.textSecondary }]}>
                {completedTasks} of {totalTasks} tasks completed
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statPill}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.statPillText, { color: colors.success }]}>
                    {completedTasks} Done
                  </Text>
                </View>
                <View style={styles.statPill}>
                  <Ionicons name="time" size={16} color={colors.warning} />
                  <Text style={[styles.statPillText, { color: colors.warning }]}>
                    {inProgressTasks} Active
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.completionRight}>
              <DonutChart percentage={completionRate} colors={colors} />
            </View>
          </View>

          {/* Mini Stats Grid */}
          <View style={styles.miniStatsGrid}>
            <View style={[styles.miniStatCard, { backgroundColor: colors.card }]}>
              <View style={[styles.miniStatIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="briefcase" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.miniStatValue, { color: colors.text }]}>
                {totalTasks}
              </Text>
              <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>
                Total Tasks
              </Text>
            </View>

            <View style={[styles.miniStatCard, { backgroundColor: colors.card }]}>
              <View style={[styles.miniStatIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="chatbubbles" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.miniStatValue, { color: colors.text }]}>
                {totalChannels}
              </Text>
              <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>
                Channels
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Weekly Activity
            </Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <MiniBarChart data={weeklyData} colors={colors} />
          </View>
        </View>

        {/* Active Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Active Tasks
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textTertiary }]}>
                {inProgressTasks} tasks in progress
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recentTasks.map((task, index) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.modernTaskCard,
                  {
                    backgroundColor: colors.card,
                    borderLeftColor: index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent,
                  },
                ]}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              >
                <View style={styles.taskCardTop}>
                  <View
                    style={[
                      styles.taskIconModern,
                      {
                        backgroundColor: (index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent) + '20',
                      },
                    ]}
                  >
                    <Ionicons
                      name={task.status === 'DONE' ? 'checkmark-circle' : 'rocket'}
                      size={24}
                      color={index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent}
                    />
                  </View>
                  <View
                    style={[
                      styles.progressBadge,
                      { backgroundColor: colors.cardLight },
                    ]}
                  >
                    <Text style={[styles.progressBadgeText, { color: colors.primary }]}>
                      {getTaskProgress(task)}%
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modernTaskTitle, { color: colors.text }]} numberOfLines={2}>
                  {task.title}
                </Text>
                <Text style={[styles.modernTaskMeta, { color: colors.textTertiary }]} numberOfLines={1}>
                  {task.category || 'General'} • {task.status.replace('_', ' ')}
                </Text>

                <View style={[styles.modernProgressBar, { backgroundColor: colors.cardLight }]}>
                  <View
                    style={[
                      styles.modernProgressFill,
                      {
                        width: `${getTaskProgress(task)}%`,
                        backgroundColor: index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent,
                      },
                    ]}
                  />
                </View>

                {task.dueDate && (
                  <View style={styles.dueDateRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                    <Text style={[styles.dueDateText, { color: colors.textTertiary }]}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {recentTasks.length === 0 && !tasksLoading && (
              <View style={[styles.emptyTaskCard, { backgroundColor: colors.card }]}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
                </View>
                <Text style={[styles.emptyText, { color: colors.text }]}>No tasks yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                  Create your first task
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Continue Working */}
        {ongoingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Continue Working
              </Text>
            </View>

            {ongoingTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.continueCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              >
                <View style={styles.continueHeader}>
                  <View style={[styles.continueIconBox, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="play-circle" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.continueTitleBox}>
                    <Text style={[styles.continueTitle, { color: colors.text }]} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Text style={[styles.continueSubtitle, { color: colors.textTertiary }]}>
                      {task.category || 'Task'} • {getTaskProgress(task)}% complete
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>

                <View style={[styles.modernProgressBar, { backgroundColor: colors.cardLight }]}>
                  <View
                    style={[
                      styles.modernProgressFill,
                      {
                        width: `${getTaskProgress(task)}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Channels */}
        {channels && channels.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Channels
              </Text>
            </View>

            {channels.slice(0, 3).map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[styles.channelCard, { backgroundColor: colors.card }]}
              >
                <View style={[styles.channelIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="chatbubbles" size={20} color={colors.accent} />
                </View>
                <View style={styles.channelContent}>
                  <Text style={[styles.channelName, { color: colors.text }]}>
                    {channel.name}
                  </Text>
                  <Text style={[styles.channelMeta, { color: colors.textTertiary }]}>
                    {channel.memberCount || 0} members
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gradientHeader: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  completionCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  completionLeft: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completionRight: {
    marginLeft: 16,
  },
  miniStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  miniStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  miniBarChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  modernTaskCard: {
    width: 220,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskIconModern: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modernTaskTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  modernTaskMeta: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 12,
  },
  modernProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  modernProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyTaskCard: {
    width: 220,
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    fontWeight: '400',
  },
  continueCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  continueTitleBox: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  continueSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelContent: {
    flex: 1,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  channelMeta: {
    fontSize: 12,
    fontWeight: '400',
  },
});