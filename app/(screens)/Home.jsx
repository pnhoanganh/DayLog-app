import { Text, View } from "react-native";
import { FontFamily } from "../../constants/fonts";

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-xl" style={{ fontFamily: FontFamily.Poetsen }}>
        Home Screen
      </Text>
    </View>
  );
};

export default HomeScreen;
