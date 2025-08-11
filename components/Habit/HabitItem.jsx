import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button } from "tamagui";
import { CheckCircle } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { HabitContext } from "@/contexts/HabitContext";
import useCalendarMonth from "@/hooks/useCalendarMonth";
import { FontFamily } from "@/constants/fonts";
import COLORS from "@/constants/colors";
import CalHeatMapMonth from "../Char/Calendar/CalHeatMapMonth";
import useToggleModal from "@/hooks/useToggleModal";
import { router } from "expo-router";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import dayjs from "dayjs";
import { AlertWarn } from "@/components/Alert/AlertWarn";
import { ThemeContext } from "@/contexts/ThemeContext";

const HabitItem = ({ icon, title, description, color, id }) => {
  const { habitData, habitCheck, removeCheckin, handleDeleteHabit } =
    useContext(HabitContext);
  const { currentDate, goToPreviousDate, goToNextMonth, formattedLabel } =
    useCalendarMonth();
  const toast = useToastController();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const today = dayjs().format("YYYY-MM-DD");
  const deleteConfirmModal = useToggleModal();
  const { theme } = useContext(ThemeContext);

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
    const pathname = "/tabs/HabitDetailPanel";
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
          borderColor: theme === "dark" ? COLORS.gray : "#ebedf0",
          borderWidth: 1,
          padding: 12,
          borderRadius: 12,
          backgroundColor: theme === "dark" ? COLORS.darkBlue : COLORS.white,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
          maxWidth: 400,
        }}
        onPress={() => {
          handleSelectedItem(id);
        }}
        onLongPress={deleteConfirmModal.open}
      >
        <View
          style={{
            width: wp("86%"),
            display: "flex",
            gap: hp("1%"),
            flexDirection: "row",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              maxWidth: wp("50%"),
            }}
          >
            {/* ICON */}
            <View
              style={{
                backgroundColor: color,
                width: wp("10%"),
                height: wp("10%"),
                display: "flex",
                justifyContent: "center",
                borderRadius: "60%",
                alignItems: "center",
                marginBottom: hp("1%"),
              }}
            >
              {MaterialIconsGlyphs[icon] ? (
                <MaterialIcons
                  name={icon}
                  size={wp("6%")}
                  color={COLORS.darkGreen}
                />
              ) : (
                <Text style={{ fontSize: 20 }}>{icon}</Text>
              )}
            </View>
            {/* TEXT */}
            <View>
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: FontFamily.Poppins.SemiBold,
                  textAlign: "left",
                  color: theme === "dark" ? COLORS.white : COLORS.black,
                }}
              >
                {title && title.length > 13
                  ? title.substr(0, 13) + "..."
                  : title}
              </Text>
              <Text
                style={{
                  fontSize: wp("3%"),
                  fontFamily: FontFamily.Poppins.Regular,
                  color: theme === "dark" ? COLORS.white : COLORS.darkGreen,
                  textAlign: "left",
                }}
              >
                {description && description.length > 16
                  ? description.substr(0, 16) + "..."
                  : description}
              </Text>
            </View>
            {/* BUTTON */}
            <Button
              icon={<CheckCircle size={wp("3%")} />}
              size="$2.5"
              themeInverse
              style={{
                fontFamily: FontFamily.Poppins.Regular,
                marginTop: hp("2%"),
              }}
              textProps={{ style: { fontSize: wp("3.5%") } }}
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
          <View className="flex flex-col gap-1">
            <Text
              style={{
                color: theme === "dark" ? COLORS.white : COLORS.darkGreen,
                fontFamily: FontFamily.Poppins.SemiBold,
                fontSize: wp("3.4%"),
                textAlign: "center",
              }}
            >
              {formattedLabel}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <ArrowLeft2
                size={20}
                color={theme === "dark" ? COLORS.white : COLORS.darkGreen}
                onPress={goToPreviousDate}
              />
              <CalHeatMapMonth
                key={id}
                habitId={id}
                color={color}
                data={heatmapData}
                currentDate={currentDate}
                removeCheckinForHabit={(dateKey) => {
                  removeCheckin(id, dateKey);
                  if (dateKey === today) {
                    toast.show("Check-in removed 😢", {
                      message: "Don’t worry, you can always check in again!",
                      duration: 3000,
                    });
                  }
                }}
              />
              <ArrowRight2
                size={20}
                color={theme === "dark" ? COLORS.white : COLORS.darkGreen}
                onPress={goToNextMonth}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <AlertWarn
        isOpen={deleteConfirmModal.isOpen}
        setIsOpen={deleteConfirmModal.toggle}
        action={() => {
          handleDeleteHabit(id);
          toast.show(`Successfully removed habit`, {
            message: "This habit is no longer in your tracker.",
            duration: 3000,
          });
        }}
      />
    </View>
  );
};

export default HabitItem;
