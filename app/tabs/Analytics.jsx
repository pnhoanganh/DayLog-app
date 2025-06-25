import { View, Text } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import { HabitContext } from "@/contexts/HabitContext";
import Horizontal from "@/components/Char/Bar/Horizontal";
import { useSQLiteContext } from "expo-sqlite";
import { getWeeklyDayStats } from "@/utils/habitAnalytics";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "../../constants/colors";
import { FontFamily } from "../../constants/fonts";
import { ScrollView } from "tamagui";

const Analytis = () => {
  const navigation = useNavigation();
  const { currentHabit } = useContext(HabitContext);
  const [weeklyChartData, setWeeklyChartData] = useState();
  const db = useSQLiteContext();

  useEffect(() => {
    if (currentHabit?.title) {
      navigation.setOptions({ title: currentHabit.title });
    }
  }, [currentHabit?.title, navigation]);
  useEffect(() => {
    const load = async () => {
      const weeklyStats = await getWeeklyDayStats(db, currentHabit.id);
      setWeeklyChartData(weeklyStats);
    };
    load();
  }, []);

  return (
    <ScrollView
      style={{
        paddingBottom: hp("20%"),
        paddingHorizontal: wp("6%"),
        paddingTop: hp("1%"),
        marginBottom: hp("12%"),
      }}
    >
      <View style={{ gap: hp("2%") }}>
        <View
          style={{
            borderWidth: 1,
            padding: wp("3%"),
            borderRadius: 10,
            borderColor: COLORS.gray,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: hp("3%"),
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: FontFamily.Poppins.SemiBold,
            }}
          >
            Weekly Analytics
          </Text>
        </View>
        <Horizontal
          barData={weeklyChartData}
          themeColor={currentHabit.color_code}
        />
      </View>
    </ScrollView>
  );
};

export default Analytis;
