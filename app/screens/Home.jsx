import { View } from "react-native";
import Header from "@/components/Layouts/Header";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AddHabitModal from "@/components/Feature/AddHabit";
import SafeScreen from "@/components/Layouts/SafeScreen";
import useToggleModal from "@/hooks/useToggleModal";
import { useContext } from "react";
import { HabitContext } from "@/hooks/HabitContext";
import HabitList from "@/components/Layouts/HabitList";
import EmptyHabitState from "@/components/Layouts/EmptyHabitState";

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
          <EmptyHabitState />
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
