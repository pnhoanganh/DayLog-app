import { TouchableOpacity } from "react-native";
import { useState, useCallback, useContext, useEffect } from "react";
import { Tabs, router, useFocusEffect } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { FilterAdd } from "iconsax-react-nativejs";
import { FontFamily } from "@/constants/fonts";
import BottomNav from "@/components/UI/BottomNav";
import { HabitContext } from "@/contexts/HabitContext";
import useToggleModal from "@/hooks/useToggleModal";
import { FilterCheckins } from "@/components/Modals/FilterCheckins";
import { FilterProvider } from "@/contexts/FilterContext";

export default function TabLayout() {
  const { habitList, currentHabit, loadHabitHistoryGrouped } =
    useContext(HabitContext);
  const [_, forceRerender] = useState(0);
  const filterModal = useToggleModal();
  const [habitHistory, setHabitHistory] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      forceRerender((prev) => prev + 1);
    }, [habitList])
  );

  useEffect(() => {
    const loadData = async () => {
      const result = await loadHabitHistoryGrouped(currentHabit?.id);
      setHabitHistory(result || []);
    };
    if (currentHabit?.id) {
      loadData();
    }
  }, [currentHabit?.id, loadHabitHistoryGrouped]);

  useEffect(() => {
    router.setParams({ selectedDates });
  }, [selectedDates]);

  return (
    <FilterProvider>
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
              headerTitle: currentHabit?.title,
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
              headerTitle: currentHabit?.title,
              tabBarLabel: "Analytics",
            };
          }}
        />
        <Tabs.Screen
          name="Report"
          initialParams={{ selectedDates }}
          options={({ route }) => {
            const habitId = route.params?.id;
            const currentHabit = habitList.find((h) => h.habit_id === habitId);
            return {
              headerTitle: currentHabit?.title,
              tabBarLabel: "Check-ins",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => filterModal.open()}
                  style={{ paddingRight: 15 }}
                >
                  <FilterAdd size="24" color="#000000" />
                </TouchableOpacity>
              ),
            };
          }}
        />
      </Tabs>
      <FilterCheckins
        open={filterModal.isOpen}
        setOpen={filterModal.toggle}
        snapPoints={[50]}
        data={habitHistory}
        onApplyDates={setSelectedDates}
      />
    </FilterProvider>
  );
}
