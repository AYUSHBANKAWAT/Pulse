import { StyleSheet, View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

export function Card(props: ViewProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const colorScheme = useThemeColor({}, 'background') === Colors.dark.background ? 'dark' : 'light';

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderWidth: colorScheme === 'light' ? 1 : 0,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20, // More padding
    borderRadius: 16, // More rounded
    marginVertical: 8,
  },
});