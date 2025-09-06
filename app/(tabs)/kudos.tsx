import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { KudoItemPlaceholder } from '@/components/placeholders/KudoItemPlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock Data - In a real app, this would come from your API
const MOCK_LEADERBOARD = [
  { id: '1', name: 'Jane Doe', kudos: 125, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '2', name: 'John Smith', kudos: 110, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: '3', name: 'Alex Ray', kudos: 98, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

const MOCK_KUDOS_FEED = [
  { id: 'k1', from: 'Mia Wong', to: 'John Smith', message: 'Thanks for helping me out with the presentation, you saved the day!', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
  { id: 'k2', from: 'CEO', to: 'The entire Engineering Team', message: 'Incredible work on the Q3 launch. Your dedication and hard work are truly appreciated.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
  { id: 'k3', from: 'Jane Doe', to: 'Alex Ray', message: 'Your positive attitude is contagious and makes our team a better place to work!', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
];

export default function KudosScreen() {
  const accentColor = useThemeColor({}, 'accent');
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [kudosFeed, setKudosFeed] = useState<(typeof MOCK_KUDOS_FEED)>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKudosFeed(MOCK_KUDOS_FEED);
      setIsLoading(false);
    }, 1500); // Simulate network request
    return () => clearTimeout(timer);
  }, []);

  const renderKudoItem = ({ item }: { item: (typeof MOCK_KUDOS_FEED)[0] }) => (
    <Card style={styles.kudoCard}>
      <View style={styles.kudoHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <StyledText style={styles.kudoAuthor} numberOfLines={2}>
            <StyledText style={{ fontWeight: 'bold' }}>{item.from}</StyledText> gave kudos to <StyledText style={{ fontWeight: 'bold' }}>{item.to}</StyledText>
          </StyledText>
        </View>
      </View>
      <StyledText style={styles.kudoMessage}>{item.message}</StyledText>
    </Card>
  );

  const ListHeader = () => (
    <>
      <StyledText style={styles.header}>Kudos & Recognition</StyledText>
      <StyledButton title="Give Kudos" onPress={() => router.push('/give-kudos')} />
      <Card>
        <StyledText style={styles.cardTitle}>Top Employees</StyledText>
        {MOCK_LEADERBOARD.map((item, index) => (
          <View key={item.id} style={styles.leaderboardItem}>
            <StyledText style={styles.leaderboardRank}>{index + 1}</StyledText>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <StyledText style={styles.leaderboardName}>{item.name}</StyledText>
            <StyledText style={[styles.leaderboardKudos, { color: accentColor }]}>
              {item.kudos} Kudos
            </StyledText>
          </View>
        ))}
      </Card>
      <StyledText style={styles.feedTitle}>Recent Shoutouts</StyledText>
    </>
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <FlatList
        data={isLoading ? Array.from({ length: 3 }) : kudosFeed}
        renderItem={isLoading ? () => <KudoItemPlaceholder /> : renderKudoItem}
        keyExtractor={(item, index) => (isLoading ? index.toString() : item.id)}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  leaderboardKudos: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  kudoCard: {
    padding: 16,
  },
  kudoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  kudoAuthor: {
    fontSize: 15,
    lineHeight: 20,
  },
  kudoMessage: {
    fontSize: 16,
    lineHeight: 22,
  },
});