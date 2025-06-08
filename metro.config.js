const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

let config = getDefaultConfig(__dirname);

// SVG support
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// .db file support
config.resolver.assetExts.push("db");

// NativeWind
config = withNativeWind(config, { input: "./global.css" });

// Reanimated
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;
