import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { KudoItemPlaceholder } from '@/components/placeholders/KudoItemPlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { UserProfile } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { collection, limit, orderBy, query } from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

interface Kudo {
  id: string;
  fromId: string;
  fromName: string;
  toName: string;
  message: string;
  createdAt: any;
}

export default function KudosScreen() {
  const accentColor = useThemeColor({}, 'accent');
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [kudosFeed, setKudosFeed] = useState<Kudo[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      const kudosQuery = query(collection(firebaseDb, 'kudos'), orderBy('createdAt', 'desc'));
      const unsubscribeKudos = kudosQuery.onSnapshot((snapshot) => {
        const fetchedKudos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Kudo);
        setKudosFeed(fetchedKudos);
        setIsLoading(false); // Can set loading false here
      });

      const leaderboardQuery = query(
        collection(firebaseDb, 'users'),
        orderBy('kudosReceived', 'desc'),
        limit(3)
      );
      const unsubscribeLeaderboard = leaderboardQuery.onSnapshot((snapshot) => {
        const fetchedUsers = snapshot.docs.map((doc) => doc.data() as UserProfile);
        setLeaderboard(fetchedUsers);
      });

      return () => {
        unsubscribeKudos();
        unsubscribeLeaderboard();
      };
    }, [])
  );

  const renderKudoItem = ({ item }: { item: Kudo }) => (
    <Card style={styles.kudoCard}>
      <View style={styles.kudoHeader}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${item.fromId}` }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <StyledText style={styles.kudoAuthor} numberOfLines={2}>
            <StyledText style={{ fontWeight: 'bold' }}>{item.fromName}</StyledText> gave kudos to{' '}
            <StyledText style={{ fontWeight: 'bold' }}>{item.toName}</StyledText>
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
        {leaderboard.map((item, index) => (
          <View key={item.uid} style={styles.leaderboardItem}>
            <StyledText style={styles.leaderboardRank}>{index + 1}</StyledText>
            <Image
              source={{ uri: `https://i.pravatar.cc/150?u=${item.uid}` }}
              style={styles.avatar}
            />
            <StyledText style={styles.leaderboardName}>{item.fullName}</StyledText>
            <StyledText style={[styles.leaderboardKudos, { color: accentColor }]}>
              {item.kudosReceived} Kudos
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