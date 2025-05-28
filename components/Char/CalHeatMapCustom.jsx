import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import tinycolor from "tinycolor2";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_DAYS = 30;
const SQUARE_SIZE = 20;
const ITEM_MARGIN = 2;
const ITEM_TOTAL_WIDTH = SQUARE_SIZE + ITEM_MARGIN;

const START_DATE = new Date(
  new Date().setDate(new Date().getDate() - NUM_DAYS + 1)
);

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < NUM_DAYS; i++) {
    const d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDateKey = (date) => date.toISOString().split("T")[0];

const CalHeatMapCustom = ({ data = [], color = "#4caf50" }) => {
  const dates = generateDates();

  const numColumns = Math.floor(SCREEN_WIDTH / ITEM_TOTAL_WIDTH);
  const numRows = Math.ceil(NUM_DAYS / numColumns);

  const safeData = Array.isArray(data) ? data : [];

  // Define 5 color levels (0 for no check-ins, 1-4 for increasing counts)
  const levelCount = 4; // Levels 0 (background), 1, 2, 3, 4
  const colorArray = ["#F0F2F5"]; // Background color for level 0
  for (let i = 1; i <= levelCount; i++) {
    // Darken from 15% (level 1) to 60% (level 4)
    const darkenRatio = 4 + ((i - 1) * (70 - 35)) / (levelCount - 1);
    const c = tinycolor(color).darken(darkenRatio).toHexString();
    colorArray.push(c);
  }

  // Map count to level (0-4) with fixed thresholds
  const getLevel = (count) => {
    if (count === 0 || count == null) return 0; // No check-ins
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count >= 4) return 4; // count >= 4 maps to darkest color
    return 0; // Fallback
  };

  // Map dates to levels and store raw counts
  const dataMap = {};
  const rawCountMap = {};

  safeData.forEach((item) => {
    if (item.date && item.count != null) {
      const key = formatDateKey(new Date(item.date));
      rawCountMap[key] = item.count;
      dataMap[key] = getLevel(item.count);
    }
  });

  const onPressDay = (date) => {
    const key = formatDateKey(date);
    const count = rawCountMap[key];
    Alert.alert(
      "Ngày check-in",
      count != null
        ? `${date.toDateString()}\nSố lần check-in: ${count}`
        : `${date.toDateString()}\nChưa có check-in`
    );
  };

  const renderItem = ({ item }) => {
    const key = formatDateKey(item);
    const level = dataMap[key] || 0; // 0-4
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
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <FlatList
          data={dates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toISOString()}
          numColumns={numColumns}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: numColumns * ITEM_TOTAL_WIDTH,
            height: numRows * ITEM_TOTAL_WIDTH,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  square: {
    margin: ITEM_MARGIN / 2, // Consistent with ITEM_MARGIN
    borderRadius: 4,
  },
});

export default CalHeatMapCustom;
