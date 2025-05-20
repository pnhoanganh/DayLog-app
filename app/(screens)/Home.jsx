import { Text, View } from "react-native";
import { FontFamily } from "@/constants/fonts";
import Header from "@/components/Header";
import COLORS from "@/constants/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: hp("10%"),
      }}
    >
      <Header />
    </View>
  );
};

export default HomeScreen;
