import { View, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { SizableText, Tabs, Separator } from "tamagui";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconsGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import EmojiSelector from "react-native-emoji-selector";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "@/constants/colors";
import { FontFamily } from "@/constants/fonts";

// List Life Styles Icon filtered
import IconLifeStylesList from "../../constants/icons";

// If want to use all icon of  MaterialIcons
const icons = Object.keys(MaterialIconsGlyphs);

const IconPickerModal = ({ isVisible, onClose, onSelectIcon }) => {
  const [selectedTab, setSelectedTab] = useState("tab1");
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
        <Tabs
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val)}
          orientation="horizontal"
          flexDirection="column"
          overflow="hidden"
        >
          <Tabs.List
            borderWidth="$0.25"
            borderColor="$borderColor"
            borderRadius="$4"
            separator={<Separator vertical />}
            // $maxMd={{ width: 300 }}
          >
            <Tabs.Tab
              flex={1}
              value="tab1"
              theme={selectedTab === "tab1" ? "accent" : "none"}
            >
              <SizableText fontFamily={FontFamily.Poppins.Bold}>
                ICON
              </SizableText>
            </Tabs.Tab>
            <Tabs.Tab
              flex={1}
              value="tab2"
              theme={selectedTab === "tab2" ? "accent" : "none"}
            >
              <SizableText fontFamily={FontFamily.Poppins.Bold}>
                EMOJI
              </SizableText>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Content value="tab1">
            <FlatList
              data={IconLifeStylesList} // use icons if want to use all icon list of  MaterialIcons
              keyExtractor={(item) => item}
              numColumns={5}
              contentContainerStyle={{
                justifyContent: "flex-start",
                marginTop: hp("2%"),
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
                  <MaterialIcons name={item} size={30} color="#5F6368" />
                </TouchableOpacity>
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <View
              style={{ width: "100%", height: "100%", marginTop: hp("2%") }}
            >
              <EmojiSelector
                showTabs={false}
                onEmojiSelected={(emoji) => {
                  onSelectIcon(emoji);
                  onClose();
                }}
                columns={6}
                showSectionTitles={false}
              />
            </View>
          </Tabs.Content>
        </Tabs>
      </View>
    </Modal>
  );
};

export default IconPickerModal;
