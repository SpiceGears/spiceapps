import { Tabs } from "expo-router";
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: "purple"}}>
      <Tabs.Screen name="login" options={{headerShown: false, tabBarIcon: () => (
        <FontAwesome6 name="house" iconStyle="solid" color="purple" size={20} />
      )}} />
    </Tabs>
  )
}
