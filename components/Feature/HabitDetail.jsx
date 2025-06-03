import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModalFull from "../Modals/ModalFull";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "../../constants/colors";
import { FontFamily } from "@/constants/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import CalHeatMapYear from "../Char/CalHeatMapYear";
import { CheckinHabit } from "@/hooks/checkinHabit";
import { Button, XStack } from "tamagui";
import { CheckCircle, Circle } from "@tamagui/lucide-icons";
import dayjs from "dayjs";

const HabitDetail = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  color,
  id,
  data,
}) => {
  const { habitCheck, removeAllCheckin, habitData } = useContext(CheckinHabit);
  const today = dayjs().format("YYYY-MM-DD");
  const checkins = habitData?.[id] || [];
  const isComplete = checkins.some(
    (item) => item.date === today && item.count > 0
  );

  return (
    <>
      <ModalFull visible={isOpen} onClose={onClose}>
        <View
          style={{
            height: hp("35%"),
            width: wp("100%"),
            padding: 20,
          }}
        >
          {/* HEADER = ICON + TITLE + CLOSEBTN*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <View className="flex flex-row gap-1">
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
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
          {/* DESCRIPTION */}
          {description && (
            <View className="mb-2">
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: FontFamily.Poppins.Regular,
                  color: COLORS.darkGray,
                }}
              >
                {description && description.length > 14
                  ? description.substr(0, 14) + "..."
                  : description}
              </Text>
            </View>
          )}
          {/* CAL-HEATMAP YEAR */}
          <View className="mt-2">
            <CalHeatMapYear color={color} data={data} />
          </View>
          {/* FUNCTION BTN */}
          <XStack paddingTop="$3">
            {/* COMPLETE BTN */}
            {isComplete ? (
              <Button
                icon={Circle}
                size="$3"
                width={"40%"}
                style={{
                  fontFamily: FontFamily.Poppins.Regular,
                }}
                textProps={{ style: { fontSize: wp("3.5%") } }}
                onPress={() => {
                  removeAllCheckin(id);
                  console.log("Removed check-in in detail");
                }}
              >
                Uncomplete
              </Button>
            ) : (
              // CHƯA hoàn thành → hiện nút Complete
              <Button
                icon={CheckCircle}
                size="$3"
                width={"40%"}
                theme="accent"
                style={{
                  fontFamily: FontFamily.Poppins.Regular,
                }}
                textProps={{ style: { fontSize: wp("3.5%") } }}
                onPress={() => {
                  habitCheck(id);
                  console.log("Check-in added in detail");
                }}
              >
                Complete
              </Button>
            )}

            {/* DETAIL BTN */}
          </XStack>
        </View>
      </ModalFull>
    </>
  );
};

export default HabitDetail;
