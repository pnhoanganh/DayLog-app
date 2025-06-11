import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { PortalProvider } from "tamagui";

const ModalFull = ({ visible, onClose, children }) => {
  return (
    <Modal
      isVisible={visible}
      animationOut="slideOutDown"
      style={{
        margin: 0,
        backgroundColor: "white",
      }}
      backdropOpacity={0.5}
      swipeDirection={[]}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      avoidKeyboard={false}
      propagateSwipe
    >
      <TouchableWithoutFeedback
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PortalProvider>
          <View>{children}</View>
        </PortalProvider>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalFull;
