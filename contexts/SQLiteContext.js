import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite";
import { Text } from "tamagui";

const dbName = "mySQLiteDB.db";

const loadDatabase = async () => {
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
      console.log("Database copied from assets.");
    } else {
      console.log("Database already exists.");
      // delete old database
      // await FileSystem.deleteAsync(dbFilePath);
    }
  } catch (e) {
    console.error("Error loading database:", e);
    throw e;
  }
};

export default function SQLiteContext({ children }) {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbReady(true))
      .catch((err) => console.log(err));
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <SQLiteProvider databaseName={dbName}>{children}</SQLiteProvider>;
}
