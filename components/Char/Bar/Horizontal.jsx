import { BarChart } from "react-native-gifted-charts";
import { View } from "react-native";
import COLORS from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Horizontal = ({ barData, themeColor }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("2%"),
      }}
    >
      <BarChart
        style={{ alignSelf: "center" }}
        barWidth={wp("4%")}
        width={wp("70%")}
        barBorderRadius={4}
        frontColor={themeColor}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={5}
        stepValue={1}
        initialSpacing={16}
        spacing={wp("6%")}
      />
    </View>
  );
};

export default Horizontal;
