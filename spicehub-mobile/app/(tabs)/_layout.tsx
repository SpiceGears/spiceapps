import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Folder, Home, TestTube, Search, User } from "lucide-react-native";

function CustomTabBarBackground() {
  const colorScheme = useColorScheme();
  // expo-blur supports "light" | "dark"
  const tint = colorScheme === "dark" ? "dark" : "light";
  return (
    <BlurView
      tint={tint}
      intensity={50}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const {
    tint: activeTint,
    tabIconDefault: inactiveTint,
  } = Colors[colorScheme];

  const isDark = colorScheme === "dark";
  // dynamic RGBA backgrounds
  const tabBarBackground = isDark
    ? "rgba(0, 0, 0, 0.7)"
    : "rgba(255, 255, 255, 0.7)";
  // for the shadow
  const shadowColor = isDark ? "#FFF" : "#000";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarButton: HapticTab,
        tabBarBackground: () => <CustomTabBarBackground />,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: tabBarBackground, shadowColor },
          Platform.OS === "ios" && styles.iosTabBar,
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="spicehub"
        options={{
          title: "SpiceHub",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="spicelab"
        options={{
          title: "SpiceLab",
          tabBarIcon: ({ color }) => <TestTube size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Pliki",
          tabBarIcon: ({ color }) => <Folder size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Szukaj",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iosTabBar: {
    // we want the blurView to show through on iOS
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
});