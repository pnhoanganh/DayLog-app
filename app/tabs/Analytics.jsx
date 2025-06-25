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
        backgroundColor: COLORS.white,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("6%"),
          paddingTop: hp("1%"),
          paddingBottom: hp("16%"),
        }}
      >
        <View style={{ gap: hp("1%") }}>
          <View
            style={{
              borderWidth: 1,
              padding: wp("3%"),
              borderRadius: 10,
              borderColor: COLORS.gray,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: hp("3%"),
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: FontFamily.Poppins.SemiBold,
              }}
            >
              Weekly Analytics
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
