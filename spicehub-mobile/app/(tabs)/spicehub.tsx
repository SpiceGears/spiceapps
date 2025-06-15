import { Text, View, StyleSheet } from "react-native";

export default function Spicehub() {
    return (
        <View style={styles.container}>
            <Text>This is SpiceHub screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    }
})