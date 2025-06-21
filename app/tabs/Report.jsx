import { View, FlatList } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HabitContext } from "@/hooks/HabitContext";
import HabitHistoryList from "@/components/Habit/HabitHistoryList";
import EmptyHabitState from "../../components/Habit/EmptyHabitState";

const Report = () => {
  const navigation = useNavigation();
  const { currentHabit, loadHabitHistoryGrouped } = useContext(HabitContext);
  const [habitHistory, setHabitHistory] = useState([]);

  useEffect(() => {
    if (currentHabit?.title) {
      navigation.setOptions({ title: currentHabit.title });
    }
  }, [currentHabit?.title, navigation]);

  useEffect(() => {
    const loadData = async () => {
      const result = await loadHabitHistoryGrouped(currentHabit?.id);
      setHabitHistory(result || []);
    };
    if (currentHabit?.id) {
      loadData();
    }
  }, [currentHabit?.id, loadHabitHistoryGrouped]);

  return (
    <View
      style={{
        backgroundColor: "#F2F2F7",
        flex: 1,
      }}
    >
      <FlatList
        data={habitHistory}
        keyExtractor={(item) => item.month}
        renderItem={({ item }) => (
          <HabitHistoryList
            month={item.month}
            total={item.total}
            days={item.days}
            currentHabit={currentHabit}
          />
        )}
        contentContainerStyle={{
          paddingBottom: hp("20%"),
          paddingHorizontal: wp("6%"),
          paddingTop: hp("3%"),
        }}
        ListEmptyComponent={() => (
          <EmptyHabitState
            title="Oops! No checkins yet"
            description="Looks like there’s nothing here. Change your filters or start your first check-in!"
          />
        )}
      />
    </View>
  );
};

export default Report;
