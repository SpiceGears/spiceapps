import {
    KeyboardAvoidingView, Platform, View
} from "react-native";

import { Text, TextInput } from "react-native-paper"

export default function Auth() {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View>
                <Text>Stwórz Konto</Text>

                <TextInput
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Email"
                    mode="outlined"
                />
                <TextInput
                    label="Hasło"
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder="Hasło"
                    mode="outlined"
                />
            </View>
        </KeyboardAvoidingView>
    )
}