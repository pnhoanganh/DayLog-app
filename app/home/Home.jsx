import { useContext } from "react";
import { View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useToggleModal from "@/hooks/useToggleModal";
import { HabitContext } from "@/hooks/HabitContext";
import HabitList from "@/components/Habit/HabitList";
import EmptyHabitState from "@/components/Habit//EmptyHabitState";
import AddHabitModal from "@/components/Habit/AddHabit";
import SafeScreen from "@/components/UI/SafeScreen";
import Header from "@/components/UI/Header";

const Home = () => {
  const addHabitModal = useToggleModal();
  const { habitList, resetHabitData } = useContext(HabitContext);

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("3%") }}>
        <Header
          toggleAddHabit={addHabitModal.open}
          resetHabitData={resetHabitData}
        />
        {habitList.length > 0 ? (
          <HabitList habitList={habitList} />
        ) : (
          <EmptyHabitState desciption=" Let’s tap the + button to start building your awesome routine!" />
        )}
        <AddHabitModal
          isOpen={addHabitModal.isOpen}
          onClose={() => {
            addHabitModal.close();
          }}
        />
      </View>
    </SafeScreen>
  );
};

export default Home;
