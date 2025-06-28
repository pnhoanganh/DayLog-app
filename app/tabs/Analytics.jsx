import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState, useMemo } from "react";
import { useNavigation } from "expo-router";
import { HabitContext } from "@/contexts/HabitContext";
import Horizontal from "@/components/Char/Bar/Horizontal";
import { useSQLiteContext } from "expo-sqlite";
import { getWeeklyDayStats, getMaxCheckinCount } from "@/utils/habitAnalytics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { ScrollView, XStack } from "tamagui";
import dayjs from "dayjs";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react-nativejs";

const Analytis = () => {
  const navigation = useNavigation();
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

  useEffect(() => {
    if (currentHabit?.title) {
      navigation.setOptions({ title: currentHabit.title });
    }
  }, [currentHabit?.title, navigation]);

  const loadWeek = async (targetWeek) => {
    if (!db || !currentHabit?.id) return;

    const weeklyStats = await getWeeklyDayStats(
      db,
      currentHabit.id,
      targetWeek
    );
    setWeeklyChartData(weeklyStats);

    const max = await getMaxCheckinCount(db, currentHabit.id);
    setMaxCheckinCount(max + 1);
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#F2F1F5",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingTop: hp("2%"),
          paddingBottom: hp("16%"),
        }}
      >
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
            <Horizontal
              barData={weeklyChartData}
              themeColor={currentHabit.color_code}
              maxY={maxCheckinCount}
            />
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
      </ScrollView>
    </View>
  );
};

export default Analytis;
