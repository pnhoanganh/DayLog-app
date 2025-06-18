import { View, Text, TouchableOpacity } from "react-native";
import { useState, useContext, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";
import { HabitContext } from "@/hooks/HabitContext";
import ModalBottom from "../Modals/ModalBottom";
import IconSelector from "../UI/IconSelector";
import TextInput from "../UI/TextInputwLabel";
import ColorPicker from "../UI/ColorPicker";

const EditHabitModal = ({ isOpen, onClose, habitToEdit }) => {
  const {
    handleUpdateHabit,
    errorMessage,
    setErrorMessage,
    isError,
    setIsError,
  } = useContext(HabitContext);
  const [isIconModalOpen, setIconModalOpen] = useState(false);

  const [updatedFields, setUpdatedFields] = useState({
    title: "",
    description: "",
    color_code: "",
    icon: "",
  });

  useEffect(() => {
    if (habitToEdit) {
      setUpdatedFields({
        title: habitToEdit.title || "",
        description: habitToEdit.description || "",
        color_code: habitToEdit.color_code || "",
        icon: habitToEdit.icon || "",
      });
    }
  }, [habitToEdit]);
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
      title="Edit Habit"
    >
      <View className="flex flex-col justify-between h-full">
        <View style={{ marginBottom: hp("6%") }}>
          {/* ICON PICKER */}
          <IconSelector
            isModalOpen={isIconModalOpen}
            setModalOpen={setIconModalOpen}
            selectedIcon={updatedFields.icon}
            setSelectedIcon={(icon) => {
              setUpdatedFields((prev) => ({ ...prev, icon }));
            }}
          />
          {/* TEXT INPUT */}
          <View className="flex flex-col gap-4 mt-4 mb-8">
            <View className="gap-1">
              <TextInput
                label="Habit *"
                value={updatedFields.title}
                onChangeText={(text) =>
                  setUpdatedFields((prev) => ({ ...prev, title: text }))
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
              value={updatedFields.description}
              onChangeText={(text) =>
                setUpdatedFields((prev) => ({ ...prev, description: text }))
              }
            />
          </View>
          {/* COLOR PICKER */}
          <ColorPicker
            selectedColor={updatedFields.color_code}
            setSelectedColor={(color) => {
              setUpdatedFields((prev) => ({ ...prev, color_code: color }));
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
            const success = await handleUpdateHabit(habitToEdit.habit_id, {
              title: updatedFields.title,
              description: updatedFields.description,
              color_code: updatedFields.color_code,
              icon: updatedFields.icon,
            });
            if (success) {
              setUpdatedFields({
                title: updatedFields.title,
                description: updatedFields.description,
                color_code: updatedFields.color_code,
                icon: updatedFields.icon,
              });
              setErrorMessage("");
              setIsError(false);
              setTimeout(() => {
                onClose(true);
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
            Update
          </Text>
        </TouchableOpacity>
        <View />
      </View>
    </ModalBottom>
  );
};

export default EditHabitModal;
