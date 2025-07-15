import { View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HabitContext } from "@/contexts/HabitContext";
import HabitHistoryList from "@/components/Habit/HabitHistoryList";
import EmptyState from "@/components/UI/EmptyState";
import { useFilter } from "@/contexts/FilterContext";
import { Button } from "tamagui";
import { FilterRemove } from "iconsax-react-nativejs";
import COLORS from "@/constants/colors";
import DropdownMenu from "@/components/UI/DropdownMenu";
import dayjs from "dayjs";

const Report = () => {
  const navigation = useNavigation();
  const { currentHabit, loadHabitHistoryGrouped } = useContext(HabitContext);
  const [habitHistory, setHabitHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selectedRange, setSelectedRange] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedDates, applyFilter, setApplyFilter, setSelectedDates } =
    useFilter();

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
  }, [currentHabit?.id]);

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

  const filterLastNDays = (data, n) => {
    const today = dayjs();
    const cutoff = today.subtract(n - 1, "day");

    return data
      .map((monthData) => {
        const filteredDays = monthData.days.filter((d) =>
          dayjs(d.rawDate).isAfter(cutoff.subtract(1, "day"))
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
      setHasFiltered(true);
    }
  }, [applyFilter]);

  const ranges = [
    { label: "7 days", days: 7 },
    { label: "14 days", days: 14 },
    { label: "1 month", days: 30 },
    { label: "3 month", days: 90 },
    { label: "Showing all check-ins", days: "total" },
  ];

  const dataToRender =
    hasFiltered && Object.keys(selectedDates).length > 0
      ? filteredHistory
      : selectedRange === "total"
      ? habitHistory
      : filterLastNDays(habitHistory, selectedRange);
  return (
    <View style={{ backgroundColor: "#F2F1F5" }}>
      <DropdownMenu
        // label="Report for"
        data={ranges.map((r) => ({ label: r.label, value: r.days }))}
        color={currentHabit.color_code}
        selectedValue={selectedRange}
        onSelect={(item) => {
          setIsLoading(true);
          setSelectedRange(item.value);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }}
      />

      {isLoading ? (
        <View style={{ alignItems: "center", marginTop: hp("4%") }}>
          <ActivityIndicator />
        </View>
      ) : (
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
          }}
          ListEmptyComponent={() => (
            <EmptyState title="Oops! No checkins yet" />
          )}
        />
      )}

      {Object.keys(selectedDates).length > 0 && (
        <Button
          themeInverse
          onPress={() => {
            setSelectedDates({});
            setFilteredHistory([]);
            setHasFiltered(false);
          }}
          size="$4"
          style={{
            position: "absolute",
            bottom: hp("4%"),
            alignSelf: "center",
            zIndex: 10,
          }}
        >
          <FilterRemove size="20" color={COLORS.white} />
          Clear Filter
        </Button>
      )}
    </View>
  );
};

export default Report;
