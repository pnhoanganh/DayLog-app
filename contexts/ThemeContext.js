import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState("light");
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          if (savedTheme === "system") {
            setIsSystemTheme(true);
            setTheme(colorScheme || "light");
          } else {
            setIsSystemTheme(false);
            setTheme(savedTheme);
          }
        }
      } catch (error) {
        console.error("Error loading theme", error);
      }
    };

    getTheme();
  }, []);

  // If using system theme, react to device theme changes
  useEffect(() => {
    if (isSystemTheme) {
      setTheme(colorScheme || "light");
    }
  }, [colorScheme, isSystemTheme]);

  const toggleTheme = (newTheme) => {
    if (newTheme === "system") {
      AsyncStorage.setItem("theme", "system");
      setIsSystemTheme(true);
      setTheme(colorScheme || "light");
    } else {
      AsyncStorage.setItem("theme", newTheme);
      setIsSystemTheme(false);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
