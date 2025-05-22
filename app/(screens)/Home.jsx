import { View, FlatList, Text, TouchableOpacity } from "react-native";
import Header from "@/components/Layouts/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddHabitModal from "@/components/Modals/AddHabit";
import SafeScreen from "@/components/Layouts/SafeScreen";
import useToggleModal from "@/hooks/useToggleModal";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HabitItem from "@/components/HabitItem";

const HomeScreen = () => {
  const addHabitModal = useToggleModal();
  const [habitList, setHabitList] = useState([]);
  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem("habits");
      const habitList = stored ? JSON.parse(stored) : [];
      setHabitList(habitList);
    } catch (error) {
      console.error("Error to loading habit list: ", error);
    }
  };
  useEffect(() => {
    loadHabits();
  }, []);
  console.log(habitList);

  const handleDeleteHabit = async (id) => {
    const updateList = habitList.filter((habit) => habit.id !== id);
    setHabitList(updateList);
    await AsyncStorage.setItem("habits", JSON.stringify(updateList));
  };

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("3%") }}>
        <Header toggleAddHabit={addHabitModal.open} />
        <FlatList
          style={{ marginHorizontal: "auto", marginTop: hp("2%") }}
          data={habitList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HabitItem
              icon={item.icon}
              color={item.color}
              title={item.title}
              description={item.description}
              id={item.id}
              deleteHabit={handleDeleteHabit}
            />
          )}
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

export default HomeScreen;
