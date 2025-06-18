import { TouchableOpacity } from "react-native";
import { Tabs, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { FontFamily } from "@/constants/fonts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import BottomNav from "@/components/UI/BottomNav";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <BottomNav {...props} />}>
      <Tabs.Screen
        name="HabitDetailPanel"
        options={({ route }) => ({
          title: route.params?.habitTitle,
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: FontFamily.Poppins.SemiBold,
          },
          headerShown: true,
          tabBarLabel: "Overview",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingLeft: 15 }}
            >
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: hp("13%"),
          },
        })}
      />
      <Tabs.Screen
        name="Analytics"
        options={() => ({
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: FontFamily.Poppins.SemiBold,
          },
          headerShown: true,
          tabBarLabel: "Analytics",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/screens/Home")}
              style={{ paddingLeft: 15 }}
            >
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: hp("13%"),
          },
        })}
      />
      <Tabs.Screen
        name="Report"
        options={() => ({
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: FontFamily.Poppins.SemiBold,
          },
          headerShown: true,
          tabBarLabel: "Check-ins",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/screens/Home")}
              style={{ paddingLeft: 15 }}
            >
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: hp("13%"),
          },
        })}
      />
    </Tabs>
  );
}
