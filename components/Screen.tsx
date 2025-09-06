import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';

export function Screen(props: ScrollViewProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ScrollView
      {...props}
      style={[{ backgroundColor, paddingTop: insets.top }, styles.container, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});