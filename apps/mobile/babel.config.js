// babel-preset-expo ya incluye automáticamente el plugin de react-native-reanimated,
// así que NO lo añadimos a mano (evita el error de "plugin duplicado").
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
