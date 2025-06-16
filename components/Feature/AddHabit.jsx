import { View, Text, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import ModalBottom from "../Modals/ModalBottom";
import IconSelector from "../Forms/IconSelector";
import TextInput from "../Forms/TextInputwLabel";
import ColorPicker from "../Forms/ColorPicker";
import { HabitContext } from "../../hooks/HabitContext";

const AddHabitModal = ({ isOpen, onClose }) => {
  const { handleAddHabit, errorMessage, setErrorMessage, isError, setIsError } =
    useContext(HabitContext);
  const [isIconModalOpen, setIconModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    color_code: "",
    icon: "",
  });
  return (
    <ModalBottom
      visible={isOpen}
      onClose={() => {
        onClose();
        setTimeout(() => {
          setErrorMessage("");
          setIsError(false);
        }, 1000);
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
            selectedIcon={newHabit.icon}
            setSelectedIcon={(icon) => {
              setNewHabit((prev) => ({ ...prev, icon }));
            }}
          />
          {/* TEXT INPUT */}
          <View className="flex flex-col gap-4 mt-4 mb-8">
            <View className="gap-1">
              <TextInput
                label="New Habit *"
                value={newHabit.title}
                onChangeText={(text) =>
                  setNewHabit((prev) => ({ ...prev, title: text }))
                }
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  borderColor: isError ? COLORS.red : COLORS.gray,
                }}
              />
              {isError && (
                <Text style={{ color: COLORS.red }}>{errorMessage}</Text>
              )}
            </View>
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
          onPress={async () => {
            const success = await handleAddHabit(newHabit);
            if (success) {
              setNewHabit({
                title: "",
                description: "",
                color_code: "",
                icon: "",
              });
              setErrorMessage("");
              setIsError(false);
              setTimeout(() => {
                onClose();
              }, 100);
            }
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
