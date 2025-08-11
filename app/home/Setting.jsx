import { View, Text, TouchableOpacity, Switch } from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ArrowLeft2 } from "iconsax-react-nativejs";
import { FontFamily } from "@/constants/fonts";
import { router } from "expo-router";
import SafeScreen from "@/components/UI/SafeScreen";
import { XStack, YStack, RadioGroup } from "tamagui";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import COLORS from "@/constants/colors";
import { HabitContext } from "@/contexts/HabitContext";
import useToggleModal from "@/hooks/useToggleModal";
import { AlertWarn } from "@/components/Alert/AlertWarn";
import { useToastController } from "@tamagui/toast";
import { ThemeContext } from "@/contexts/ThemeContext";

const Setting = () => {
  const { resetHabitData } = useContext(HabitContext);
  const resetConfirmModal = useToggleModal();
  const toast = useToastController();
  const { theme, toggleTheme, isSystemTheme } = useContext(ThemeContext);
  return (
    <SafeScreen>
      <View style={{ flex: 1, paddingTop: hp("2%") }}>
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: wp("25%"),
            marginHorizontal: wp("4%"),
            marginBottom: hp("4%"),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push("/home/Home");
            }}
          >
            <ArrowLeft2
              size="32"
              color={theme === "dark" ? COLORS.white : COLORS.black}
              variant="Outline"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: FontFamily.Poetsen,
              fontSize: hp("3.5%"),
              color: theme === "dark" ? COLORS.white : COLORS.black,
            }}
          >
            Setting
          </Text>
        </View>
        {/* Theme Switch */}
        <View style={{ marginHorizontal: wp("8%"), gap: hp("2%") }}>
          <YStack gap={"$2"}>
            <Text
              style={{
                fontFamily: FontFamily.Poppins.SemiBold,
                fontSize: 16,
                color: theme === "dark" ? COLORS.white : COLORS.black,
              }}
            >
              Theme Switch
            </Text>
            <XStack
              style={{
                paddingVertical: hp("2%"),
                paddingHorizontal: wp("4%"),
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: COLORS.gray,
                borderWidth: 1,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 5,
                backgroundColor:
                  theme === "dark" ? COLORS.darkBlue : COLORS.white,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Poppins.Regular,
                  fontSize: 14,
                  color: theme === "dark" ? COLORS.white : COLORS.black,
                }}
              >
                Dark mode
              </Text>
              <Switch
                value={theme === "dark"}
                onValueChange={() => {
                  toggleTheme(theme === "light" ? "dark" : "light");
                }}
              />
            </XStack>
          </YStack>
          <YStack gap={"$2"}>
            <Text
              style={{
                fontFamily: FontFamily.Poppins.SemiBold,
                fontSize: 16,
                color: theme === "dark" ? COLORS.white : COLORS.black,
              }}
            >
              Theme Setting
            </Text>
            <RadioGroup
              value={isSystemTheme ? "system" : theme}
              onValueChange={(val) => toggleTheme(val)}
              gap="$3"
            >
              <XStack
                style={{
                  paddingVertical: hp("2%"),
                  paddingHorizontal: wp("4%"),
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: COLORS.gray,
                  borderWidth: 1,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5,
                  backgroundColor:
                    theme === "dark" ? COLORS.darkBlue : COLORS.white,
                }}
              >
                <XStack gap={"$2"} alignItems="center">
                  <Feather
                    name="sun"
                    size={20}
                    color={theme === "dark" ? COLORS.white : COLORS.black}
                  />
                  <Text
                    style={{
                      fontFamily: FontFamily.Poppins.Regular,
                      fontSize: 14,
                      color: theme === "dark" ? COLORS.white : COLORS.black,
                    }}
                  >
                    Light
                  </Text>
                </XStack>
                <RadioGroup.Item value="light" id="light-radio">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
              </XStack>
              <XStack
                style={{
                  paddingVertical: hp("2%"),
                  paddingHorizontal: wp("4%"),
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: COLORS.gray,
                  borderWidth: 1,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5,
                  backgroundColor:
                    theme === "dark" ? COLORS.darkBlue : COLORS.white,
                }}
              >
                <XStack gap={"$2"} alignItems="center">
                  <MaterialIcons
                    name="dark-mode"
                    size={20}
                    color={theme === "dark" ? COLORS.white : COLORS.black}
                  />
                  <Text
                    style={{
                      fontFamily: FontFamily.Poppins.Regular,
                      fontSize: 14,
                      color: theme === "dark" ? COLORS.white : COLORS.black,
                    }}
                  >
                    Dark
                  </Text>
                </XStack>
                <RadioGroup.Item value="dark" id="dark-radio">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
              </XStack>
              <XStack
                style={{
                  paddingVertical: hp("2%"),
                  paddingHorizontal: wp("4%"),
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: COLORS.gray,
                  borderWidth: 1,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 5,
                  backgroundColor:
                    theme === "dark" ? COLORS.darkBlue : COLORS.white,
                }}
              >
                <XStack gap={"$2"} alignItems="center">
                  <MaterialCommunityIcons
                    name="theme-light-dark"
                    size={20}
                    color={theme === "dark" ? COLORS.white : COLORS.black}
                  />
                  <Text
                    style={{
                      fontFamily: FontFamily.Poppins.Regular,
                      fontSize: 14,
                      color: theme === "dark" ? COLORS.white : COLORS.black,
                    }}
                  >
                    System
                  </Text>
                </XStack>
                <RadioGroup.Item value="system" id="system-radio">
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
              </XStack>
            </RadioGroup>
          </YStack>
        </View>

        {/* RESET DATA */}
        <TouchableOpacity
          style={{
            marginTop: hp("10%"),
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={resetConfirmModal.open}
        >
          <Text
            style={{
              padding: 10,
              backgroundColor: COLORS.red,
              color: COLORS.white,
            }}
          >
            RESET DATA
          </Text>
        </TouchableOpacity>
        <AlertWarn
          isOpen={resetConfirmModal.isOpen}
          setIsOpen={resetConfirmModal.toggle}
          msg="Do you really want to reset checkins data in the app?"
          action={() => {
            resetHabitData();
            toast.show(`Successfully removed checkins data`, {
              message: "Let's start a new journey",
              duration: 3000,
            });
          }}
        />
      </View>
    </SafeScreen>
  );
};

export default Setting;
