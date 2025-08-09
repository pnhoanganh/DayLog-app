import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import COLORS from "@/constants/colors";
import { HabitContext } from "@/contexts/HabitContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";
import { getMonthlyCheckinDates } from "@/utils/habitAnalytics";
import { ScrollView, XStack, YStack } from "tamagui";
import { FontFamily } from "@/constants/fonts";
import Horizontal from "@/components/Char/Bar/Horizontal";
import { LineChart } from "react-native-gifted-charts";

export default function Monthly() {
  const db = useSQLiteContext();
  const { currentHabit } = useContext(HabitContext);
  const [monthlyData, setMonthlyData] = useState([]);
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const loadData = async () => {
      if (!currentHabit?.id || !db) return;
      const stats = await getMonthlyCheckinDates(
        db,
        currentHabit.id,
        selectedYear
      );
      const colored = stats.map((item, index) => ({
        ...item,
        label: dayjs().month(index).format("MMM"),
        frontColor: currentHabit.color_code,
      }));
      setMonthlyData(colored);
    };
    loadData();
  }, [db, currentHabit, selectedYear]);

  const maxY = Math.max(...monthlyData.map((d) => d.value)) + 2;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: wp("4%"),
        paddingBottom: hp("16%"),
      }}
    >
      <YStack gap="$5">
        <View
          style={{
            gap: hp("2%"),
            backgroundColor: COLORS.white,
            borderRadius: "2%",
            padding: wp("4%"),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <Text
                style={{
                  fontFamily: FontFamily.Poppins.SemiBold,
                  fontSize: wp("5%"),
                }}
              >
                Monthly
              </Text>
              <Text
                style={{
                  fontFamily: FontFamily.Poppins.Regular,
                  color: COLORS.gray,
                }}
              >
                Your habit journey by month
              </Text>
            </YStack>
            <View
              style={{
                flexDirection: "row",
                gap: wp("2%"),
                marginBottom: hp("2%"),
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setSelectedYear((prev) => prev - 1)}
              >
                <Text style={{ fontSize: 14 }}>← </Text>
              </TouchableOpacity>
              <Text
                style={{ fontSize: 16, fontFamily: FontFamily.Poppins.Regular }}
              >
                {selectedYear}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedYear((prev) => prev + 1)}
              >
                <Text style={{ fontSize: 14 }}> →</Text>
              </TouchableOpacity>
            </View>
          </XStack>
          {monthlyData.length > 0 && (
            <Horizontal barData={monthlyData} maxY={maxY} />
          )}
        </View>

        <View
          style={{
            padding: wp("5%"),
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <LineChart
            data={monthlyData}
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
      </YStack>
    </ScrollView>
  );
}
