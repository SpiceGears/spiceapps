import { View, Text, StyleSheet } from "react-native";

export default function Profile() {
    return (
        <View style={styles.container}>
            <Text>This is profile Screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    }
})