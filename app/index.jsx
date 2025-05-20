import SafeScreen from "@/components/SafeScreen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { Text, TouchableOpacity, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Calendar3D from "@/assets/images/Launch/calendar3d.svg";
import Sticker from "@/assets/images/Launch/sticker.svg";
import { useRouter } from "expo-router";

const LaunchScreen = () => {
  const router = useRouter();
  return (
    <SafeScreen bgColor={COLORS.lightOrange}>
      <View
        className="flex-1 justify-center items-center mx-auto"
        style={{ gap: hp("12%") }}
      >
        {/* SLOGAN OF APP */}
        <View className="relative rotate-[-8deg]">
          <Text
            style={{
              fontFamily: FontFamily.Poetsen,
              fontSize: wp("12%"),
            }}
          >
            Go for Better{"\n"}Habits with{"\n"}Day
            <Text style={{ color: COLORS.darkOrange }}>Log</Text>
          </Text>
          <View
            className=" absolute"
            style={{
              bottom: hp("-5%"),
              right: wp("2%"),
            }}
          >
            <Calendar3D width={wp("32%")} height={hp("10%")} />
          </View>
        </View>
        {/* GET STARTED BUTTON */}
        <View className="relative items-center">
          <View className="z-10">
            <Sticker width={wp("72%")} height={hp("32%")} />
          </View>
          <TouchableOpacity
            className="absolute self-center justify-center"
            style={{
              backgroundColor: COLORS.black,
              height: hp("6%"),
              width: wp("84%"),
              borderRadius: 8,
              bottom: hp("-2.2%"),
            }}
            onPress={() => router.navigate("/(screens)/Home")}
          >
            <Text
              style={{
                fontFamily: FontFamily.Poppins.Regular,
                fontSize: hp("2.2%"),
                textAlign: "center",
                color: COLORS.white,
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

export default LaunchScreen;
