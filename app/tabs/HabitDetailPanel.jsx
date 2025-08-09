import React, { useContext, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, XStack, YStack } from "tamagui";
import { useToastController } from "@tamagui/toast";
import { CheckCircle, Circle, Pencil, Trash2 } from "@tamagui/lucide-icons";
import dayjs from "dayjs";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import useToggleModal from "@/hooks/useToggleModal";
import { HabitContext } from "@/contexts/HabitContext";
import { AlertWarn } from "@/components/Alert/AlertWarn";
import CalHeatMapYear from "@/components/Char/Calendar/CalHeatMapYear";
import EditHabitModal from "@/components/Habit/EditHabit";
import StreakBox from "@/components/UI/SteakBox";
import TotalBox from "@/components/UI/TotalBox";
import { CalendarStreak } from "@/components/Modals/CalendarStreak";

const HabitDetailPanel = () => {
  const {
    habitCheck,
    habitData,
    removeCheckin,
    handleDeleteHabit,
    habitList,
    setCurrentHabit,
  } = useContext(HabitContext);
  const { id, currentDate, title } = useLocalSearchParams();
  const today = dayjs().format("YYYY-MM-DD");
  const checkins = habitData?.[id] || [];
  const isComplete =
    Array.isArray(checkins) &&
    checkins.some((item) => item.date === today && item.count > 0);
  const formatDateKey = (date) => dayjs(date).format("YYYY-MM-DD");
  const deleteConfirmModal = useToggleModal();
  const editHabitModal = useToggleModal();
  const streakModal = useToggleModal();
  const toast = useToastController();
  const habit = habitList.find(
    (habit) => String(habit.habit_id) === String(id)
  );
  const habitToEdit = habit;
  const navigation = useNavigation();
  const heatmapData = useMemo(() => {
    if (!Array.isArray(habitData[id])) return [];

    return habitData[id]
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.count === "number" &&
          item.date &&
          !isNaN(new Date(item.date).getTime())
      )
      .map((item) => ({
        date: formatDateKey(item.date),
        count: item.count,
      }));
  }, [habitData, id]);
  useEffect(() => {
    title && navigation.setOptions({ title: title });
  }, []);

  useEffect(() => {
    if (!habit) {
      router.push("/home/Home");
    }
    if (habit) {
      setCurrentHabit({
        id: habit.habit_id,
        title: habit.title,
        description: habit.description,
        color_code: habit.color_code,
        icon: habit.icon,
      });
    }
  }, [habit, setCurrentHabit]);

  if (!habit) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F2F1F5",
        alignItems: "center",
        gap: hp("2%"),
      }}
    >
      <View
        style={{
          width: wp("90%"),
          padding: hp("2%"),
          backgroundColor: "white",
          marginTop: hp("2%"),
          borderRadius: "2%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        {/* HEADER = ICON + DESCRIPTION */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <View className="flex flex-row gap-1 justify-center items-center">
            {/* ICON */}
            <View
              style={{
                backgroundColor: habit.color_code,
                width: wp("12%"),
                height: wp("12%"),
                display: "flex",
                justifyContent: "center",
                borderRadius: "50%",
                alignItems: "center",
              }}
            >
              {MaterialIconsGlyphs[habit.icon] ? (
                <MaterialIcons
                  name={habit.icon}
                  size={30}
                  color={COLORS.darkGreen}
                />
              ) : (
                <Text style={{ fontSize: 30 }}>{habit.icon}</Text>
              )}
            </View>
            {/* TEXT */}
            <View>
              {habit.description && (
                <View className="mb-2">
                  <Text
                    style={{
                      fontSize: wp("4%"),
                      fontFamily: FontFamily.Poppins.Regular,
                      color: COLORS.darkGray,
                      marginLeft: 8,
                    }}
                  >
                    {habit.description && habit.description.length > 45
                      ? habit.description.substr(0, 45) + "..."
                      : habit.description}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* CAL-HEATMAP YEAR */}
        <View className="mt-2">
          <CalHeatMapYear color={habit.color_code} data={heatmapData} />
        </View>
        {/* FUNCTION BTN */}
        <XStack
          paddingTop="$3"
          justifyContent="space-between"
          alignItems="center"
        >
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

          <XStack gap="$6">
            <TouchableOpacity
              onPress={() => {
                editHabitModal.open();
              }}
            >
              <Pencil color={COLORS.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteConfirmModal.open}>
              <Trash2 color={COLORS.darkGreen} />
            </TouchableOpacity>
          </XStack>
        </XStack>
      </View>
      <XStack gap={"$2"}>
        <StreakBox habit_id={habit.habit_id} onPress={streakModal.open} />
        <TotalBox habit_id={habit.habit_id} />
      </XStack>
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
      <EditHabitModal
        isOpen={editHabitModal.isOpen}
        onClose={() => editHabitModal.close()}
        habitToEdit={habitToEdit}
      />
      <CalendarStreak
        open={streakModal.isOpen}
        setOpen={streakModal.toggle}
        snapPoints={[55]}
      />
    </View>
  );
};

export default HabitDetailPanel;
