import { Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getCheckinInHour } from "@/utils/habitAnalytics";
import { HabitContext } from "@/contexts/HabitContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import dayjs from "dayjs";
import Horizontal from "@/components/Char/Bar/Horizontal";
import { YStack, XStack, ScrollView, View } from "tamagui";
import { FontFamily } from "@/constants/fonts";
import COLORS from "@/constants/colors";
import { ArrowCircleLeft, ArrowCircleRight } from "iconsax-react-nativejs";
import HabitHistoryList from "@/components/Habit/HabitHistoryList";
import EmptyState from "@/components/UI/EmptyState";
import { useFilter } from "@/contexts/FilterContext";

export default function Daily() {
  const db = useSQLiteContext();
  const { currentHabit, loadHabitHistoryGrouped } = useContext(HabitContext);
  const [dailyStats, setDailyStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  const [habitHistory, setHabitHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!db || !currentHabit?.id) return;
      const result = await loadHabitHistoryGrouped(currentHabit?.id);
      setHabitHistory(result || []);

      const stats = await getCheckinInHour(db, currentHabit.id, selectedDate);

      const colored = stats.map((item, index) => ({
        ...item,
        frontColor: currentHabit.color_code,
      }));
      setDailyStats(colored);
    };

    loadData();
  }, [db, currentHabit, selectedDate]);

  const maxY = Math.max(...dailyStats.map((d) => d.value)) + 2;

  const filterBySelectedDates = (data, selectedDates) => {
    const selectedKeys = Object.keys(selectedDates || {});
    if (selectedKeys.length === 0) return data;

    return data
      .map((monthData) => {
        const filteredDays = monthData.days.filter((d) =>
          selectedKeys.includes(d.rawDate)
        );

        if (filteredDays.length === 0) return null;

        return {
          ...monthData,
          days: filteredDays,
          total: filteredDays.reduce((sum, d) => sum + d.count, 0),
        };
      })
      .filter(Boolean);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: hp("2%"),
      }}
    >
      <YStack
        style={{
          padding: wp("5%"),
          backgroundColor: "white",
          borderRadius: 10,
          marginHorizontal: wp("4%"),
        }}
        gap={hp("2%")}
      >
        <YStack>
          <Text
            style={{
              fontFamily: FontFamily.Poppins.SemiBold,
              fontSize: wp("5%"),
            }}
          >
            Daily
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Poppins.Regular,
              color: COLORS.gray,
            }}
          >
            Small steps every day lead to big changes.
          </Text>
        </YStack>

        {dailyStats.length > 0 && (
          <Horizontal barData={dailyStats} maxY={maxY} />
        )}

        <XStack alignItems="center" justifyContent="center" gap="$2">
          <TouchableOpacity
            onPress={() => setSelectedDate((prev) => prev.subtract(1, "day"))}
          >
            <ArrowCircleLeft size="24" />
          </TouchableOpacity>
          <Text>{selectedDate.format("DD/MM/YYYY")}</Text>
          <TouchableOpacity
            onPress={() => setSelectedDate((prev) => prev.add(1, "day"))}
          >
            <ArrowCircleRight size="24" />
          </TouchableOpacity>
        </XStack>
      </YStack>
      <FlatList
        scrollEnabled={false}
        data={filterBySelectedDates(habitHistory, {
          [selectedDate.format("YYYY-MM-DD")]: true,
        })}
        keyExtractor={(item) => item.month}
        renderItem={({ item }) => (
          <HabitHistoryList
            month={item.month}
            total={item.total}
            days={item.days}
            currentHabit={currentHabit}
          />
        )}
        contentContainerStyle={{
          paddingBottom: hp("20%"),
          paddingHorizontal: wp("6%"),
          paddingTop: hp("2%"),
        }}
        ListEmptyComponent={() => <EmptyState title="Oops! No checkins yet" />}
      />
    </ScrollView>
  );
}
