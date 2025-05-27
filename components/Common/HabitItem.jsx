import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { Trash } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";
import { Button } from "tamagui";
import { CheckCircle } from "@tamagui/lucide-icons";

const HabitItem = ({ icon, title, description, color, deleteHabit, id }) => {
  return (
    <TouchableOpacity style={{}}>
      {/* HEARDER */}
      <View style={{ width: wp("86%") }}>
        <View
          style={{
            paddingVertical: 8,
            marginBottom: 8,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          {/* ICON */}
          <View
            style={{
              backgroundColor: color,
              width: wp("14%"),
              height: wp("14%"),
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
              {title && title.length > 20 ? title.substr(0, 20) + "..." : title}
            </Text>
            <Text
              style={{
                fontSize: wp("4%"),
                fontFamily: FontFamily.Poppins.Regular,
                color: COLORS.darkGreen,
              }}
            >
              {description && description.length > 25
                ? description.substr(0, 25) + "..."
                : description}
            </Text>
          </View>
        </View>
        <Button
          icon={<CheckCircle size={20} />}
          size="$4"
          style={{
            fontFamily: FontFamily.Poppins.Regular,
          }}
          textProps={{ style: { fontSize: wp("4%") } }}
        >
          Check In
        </Button>
      </View>

      {/* <Trash size="32" color="#FF8A65" onPress={() => deleteHabit(id)} /> */}
    </TouchableOpacity>
  );
};

export default HabitItem;
