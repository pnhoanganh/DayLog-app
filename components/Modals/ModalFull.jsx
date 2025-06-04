import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";

const ModalFull = ({ visible, onClose, children }) => {
  return (
    <Modal
      isVisible={visible}
      animationOut="slideOutDown"
      style={{
        margin: 0,
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
      backdropOpacity={0.5}
      swipeDirection={[]}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      avoidKeyboard
      propagateSwipe
    >
      <TouchableWithoutFeedback
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>{children}</View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalFull;
