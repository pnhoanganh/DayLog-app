import { FlatList } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import HabitItem from "@/components/Common/HabitItem";

const HabitList = ({ habitList, handleDeleteHabit }) => {
  return (
    <FlatList
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: hp("10%"),
        gap: hp("2%"),
      }}
      data={habitList}
      keyExtractor={(item) => item.habit_id.toString()}
      renderItem={({ item }) => (
        <HabitItem
          icon={item.icon}
          color={item.color_code}
          title={item.title}
          description={item.description}
          id={item.habit_id}
        />
      )}
    />
  );
};

export default HabitList;
