import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Text } from "@react-navigation/elements";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import tinycolor from "tinycolor2";
import { Element4 } from "iconsax-react-nativejs";
import { HabitContext } from "@/hooks/HabitContext";
import COLORS from "@/constants/colors";

const BottomNav = ({ state, descriptors, navigation }) => {
  const { currentHabit } = useContext(HabitContext);
  const activeColor = tinycolor(currentHabit.color_code)
    .darken(45)
    .toHexString();
  const getIconByName = ({ routeName, focused }) => {
    const iconSize = 24;
    const iconColor = COLORS.darkGray;

    switch (routeName) {
      case "HabitDetailPanel":
        return (
          <Element4
            size={iconSize}
            color={focused ? activeColor : iconColor}
            variant="Bold"
          />
        );
      case "Analytics":
        return (
          <MaterialCommunityIcons
            name="google-analytics"
            size={iconSize}
            color={focused ? activeColor : iconColor}
          />
        );
      case "Report":
        return (
          <AntDesign
            name="checkcircle"
            size={iconSize}
            color={focused ? activeColor : iconColor}
          />
        );

      default:
        return null;
    }
  };
  const styles = StyleSheet.create({
    tabBar: {
      flexDirection: "row",
      width: "100%",
      height: hp("9%"),
      backgroundColor: "tranparent",
      borderWidth: 1,
      borderColor: COLORS.gray,
      alignSelf: "center",
      position: "absolute",
      bottom: 0,
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "gray",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      paddingHorizontal: wp("12%"),
      paddingBottom: hp("2%"),
    },
    tabItem: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: wp("12%") / 2,
    },
    tabTitle: {
      marginLeft: 8,
      fontWeight: 500,
    },
  });

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            {getIconByName({
              routeName: route.name,
              focused: isFocused,
            })}
            {isFocused && (
              <Text style={[styles.tabTitle, { color: activeColor }]}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
