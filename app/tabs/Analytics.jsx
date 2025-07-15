import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import { HabitContext } from "@/contexts/HabitContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { XStack } from "tamagui";
import Weekly from "@/components/Habit/Analytics/Weekly";
import Monthly from "@/components/Habit/Analytics/Monthly";
import Yearly from "@/components/Habit/Analytics/Yearly";

const Analytis = () => {
  const navigation = useNavigation();
  const { currentHabit } = useContext(HabitContext);
  const [activeTab, setActiveTab] = useState("weekly");
  const tabs = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];
  useEffect(() => {
    if (currentHabit?.title) {
      navigation.setOptions({ title: currentHabit.title });
    }
  }, [currentHabit?.title, navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F2F1F5",
        paddingTop: hp("2%"),
        gap: hp("2%"),
      }}
    >
      <XStack
        justifyContent="space-between"
        padding={"$2"}
        backgroundColor={COLORS.white}
        borderRadius={30}
        marginHorizontal={wp("4%")}
        shadowColor={"#000"}
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity="0.1"
        shadowRadius={6}
        elevation={5}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{
              backgroundColor:
                activeTab === tab.id ? currentHabit.color_code : "tranparent",
              padding: wp("3%"),
              borderRadius: 30,
              minWidth: wp("28%"),
            }}
            onPress={() => {
              setActiveTab(tab.id);
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.Poppins.Medium,
                color: activeTab === tab.id ? COLORS.black : COLORS.gray,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </XStack>
      {activeTab === "weekly" ? (
        <Weekly />
      ) : activeTab === "monthly" ? (
        <Monthly />
      ) : (
        <Yearly />
      )}
    </View>
  );
};

export default Analytis;
