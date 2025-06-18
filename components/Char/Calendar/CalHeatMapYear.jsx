import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import tinycolor from "tinycolor2"; // Library for generating color shades
import dayjs from "dayjs";
import useToggleModal from "@/hooks/useToggleModal";
import { AlertDate } from "../../Alert/AlertDate";

const SQUARE_SIZE = 16;
const ITEM_MARGIN = 2;
const ITEM_TOTAL_WIDTH = SQUARE_SIZE + ITEM_MARGIN;

// Function to generate dates for a single week, starting from Sunday and ending on Saturday
const generateWeekDates = (endDate) => {
  const endDay = endDate.getDay(); // 0 = Sunday, 6 = Saturday
  const end = new Date(endDate);
  end.setDate(end.getDate() + (6 - endDay)); // Move to the Saturday of the week

  const start = new Date(end);
  start.setDate(end.getDate() - 6); // Move to the Sunday of the week

  const dates = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// Format date to YYYY-MM-DD string for use as a key
const formatDateKey = (date) => dayjs(date).format("YYYY-MM-DD");

const CalHeatMapYear = ({ data = [], color }) => {
  const showAlert = useToggleModal();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);

  // State to store the list of dates in years
  const [dates, setDates] = useState(() => {
    // Initialize with dates from the start of the year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startDay = startOfYear.getDay();
    const start = new Date(startOfYear);
    start.setDate(start.getDate() - startDay); // Move to the first Sunday

    const endDate = new Date();
    const endDay = endDate.getDay();
    const end = new Date(endDate);
    end.setDate(end.getDate() + (6 - endDay)); // Move to the Saturday of the current week

    const initialDates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      initialDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return initialDates;
  });

  const scrollViewRef = useRef(null); // Ref to control the ScrollView
  const numRows = 7; // Number of rows = 7 days/week (Sunday to Saturday)
  const numCols = Math.ceil(dates.length / numRows); // Number of columns = number of weeks

  const arrangedDates = useMemo(() => {
    // Group dates into weeks (7 ngày mỗi tuần)
    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }
    // Rearrange into column-major (Sunday to Saturday in column)
    const arranged = [];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < weeks.length; col++) {
        if (weeks[col][row]) {
          arranged.push(weeks[col][row]);
        }
      }
    }
    return arranged;
  }, [dates]);

  // Check for a new week and append new column if necessary
  useEffect(() => {
    const checkNewWeek = () => {
      const today = new Date();
      const lastDate = dates[dates.length - 1]; // Last date in the current list
      const lastWeekEnd = new Date(lastDate);
      lastWeekEnd.setDate(lastDate.getDate() + (6 - lastDate.getDay())); // Saturday of the last week

      // If today is beyond the last week's Saturday, add a new week
      if (today > lastWeekEnd) {
        const newWeekDates = generateWeekDates(today); // Generate date for new week
        setDates((prevDates) => {
          const existingKeys = new Set(prevDates.map(formatDateKey));
          const filteredNewDates = newWeekDates.filter(
            (date) => !existingKeys.has(formatDateKey(date))
          );
          // if don't have new date => don't update state
          if (filteredNewDates.length === 0) return prevDates;
          return [...prevDates, ...filteredNewDates];
        });
      }
    };

    // Check immediately on mount and daily thereafter
    checkNewWeek();
    const interval = setInterval(checkNewWeek, 24 * 60 * 60 * 1000); // Check every 24 hours
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [dates]);

  // Auto-scroll to the last column when the date list updates
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false }); // Scroll to the last column (latest week)
    }
  }, [dates]); // Trigger when dates change

  // Generate 5 color levels: from background to progressively darker shades
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

  // Handle press on a day square
  const onPressDay = useCallback(
    (date) => {
      const key = formatDateKey(date);
      const count = rawCountMap[key];
      console.log(
        "Pressed date:",
        key,
        "Raw count:",
        rawCountMap[formatDateKey(date)]
      );
      showAlert.open();
      setSelectedDate(date);
      setSelectedCount(count ?? null);
    },
    [rawCountMap, showAlert]
  );

  // Render function for each day square
  const renderItem = useCallback(
    ({ item }) => {
      const key = formatDateKey(item);
      const level = getLevel(dataMap[key]); // Get check-in level, default to 0
      return (
        <TouchableOpacity
          onPress={() => onPressDay(item)} // Call onPressDay when square is pressed
          style={[
            styles.square,
            {
              backgroundColor: colorArray[level], // Apply color based on level
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
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        ref={scrollViewRef}
      >
        <FlatList
          key={numCols.toString()}
          data={arrangedDates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toISOString()}
          numColumns={numCols}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: numCols * ITEM_TOTAL_WIDTH,
            height: numRows * ITEM_TOTAL_WIDTH,
          }}
        />
      </ScrollView>
      <AlertDate
        isOpen={showAlert.isOpen}
        setIsOpen={showAlert.toggle}
        count={selectedCount}
        date={selectedDate}
      />
    </View>
  );
};

// Styles for the day squares
const styles = StyleSheet.create({
  square: {
    margin: ITEM_MARGIN / 2,
    borderRadius: 4,
  },
});

export default React.memo(CalHeatMapYear);
