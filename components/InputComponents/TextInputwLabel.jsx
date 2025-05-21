import { View, Text, TextInput } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

const TextInputwLabel = ({ label }) => {
  return (
    <View className="mt-4 flex flex-col gap-1">
      <Text
        style={{ fontFamily: FontFamily.Poppins.Regular, fontSize: wp("4%") }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.white,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: COLORS.gray,
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: hp("5%"),
            color: COLORS.black,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
};

export default TextInputwLabel;
