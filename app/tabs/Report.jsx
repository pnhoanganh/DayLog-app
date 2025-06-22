import { View, FlatList } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HabitContext } from "@/hooks/HabitContext";
import HabitHistoryList from "@/components/Habit/HabitHistoryList";
import EmptyState from "../../components/UI/EmptyState";

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
          paddingTop: hp("1%"),
        }}
        ListEmptyComponent={() => <EmptyState title="Oops! No checkins yet" />}
      />
    </View>
  );
};

export default Report;
