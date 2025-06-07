import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import tinycolor from "tinycolor2";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useToggleModal from "@/hooks/useToggleModal";
import { AlertDate } from "../Layouts/AlertDate";
import dayjs from "dayjs";

const SQUARE_SIZE = wp("5%");
const ITEM_MARGIN = wp("0.8%");
const NUM_COLUMNS = 7;
const NUM_ROWS = 6;
const TOTAL_CELLS = NUM_COLUMNS * NUM_ROWS;

const formatDateKey = (date) => dayjs(date).format("YYYY-MM-DD");

const CalHeatMapMonth = ({
  data = [],
  color,
  currentDate,
  removeCheckinForHabit,
  habitId,
}) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const showAlert = useToggleModal();
  useEffect(() => {
    if (!currentDate) return;
    // 1. Get the first and last day of the current month
    const today = currentDate;
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // startDay: 0 (Sunday) → 6 (Saturday), map so week starts on Monday
    let startDay = firstDayOfMonth.getDay(); // Use getDay() (take day in week)
    startDay = startDay === 0 ? 6 : startDay - 1;

    // 2. Create an array of all days in the heatmap month
    const tempDates = [];
    // Fill previous month
    for (let i = startDay; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      tempDates.push(prevDate);
    }

    // Fill current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      tempDates.push(new Date(year, month, d));
    }

    // Fill next month
    while (tempDates.length < TOTAL_CELLS) {
      const lastDate = tempDates[tempDates.length - 1];
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      tempDates.push(nextDate);
    }

    setDates(tempDates);
  }, [currentDate]);

  // Process input data
  const { dataMap, rawCountMap } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    const dataMap = {};
    const rawCountMap = {};
    safeData.forEach((item) => {
      if (item.date && item.count != null) {
        const key = formatDateKey(new Date(item.date));
        rawCountMap[key] = item.count;
        dataMap[key] = item.count;
      }
    });
    return { dataMap, rawCountMap };
  }, [data]);

  // Generate color array from light to dark
  const colorArray = useMemo(() => {
    const arr = ["#F0F2F5"];
    for (let i = 1; i <= 4; i++) {
      const darkenRatio = 4 + ((i - 1) * (70 - 35)) / (4 - 1);
      const c = tinycolor(color).darken(darkenRatio).toHexString();
      arr.push(c);
    }
    return arr;
  }, [color]);
  // Determine color level based on count
  const getLevel = (count) => {
    if (!count) return 0;
    if (count >= 4) return 4;
    return count;
  };

  // Handle day press
  const onPressDay = useCallback(
    (date) => {
      const key = formatDateKey(date);
      const count = rawCountMap[key];
      setSelectedDate(date);
      setSelectedCount(count ?? null);
      if (count > 0) removeCheckinForHabit(key);
      console.log(key, count);
      // showAlert.open();
    },
    [rawCountMap, removeCheckinForHabit]
  );

  // Render each day square
  const renderItem = useCallback(
    ({ item }) => {
      const key = formatDateKey(item);
      const level = getLevel(dataMap[key]);
      return (
        <TouchableOpacity
          onPress={() => onPressDay(item)}
          style={[
            styles.square,
            {
              backgroundColor: colorArray[level],
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
            },
          ]}
        />
      );
    },
    [dataMap, colorArray, onPressDay]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: ITEM_MARGIN,
        }}
      >
        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day, index) => (
          <View
            key={index}
            style={{
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: wp("2.5%"),
                color: "#333",
                textAlign: "center",
                lineHeight: SQUARE_SIZE,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item) => item.toISOString()}
        numColumns={NUM_COLUMNS}
        key={NUM_COLUMNS.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
      <AlertDate
        isOpen={showAlert.isOpen}
        setIsOpen={showAlert.toggle}
        date={selectedDate}
        count={selectedCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    padding: ITEM_MARGIN / 2,
  },
  square: {
    margin: ITEM_MARGIN / 2,
    borderRadius: 4,
  },
});

export default CalHeatMapMonth;
