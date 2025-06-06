import { View } from "react-native";
import Header from "@/components/Layouts/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddHabitModal from "@/components/Feature/AddHabit";
import SafeScreen from "@/components/Layouts/SafeScreen";
import useToggleModal from "@/hooks/useToggleModal";
import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckinHabit } from "@/hooks/checkinHabit";
import HabitList from "@/components/Feature/HabitList";

const Home = () => {
  const addHabitModal = useToggleModal();
  const [habitList, setHabitList] = useState([]);
  const { habitData, setHabitData } = useContext(CheckinHabit);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem("habits");
      const habitList = stored ? JSON.parse(stored) : [];
      setHabitList(habitList);
      // Initialize habitData for new habits
      const updatedHabitData = { ...habitData };
      habitList.forEach((habit) => {
        if (!updatedHabitData[habit.id]) {
          updatedHabitData[habit.id] = [];
        }
      });
      setHabitData(updatedHabitData); // Update context
      await AsyncStorage.setItem("habitData", JSON.stringify(updatedHabitData));
    } catch (error) {
      console.error("Error loading habit list:", error);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleDeleteHabit = async (id) => {
    try {
      // Update habitList
      const updatedList = habitList.filter((habit) => habit.id !== id);
      setHabitList(updatedList);
      await AsyncStorage.setItem("habits", JSON.stringify(updatedList));

      // Update habitData
      const updatedHabitData = { ...habitData };
      delete updatedHabitData[id];
      setHabitData(updatedHabitData); // Update context
      await AsyncStorage.setItem("habitData", JSON.stringify(updatedHabitData));
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again.");
    }
  };

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("3%") }}>
        <Header toggleAddHabit={addHabitModal.open} />
        <HabitList
          habitList={habitList}
          handleDeleteHabit={handleDeleteHabit}
        />
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
