import { View, Text } from "react-native";
import ModalBottom from "./Modals/ModalBottom";
import IconSelector from "./InputComponents/IconSelector";
import { useState } from "react";

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
    </ModalBottom>
  );
};

export default AddHabitModal;
