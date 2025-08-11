import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { ThemeContext, ThemeProvider } from "@/contexts/ThemeContext";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { createTamagui, TamaguiProvider } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { PortalProvider } from "@tamagui/portal";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import ToastCus from "@/components/UI/ToastCus";
import { HabitProvider } from "@/contexts/HabitContext";
import { customFonts } from "@/constants/fonts";
import SQLiteContext from "@/contexts/SQLiteContext";

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
      <SQLiteContext>
        <GestureHandlerRootView>
          <PortalProvider>
            <ToastProvider>
              <ToastViewport
                flexDirection="column-reverse"
                bottom={50}
                left={0}
                right={0}
                position="absolute"
                width="100%"
                zIndex={99999}
              />
              <HabitProvider>
                <ThemeProvider>
                  <SafeAreaProvider>
                    <GlobalStatusBar />
                    <Stack screenOptions={{ headerShown: false }} />
                    <ToastCus />
                  </SafeAreaProvider>
                </ThemeProvider>
              </HabitProvider>
            </ToastProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </SQLiteContext>
    </TamaguiProvider>
  );
}

function GlobalStatusBar() {
  const { theme } = useContext(ThemeContext);
  return <StatusBar style={theme === "dark" ? "light" : "dark"} />;
}
