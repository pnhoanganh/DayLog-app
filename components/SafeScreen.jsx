import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";

const SafeScreen = ({ children, bgColor }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor:  bgColor ||  COLORS.white,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
