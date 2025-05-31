import React, { useRef, useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import tinycolor from "tinycolor2"; // Library for generating color shades
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SQUARE_SIZE = wp("4%"); // Size of each square
const ITEM_MARGIN = wp("0.4%"); // Margin between squares
const ITEM_TOTAL_WIDTH = SQUARE_SIZE + ITEM_MARGIN; // Total width of each square (size + margin)

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
const formatDateKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Đặt về 00:00:00 để tránh sai ngày do timezone
  return d.toISOString().split("T")[0];
};

const CalHeatMapCustom = ({ data = [], color }) => {
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

  // Group dates into weeks (7 ngày mỗi tuần)
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  // Rearrange into column-major (Chủ nhật đến Thứ 7 theo cột)
  const arrangedDates = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < weeks.length; col++) {
      if (weeks[col][row]) {
        arrangedDates.push(weeks[col][row]);
      }
    }
  }

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
          // if don't have new date =>don't update state
          if (filteredNewDates.length === 0) return prevDates;
          return [...prevDates, ...filteredNewDates];
        });
      }
    };

    // Check immediately on mount and daily thereafter
    checkNewWeek();
    const interval = setInterval(checkNewWeek, 24 * 60 * 60 * 1000); // Check every 24 hours
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Auto-scroll to the last column when the date list updates
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false }); // Scroll to the last column (latest week)
    }
  }, [dates]); // Trigger when dates change

  // Ensure input data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Generate 5 color levels: from background to progressively darker shades
  const levelCount = 4;
  const colorArray = ["#F0F2F5"]; // Background color for level 0 (no check-ins)
  for (let i = 1; i <= levelCount; i++) {
    const darkenRatio = 4 + ((i - 1) * (70 - 35)) / (levelCount - 1); // Calculate darkening ratio
    const c = tinycolor(color).darken(darkenRatio).toHexString(); // Generate darker shade
    colorArray.push(c);
  }

  // Function to determine check-in level (0-4) based on count
  const getLevel = (count) => {
    if (count === 0 || count == null) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count >= 4) return 4;
    return 0;
  };

  // Create maps for check-in data
  const dataMap = {}; // Stores check-in levels (0-4)
  const rawCountMap = {}; // Stores raw check-in counts
  safeData.forEach((item) => {
    if (item.date && item.count != null) {
      const key = formatDateKey(new Date(item.date));
      rawCountMap[key] = item.count; // Store raw count
      dataMap[key] = getLevel(item.count); // Store level
    }
  });

  // Handle press on a day square
  const onPressDay = (date) => {
    const key = formatDateKey(date);
    const count = rawCountMap[key];
    Alert.alert(
      "Check-in Date",
      count != null
        ? `${date.toDateString()}\nCheck-ins: ${count}`
        : `${date.toDateString()}\nNo check-ins`
    );
    console.log(
      "Pressed date:",
      date,
      "Raw count:",
      rawCountMap[formatDateKey(date)]
    );
  };

  // Render function for each day square
  const renderItem = ({ item }) => {
    const key = formatDateKey(item);
    const level = dataMap[key] || 0; // Get check-in level, default to 0
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
  };

  return (
    // Horizontal ScrollView to scroll through columns
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      ref={scrollViewRef} // Attach ref for scroll control
    >
      <View>
        <FlatList
          key={numCols.toString()} // Key to force re-render when column count changes
          data={arrangedDates} // Data is the column-major arranged dates
          renderItem={renderItem} // Render function for each square
          keyExtractor={(item) => item.toISOString()} // Unique key for each date
          numColumns={numCols} // Number of columns = number of weeks
          scrollEnabled={false} // Disable scrolling in FlatList (handled by ScrollView)
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: numCols * ITEM_TOTAL_WIDTH, // Total width of FlatList
            height: numRows * ITEM_TOTAL_WIDTH, // Total height of FlatList
          }}
        />
      </View>
    </ScrollView>
  );
};

// Styles for the day squares
const styles = StyleSheet.create({
  square: {
    margin: ITEM_MARGIN / 2, // Margin between squares
    borderRadius: 4, // Rounded corners for squares
  },
});

export default CalHeatMapCustom;
