import { View, ActivityIndicator } from "react-native";
import Header from "@/components/Layouts/Header";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AddHabitModal from "@/components/Feature/AddHabit";
import SafeScreen from "@/components/Layouts/SafeScreen";
import useToggleModal from "@/hooks/useToggleModal";
import { useEffect, useState, useContext } from "react";
import { CheckinHabit } from "@/hooks/checkinHabit";
import HabitList from "@/components/Layouts/HabitList";
import EmptyHabitState from "@/components/Layouts/EmptyHabitState";
import { useSQLiteContext } from "expo-sqlite";

const Home = () => {
  const addHabitModal = useToggleModal();
  const [habitList, setHabitList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { habitData, setHabitData } = useContext(CheckinHabit);
  const db = useSQLiteContext();

  const loadHabits = async () => {
    try {
      const habits = await db.getAllAsync(`SELECT * FROM habit`);
      const checkIns = await db.getAllAsync(`SELECT * FROM check_ins_log`);

      const updatedHabitData = {};
      habits.forEach((habit) => {
        updatedHabitData[habit.habit_id] = checkIns
          .filter((log) => log.habit_id === habit.habit_id)
          .map((log) => ({
            log_id: log.log_id,
            count: log.count,
            created_at: log.created_at,
            updated_at: log.updated_at,
          }));
      });

      setHabitList(habits);
      setHabitData(updatedHabitData);
    } catch (error) {
      console.log("Database error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const resetHabitData = async () => {
    try {
      await db.runAsync("DELETE FROM check_ins_log");
      setHabitData({});
    } catch (error) {
      console.error("Error resetting habit data:", error);
      alert("Failed to reset habit data. Please try again.");
    }
  };

  const handleDeleteHabit = async (habit_id) => {
    try {
      await db.runAsync("DELETE FROM habit WHERE habit_id = ?", [habit_id]);
      await db.runAsync("DELETE FROM check_ins_log WHERE habit_id = ?", [
        habit_id,
      ]);

      const updatedList = habitList.filter(
        (habit) => habit.habit_id !== habit_id
      );
      setHabitList(updatedList);

      const updatedHabitData = { ...habitData };
      delete updatedHabitData[habit_id];
      setHabitData(updatedHabitData);
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again.");
    }
  };

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("3%") }}>
        <Header
          toggleAddHabit={addHabitModal.open}
          resetHabitData={resetHabitData}
        />
        {habitList.length > 0 ? (
          <HabitList
            habitList={habitList}
            handleDeleteHabit={handleDeleteHabit}
          />
        ) : (
          <EmptyHabitState />
        )}
        <AddHabitModal
          isOpen={addHabitModal.isOpen}
          onClose={() => {
            addHabitModal.close();
            loadHabits();
          }}
        />
      </View>
    </SafeScreen>
  );
};

export default Home;
