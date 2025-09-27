module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin has been moved to 'react-native-worklets'
      'react-native-worklets/plugin',
    ],
  };
};