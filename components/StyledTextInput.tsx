import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function StyledTextInput(props: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = colorScheme === 'dark' ? styles.dark : styles.light;
  const themeColors = Colors[colorScheme];

  return (
    <TextInput
      {...props}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.input,
        theme,
        { borderColor: isFocused ? themeColors.accent : themeColors.border },
        props.style,
      ]}
      placeholderTextColor={Colors[colorScheme].inputPlaceholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    width: '100%',
    fontSize: 16,
    borderWidth: 1.5, // Add a border to show focus state
  },
  light: {
    backgroundColor: Colors.light.inputBackground,
    color: Colors.light.text,
  },
  dark: {
    backgroundColor: Colors.dark.inputBackground,
    color: Colors.dark.text,
  },
});