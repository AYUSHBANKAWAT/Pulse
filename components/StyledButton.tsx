import { Pressable, type PressableProps, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface StyledButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function StyledButton({ title, variant = 'primary', ...props }: StyledButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const variantStyles = {
    primary: {
      backgroundColor: themeColors.accent,
      textColor: themeColors.buttonText,
    },
    secondary: {
      backgroundColor: themeColors.cardBackground,
      textColor: themeColors.text,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: currentVariant.backgroundColor },
        pressed && styles.pressed,
        props.style,
      ]}>
      <Text style={[styles.text, { color: currentVariant.textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12, // Slightly more rounded for a modern feel
    marginVertical: 8,
    width: '100%',
  },
  text: {
    fontSize: 16, // A bit smaller for a cleaner look
    lineHeight: 21,
    fontWeight: '600', // Use semibold
    letterSpacing: 0.25,
  },
  pressed: { opacity: 0.8 },
});