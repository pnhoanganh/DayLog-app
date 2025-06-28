import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import { YStack } from "tamagui";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getTotalCheckins } from "@/utils/habitAnalytics";
import { useSQLiteContext } from "expo-sqlite";

const TotalBox = ({ habit_id }) => {
  const [total, setTotal] = useState(0);
  const db = useSQLiteContext();
  useEffect(() => {
    const loadTotal = async () => {
      const value = await getTotalCheckins(db, habit_id);
      setTotal(value);
    };
    loadTotal();
  }, [habit_id, db]);
  return (
    <YStack
      style={{
        gap: 4,
        backgroundColor: COLORS.white,
        minWidth: wp("42%"),
        padding: wp("6%"),
        borderRadius: "6%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 24, fontFamily: FontFamily.Poppins.SemiBold }}>
        ✅ Total
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          fontFamily: FontFamily.Poppins.Regular,
          color: COLORS.darkGray,
        }}
      >
        {total} times
      </Text>
    </YStack>
  );
};

export default TotalBox;
