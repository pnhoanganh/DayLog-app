import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AddCircle, Setting2 } from "iconsax-react-nativejs";
import { FontFamily } from "@/constants/fonts";
const Header = ({ toggleAddHabit }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 50,
        marginHorizontal: wp("8%"),
      }}
    >
      <TouchableOpacity>
        <Setting2 size="32" color="#000000" variant="Outline" />
      </TouchableOpacity>
      <Text style={{ fontFamily: FontFamily.Poetsen, fontSize: hp("3.5%") }}>
        DayLog
      </Text>
      <TouchableOpacity onPress={toggleAddHabit}>
        <AddCircle size="32" color="#000000" variant="Outline" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
