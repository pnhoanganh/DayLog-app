import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getMonthlyCheckinDates } from "@/utils/habitAnalytics";
import { HabitContext } from "@/contexts/HabitContext";
import { LineChart } from "react-native-gifted-charts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import dayjs from "dayjs";

export default function Yearly() {
  const db = useSQLiteContext();
  const { currentHabit } = useContext(HabitContext);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const loadData = async () => {
      if (!db || !currentHabit?.id) return;
      const stats = await getMonthlyCheckinDates(
        db,
        currentHabit.id,
        selectedYear
      );
      setMonthlyStats(stats);
    };
    loadData();
  }, [db, currentHabit, selectedYear]);

  return (
    <View
      style={{
        padding: wp("5%"),
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: wp("4%"),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: hp("2%"),
        }}
      >
        <TouchableOpacity onPress={() => setSelectedYear((prev) => prev - 1)}>
          <Text style={{ fontSize: 16 }}>← </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{selectedYear}</Text>
        <TouchableOpacity onPress={() => setSelectedYear((prev) => prev + 1)}>
          <Text style={{ fontSize: 16 }}> →</Text>
        </TouchableOpacity>
      </View>

      <LineChart
        data={monthlyStats}
        areaChart
        width={wp("70%")}
        height={hp("20%")}
        color={currentHabit?.color_code}
        noOfSections={5}
        yAxisColor="#ccc"
        xAxisColor="#ccc"
        xAxisLabelTextStyle={{ fontSize: 10 }}
        startFillColor={currentHabit?.color_code}
        startOpacity={0.8}
        endFillColor={currentHabit?.color_code}
        endOpacity={0.3}
      />
    </View>
  );
}
