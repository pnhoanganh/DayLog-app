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
import { useFilter } from "@/hooks/FilterContext";

const Report = () => {
  const navigation = useNavigation();
  const { currentHabit, loadHabitHistoryGrouped } = useContext(HabitContext);
  const [habitHistory, setHabitHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const { selectedDates, applyFilter, setApplyFilter } = useFilter();

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

  const filterBySelectedDates = (data, selectedDates) => {
    const selectedKeys = Object.keys(selectedDates || {});
    if (selectedKeys.length === 0) return data;

    return data
      .map((monthData) => {
        const filteredDays = monthData.days.filter((d) =>
          selectedKeys.includes(d.rawDate)
        );

        if (filteredDays.length === 0) return null;

        return {
          ...monthData,
          days: filteredDays,
          total: filteredDays.reduce((sum, d) => sum + d.count, 0),
        };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (applyFilter) {
      const result = filterBySelectedDates(habitHistory, selectedDates);
      setFilteredHistory(result);
      setApplyFilter(false);
    }
  }, [applyFilter]);

  const dataToRender =
    applyFilter && selectedDates && Object.keys(selectedDates).length > 0
      ? filteredHistory
      : habitHistory;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataToRender}
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
