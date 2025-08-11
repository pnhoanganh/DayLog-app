import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { YStack, XStack } from "tamagui";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getTotalCheckins } from "@/utils/habitAnalytics";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";

const TotalBox = ({ habit_id }) => {
  const [total, setTotal] = useState(0);
  const db = useSQLiteContext();
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const loadTotal = async () => {
      const value = await getTotalCheckins(db, habit_id);
      setTotal(value);
    };
    loadTotal();
  }, [habit_id, db]);
  return (
    <TouchableOpacity
      style={{
        flexDirection: "column",
        gap: 4,
        backgroundColor: theme === "dark" ? COLORS.darkBlue : COLORS.white,
        width: wp("45%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: wp("5%"),
        borderRadius: "10%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: theme === "dark" ? 1 : 0,
        borderColor: COLORS.gray,
      }}
      onPress={() => router.push("/tabs/Report")}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.Poppins.Regular,
              color: theme === "dark" ? COLORS.white : COLORS.black,
            }}
          >
            Total
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.Poppins.Regular,
              color: theme === "dark" ? COLORS.white : COLORS.black,
            }}
          >
            Check-ins
          </Text>
        </YStack>
        <View
          style={{
            backgroundColor: theme === "dark" ? COLORS.darkGray : "#F9F9F9",
            padding: wp("2%"),
            borderRadius: 50,
          }}
        >
          <Text style={{ fontSize: 24 }}>✨</Text>
        </View>
      </XStack>
      <Text
        style={{
          fontSize: 24,
          fontFamily: FontFamily.Poppins.Medium,
          color: theme === "dark" ? COLORS.white : COLORS.black,
          marginTop: hp("1%"),
        }}
      >
        {total}{" "}
        <Text
          style={{
            fontSize: 16,
            fontFamily: FontFamily.Poppins.Regular,
            color: theme === "dark" ? COLORS.gray : COLORS.darkGray,
          }}
        >
          times
        </Text>
      </Text>
    </TouchableOpacity>
  );
};

export default TotalBox;
