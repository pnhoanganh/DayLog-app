import { View, TouchableOpacity, FlatList } from "react-native";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";

// List Life Styles Icon filtered
import IconLifeStylesList from "../../constants/icons";

// If want to use all icon of  MaterialIcons
const icons = Object.keys(MaterialIconsGlyphs);

const IconPickerModal = ({ isVisible, onClose, onSelectIcon }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection={["down"]}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderTopLeftRadius: wp("6%"),
          borderTopRightRadius: wp("6%"),
          height: hp("92%"),
          paddingHorizontal: wp("6%"),
          paddingVertical: hp("3%"),
        }}
      >
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: "#ccc",
            alignSelf: "center",
            marginBottom: hp("2%"),
          }}
        />

        <FlatList
          data={IconLifeStylesList} // use icons if want to use all icon list of  MaterialIcons
          keyExtractor={(item) => item}
          numColumns={5}
          contentContainerStyle={{
            justifyContent: "flex-start",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelectIcon(item);
                onClose();
              }}
              style={{
                padding: 10,
                width: "20%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name={item} size={30} color="#333" />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

export default IconPickerModal;
