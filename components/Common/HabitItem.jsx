import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { Trash } from "iconsax-react-nativejs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontFamily } from "@/constants/fonts";
import { Button, ScrollView } from "tamagui";
import { CheckCircle } from "@tamagui/lucide-icons";
import { CheckinHabit } from "@/hooks/checkinHabit";
import Toast from "react-native-toast-message";
import CalHeatMapCustom from "../Char/CalHeatMapCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HabitItem = ({ icon, title, description, color, deleteHabit, id }) => {
  const { habitData, habitCheck, setHabitData } = useContext(CheckinHabit);
  const heatmapData = Array.isArray(habitData[id])
    ? habitData[id]
        .filter(
          (item) =>
            item != null &&
            typeof item === "object" &&
            typeof item.count === "number" &&
            item.date &&
            !isNaN(new Date(item.date).getTime())
        )
        .map((item) => ({
          date: new Date(item.date),
          count: item.count,
        }))
    : [];
  const resetHabitData = async () => {
    setHabitData({});
    await AsyncStorage.setItem("habitData", JSON.stringify({}));
  };

  return (
    <View
      style={{
        borderColor: "#ebedf0",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,

        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View style={{ width: wp("86%"), display: "flex", gap: hp("1%") }}>
        <View
          style={{
            marginBottom: 4,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: color,
              width: wp("14%"),
              height: wp("14%"),
              display: "flex",
              justifyContent: "center",
              borderRadius: "30%",
              alignItems: "center",
            }}
          >
            <MaterialIcons name={icon} size={30} color={COLORS.darkGreen} />
          </View>
          <View>
            <Text
              style={{
                fontSize: wp("4.7%"),
                fontFamily: FontFamily.Poppins.Regular,
              }}
            >
              {title && title.length > 20 ? title.substr(0, 20) + "..." : title}
            </Text>
            <Text
              style={{
                fontSize: wp("4%"),
                fontFamily: FontFamily.Poppins.Regular,
                color: COLORS.darkGreen,
              }}
            >
              {description && description.length > 25
                ? description.substr(0, 25) + "..."
                : description}
            </Text>
          </View>
        </View>
        <CalHeatMapCustom
          key={id}
          color={color}
          // data={[heatmapData,
          //   { date: "2025-05-01", count: 0 },
          //   { date: "2025-05-02", count: 1 },
          //   { date: "2025-05-03", count: 2 },
          //   { date: "2025-05-04", count: 3 },
          //   { date: "2025-05-05", count: 4 },
          // ]}
          data={heatmapData}
        />

        <Button
          icon={<CheckCircle size={20} />}
          size="$4"
          style={{
            fontFamily: FontFamily.Poppins.Regular,
          }}
          textProps={{ style: { fontSize: wp("4%") } }}
          onPress={() => {
            habitCheck(id);
            Toast.show({
              type: "success",
              text1: "Habit checked in!",
            });
          }}
        >
          Check In
        </Button>
        {/* <Trash size="32" color="#FF8A65" onPress={() => deleteHabit(id)} />
        <Button onPress={resetHabitData}>Reset All Habit Data</Button> */}
      </View>
    </View>
  );
};

export default HabitItem;
