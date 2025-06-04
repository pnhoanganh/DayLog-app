import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import tinycolor from "tinycolor2";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useToggleModal from "@/hooks/useToggleModal";
import { AlertDate } from "../Layouts/AlertDate";
import dayjs from "dayjs";

const SQUARE_SIZE = wp("4.5%");
const ITEM_MARGIN = wp("0.5%");
const ITEM_TOTAL_SIZE = SQUARE_SIZE + ITEM_MARGIN;

const formatDateKey = (date) => dayjs(date).format("YYYY-MM-DD");

const CalHeatMapMonth = ({
  data = [],
  color,
  currentDate,
  removeCheckinForHabit,
  habitId,
}) => {
  const [dates, setDates] = useState([]);
  const [numColumns, setNumColumns] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const showAlert = useToggleModal();
  const [containerWidth, setContainerWidth] = useState(null);

  // Get container width and calculate number of columns
  const onLayout = useCallback(
    (event) => {
      const width = event.nativeEvent.layout.width;
      if (width && width !== containerWidth) {
        setContainerWidth(width);
        const calculatedColumns = Math.floor(width / ITEM_TOTAL_SIZE);
        setNumColumns(calculatedColumns > 0 ? calculatedColumns : 1);
      }
    },
    [containerWidth]
  );

  useEffect(() => {
    if (!currentDate) return;
    // 1. Get the first and last day of the current month
    const today = currentDate;
    const year = today.getFullYear();
    const month = today.getMonth();

    //const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 2. Create an array of all days in the current month
    const tempDates = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      tempDates.push(new Date(year, month, day));
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
    <View style={styles.container} onLayout={onLayout}>
      {containerWidth && (
        <FlatList
          data={dates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toISOString()}
          numColumns={numColumns}
          key={numColumns.toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
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
    width: "100%",
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
