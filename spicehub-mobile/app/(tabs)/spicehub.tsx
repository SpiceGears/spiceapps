import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain"


import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Spicehub() {

    return (
        <View style={styles.container}>
            <Text>This is SpiceHub screen!</Text>
            <Text>
                
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