import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import Streak from "@/assets/images/Streak.svg";
import { getHabitStreak } from "@/utils/habitAnalytics";
import { useSQLiteContext } from "expo-sqlite";
import COLORS from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { XStack, YStack } from "tamagui";
import { FontFamily } from "@/constants/fonts";

const SteakBox = ({ habit_id }) => {
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
    <YStack
      style={{
        gap: 4,
        backgroundColor: COLORS.white,
        minWidth: wp("42%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: wp("5%"),
        borderRadius: "6%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <XStack alignItems="center" gap={"$1"}>
        <Streak width={34} height={34} />
        <Text style={{ fontSize: 24, fontFamily: FontFamily.Poppins.SemiBold }}>
          Streak
        </Text>
      </XStack>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          fontFamily: FontFamily.Poppins.Regular,
          color: COLORS.darkGray,
        }}
      >
        {streak} days
      </Text>
    </YStack>
  );
};

export default SteakBox;
