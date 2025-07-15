import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState, useMemo } from "react";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import {
  getWeeklyDayStats,
  getMaxCheckinCount,
  getMissedDaysInWeek,
  getTotalCheckinsInWeek,
} from "@/utils/habitAnalytics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react-nativejs";
import { HabitContext } from "@/contexts/HabitContext";
import Horizontal from "@/components/Char/Bar/Horizontal";
import tinycolor from "tinycolor2";
import { useSQLiteContext } from "expo-sqlite";
import dayjs from "dayjs";
import { XStack, YStack } from "tamagui";

export default function Weekly() {
  const { currentHabit } = useContext(HabitContext);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const db = useSQLiteContext();
  const [weekStartDate, setWeekStartDate] = useState(dayjs().startOf("week"));
  const [startStr, endStr] = useMemo(() => {
    const start = dayjs(weekStartDate).format("DD/MM/YY");
    const end = dayjs(weekStartDate).endOf("week").format("DD/MM/YY");
    return [start, end];
  }, [weekStartDate]);
  const [maxCheckinCount, setMaxCheckinCount] = useState(1);
  const [totalInWeek, setTotalInWeek] = useState();
  const [missedDate, setMissedDate] = useState([]);

  const loadWeek = async (targetWeek) => {
    if (!db || !currentHabit?.id) return;

    const weeklyStats = await getWeeklyDayStats(
      db,
      currentHabit.id,
      targetWeek
    );

    const maxValue = Math.max(...weeklyStats.map((item) => item.value));
    const coloredStats = weeklyStats.map((item) => ({
      ...item,
      frontColor:
        item.value === maxValue
          ? tinycolor(currentHabit.color_code).darken(15).toString()
          : currentHabit.color_code,
    }));
    setWeeklyChartData(weeklyStats);

    const max = await getMaxCheckinCount(db, currentHabit.id);
    setMaxCheckinCount(max + 1);
    setWeeklyChartData(coloredStats);
    const totalInWeek = await getTotalCheckinsInWeek(
      db,
      currentHabit.id,
      weekStartDate
    );
    setTotalInWeek(totalInWeek);

    const missedDate = await getMissedDaysInWeek(
      db,
      currentHabit.id,
      weekStartDate
    );
    setMissedDate(missedDate);
  };

  useEffect(() => {
    loadWeek(weekStartDate);
  }, [weekStartDate]);

  const preWeek = () => {
    setWeekStartDate((prev) => dayjs(prev).subtract(1, "week"));
  };
  const nextWeek = () => {
    setWeekStartDate((prev) => dayjs(prev).add(1, "week"));
  };

  return (
    <View style={{ gap: hp("2%"), paddingHorizontal: wp("4%") }}>
      <View
        style={{
          gap: hp("2%"),
          backgroundColor: COLORS.white,
          borderRadius: "2%",
          padding: wp("3%"),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: FontFamily.Poppins.SemiBold,
              fontSize: wp("5%"),
            }}
          >
            Weekdays
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Poppins.Regular,
              color: COLORS.gray,
            }}
          >
            Total check-ins by day of week
          </Text>
        </View>
        {weeklyChartData?.length > 0 && (
          <Horizontal barData={weeklyChartData} maxY={maxCheckinCount} />
        )}

        <XStack alignItems="center" justifyContent="center" gap="$2">
          <TouchableOpacity onPress={() => preWeek()}>
            <ArrowCircleLeft size="24" />
          </TouchableOpacity>
          <Text>
            {startStr} - {endStr}
          </Text>
          <TouchableOpacity onPress={() => nextWeek()}>
            <ArrowCircleRight size="24" />
          </TouchableOpacity>
        </XStack>
      </View>

      <XStack gap={"$2"}>
        <YStack
          style={{
            gap: 4,
            backgroundColor: COLORS.white,
            width: wp("45%"),
            paddingHorizontal: wp("4%"),
            paddingVertical: wp("5%"),
            borderRadius: "10%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <XStack
            alignItems="center"
            justifyContent="space-between"
            marginBottom={hp("1%")}
          >
            <YStack>
              <Text
                style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
              >
                Total
              </Text>
              <Text
                style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
              >
                Check-ins
              </Text>
            </YStack>
            <View
              style={{
                backgroundColor: "#F9F9F9",
                padding: wp("2%"),
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 20 }}>✨</Text>
            </View>
          </XStack>
          <Text
            style={{
              fontSize: 24,
              fontFamily: FontFamily.Poppins.Medium,
              color: COLORS.black,
            }}
          >
            {totalInWeek}{" "}
            <Text
              style={{
                fontSize: 16,
                fontFamily: FontFamily.Poppins.Regular,
                color: COLORS.darkGray,
              }}
            >
              times
            </Text>
          </Text>
        </YStack>
        <YStack
          style={{
            gap: 4,
            backgroundColor: COLORS.white,
            width: wp("45%"),
            paddingHorizontal: wp("4%"),
            paddingVertical: wp("5%"),
            borderRadius: "10%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <XStack
            alignItems="center"
            justifyContent="space-between"
            marginBottom={hp("2%")}
          >
            <YStack>
              <Text
                style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
              >
                Missed
              </Text>
              <Text
                style={{ fontSize: 18, fontFamily: FontFamily.Poppins.Regular }}
              >
                Days
              </Text>
            </YStack>
            <View
              style={{
                backgroundColor: "#F9F9F9",
                padding: wp("2%"),
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 20 }}>🗓️</Text>
            </View>
          </XStack>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.Poppins.Medium,
              color: COLORS.black,
            }}
          >
            {missedDate.length > 0 ? missedDate.join(", ") : "None"}{" "}
          </Text>
        </YStack>
      </XStack>
    </View>
  );
}
