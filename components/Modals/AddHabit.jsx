import { View, Text, TouchableOpacity } from "react-native";
import ModalBottom from "./ModalBottom";
import IconSelector from "../InputComponents/IconSelector";
import { useState } from "react";
import TextInput from "../InputComponents/TextInputwLabel";
import ColorPicker from "../InputComponents/ColorPicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

const AddHabitModal = ({ isOpen, onClose }) => {
  const [isIconModalOpen, setIconModalOpen] = useState(false);
  return (
    <ModalBottom
      visible={isOpen}
      onClose={onClose}
      disableClose={isIconModalOpen}
      title="New Habit"
    >
      <View className="flex flex-col justify-between h-full">
        <View style={{ marginBottom: hp("6%") }}>
          {/* ICON PICKER */}
          <IconSelector
            isModalOpen={isIconModalOpen}
            setModalOpen={setIconModalOpen}
          />
          {/* TEXT INPUT */}
          <View className="flex flex-col gap-4 mt-4 mb-8">
            <TextInput label="New Habit" />
            <TextInput label="Description" />
          </View>
          {/* COLOR PICKER */}
          <ColorPicker />
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
          onPress={() => {}}
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
