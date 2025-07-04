import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, StatusBar } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackendUrl } from "@/Constants/backend"

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const insets = useSafeAreaInsets()

  const handleRegister = async () => {

  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom, 
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Witaj Ponownie</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              theme={{
                colors: {
                  text: "#121416",
                  placeholder: "#6a7681",
                  background: "#f1f2f4",
                  outline: "#f1f2f4",
                },
                roundness: 12,
              }}
            />
            {!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <Text style={{ color: "red", marginTop: 4 }}>Niepoprawny adres Email</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Hasło"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              error={
                !!password &&
                (
                  password.length < 7 ||
                  !/[a-z]/.test(password) ||
                  !/\d/.test(password)
                )
              }
              theme={{
                colors: {
                  text: "#121416",
                  placeholder: "#6a7681",
                  background: "#f1f2f4",
                  outline: "#f1f2f4",
                },
                roundness: 12,
              }}
            />
            {!!password && password.length < 7 && (
              <Text style={{ color: "red", marginTop: 4 }}>
                Hasło musi mieć co najmniej 8 znaków
              </Text>
            )}
            {!!password && !/[a-z]/.test(password) && (
              <Text style={{ color: "red", marginTop: 4 }}>
                Hasło musi zawierać co najmniej jedną małą literę
              </Text>
            )}
            {!!password && !/\d/.test(password) && (
              <Text style={{ color: "red", marginTop: 4 }}>
                Hasło musi zawierać co najmniej jedną cyfrę
              </Text>
            )}
          </View>
        </View>
        <View>
          <View style={styles.buttonWrapper}>
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={
                !email ||
                !password ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                password.length < 7
              }
            >
              Login
            </Button>
          </View>
          <View style={styles.spacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerText: {
    color: "#121416",
    fontSize: 23,
    fontWeight: "bold",
  },
  inputContainer: {
    maxWidth: 480,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "center",
  },
  input: {
    height: 56,
    backgroundColor: "#f1f2f4",
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#dce8f3",
    borderRadius: 12,
    elevation: 0,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    color: "#121416",
    fontSize: 16,
    fontWeight: "bold",
  },
  spacer: {
    height: 20,
  },
});