import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/Shimmer';

export function ChatMessagePlaceholder() {
  return (
    <View style={styles.messageContainer}>
      <Shimmer style={styles.avatar} />
      <View style={styles.messageContent}>
        <Shimmer style={styles.authorName} />
        <Shimmer style={styles.messageBubble} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
  },
  authorName: {
    height: 16,
    width: '30%',
    marginBottom: 6,
    borderRadius: 4,
  },
  messageBubble: {
    height: 50,
    width: '70%',
    borderRadius: 12,
  },
});