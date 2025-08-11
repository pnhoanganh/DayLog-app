import { BarChart } from "react-native-gifted-charts";
import { View } from "react-native";
import COLORS from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

const Horizontal = ({ barData = [], themeColor, maxY }) => {
  const maxValue = maxY ?? Math.max(...barData.map((d) => d.value ?? 0), 1);

  const stepValue = Math.ceil(maxValue / 4);
  const noOfSections = Math.ceil(maxValue / stepValue);

  const { theme } = useContext(ThemeContext);

  const yAxisLabelTexts = Array.from({ length: noOfSections + 1 }, (_, i) =>
    (i * stepValue).toString()
  );

  return (
    <View
      style={{
        backgroundColor: theme === "dark" ? COLORS.darkBlue : COLORS.white,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BarChart
        data={barData}
        barWidth={wp("4%")}
        width={wp("65%")}
        height={hp("20%")}
        barBorderRadius={4}
        frontColor={themeColor}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor="#ccc"
        yAxisColor={theme === "dark" ? "#ccc" : COLORS.black}
        xAxisLabelTextStyle={{
          color: theme === "dark" ? "#ccc" : COLORS.black,
        }}
        yAxisTextStyle={{ color: theme === "dark" ? "#ccc" : COLORS.black }}
        stepValue={stepValue}
        noOfSections={noOfSections}
        yAxisLabelTexts={yAxisLabelTexts}
        spacing={wp("5%")}
        initialSpacing={16}
        formatYLabel={(val) => parseInt(val).toString()}
      />
    </View>
  );
};

export default Horizontal;
