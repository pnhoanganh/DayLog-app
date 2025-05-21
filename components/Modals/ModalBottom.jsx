import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontFamily } from "@/constants/fonts";
import Modal from "react-native-modal";

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
      propagateSwipe // allow child modal can swipe
    >
      <View
        style={{
          backgroundColor: COLORS.white,
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
      </View>
    </Modal>
  );
};

export default ModalBottom;
