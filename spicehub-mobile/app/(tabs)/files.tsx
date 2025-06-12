import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FilesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is the Files screen.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
    },
});