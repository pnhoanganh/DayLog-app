import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import ModalBottom from "../Modals/ModalBottom";
import IconSelector from "../Forms/IconSelector";
import TextInput from "../Forms/TextInputwLabel";
import ColorPicker from "../Forms/ColorPicker";
import { useToastController } from "@tamagui/toast";
import { useSQLiteContext } from "expo-sqlite";
import uuid from "react-native-uuid";

const AddHabitModal = ({ isOpen, onClose }) => {
  const [isIconModalOpen, setIconModalOpen] = useState(false);
  const toast = useToastController();
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    color_code: "",
    icon: "",
  });
  const db = useSQLiteContext();
  const handleAddHabit = async () => {
    const newId = uuid.v4();
    const timestamp = new Date().toISOString();

    // Validate required fields
    if (!newHabit.title || typeof newHabit.title !== "string") {
      toast.show("Error", {
        message: "Habit name is required!",
        duration: 3000,
      });
      return;
    }

    const habitToSave = {
      habit_id: String(newId),
      title: String(newHabit.title),
      description: newHabit.description ? String(newHabit.description) : "",
      color_code: newHabit.color_code ? String(newHabit.color_code) : "#C3F0C8",
      icon: newHabit.icon ? String(newHabit.icon) : "add",
      created_at: String(timestamp),
      updated_at: String(timestamp),
    };

    // Log for debugging
    console.log("Inserting habit:", habitToSave);
    console.log("Types:", {
      habit_id: typeof habitToSave.habit_id,
      title: typeof habitToSave.title,
      description: typeof habitToSave.description,
      color_code: typeof habitToSave.color_code,
      icon: typeof habitToSave.icon,
      created_at: typeof habitToSave.created_at,
      updated_at: typeof habitToSave.updated_at,
    });

    try {
      await db.runAsync(
        "INSERT INTO habit (habit_id, title, description, color_code, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          habitToSave.habit_id,
          habitToSave.title,
          habitToSave.description,
          habitToSave.color_code,
          habitToSave.icon,
          habitToSave.created_at,
          habitToSave.updated_at,
        ]
      );

      setNewHabit({
        title: "",
        description: "",
        color_code: "",
        icon: "",
      });

      toast.show("Habit is saved 🥳", {
        message: "Nice work keeping up the habit!",
        duration: 3000,
      });

      setTimeout(onClose, 100);
    } catch (error) {
      console.error("Failed to save habit:", error, error.stack);
      toast.show("Error", {
        message: "Failed to save habit. Please try again.",
        duration: 3000,
      });
    }
  };

  // const [habitTitle, setHabitTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [selectedIcon, setSelectedIcon] = useState("");
  // const [selectedColor, setSelectedColor] = useState("");

  // const handleAddHabit = async () => {
  //   // Create new habit object
  //   const newHabit = {
  //     // id: uuidv4(),
  //     id: Date.now(),
  //     title: habitTitle,
  //     description: description,
  //     icon: selectedIcon || "add",
  //     color: selectedColor || "#C3F0C8",
  //   };

  //   try {
  //     // Get old habits list (if any)
  //     const existingHabits = await AsyncStorage.getItem("habits");
  //     const habits = existingHabits ? JSON.parse(existingHabits) : [];

  //     // Adding new habits
  //     const updateHabits = [...habits, newHabit];

  //     // Storing habits
  //     await AsyncStorage.setItem("habits", JSON.stringify(updateHabits));
  //     // Reset form (modal sẽ đóng bên ngoài sau 100ms)
  //     setHabitTitle("");
  //     setDescription("");
  //     setSelectedColor("");
  //     setSelectedIcon("");

  //     toast.show("Habit is saved 🥳", {
  //       message: "Nice work keeping up the habit!",
  //       duration: 3000,
  //     });

  //     setTimeout(() => {
  //       onClose();
  //     }, 100);
  //   } catch (error) {
  //     console.error("Failed to save habit:", error);
  //   }
  // };
  return (
    <ModalBottom
      visible={isOpen}
      onClose={() => {
        // reset form when modal close
        // setHabitTitle("");
        // setDescription("");
        // setSelectedColor("");
        // setSelectedIcon("");
        onClose();
      }}
      disableClose={isIconModalOpen}
      title="New Habit"
    >
      <View className="flex flex-col justify-between h-full">
        <View style={{ marginBottom: hp("6%") }}>
          {/* ICON PICKER */}
          <IconSelector
            isModalOpen={isIconModalOpen}
            setModalOpen={setIconModalOpen}
            // selectedIcon={selectedIcon}
            // setSelectedIcon={setSelectedIcon}
            selectedIcon={newHabit.icon}
            setSelectedIcon={(icon) => {
              setNewHabit((prev) => ({ ...prev, icon }));
            }}
          />
          {/* TEXT INPUT */}
          <View className="flex flex-col gap-4 mt-4 mb-8">
            <TextInput
              label="New Habit"
              // value={habitTitle}
              // onChangeText={setHabitTitle}
              value={newHabit.title}
              onChangeText={(text) =>
                setNewHabit((prev) => ({ ...prev, title: text }))
              }
            />
            <TextInput
              label="Description"
              value={newHabit.description}
              onChangeText={(text) =>
                setNewHabit((prev) => ({ ...prev, description: text }))
              }
            />
          </View>
          {/* COLOR PICKER */}
          <ColorPicker
            selectedColor={newHabit.color_code}
            setSelectedColor={(color) => {
              setNewHabit((prev) => ({ ...prev, color_code: color }));
            }}
          />
        </View>
        {/* BUTTON  */}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.black,
            height: hp("5.5%"),
            width: wp("84%"),
            borderRadius: 8,
            bottom: hp("-2.2%"),
          }}
          onPress={handleAddHabit}
        >
          <Text
            style={{
              fontFamily: FontFamily.Poppins.Regular,
              fontSize: hp("2.2%"),
              textAlign: "center",
              color: COLORS.white,
              marginVertical: "auto",
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
        <View />
      </View>
    </ModalBottom>
  );
};

export default AddHabitModal;
