import { View, Text, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { FontFamily } from "@/constants/fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ColorPicker = () => {
  const [valueColor, setValueColor] = useState(0);
  const colors = [
    "#393E46",
    "#27548A",
    "#5F8B4C",
    "#E69DB8",
    "#F2613F",
    "#C62E2E",
  ];
  const CIRCLE_SIZE = 40;
  const CIRCLE_RING_SIZE = 2;
  return (
    <View className="flex flex-col gap-1">
      <Text
        style={{
          fontFamily: FontFamily.Poppins.Regular,
          fontSize: wp("4%"),
        }}
      >
        Color
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {colors.map((item, index) => {
          const isActive = valueColor == index;
          return (
            <View key={item}>
              <TouchableWithoutFeedback onPress={() => setValueColor(index)}>
                <View
                  style={{
                    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
                    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
                    borderRadius: 9999,
                    backgroundColor: "white",
                    borderWidth: CIRCLE_RING_SIZE,
                    borderColor: isActive ? item : "transparent",
                    marginRight: 8,
                  }}
                >
                  <View
                    style={{
                      width: CIRCLE_SIZE,
                      height: CIRCLE_SIZE,
                      borderRadius: 9999,
                      position: "absolute",
                      top: CIRCLE_RING_SIZE,
                      left: CIRCLE_RING_SIZE,
                      backgroundColor: item,
                    }}
                  ></View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ColorPicker;
