import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import IconPickerModal from "../Modals/IconPickerModal";

const IconSelector = ({ isModalOpen, setModalOpen }) => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  return (
    <View>
      <View className="opacity-55 relative items-center">
        <Image
          source={require("../../assets/images/iconSelectorBg.png")}
          style={{ width: wp("90%"), height: hp("18%") }}
        />
      </View>

      <TouchableOpacity
        onPress={() => setModalOpen(true)}
        className="absolute self-center border border-gray-400 rounded-full top-1/2 -translate-y-1/2"
        style={{ backgroundColor: COLORS.white, padding: wp("6%") }}
      >
        {selectedIcon ? (
          <MaterialIcons name={selectedIcon} size={40} color="#5F6368" />
        ) : (
          <MaterialIcons name="add" size={44} color="#5F6368" />
        )}
      </TouchableOpacity>

      <IconPickerModal
        isVisible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelectIcon={(iconName) => setSelectedIcon(iconName)}
      />
    </View>
  );
};

export default IconSelector;
