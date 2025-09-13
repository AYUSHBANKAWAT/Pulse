import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Shimmer } from '@/components/Shimmer';

export function ArticleDetailPlaceholder() {
  return (
    <Screen style={styles.container}>
      <Shimmer style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <Shimmer style={styles.title} />
        <Shimmer style={styles.author} />
        <Shimmer style={styles.contentLine} />
        <Shimmer style={[styles.contentLine, { width: '95%' }]} />
        <Shimmer style={[styles.contentLine, { width: '80%' }]} />
        <Shimmer style={[styles.contentLine, { width: '90%' }]} />
        <Shimmer style={[styles.contentLine, { width: '60%' }]} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    height: 28,
    width: '90%',
    marginBottom: 12,
    borderRadius: 4,
  },
  author: {
    height: 14,
    width: '50%',
    marginBottom: 24,
    borderRadius: 4,
  },
  contentLine: {
    height: 16,
    width: '100%',
    marginBottom: 10,
    borderRadius: 4,
  },
});