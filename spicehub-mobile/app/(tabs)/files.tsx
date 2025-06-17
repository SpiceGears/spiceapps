import { View, Text, StyleSheet } from "react-native";

export default function Files() {
    return (
        <View style={styles.container}>
            <Text>This is files Screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    }
})