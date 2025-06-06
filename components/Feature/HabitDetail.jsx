import React, { useState, useContext, useEffect } from "react";
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
import {
  CheckCircle,
  Circle,
  CalendarFold,
  Pencil,
  Trash2,
} from "@tamagui/lucide-icons";
import dayjs from "dayjs";
import useToggleModal from "../../hooks/useToggleModal";
import { AlertWarn } from "../Layouts/AlertWarn";

const HabitDetail = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  color,
  id,
  data,
  currentDate,
  deleteHabit,
}) => {
  const { habitCheck, habitData, removeCheckin } = useContext(CheckinHabit);
  const today = dayjs().format("YYYY-MM-DD");
  const checkins = habitData?.[id] || [];
  const isComplete =
    Array.isArray(checkins) &&
    checkins.some((item) => item.date === today && item.count > 0);
  const formatDateKey = (date) => dayjs(date).format("YYYY-MM-DD");
  const deleteConfirmModal = useToggleModal();

  return (
    <View>
      <ModalFull visible={isOpen} onClose={onClose}>
        <View
          style={{
            height: hp("35%"),
            width: wp("100%"),
            // justifyContent: "center",
            padding: 20,
          }}
        >
          {/* HEADER = ICON + TITLE + CLOSEBTN */}
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
                  {title && title.length > 30
                    ? title.substr(0, 30) + "..."
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
                {description && description.length > 45
                  ? description.substr(0, 45) + "..."
                  : description}
              </Text>
            </View>
          )}
          {/* CAL-HEATMAP YEAR */}
          <View className="mt-2">
            <CalHeatMapYear color={color} data={data} />
          </View>
          {/* FUNCTION BTN */}
          <XStack
            paddingTop="$3"
            justifyContent="space-between"
            alignItems="center"
          >
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
                  removeCheckin(id, formatDateKey(currentDate));
                  console.log(
                    "Removed check-in in detail",
                    id,
                    formatDateKey(currentDate)
                  );
                }}
              >
                Uncomplete
              </Button>
            ) : (
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
            <XStack gap="$6">
              <CalendarFold color={COLORS.darkGreen} />
              <Pencil color={COLORS.darkGreen} />
              <TouchableOpacity onPress={deleteConfirmModal.open}>
                <Trash2 color={COLORS.darkGreen} />
              </TouchableOpacity>
            </XStack>
          </XStack>
        </View>
        <AlertWarn
          isOpen={deleteConfirmModal.isOpen}
          setIsOpen={deleteConfirmModal.toggle}
          action={deleteHabit}
        />
      </ModalFull>
    </View>
  );
};

export default HabitDetail;
