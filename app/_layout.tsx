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
import { PortalProvider } from "@tamagui/portal";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import ToastCus from "../components/Common/ToastCus";
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
        <PortalProvider shouldAddRootHost>
          <ToastProvider>
            <ToastViewport
              flexDirection="column-reverse"
              top={50}
              left={0}
              right={0}
              position="absolute"
              width="100%"
              zIndex={999}
            />
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <ToastCus />
            </SafeAreaProvider>
          </ToastProvider>
        </PortalProvider>
      </CheckinProvider>
    </TamaguiProvider>
  );
}
