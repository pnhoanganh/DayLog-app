import { View, Text, Dimensions } from "react-native";
import Svg, { Path, Text as SvgText, TextPath, Defs } from "react-native-svg";
import React from "react";
import { YStack } from "tamagui";
import Sticker from "@/assets/images/Launch/homeSticker.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

const screenWidth = Dimensions.get("window").width;
const imageSize = Math.min(screenWidth * 0.72, 500);
const CurvedText = ({ text }) => {
  return (
    <Svg height={hp("12%")} width={wp("90%")}>
      <Defs>
        <Path
          id="curve"
          d="M 20,100 C 100,10 220,10 300,130"
          fill="transparent"
        />
      </Defs>

      <SvgText
        fontSize={wp("7%")}
        fontFamily={FontFamily.Poetsen}
        fill={COLORS.darkOrange}
      >
        <TextPath href="#curve" startOffset="0">
          {text}
        </TextPath>
      </SvgText>
    </Svg>
  );
};
const EmptyState = ({ description, title }) => {
  return (
    <YStack
      alignItems="center"
      gap="$3"
      style={{ marginTop: hp("12%"), paddingHorizontal: wp("8%") }}
    >
      <View className="items-center justify-center">
        <View
          className="rotate-[-10deg]"
          style={{
            position: "absolute",
            top: -hp("7%"),
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CurvedText text={title} />
        </View>
        <Sticker width={imageSize} height={imageSize * 0.8} />
      </View>
      <Text
        style={{
          fontSize: wp("4.5%"),
          textAlign: "center",
          color: COLORS.darkGray,
        }}
      >
        {description}
      </Text>
    </YStack>
  );
};

export default EmptyState;
