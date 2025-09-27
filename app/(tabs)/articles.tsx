import { Card } from '@/components/Card';
import { ArticleCardPlaceholder } from '@/components/placeholders/ArticleCardPlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { DropdownOption } from '@/components/StyledDropdown';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { Colors } from '@/constants/Colors';
import { firebaseDb } from '@/firebaseConfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface Article {
  id: string;
  title: string;
  authorName: string;
  category: string;
  status: 'published' | 'draft';
  createdAt: any; // Firestore Timestamp
  content: string;
  likeCount: number;
}
const CATEGORIES: DropdownOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Tech Tips', value: 'tech-tips' },
  { label: 'Team Culture', value: 'team-culture' },
  { label: 'Company News', value: 'company-news' },
];

export default function ArticlesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const backgroundColor = Colors[colorScheme].background;
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      let articlesQuery: any = firebaseDb()
        .collection('articles') // <-- Corrected call
        .where('status', '==', 'published');

      if (selectedCategory !== 'all') {
        articlesQuery = articlesQuery.where('category', '==', selectedCategory);
      }

      const unsubscribe = articlesQuery.orderBy('createdAt', 'desc').onSnapshot(
        (querySnapshot) => {
          const fetchedArticles = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Article
          );
          setArticles(fetchedArticles);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching articles: ', error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    }, [selectedCategory])
  );

  const renderArticle = ({ item }: { item: Article }) => (
    <Pressable onPress={() => router.push(`/article/${item.id}`)}>
      <Card style={styles.articleCard}>
        <StyledText style={styles.articleTitle}>{item.title}</StyledText>
        <StyledText style={styles.articleAuthor}>
          By {item.authorName} in <StyledText style={{ fontWeight: 'bold' }}>{item.category}</StyledText>
        </StyledText>
      </Card>
    </Pressable>
  );

  const ListHeader = () => (
    <View style={{ paddingHorizontal: 16 }}>
        <StyledText style={styles.header}>Articles</StyledText>
        <StyledTextInput placeholder="Search articles..." />
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {CATEGORIES.map((cat) => (
              <StyledButton
                key={cat.value}
                title={cat.label}
                variant={selectedCategory === cat.value ? 'primary' : 'secondary'}
                style={styles.categoryButton}
                onPress={() => setSelectedCategory(cat.value)}
              />
            ))}
          </ScrollView>
        </View>
    </View>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <StyledText style={styles.header}>Articles</StyledText>
        <StyledTextInput placeholder="Search articles..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => (
            <StyledButton
              key={cat.value}
              title={cat.label}
              variant={selectedCategory === cat.value ? 'primary' : 'secondary'}
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(cat.value)}
            />
          ))}
        </ScrollView>
      </View>
        <FlatList
          data={isLoading ? Array.from({ length: 4 }) : articles}  
          renderItem={isLoading ? () => <ArticleCardPlaceholder /> : renderArticle}
          keyExtractor={(item, index) => (isLoading ? index.toString() : item.id)}
          contentContainerStyle={{ paddingBottom: insets.top + 80 }}
        />
      </View>
      <Pressable style={[styles.fab, { backgroundColor: Colors[colorScheme].accent }]} onPress={() => router.push('/article/write')}>
        <StyledText style={[styles.fabText, { color: Colors[colorScheme].buttonText }]}>+</StyledText>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: 16,
    // Adapt height as needed
    paddingBottom: 8,
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
    // Elevation/shadow for iOS and Android if desired
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
    zIndex: 1,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    marginRight: 8,
    paddingHorizontal: 16,
    height: 40,
    width: 'auto',
  },
  articleCard: {
    padding: 16,
    marginHorizontal: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  articleAuthor: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
  },
  fabText: {
    fontSize: 36,
    lineHeight: 36,
  },
});