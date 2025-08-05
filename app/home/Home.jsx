import { useContext, useEffect } from "react";
import { View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useToggleModal from "@/hooks/useToggleModal";
import { HabitContext } from "@/contexts/HabitContext";
import HabitList from "@/components/Habit/HabitList";
import EmptyState from "@/components/UI/EmptyState";
import AddHabitModal from "@/components/Habit/AddHabit";
import SafeScreen from "@/components/UI/SafeScreen";
import Header from "@/components/UI/Header";
import { ExtensionStorage } from "@bacons/apple-targets";

const widgetStorage = new ExtensionStorage("group.com.pnhoanganh.DayLogapp");
const Home = () => {
  const addHabitModal = useToggleModal();
  const { habitList, resetHabitData } = useContext(HabitContext);

  const saveHabitToWidget = async (habitList) => {
    if (habitList.length === 0) return;

    const firstHabit = habitList[0];

    // const data = {
    //   habitName: firstHabit.name,
    //   icon: firstHabit.icon || "🔥",
    //   lastCheckin: firstHabit.lastCheckin || "Never",
    // };

    widgetStorage.set("name", firstHabit.title);
    widgetStorage.set("icon", firstHabit.icon);
    console.log(firstHabit.title);
    ExtensionStorage.reloadWidget();
  };

  useEffect(() => {
    if (habitList.length > 0) {
      saveHabitToWidget(habitList);
    }
  }, [habitList]);

  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("1%") }}>
        <Header
          toggleAddHabit={addHabitModal.open}
          resetHabitData={resetHabitData}
        />
        {habitList.length > 0 ? (
          <HabitList habitList={habitList} />
        ) : (
          <EmptyState
            title="Oops! No habits yet"
            desciption=" Let’s tap the + button to start building your awesome routine!"
          />
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
