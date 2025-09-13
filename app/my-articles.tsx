import { useAuth } from '@/context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { StyledText } from '@/components/StyledText';

// A simple type definition for your articles
type Article = {
  id: string;
  title: string;
  status: 'published' | 'draft';
  // Add other article fields here
};

export default function MyArticlesScreen() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // This sets up a real-time listener for the user's articles.
    // It uses a collectionGroup query, which is powerful but often requires a custom index.
    const unsubscribe = firestore()
      .collectionGroup('articles')
      .where('authorId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const userArticles: Article[] = [];
          querySnapshot.forEach((doc) => {
            userArticles.push({ id: doc.id, ...doc.data() } as Article);
          });
          setArticles(userArticles);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          // The most likely error here is the missing index!
          setError('Failed to fetch articles. You may need to create a Firestore index.');
          setLoading(false);
        }
      );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <ActivityIndicator style={styles.container} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.errorText}>{error}</StyledText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleItem}>
            <StyledText style={styles.articleTitle}>{item.title}</StyledText>
            <StyledText style={styles.articleStatus}>Status: {item.status}</StyledText>
          </View>
        )}
        ListHeaderComponent={
          <StyledText style={styles.title}>My Articles & Drafts</StyledText>
        }
        ListEmptyComponent={
          <StyledText style={styles.emptyText}>You haven't written any articles yet.</StyledText>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 20, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  articleItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  articleTitle: { fontSize: 18, fontWeight: '600' },
  articleStatus: { fontSize: 14, color: '#666', marginTop: 4 },
  errorText: { color: 'red', textAlign: 'center' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
});