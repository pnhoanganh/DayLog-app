export const FontFamily = {
  Poetsen: "PoetsenOne",
  Poppins: {
    Bold: "PoppinsBold",
    Medium: "PoppinsMedium",
    Regular: "PoppinsRegular",
  },
};

export const customFonts = {
  [FontFamily.Poetsen]: require("../assets/fonts/PoetsenOne-Regular.ttf"),
  [FontFamily.Poppins.Bold]: require("../assets/fonts/Poppins-Bold.ttf"),
  [FontFamily.Poppins.Medium]: require("../assets/fonts/Poppins-Medium.ttf"),
  [FontFamily.Poppins.Regular]: require("../assets/fonts/Poppins-Regular.ttf"),
};
