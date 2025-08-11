import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AddCircle, Setting2 } from "iconsax-react-nativejs";
import { FontFamily } from "@/constants/fonts";
import { router } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";
import COLORS from "@/constants/colors";

const Header = ({ toggleAddHabit }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 50,
        marginHorizontal: wp("8%"),
        marginBottom: hp("3%"),
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push("/home/Setting");
        }}
      >
        <Setting2
          size="32"
          color={theme === "dark" ? COLORS.white : COLORS.black}
          variant="Outline"
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: FontFamily.Poetsen,
          fontSize: hp("3.5%"),
          color: theme === "dark" ? COLORS.white : COLORS.black,
        }}
      >
        DayLog
      </Text>
      <TouchableOpacity onPress={toggleAddHabit}>
        <AddCircle
          size="32"
          color={theme === "dark" ? COLORS.white : COLORS.black}
          variant="Outline"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
