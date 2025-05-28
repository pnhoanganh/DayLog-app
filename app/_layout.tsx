import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { customFonts } from "../constants/fonts";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { CheckinProvider } from "@/hooks/checkinHabit";

SplashScreen.preventAutoHideAsync();
const config = createTamagui(defaultConfig);
export default function RootLayout() {
  const [fontsLoaded] = useFonts(customFonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <TamaguiProvider config={config}>
      <CheckinProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </CheckinProvider>
    </TamaguiProvider>
  );
}
