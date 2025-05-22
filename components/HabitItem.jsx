import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { Trash } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";

const HabitItem = ({ icon, title, description, color, deleteHabit, id }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: color,
          width: wp("14%"),
          height: wp("14%"),
          display: "flex",
          justifyContent: "center",
          borderRadius: "30%",
        }}
      >
        <MaterialIcons name={icon} size={38} color={COLORS.darkGreen} />
      </View>
      <View>
        <Text
          style={{
            fontSize: wp("5%"),
            fontFamily: FontFamily.Poppins.Regular,
          }}
        >
          {title && title.length > 20 ? title.substr(0, 20) + "..." : title}
        </Text>
        <Text
          style={{
            fontSize: wp("4%"),
            fontFamily: FontFamily.Poppins.Regular,
            color: COLORS.darkGreen,
          }}
        >
          {description && description.length > 30
            ? description.substr(0, 30) + "..."
            : description}
        </Text>
      </View>
      {/* <Trash size="32" color="#FF8A65" onPress={() => deleteHabit(id)} /> */}
    </TouchableOpacity>
  );
};

export default HabitItem;
