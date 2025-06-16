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
import { AlertDate } from "../Common/Alert/AlertDate";
import dayjs from "dayjs";
import { FontFamily } from "@/constants/fonts";
import COLOR from "@/constants/colors";

const SQUARE_SIZE = wp("4.5%");
const ITEM_MARGIN = wp("0.4%");

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

  // Generate column-major calendar (week-based)
  useEffect(() => {
    if (!currentDate) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Bắt đầu từ thứ Hai gần nhất (hoặc Chủ Nhật trước đó nếu là Chủ Nhật)
    const offset =
      firstDayOfMonth.getDay() === 0 ? -6 : 1 - firstDayOfMonth.getDay();
    const calendarStart = new Date(year, month, 1 + offset);

    const totalDays = 6 * 7; // 6 tuần * 7 ngày = 42 ô
    const allDates = [];
    const current = new Date(calendarStart);

    for (let i = 0; i < totalDays; i++) {
      allDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Sắp xếp theo column-major: mỗi cột là 1 tuần (6 cột x 7 hàng)
    const rearranged = [];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 6; col++) {
        rearranged.push(allDates[col * 7 + row]);
      }
    }

    setDates(rearranged);
  }, [currentDate]);

  // 🔁 KEEP THIS: dataMap and color logic
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

  const colorArray = useMemo(() => {
    const arr = ["#F0F2F5"];
    for (let i = 1; i <= 4; i++) {
      const darkenRatio = 4 + ((i - 1) * (70 - 35)) / (4 - 1);
      const c = tinycolor(color).darken(darkenRatio).toHexString();
      arr.push(c);
    }
    return arr;
  }, [color]);

  const getLevel = (count) => {
    if (!count) return 0;
    if (count >= 4) return 4;
    return count;
  };

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

  const numColumns = 6; // each column is a week

  return (
    <View style={styles.container}>
      <View className="mr-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <View
            key={index}
            style={{
              height: SQUARE_SIZE + ITEM_MARGIN,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: wp("2.5%"),
                color: COLOR.gray,
                fontFamily: FontFamily.Poppins.SemiBold,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        key={numColumns}
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item) => item.toISOString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingLeft: SQUARE_SIZE },
        ]}
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
    flexDirection: "row",
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
