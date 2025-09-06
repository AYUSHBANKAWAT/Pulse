import { Card } from '@/components/Card';
import { ArticleCardPlaceholder } from '@/components/placeholders/ArticleCardPlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_ARTICLES = [
  { id: '1', title: 'Wellness Wednesday: Tips for a Healthy Work-Life Balance', author: 'Jane Doe', category: 'Wellness', type: 'company' },
  { id: '2', title: 'My Journey into React Native', author: 'John Smith', category: 'Tech Tips', type: 'user' },
  { id: '3', title: 'Q3 All-Hands Recap', author: 'CEO', category: 'Company News', type: 'company' },
  { id: '4', title: 'How to Improve Team Culture', author: 'Emily White', category: 'Team Culture', type: 'user' },
];

const CATEGORIES = ['All', 'Wellness', 'Tech Tips', 'Team Culture', 'Company News'];

export default function ArticlesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<(typeof MOCK_ARTICLES)>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(MOCK_ARTICLES);
      setIsLoading(false);
    }, 1500); // Simulate network request
    return () => clearTimeout(timer);
  }, []);

  const renderArticle = ({ item }: { item: (typeof MOCK_ARTICLES)[0] }) => (
    <Pressable onPress={() => router.push(`/article/${item.id}`)}>
      <Card style={styles.articleCard}>
        <StyledText style={styles.articleTitle}>{item.title}</StyledText>
        <StyledText style={styles.articleAuthor}>
          By {item.author} in <StyledText style={{ fontWeight: 'bold' }}>{item.category}</StyledText>
        </StyledText>
        {item.type === 'company' && (
          <View style={[styles.badge, { backgroundColor: Colors[colorScheme].accent }]}>
            <StyledText style={[styles.badgeText, { color: Colors[colorScheme].buttonText }]}>
              Official
            </StyledText>
          </View>
        )}
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
              <StyledButton key={cat} title={cat} variant="secondary" style={styles.categoryButton} />
            ))}
          </ScrollView>
        </View>
    </View>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <FlatList
          data={isLoading ? Array.from({ length: 4 }) : articles}
          renderItem={isLoading ? () => <ArticleCardPlaceholder /> : renderArticle}
          keyExtractor={(item, index) => (isLoading ? index.toString() : item.id)}
          ListHeaderComponent={ListHeader}
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