import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { ArrowLeft3, ArrowRight3, Trash } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";
import { Button, ScrollView } from "tamagui";
import { CheckCircle } from "@tamagui/lucide-icons";
import { CheckinHabit } from "@/hooks/checkinHabit";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalHeatMapMonth from "../Char/CalHeatMapMonth";
import useCalendarMonth from "@/hooks/useCalendarMonth";

const HabitItem = ({ icon, title, description, color, deleteHabit, id }) => {
  const { habitData, habitCheck, setHabitData } = useContext(CheckinHabit);
  const { currentDate, goToPreviousDate, goToNextMonth, formattedLabel } =
    useCalendarMonth();

  const heatmapData = Array.isArray(habitData[id])
    ? habitData[id]
        .filter(
          (item) =>
            item != null &&
            typeof item === "object" &&
            typeof item.count === "number" &&
            item.date &&
            !isNaN(new Date(item.date).getTime())
        )
        .map((item) => ({
          date: new Date(item.date),
          count: item.count,
        }))
    : [];

  // reset habitData (to check)
  const resetHabitData = async () => {
    setHabitData({});
    await AsyncStorage.setItem("habitData", JSON.stringify({}));
  };

  return (
    <View
      style={{
        borderColor: "#ebedf0",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,

        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View
        style={{
          width: wp("86%"),
          display: "flex",
          gap: hp("1%"),
        }}
      >
        <View
          style={{
            marginBottom: 4,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            {/* ICON */}
            <View
              style={{
                backgroundColor: color,
                width: wp("12%"),
                height: wp("12%"),
                display: "flex",
                justifyContent: "center",
                borderRadius: "30%",
                alignItems: "center",
              }}
            >
              <MaterialIcons name={icon} size={30} color={COLORS.darkGreen} />
            </View>
            {/* TEXT */}
            <View>
              <Text
                style={{
                  fontSize: wp("4.7%"),
                  fontFamily: FontFamily.Poppins.Regular,
                }}
              >
                {title && title.length > 12
                  ? title.substr(0, 12) + "..."
                  : title}
              </Text>
              <Text
                style={{
                  fontSize: wp("4%"),
                  fontFamily: FontFamily.Poppins.Regular,
                  color: COLORS.darkGreen,
                }}
              >
                {description && description.length > 14
                  ? description.substr(0, 14) + "..."
                  : description}
              </Text>
            </View>
          </View>
          {/* PREVIOUS &  NEXT MONTH*/}
          <View className="flex flex-row items-center">
            <ArrowLeft3
              size={24}
              color={COLORS.darkGreen}
              onPress={goToPreviousDate}
            />
            <Text
              style={{
                color: COLORS.darkGreen,
                fontFamily: FontFamily.Poppins.Regular,
                fontSize: wp("3%"),
              }}
            >
              {formattedLabel}
            </Text>
            <ArrowRight3
              size={24}
              color={COLORS.darkGreen}
              onPress={goToNextMonth}
            />
          </View>
        </View>
        <CalHeatMapMonth
          key={id}
          id={id}
          color={color}
          data={heatmapData}
          currentDate={currentDate}
        />

        <Button
          icon={<CheckCircle size={wp("3%")} />}
          size="$4"
          style={{
            fontFamily: FontFamily.Poppins.Regular,
          }}
          textProps={{ style: { fontSize: wp("4%") } }}
          onPress={() => {
            habitCheck(id);
            Toast.show({
              type: "success",
              text1: "Habit checked in!",
            });
          }}
        >
          Check In
        </Button>
        {/* <Trash size="32" color="#FF8A65" onPress={() => deleteHabit(id)} />
        <Button onPress={resetHabitData}>Reset All Habit Data</Button> */}
      </View>
    </View>
  );
};

export default HabitItem;
