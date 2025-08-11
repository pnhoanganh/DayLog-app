import { View, Text } from "react-native";
import React, { useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { ThemeContext } from "@/contexts/ThemeContext";

const HabitDayBlock = React.memo(
  ({ displayDate, count, times, currentHabit }) => {
    const { theme } = useContext(ThemeContext);
    return (
      <View style={{ marginTop: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            paddingTop: 0,
          }}
        >
          <Text
            style={{
              color: theme === "dark" ? COLORS.white : "#666",
              fontFamily: FontFamily.Poppins.Regular,
              fontSize: 17,
            }}
          >
            {displayDate}
          </Text>
          <View
            style={{
              backgroundColor: "#7BCC85",
              width: 25,
              height: 25,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
                fontFamily: FontFamily.Poppins.SemiBold,
              }}
            >
              {count}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: theme === "dark" ? COLORS.darkBlue : COLORS.white,
            borderRadius: 10,
            paddingHorizontal: wp("5%"),
            borderWidth: theme === "dark" ? 1 : 0,
            borderColor: COLORS.gray,
          }}
        >
          {times.map((time, i) => (
            <CheckinCard
              key={i}
              time={time}
              currentHabit={currentHabit}
              isLast={i === times.length - 1}
            />
          ))}
        </View>
      </View>
    );
  }
);

HabitDayBlock.displayName = "HabitDayBlock";

const CheckinCard = React.memo(({ time, currentHabit, isLast }) => {
  const icon = currentHabit?.icon;
  const { theme } = useContext(ThemeContext);
  const isValidIcon = icon && MaterialIconsGlyphs?.[icon];

  return (
    <View
      style={{
        paddingHorizontal: wp("1%"),
        paddingVertical: hp("2%"),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: wp("3%"),
        borderBottomWidth: isLast ? 0 : 1,
        borderColor: theme === "dark" ? COLORS.darkGray : "#E6E6E8",
      }}
    >
      {isValidIcon ? (
        <MaterialIcons
          name={icon}
          size={wp("6%")}
          color={theme === "dark" ? COLORS.white : COLORS.darkGreen}
        />
      ) : (
        <Text style={{ fontSize: wp("6%") }}>{icon || "❓"}</Text>
      )}
      <Text
        style={{
          fontFamily: FontFamily.Poppins.Medium,
          fontSize: 18,
          color: theme === "dark" ? COLORS.white : COLORS.darkGreen,
        }}
      >
        {time}
      </Text>
    </View>
  );
});

CheckinCard.displayName = "CheckinCard";

export default function HabitHistoryList({ month, days, total, currentHabit }) {
  return (
    <View>
      {days.map((d) => (
        <HabitDayBlock key={d.rawDate} {...d} currentHabit={currentHabit} />
      ))}
    </View>
  );
}
