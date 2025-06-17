import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#1976d2" }}>
      <Tabs.Screen
      name="spicehub"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="house" color={color} size={20} />
        ),
        tabBarLabel: "SpiceHub",
      }}
      />
      <Tabs.Screen
      name="spicelab"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="flask" color={color} size={20} />
        ),
        tabBarLabel: "SpiceLab",
      }}
      />
      <Tabs.Screen
      name="files"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="folder" color={color} size={20} />
        ),
        tabBarLabel: "Files",
      }}
      />
      <Tabs.Screen
      name="inbox"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="envelope" color={color} size={20} />
        ),
        tabBarLabel: "Inbox",
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
        <FontAwesome6 name="user" color={color} size={20} />
        ),
        tabBarLabel: "Profile",
      }}
      />
    </Tabs>
  );
}
