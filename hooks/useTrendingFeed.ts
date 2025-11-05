import { firebaseDb, firebaseRealtimeDb } from '@/firebaseConfig';
import {
    limitToLast,
    onValue,
    orderByChild,
    query as realtimeQuery,
    ref,
} from '@react-native-firebase/database';
import { collection, query as firestoreQuery, limit, onSnapshot, orderBy, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export type TrendingItem = {
  id: string;
  type: 'article' | 'kudo' | 'survey';
  title: string;
  subtitle: string;
  createdAt: Date;
  onPress: () => void;
};

export function useTrendingFeed() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const articlesCol = collection(firebaseDb, 'articles');
    const kudosCol = collection(firebaseDb, 'kudos');
    const surveysRef = ref(firebaseRealtimeDb, '/chat/messages');

    const queries = [
      // Fetch latest 5 published articles
      firestoreQuery(articlesCol, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(5)),
      // Fetch latest 5 kudos
      firestoreQuery(kudosCol, orderBy('createdAt', 'desc'), limit(5)),
      // Fetch latest 20 chat messages to find surveys
      realtimeQuery(surveysRef, orderByChild('createdAt'), limitToLast(20)),
    ];

    const unsubscribers = [
      // Articles listener
      onSnapshot(
        queries[0],
        (snapshot) => {
          const articles = (snapshot?.docs ?? []).map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: 'article',
              title: `New Article: ${data.title}`,
              subtitle: `By ${data.authorName}`,
              createdAt: data.createdAt?.toDate() ?? new Date(),
              onPress: () => router.push(`/article/${doc.id}`),
            } as TrendingItem;
          });
          updateCombinedFeed('article', articles);
        },
        (error) => console.error('Error fetching articles:', error)
      ),

      // Kudos listener
      onSnapshot(
        queries[1],
        (snapshot) => {
          const kudos = (snapshot?.docs ?? []).map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: 'kudo',
              title: `${data.fromName} gave kudos to ${data.toName}`,
              subtitle: `"${data.message}"`,
              createdAt: data.createdAt?.toDate() ?? new Date(),
              onPress: () => router.push('/(tabs)/kudos'),
            } as TrendingItem;
          });
          updateCombinedFeed('kudo', kudos);
        },
        (error) => console.error('Error fetching kudos:', error)
      ),

      // Surveys listener (from Realtime DB)
      onValue(queries[2], (snapshot) => {
        const surveys: TrendingItem[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.type === 'survey') {
            surveys.push({
              id: childSnapshot.key!,
              type: 'survey',
              title: `New Poll: ${data.question}`,
              subtitle: `By ${data.author}`,
              createdAt: new Date(data.createdAt),
              onPress: () => router.push('/(tabs)/chat'),
            });
          }
        });
        // RTDB returns oldest first, so we reverse to get latest
        updateCombinedFeed('survey', surveys.reverse().slice(0, 5));
      }),
    ];

    const updateCombinedFeed = (source: string, items: TrendingItem[]) => {
      setTrendingItems((prevItems) => {
        // Filter out old items from the same source and add the new ones
        const newItems = prevItems.filter((item) => item.type !== source).concat(items);

        // Sort all items by date and take the latest 5
        newItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return newItems.slice(0, 5);
      });

      if (isLoading) {
        setIsLoading(false);
      }
    };

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  return { trendingItems, isLoading };
}