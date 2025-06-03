import React from "react";
import { View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";

const ModalFull = ({ visible, onClose, children }) => {
  return (
    <View style={{ zIndex: 99 }}>
      <Modal
        isVisible={visible}
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        backdropOpacity={0.5}
        swipeDirection={[]}
        onBackdropPress={() => {}}
        onBackButtonPress={() => {}}
        avoidKeyboard
        propagateSwipe
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: wp("6%"),
            borderTopRightRadius: wp("6%"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      </Modal>
    </View>
  );
};

export default ModalFull;
