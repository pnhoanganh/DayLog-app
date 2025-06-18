import { TouchableOpacity } from "react-native";
import { useState, useCallback, useContext } from "react";
import { Tabs, router, useFocusEffect } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { FontFamily } from "@/constants/fonts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import BottomNav from "@/components/UI/BottomNav";
import { HabitContext } from "@/hooks/HabitContext";

export default function TabLayout() {
  const { habitList } = useContext(HabitContext);
  const [_, forceRerender] = useState(0);

  useFocusEffect(
    useCallback(() => {
      forceRerender((prev) => prev + 1);
    }, [habitList])
  );

  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: FontFamily.Poppins.SemiBold,
        },
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
      }}
    >
      <Tabs.Screen
        name="HabitDetailPanel"
        options={({ route }) => {
          const habitId = route.params?.id;
          const currentHabit = habitList.find((h) => h.habit_id === habitId);
          return {
            headerTitle: currentHabit?.title ?? "Habit Detail",
            tabBarLabel: "Overview",
          };
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={({ route }) => {
          const habitId = route.params?.id;
          const currentHabit = habitList.find((h) => h.habit_id === habitId);
          return {
            headerTitle: currentHabit?.title ?? "Analytics",
            tabBarLabel: "Analytics",
          };
        }}
      />
      <Tabs.Screen
        name="Report"
        options={({ route }) => {
          const habitId = route.params?.id;
          const currentHabit = habitList.find((h) => h.habit_id === habitId);
          return {
            headerTitle: currentHabit?.title ?? "Check-ins",
            tabBarLabel: "Check-ins",
          };
        }}
      />
    </Tabs>
  );
}
