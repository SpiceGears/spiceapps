import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native'
import {
  Button,
  Provider as PaperProvider,
} from 'react-native-paper'
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')
const IMAGE_RATIO = 390 / 320

export default function MainAuthScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom, 
        },
      ]}
    >
      <View style={styles.top}>
        <View>
          <Text style={styles.title}>Witaj w SpiceHubie</Text>
          <Text style={styles.subtitle}>
            Miej dostęp do wszystkich drużynowych projektów oraz takich rzeczy
            jak status warsztatu i ciężko pracuj dla dobra drużyny! Niech żyje
            Spice Gears i Kanclerz!
          </Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            uppercase={false}
            contentStyle={styles.buttonContent}
            labelStyle={styles.loginLabel}
            style={styles.button}
            onPress={() => {router.replace("/(auth)/login")}}
          >
            Zaloguj się
          </Button>
          <Button
            mode="contained"
            uppercase={false}
            contentStyle={styles.buttonContent}
            labelStyle={styles.registerLabel}
            style={styles.button}
            onPress={() => {router.replace("/(auth)/register")}}
          >
            Nie masz konta? Zarejestruj się
          </Button>
        </View>
      </View>

      {/* If you re-add an image later, it will also respect safe-area */}
      <View style={styles.bottom}>
        {/* <Image source={imageSource} style={styles.image} /> */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  top: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#121416',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '#121416',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 480,
  },
  button: {
    borderRadius: 24,
    height: 48,
    marginVertical: 6,
  },
  buttonContent: {
    height: '100%',
  },
  loginLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  registerLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  forgotLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: width / IMAGE_RATIO,
  },
})