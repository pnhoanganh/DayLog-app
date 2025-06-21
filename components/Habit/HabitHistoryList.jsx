import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

const HabitDayBlock = ({ date, count, times, currentHabit }) => {
  return (
    <View style={{ marginTop: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
        }}
      >
        <Text
          style={{
            color: "#666",
            fontFamily: FontFamily.Poppins.Regular,
            fontSize: 17,
          }}
        >
          {date}
        </Text>
        <View
          style={{
            backgroundColor: "#7BCC85",
            width: 25,
            height: 25,
            borderRadius: "50%",
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
          backgroundColor: COLORS.white,
          borderRadius: 10,
          paddingHorizontal: wp("5%"),
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
};

const CheckinCard = ({ time, currentHabit, isLast }) => {
  const icon = currentHabit?.icon;
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
        borderColor: "#E6E6E8",
      }}
    >
      {MaterialIconsGlyphs[icon] ? (
        <MaterialIcons name={icon} size={wp("6%")} color={COLORS.darkGreen} />
      ) : (
        <Text style={{ fontSize: wp("6%") }}>{icon}</Text>
      )}
      <Text style={{ fontFamily: FontFamily.Poppins.Medium, fontSize: 18 }}>
        {time}
      </Text>
    </View>
  );
};

export default function HabitHistoryList({ month, days, total, currentHabit }) {
  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          padding: wp("3%"),
          borderRadius: 10,
          borderColor: COLORS.gray,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: FontFamily.Poppins.SemiBold,
          }}
        >
          {month}
        </Text>
        <View
          style={{
            backgroundColor: "#7BCC85",
            width: 25,
            height: 25,
            borderRadius: "50%",
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
            {total}
          </Text>
        </View>
      </View>
      {days.map((d) => (
        <HabitDayBlock key={d.date} {...d} currentHabit={currentHabit} />
      ))}
    </View>
  );
}
