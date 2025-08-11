import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import React, { useContext } from "react";

const SafeScreen = ({ children, bgColor }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: bgColor
          ? bgColor
          : theme === "dark"
          ? COLORS.darkMode
          : COLORS.white,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
