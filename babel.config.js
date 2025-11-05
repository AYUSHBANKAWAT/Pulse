module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      // Reanimated plugin has been moved to 'react-native-worklets'
      'react-native-worklets/plugin',
    ],
  };
};