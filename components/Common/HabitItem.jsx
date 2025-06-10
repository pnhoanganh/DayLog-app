import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { ArrowLeft3, ArrowRight3 } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";
import { Button } from "tamagui";
import { CheckCircle } from "@tamagui/lucide-icons";
import { HabitContext } from "@/hooks/HabitContext";
import CalHeatMapMonth from "../Char/CalHeatMapMonth";
import useCalendarMonth from "@/hooks/useCalendarMonth";
import { useToastController } from "@tamagui/toast";
import { router } from "expo-router";

const HabitItem = ({ icon, title, description, color, id }) => {
  const { habitData, habitCheck, removeCheckin } = useContext(HabitContext);
  const { currentDate, goToPreviousDate, goToNextMonth, formattedLabel } =
    useCalendarMonth();
  const toast = useToastController();
  const [selectedHabit, setSelectedHabit] = useState(null);

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
  const handleSelectedItem = (id) => {
    if (!id) {
      console.error("Invalid habit");
    }
    setSelectedHabit(id);
    const pathname = "/(screens)/HabitDetailPanel";
    router.push({
      pathname,
      params: {
        id: id,
        icon: icon,
        title: title,
        description: description,
        color: color,
        currentDate: currentDate,
      },
    });
  };

  return (
    <View>
      <TouchableOpacity
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
        onPress={() => {
          handleSelectedItem(id);
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
          <View className="flex-row justify-between">
            <CalHeatMapMonth
              key={id}
              habitId={id}
              color={color}
              data={heatmapData}
              currentDate={currentDate}
              removeCheckinForHabit={(dateKey) => {
                removeCheckin(id, dateKey);
                toast.show("Check-in removed 😢", {
                  message: "Don’t worry, you can always check in again!",
                  duration: 3000,
                });
              }}
            />
          </View>

          <Button
            icon={<CheckCircle size={wp("3%")} />}
            size="$4"
            style={{
              fontFamily: FontFamily.Poppins.Regular,
            }}
            textProps={{ style: { fontSize: wp("4%") } }}
            onPress={() => {
              habitCheck(id);
              toast.show("Check-in saved 🥳", {
                message: "Nice work keeping up the habit!",
                duration: 3000,
              });
            }}
          >
            Check In
          </Button>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HabitItem;
