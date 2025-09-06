import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Shimmer } from '@/components/Shimmer';

export function KudoItemPlaceholder() {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Shimmer style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Shimmer style={styles.line1} />
          <Shimmer style={styles.line2} />
        </View>
      </View>
      <Shimmer style={styles.message1} />
      <Shimmer style={styles.message2} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  line1: {
    height: 15,
    width: '70%',
    marginBottom: 6,
    borderRadius: 4,
  },
  line2: {
    height: 15,
    width: '40%',
    borderRadius: 4,
  },
  message1: {
    height: 16,
    width: '90%',
    marginBottom: 6,
    borderRadius: 4,
  },
  message2: {
    height: 16,
    width: '60%',
    borderRadius: 4,
  },
});