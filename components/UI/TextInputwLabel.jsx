import { View, Text, TextInput } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

const TextInputwLabel = ({ label, value, onChangeText, style, capitalize }) => {
  return (
    <View className="mt-4 flex flex-col gap-1">
      <Text
        style={{ fontFamily: FontFamily.Poppins.Regular, fontSize: wp("4%") }}
      >
        {label}
      </Text>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.white,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.gray,
            paddingHorizontal: 12,
          },
          style,
        ]}
      >
        <TextInput
          style={{
            flex: 1,
            height: hp("5%"),
            color: COLORS.black,
            fontSize: 16,
          }}
          autoCapitalize={capitalize || "sentences"}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default TextInputwLabel;
