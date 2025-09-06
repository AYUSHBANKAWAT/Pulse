import { StyleSheet } from 'react-native';

import { Card } from '@/components/Card';
import { Shimmer } from '@/components/Shimmer';

export function ArticleCardPlaceholder() {
  return (
    <Card style={styles.card}>
      <Shimmer style={styles.title} />
      <Shimmer style={styles.subtitle} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
  },
  title: {
    height: 20,
    width: '80%',
    marginBottom: 8,
    borderRadius: 4,
  },
  subtitle: {
    height: 14,
    width: '50%',
    borderRadius: 4,
  },
});