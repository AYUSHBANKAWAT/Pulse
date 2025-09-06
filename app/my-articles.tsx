import { StyleSheet } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledText } from '@/components/StyledText';

export default function MyArticlesScreen() {
  return (
    <Screen contentContainerStyle={styles.container}>
      <StyledText style={styles.title}>My Articles & Drafts</StyledText>
      <StyledText>A list of your published and draft articles.</StyledText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
});