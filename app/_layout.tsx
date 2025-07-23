import "../global.css";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { SQLiteProvider } from "expo-sqlite";
import { createTamagui, TamaguiProvider, Text, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { PortalProvider } from "@tamagui/portal";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import ToastCus from "../components/UI/ToastCus";
import { HabitProvider } from "@/contexts/HabitContext";
import { customFonts } from "@/constants/fonts";
import SQLiteContext from "../contexts/SQLiteContext";

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
                <SafeAreaProvider>
                  <Stack screenOptions={{ headerShown: false }}></Stack>
                  <ToastCus />
                </SafeAreaProvider>
              </HabitProvider>
            </ToastProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </SQLiteContext>
    </TamaguiProvider>
  );
}
