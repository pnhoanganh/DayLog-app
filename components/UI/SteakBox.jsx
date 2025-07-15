import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getHabitStreak } from "@/utils/habitAnalytics";
import { useSQLiteContext } from "expo-sqlite";
import COLORS from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { XStack, YStack } from "tamagui";
import { FontFamily } from "@/constants/fonts";

const SteakBox = ({ habit_id, onPress }) => {
  const [streak, setStreak] = useState(0);
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchStreak = async () => {
      const value = await getHabitStreak(db, habit_id);
      setStreak(value);
    };
    fetchStreak();
  }, [habit_id, db]);
  return (
    <TouchableOpacity
      style={{
        gap: 4,
        flexDirection: "column",
        backgroundColor: COLORS.white,
        width: wp("42%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: wp("5%"),
        borderRadius: "10%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
      onPress={onPress}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack>
          <Text
            style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
          >
            Current
          </Text>
          <Text
            style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
          >
            Streak
          </Text>
        </YStack>
        <View
          style={{
            backgroundColor: "#F9F9F9",
            padding: wp("2%"),
            borderRadius: 50,
          }}
        >
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </XStack>
      <Text
        style={{
          fontSize: 24,
          fontFamily: FontFamily.Poppins.Medium,
          color: COLORS.black,
          marginTop: hp("1%"),
        }}
      >
        {streak}{" "}
        <Text
          style={{
            fontSize: 16,
            fontFamily: FontFamily.Poppins.Regular,
            color: COLORS.darkGray,
          }}
        >
          days
        </Text>
      </Text>
    </TouchableOpacity>
  );
};

export default SteakBox;
