import { View, Text, StyleSheet } from "react-native";

export default function SpiceLab() {
    return (
        <View style={styles.container}>
            <Text>This is SpiceLab Screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    }
})