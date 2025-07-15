import { View, Text, TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const colors = [
    "#FFE9BD",
    "#D4F2FF",
    "#DED4FF",
    "#FFD4EE",
    "#F0C4C3",
    "#CAC5C5",
  ];
  const CIRCLE_SIZE = 40;
  const CIRCLE_RING_SIZE = 2;
  return (
    <View className="flex flex-col gap-1 mx-auto">
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
          justifyContent: "flex-start",
          flexWrap: "wrap",
          paddingLeft: wp("2%"),
        }}
      >
        {colors.map((item) => {
          const isActive = selectedColor === item;
          return (
            <View key={item}>
              <TouchableWithoutFeedback onPress={() => setSelectedColor(item)}>
                <View
                  style={{
                    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
                    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
                    borderRadius: 9999,
                    backgroundColor: "white",
                    borderWidth: CIRCLE_RING_SIZE,
                    borderColor: isActive ? item : "transparent",
                    marginRight: wp("1%"),
                    marginBottom: 8,
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
