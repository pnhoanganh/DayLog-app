import { View, Text } from "react-native";
import React, { useEffect, useContext } from "react";
import { useNavigation } from "expo-router";
import { HabitContext } from "@/hooks/HabitContext";

const Report = () => {
  const navigation = useNavigation();
  const { currentHabit } = useContext(HabitContext);

  useEffect(() => {
    if (currentHabit?.title) {
      navigation.setOptions({ title: currentHabit.title });
    }
  }, [currentHabit?.title, navigation]);

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Report Screen</Text>
    </View>
  );
};

export default Report;
