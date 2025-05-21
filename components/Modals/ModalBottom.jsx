import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontFamily } from "@/constants/fonts";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

const ModalBottom = ({
  visible,
  onClose,
  disableClose = false,
  children,
  title,
}) => {
  const handleClose = () => {
    if (!disableClose) {
      onClose?.();
    }
  };
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection={disableClose ? [] : ["down"]}
      style={{ justifyContent: "flex-end", margin: 0 }}
      avoidKeyboard
      propagateSwipe // Allow the child modal to close by swiping down.
    >
      <LinearGradient
        colors={["#FFFFFF", "rgba(217, 217, 217, 0.7)"]}
        locations={[0.61, 1]} // 61% = 0.61, 100% = 1
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // From top to bottom
        style={{
          borderTopLeftRadius: wp("6%"),
          borderTopRightRadius: wp("6%"),
          paddingHorizontal: wp("8%"),
          paddingVertical: hp("4%"),
          height: hp("94%"),
        }}
      >
        <View className="flex justify-start items-center flex-row mb-8">
          <TouchableOpacity onPress={onClose} style={{ zIndex: 1 }}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: FontFamily.Poppins.SemiBold,
              fontSize: wp("5.5%"),
              textAlign: "center",
              flex: 1,
              marginLeft: -24,
            }}
          >
            {title}
          </Text>
        </View>

        <View>{children}</View>
      </LinearGradient>
    </Modal>
  );
};

export default ModalBottom;
