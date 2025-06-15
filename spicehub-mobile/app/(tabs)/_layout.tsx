import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "purple" }}>
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
        )
      }}
      />
    </Tabs>
  );
}
