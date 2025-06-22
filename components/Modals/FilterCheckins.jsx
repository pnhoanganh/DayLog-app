import { Sheet } from "@tamagui/sheet";
import { Text, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import COLORS from "@/constants/colors";
import { HabitContext } from "@/hooks/HabitContext";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Button, XStack } from "tamagui";
import { useFilter } from "@/hooks/FilterContext";

export const FilterCheckins = ({ open, setOpen, snapPoints, data }) => {
  const [position, setPosition] = useState(0);
  const today = format(new Date(), "yyyy-MM-dd");
  const { currentHabit } = useContext(HabitContext);

  const { selectedDates, setSelectedDates, setApplyFilter } = useFilter();

  const toggleDay = (dateStr) => {
    setSelectedDates((prev) => {
      const updated = { ...prev };
      if (updated[dateStr]) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = {
          selected: true,
          selectedColor: currentHabit.color_code,
          marked: true,
        };
      }
      return updated;
    });
  };

  const CustomDay = ({ date }) => {
    const isSelected = !!selectedDates[date.dateString];
    const isToday = date.dateString === today;

    return (
      <TouchableOpacity
        onPress={() => toggleDay(date.dateString)}
        style={{
          backgroundColor: isSelected ? currentHabit.color_code : "transparent",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isToday ? COLORS.darkGray : "transparent",
          width: wp("7%"),
          height: wp("7%"),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.textPrimary,
            fontSize: wp("3.5%"),
            textAlign: "center",
          }}
        >
          {date.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={setOpen}
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
      snapPoints={snapPoints}
      dismissOnSnapToBottom
      enableContentPanningGesture={false}
      forceRemoveScrollEnabled={open}
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        paddingTop="$5"
        paddingHorizontal="$4"
        paddingBottom="$8"
        gap="$4"
      >
        <Calendar
          current={today}
          markedDates={selectedDates}
          showSixWeeks={false}
          theme={{
            calendarBackground: "transparent",
            textSectionTitleFontWeight: "bold",
            selectedDotColor: "transparent",
            arrowColor: COLORS.darkGray,
            monthTextColor: COLORS.darkGray,
            textMonthFontWeight: "bold",
          }}
          style={{ paddingBottom: 2 }}
          dayComponent={CustomDay}
        />
        <XStack gap="$4" justifyContent="center">
          <Button
            size="$4"
            onPress={() => {
              setOpen(false);
              setApplyFilter(true);
            }}
          >
            Filter Checkins
          </Button>
          <Button
            themeInverse
            onPress={() => {
              setSelectedDates({});
              setApplyFilter(true);
              setOpen(false);
            }}
          >
            Clear Filter
          </Button>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
};
