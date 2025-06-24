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

SplashScreen.preventAutoHideAsync();
const config = createTamagui(defaultConfig);

const loadDatabase = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("../assets/databases/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  // console.log(dbFilePath);
  try {
    const dbInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!dbInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );

      await FileSystem.downloadAsync(dbUri, dbFilePath);
      console.log("Database loaded from assets.");
    } else {
      console.log("Database already exists.");
      // delete old database
      // await FileSystem.deleteAsync(dbFilePath);
    }
  } catch (e) {
    console.error("Error loading database:", e);
  }
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(customFonts);
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.log(e));
  }, []);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <TamaguiProvider config={config}>
      <SQLiteProvider databaseName="mySQLiteDB.db">
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
      </SQLiteProvider>
    </TamaguiProvider>
  );
}
