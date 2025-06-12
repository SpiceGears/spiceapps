import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Folder,
  Home,
  TestTube,
  Search,
  User,
} from 'lucide-react-native';

function CustomTabBarBackground() {
  const colorScheme = useColorScheme();
  const tint = colorScheme === 'dark' ? 'dark' : 'light';
  return (
    <BlurView
      tint={tint}
      intensity={50}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {
    tint: activeTint,
    tabIconDefault: inactiveTint,
  } = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarButton: HapticTab,
        tabBarBackground: () => <CustomTabBarBackground />,
        tabBarStyle: [
          styles.tabBar,
          Platform.OS === 'ios' && styles.iosTabBar,
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="spicehub"
        options={{
          title: 'SpiceHub',
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="spicelab"
        options={{
          title: 'SpiceLab',
          tabBarIcon: ({ color }) => (
            <TestTube size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Pliki',
          tabBarIcon: ({ color }) => (
            <Folder size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Szukaj',
          tabBarIcon: ({ color }) => (
            <Search size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  iosTabBar: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  // Add a blur overlay style for under the tab bar (if needed elsewhere)
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});