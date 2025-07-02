// Constants/backend.js
import { Platform } from "react-native";

const host = Platform.select({
  android: "10.0.2.2:8080",  // Android Emulator → przekierowuje do localhost PC
  ios: "localhost:8080",     // iOS emulator
  default: "localhost:8080"  // web
});

export const BackendUrl = `http://${host}`;
// export const BackendUrl = `https://api.team5883.pl`