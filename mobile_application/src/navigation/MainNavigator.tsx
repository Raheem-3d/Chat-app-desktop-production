// // Main app navigator with bottom tabs and stack navigators
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { MainTabParamList } from '../types';
// import { Ionicons } from '@expo/vector-icons';
// import theme from '../theme';

// // Screens
// import DashboardScreen from '../screens/main/DashboardScreen';
// import TasksScreen from '../screens/main/TasksScreen';
// import ChannelsScreen from '../screens/main/ChannelsScreen';
// import PeopleScreen from '../screens/main/PeopleScreen';
// import MoreScreen from '../screens/main/MoreScreen';
// import TaskDetailScreen from '../screens/main/TaskDetailScreen';
// import ChannelChatScreen from '../screens/main/ChannelChatScreen';
// import DirectMessageScreen from '../screens/main/DirectMessageScreen';
// import NotificationsScreen from '../screens/main/NotificationsScreen';
// import SettingsScreen from '../screens/main/SettingsScreen';
// import RemindersScreen from '../screens/main/RemindersScreen';
// import CreateTaskScreen from '../screens/main/CreateTaskScreen';
// import ConnectionTestScreen from '../screens/main/ConnectionTestScreen';

// const Tab = createBottomTabNavigator<MainTabParamList>();
// const Stack = createStackNavigator();

// function DashboardStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="DashboardHome"
//         component={DashboardScreen}
//         options={{ headerShown: false }}
//       />
//      <Stack.Screen
//         name="TaskDetail"
//         component={TaskDetailScreen}
//         options={{ title: 'Task Details' }}
//       />
//        <Stack.Screen
//         name="ChannelChat"
//         component={ChannelChatScreen}
//         options={({ route }: any) => ({
//           title: route.params?.channelName || 'Channel',
//         })}
//       />
//       <Stack.Screen
//         name="DirectMessage"
//         component={DirectMessageScreen}
//         options={({ route }: any) => ({
//           title: route.params?.userName || 'Message',
//         })}
//       />
//       <Stack.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{ title: 'Notifications' }}
//       />
//     </Stack.Navigator>
//   );
// }

// function TasksStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="TasksList"
//         component={TasksScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TaskDetail"
//         component={TaskDetailScreen}
//         options={{ title: 'Task Details' }}
//       />
//       <Stack.Screen
//         name="CreateTask"
//         component={CreateTaskScreen}
//         options={{ title: 'New Task', presentation: 'modal' }}
//       />
//     </Stack.Navigator>
//   );
// }

// function ChannelsStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="ChannelsList"
//         component={ChannelsScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ChannelChat"
//         component={ChannelChatScreen}
//         options={({ route }: any) => ({
//           title: route.params?.channelName || 'Channel',
//         })}
//       />
//     </Stack.Navigator>
//   );
// }

// function PeopleStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="PeopleList"
//         component={PeopleScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="DirectMessage"
//         component={DirectMessageScreen}
//         options={({ route }: any) => ({
//           title: route.params?.userName || 'Message',
//         })}
//       />
//     </Stack.Navigator>
//   );
// }

// function MoreStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="MoreMenu"
//         component={MoreScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ConnectionTest"
//         component={ConnectionTestScreen}
//         options={{ title: 'Connection Test' }}
//       />
      
//       <Stack.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{ title: 'Settings' }}
//       />
//       <Stack.Screen
//         name="Reminders"
//         component={RemindersScreen}
//         options={{ title: 'Reminders' }}
//       />
//     </Stack.Navigator>
//   );
// }

// export default function MainNavigator() {
//   // Use safe area insets for bottom padding
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const { useSafeAreaInsets } = require('react-native-safe-area-context');
//   const insets = useSafeAreaInsets ? useSafeAreaInsets() : { bottom: 0 };

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap = 'home';

//           if (route.name === 'Dashboard') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Tasks') {
//             iconName = focused ? 'checkbox' : 'checkbox-outline';
//           } else if (route.name === 'Channels') {
//             iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
//           } else if (route.name === 'People') {
//             iconName = focused ? 'people' : 'people-outline';
//           } else if (route.name === 'More') {
//             iconName = focused ? 'menu' : 'menu-outline';
//           }

//           // Center icon vertically and add margin for better spacing
//           return (
//             <Ionicons
//               name={iconName}
//               size={size}
//               color={color}
//               style={{ marginBottom: -2, alignSelf: 'center' }}
//             />
//           );
//         },
//         tabBarActiveTintColor: theme.colors.primary[600],
//         tabBarInactiveTintColor: theme.colors.gray[400],
//         headerShown: false,
//         tabBarStyle: {
//           paddingBottom: 16 + (insets?.bottom || 0),
//           paddingTop: 8,
//           height: 72 + (insets?.bottom || 0),
//           borderTopWidth: 1,
//           borderTopColor: theme.colors.border?.light || '#e5e7eb',
//           backgroundColor: theme.colors.background?.paper || '#fff',
//           // Add shadow for iOS/Android
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: -2 },
//           shadowOpacity: 0.08,
//           shadowRadius: 8,
//           elevation: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 2,
//         },
//         tabBarItemStyle: {
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={DashboardStack} />
//       <Tab.Screen name="Tasks" component={TasksStack} />
//       <Tab.Screen name="Channels" component={ChannelsStack} />
//       <Tab.Screen name="People" component={PeopleStack} />
//       <Tab.Screen name="More" component={MoreStack} />
       
//     </Tab.Navigator>
//   );
// }



// Main app navigator with modern floating bottom tabs
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import TasksScreen from '../screens/main/TasksScreen';
import ChannelsScreen from '../screens/main/ChannelsScreen';
import PeopleScreen from '../screens/main/PeopleScreen';
import MoreScreen from '../screens/main/MoreScreen';
import TaskDetailScreen from '../screens/main/TaskDetailScreen';
import ChannelChatScreen from '../screens/main/ChannelChatScreen';
import DirectMessageScreen from '../screens/main/DirectMessageScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import RemindersScreen from '../screens/main/RemindersScreen';
import CreateTaskScreen from '../screens/main/CreateTaskScreen';
import ConnectionTestScreen from '../screens/main/ConnectionTestScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

// Modern color theme for navigation
const navTheme = {
  background: '#0f172a',
  card: '#1e293b',
  cardLight: '#334155',
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  tabBarBg: '#1e293b',
  tabBarActive: '#667eea',
  tabBarInactive: '#64748b',
};

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.cardLight,
        },
        headerTintColor: navTheme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: navTheme.background,
        },
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ 
          title: 'Task Details',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="ChannelChat"
        component={ChannelChatScreen}
        options={({ route }: any) => ({
          title: route.params?.channelName || 'Channel',
          headerBackTitle: '',
        })}
      />
      <Stack.Screen
        name="DirectMessage"
        component={DirectMessageScreen}
        options={({ route }: any) => ({
          title: route.params?.userName || 'Message',
          headerBackTitle: '',
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

function TasksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.cardLight,
        },
        headerTintColor: navTheme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: navTheme.background,
        },
      }}
    >
      <Stack.Screen
        name="TasksList"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ 
          title: 'Task Details',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{ 
          title: 'New Task', 
          presentation: 'modal',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

function ChannelsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.cardLight,
        },
        headerTintColor: navTheme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: navTheme.background,
        },
      }}
    >
      <Stack.Screen
        name="ChannelsList"
        component={ChannelsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChannelChat"
        component={ChannelChatScreen}
        options={({ route }: any) => ({
          title: route.params?.channelName || 'Channel',
          headerBackTitle: '',
        })}
      />
    </Stack.Navigator>
  );
}

function PeopleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.cardLight,
        },
        headerTintColor: navTheme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: navTheme.background,
        },
      }}
    >
      <Stack.Screen
        name="PeopleList"
        component={PeopleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DirectMessage"
        component={DirectMessageScreen}
        options={({ route }: any) => ({
          title: route.params?.userName || 'Message',
          headerBackTitle: '',
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: navTheme.cardLight,
        },
        headerTintColor: navTheme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: navTheme.background,
        },
      }}
    >
      <Stack.Screen
        name="MoreMenu"
        component={MoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConnectionTest"
        component={ConnectionTestScreen}
        options={{ 
          title: 'Connection Test',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ 
          title: 'Reminders',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

// Custom Tab Bar Icon with animation effect
const TabBarIcon = ({ focused, iconName, size, color }: any) => {
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.iconContainerActive,
      focused && { backgroundColor: navTheme.primary + '15' }
    ]}>
      <Ionicons
        name={iconName}
        size={focused ? size + 2 : size}
        color={color}
      />
    </View>
  );
};

export default function MainNavigator() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Compute responsive offsets so the floating tab bar doesn't sit too
  // high or too low on different devices. We clamp values to keep
  // behaviour predictable across small and large phones.
  const safeBottom = insets?.bottom || 0;
  const baseBottom = Platform.OS === 'ios' ? 18 : 12;
  const bottomOffset = Math.max(8, Math.min(30, Math.round(baseBottom + safeBottom)));

  // Height grows slightly when there's a safe-area inset, but is clamped
  // to avoid becoming oversized on tall devices.
  const barHeight = Math.min(86, 64 + Math.round(safeBottom));

  // Provide a comfortable padding for icons/labels without letting it grow
  // too large. Use half the safe inset to balance space.
  const paddingBottom = Math.max(6, Math.min(18, Math.round(6 + safeBottom / 2)));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'Channels') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'People') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'grid' : 'grid-outline';
          }

          return (
            <TabBarIcon
              focused={focused}
              iconName={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: navTheme.tabBarActive,
        tabBarInactiveTintColor: navTheme.tabBarInactive,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          // lift the tab bar by a responsive offset so it doesn't sit on top
          // of system gestures / home indicator on modern devices
          bottom: bottomOffset,
          left: 20,
          right: 20,
          backgroundColor: navTheme.tabBarBg,
          borderRadius: 24,
          // responsive height and padding
          height: barHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarBackground: () => (
          <View style={[
            styles.tabBarBackground,
            {
              backgroundColor: navTheme.tabBarBg,
              // keep background flush inside the rounded container
              marginBottom: 0,
            }
          ]} />
        ),
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksStack}
        options={{
          tabBarLabel: 'Tasks',
        }}
      />
      <Tab.Screen 
        name="Channels" 
        component={ChannelsStack}
        options={{
          tabBarLabel: 'Channels',
        }}
      />
      <Tab.Screen 
        name="People" 
        component={PeopleStack}
        options={{
          tabBarLabel: 'People',
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreStack}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}
// 
const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconContainerActive: {
    transform: [{ scale: 1.05 }],
  },
});

