import { View } from "react-native";
import Header from "@/components/Layouts/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddHabitModal from "@/components/AddHabit";
import SafeScreen from "@/components/Layouts/SafeScreen";
import useToggleModal from "@/hooks/useToggleModal";

const HomeScreen = () => {
  const addHabitModal = useToggleModal();

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("3%") }}>
        <Header toggleAddHabit={addHabitModal.open} />

        <AddHabitModal
          isOpen={addHabitModal.isOpen}
          onClose={addHabitModal.close}
        />
      </View>
    </SafeScreen>
  );
};

export default HomeScreen;
