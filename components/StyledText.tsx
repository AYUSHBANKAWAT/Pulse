import { Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function StyledText(props: TextProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const color = Colors[colorScheme].text;

  return <Text {...props} style={[{ color }, props.style]} />;
}