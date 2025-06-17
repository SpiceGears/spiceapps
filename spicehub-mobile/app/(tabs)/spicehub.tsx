import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain"


import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SecureStore from "expo-secure-store";

export default function Spicehub() {
const [token, setToken] = useState<string | null>(null);

  // Load token from SecureStore
  async function loadToken() {
    try {
      const stored = await SecureStore.getItemAsync("userToken");
      console.log("🔑 Retrieved token:", stored);
      setToken(stored);
    } catch (e) {
      console.error("Failed to load token:", e);
    }
  }

  useEffect(() => {
    loadToken();
  }, []);
    return (
        <View style={styles.container}>
            <Text>This is SpiceHub screen!</Text>
            <Text>
                {token ?? "No token found"}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    }
})