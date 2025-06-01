import { View, Text, TouchableOpacity } from "react-native";
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
// import { v4 as uuidv4 } from "uuid";

const AddHabitModal = ({ isOpen, onClose }) => {
  const [isIconModalOpen, setIconModalOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const toast = useToastController();
  const handleAddHabit = async () => {
    // Create new habit object
    const newHabit = {
      // id: uuidv4(),
      id: Date.now(),
      title: habitTitle,
      description: description,
      icon: selectedIcon || "add",
      color: selectedColor || "#C3F0C8",
    };

    try {
      // Get old habits list (if any)
      const existingHabits = await AsyncStorage.getItem("habits");
      const habits = existingHabits ? JSON.parse(existingHabits) : [];

      // Adding new habits
      const updateHabits = [...habits, newHabit];

      // Storing habits
      await AsyncStorage.setItem("habits", JSON.stringify(updateHabits));
      // Reset form (modal sẽ đóng bên ngoài sau 100ms)
      setHabitTitle("");
      setDescription("");
      setSelectedColor("");
      setSelectedIcon("");

      toast.show("Habit is saved 🥳", {
        message: "Nice work keeping up the habit!",
        duration: 3000,
      });

      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Failed to save habit:", error);
    }
  };
  return (
    <ModalBottom
      visible={isOpen}
      onClose={() => {
        // reset form when modal close
        setHabitTitle("");
        setDescription("");
        setSelectedColor("");
        setSelectedIcon("");
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
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
          {/* TEXT INPUT */}
          <View className="flex flex-col gap-4 mt-4 mb-8">
            <TextInput
              label="New Habit"
              value={habitTitle}
              onChangeText={setHabitTitle}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              capitalize="none"
            />
          </View>
          {/* COLOR PICKER */}
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
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
          onPress={() => {
            // Nếu không nhập tên habit → hiện toast, không lưu, không đóng modal
            if (!habitTitle.trim()) {
              console.log("Habit name is required");
              return;
            }

            // Nếu hợp lệ thì lưu và đóng modal
            handleAddHabit();
          }}
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
