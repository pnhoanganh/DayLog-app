import { Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import COLORS from "@/constants/colors";
import { HabitContext } from "@/contexts/HabitContext";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFilter } from "@/contexts/FilterContext";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";
import { getCheckinDatesInMonth } from "@/utils/habitAnalytics";
import StreakIcon from "@/assets/images/Streak.svg";

export default function CalStreak() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { currentHabit } = useContext(HabitContext);
  const { selectedDates, setSelectedDates } = useFilter();
  const [markedDates, setMarkedDates] = useState({});
  const [monthStartDate, setMonthStartDate] = useState(
    dayjs().startOf("month")
  );
  const db = useSQLiteContext();
  useEffect(() => {
    const fetchDates = async () => {
      if (!db || !currentHabit?.id) return;
      const dates = await getCheckinDatesInMonth(
        db,
        currentHabit.id,
        monthStartDate
      );

      const marks = generateMarkedDates(dates, currentHabit.color_code);
      setMarkedDates(marks);
    };

    fetchDates();
  }, [currentHabit, db, monthStartDate]);

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

  const generateMarkedDates = (dates, color) => {
    const marks = {};
    dates.forEach((date) => {
      marks[date] = {
        customStyles: {
          container: {
            backgroundColor: color,
            borderRadius: 8,
          },
          text: {
            color: "black",
          },
        },
      };
    });
    return marks;
  };

  const CustomDay = ({ date, state }) => {
    const isMarked = !!markedDates[date.dateString];
    return (
      <View
        onPress={() => toggleDay(date.dateString)}
        disabled={state === "disabled"}
        style={{
          backgroundColor: "transparent",
          width: wp("8%"),
          height: wp("8%"),
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Text
          style={{
            color: state === "disabled" ? COLORS.gray : COLORS.textPrimary,
            fontSize: wp("3.5%"),
          }}
        >
          {date.day}
        </Text>
        {isMarked && (
          <StreakIcon
            width={40}
            height={40}
            style={{ position: "absolute", bottom: 3 }}
          />
        )}
      </View>
    );
  };

  const combinedMarks = {
    ...markedDates,
    ...selectedDates,
  };

  return (
    <Calendar
      current={today}
      markedDates={combinedMarks}
      markingType="custom"
      showSixWeeks={false}
      hideExtraDays={false}
      disableAllTouchEventsForDisabledDays={true}
      onMonthChange={(month) => {
        const selected = dayjs(`${month.year}-${month.month}-01`);
        setMonthStartDate(selected);
      }}
      theme={{
        calendarBackground: "white",
        textSectionTitleColor: COLORS.darkGray,
        textSectionTitleFontWeight: "bold",
        selectedDotColor: "transparent",
        arrowColor: COLORS.darkGray,
        monthTextColor: COLORS.darkGray,
        textMonthFontWeight: "bold",
      }}
      style={{
        paddingBottom: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderRadius: 10,
      }}
      dayComponent={CustomDay}
    />
  );
}
