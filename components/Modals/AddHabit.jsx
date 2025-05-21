import { View, Text } from "react-native";
import ModalBottom from "./ModalBottom";
import IconSelector from "../InputComponents/IconSelector";
import { useState } from "react";
import TextInput from "../InputComponents/TextInputwLabel";

const AddHabitModal = ({ isOpen, onClose }) => {
  const [isIconModalOpen, setIconModalOpen] = useState(false);
  return (
    <ModalBottom
      visible={isOpen}
      onClose={onClose}
      disableClose={isIconModalOpen}
      title="New Habit"
    >
      <IconSelector
        isModalOpen={isIconModalOpen}
        setModalOpen={setIconModalOpen}
      />
      <View className="flex flex-col gap-4 mt-4">
        <TextInput label="New Habit" />
        <TextInput label="Description" />
      </View>
    </ModalBottom>
  );
};

export default AddHabitModal;
