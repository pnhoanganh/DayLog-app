import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import tinycolor from "tinycolor2";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useToggleModal from "@/hooks/useToggleModal";
import { AlertDate } from "../Layouts/AlertDate";

const SQUARE_SIZE = wp("4.5%");
const ITEM_MARGIN = wp("0.5%");
const ITEM_TOTAL_SIZE = SQUARE_SIZE + ITEM_MARGIN;

const formatDateKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

const CalHeatMapMonth = ({ data = [], color, id, currentDate }) => {
  const [dates, setDates] = useState([]);
  const [numColumns, setNumColumns] = useState(1);
  const { open, toggle, isOpen } = useToggleModal();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const showAlert = useToggleModal();

  // Get container width and calculate number of columns
  const onLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    const calculatedColumns = Math.floor(width / ITEM_TOTAL_SIZE);
    setNumColumns(calculatedColumns > 0 ? calculatedColumns : 1);
  }, []);

  useEffect(() => {
    if (!currentDate) return;
    // 1. Get the first and last day of the current month
    const today = currentDate;
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 2. Create an array of all days in the current month
    const tempDates = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      tempDates.push(new Date(year, month, day));
    }

    setDates(tempDates);
  }, [currentDate]);

  // Process input data
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

  // Generate color array from light to dark
  const levelCount = 4;
  const colorArray = ["#F0F2F5"];
  for (let i = 1; i <= levelCount; i++) {
    const darkenRatio = 4 + ((i - 1) * (70 - 35)) / (levelCount - 1);
    const c = tinycolor(color).darken(darkenRatio).toHexString();
    colorArray.push(c);
  }

  // Determine color level based on count
  const getLevel = (count) => {
    if (!count) return 0;
    if (count >= 4) return 4;
    return count;
  };

  // Handle day press
  const onPressDay = (date) => {
    const key = formatDateKey(date);
    const count = rawCountMap[key];
    // Alert.alert(
    //   "Check-in Date",
    //   count != null
    //     ? `${date.toDateString()}\nCheck-ins: ${count}`
    //     : `${date.toDateString()}\nNo check-ins`
    // );
    setSelectedDate(date);
    setSelectedCount(rawCountMap[key] ?? null);
    showAlert.open();
  };

  // Render each day square
  const renderItem = ({ item }) => {
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
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
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
      <AlertDate
        isOpen={showAlert.isOpen}
        setIsOpen={showAlert.toggle}
        date={selectedDate}
        count={selectedCount}
        habitId={id}
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
