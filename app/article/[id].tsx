import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data - in a real app, this would be fetched from an API
const MOCK_ARTICLES = [
  { id: '1', title: 'Wellness Wednesday: Tips for a Healthy Work-Life Balance', author: 'Jane Doe', category: 'Wellness', type: 'company', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: '2', title: 'My Journey into React Native', author: 'John Smith', category: 'Tech Tips', type: 'user', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: '3', title: 'Q3 All-Hands Recap', author: 'CEO', category: 'Company News', type: 'company', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  { id: '4', title: 'How to Improve Team Culture', author: 'Emily White', category: 'Team Culture', type: 'user', content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
];

const MOCK_COMMENTS = [
    { id: 'c1', author: 'Alex Ray', text: 'Great tips, thanks for sharing!' },
    { id: 'c2', author: 'Mia Wong', text: 'This was a very insightful read.' },
];

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const accentColor = useThemeColor({}, 'accent');
  const separatorColor = useThemeColor({}, 'border');
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<(typeof MOCK_ARTICLES)[0] | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundArticle = MOCK_ARTICLES.find((a) => a.id === id);
      setArticle(foundArticle);
      setIsLoading(false);
    }, 1500); // Simulate network request
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return <ArticleDetailPlaceholder />;
  }

  if (!article) {
    return (
      <Screen contentContainerStyle={styles.container}>
        <StyledText style={styles.title}>Article Not Found</StyledText>
        <StyledButton title="Go Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Image source={{ uri: `https://picsum.photos/seed/${article.id}/400/200` }} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <StyledText style={styles.title}>{article.title}</StyledText>
        <StyledText style={styles.author}>By {article.author} • Published on Oct 26, 2023</StyledText>
        <StyledText style={styles.content}>{article.content}</StyledText>

        <View style={styles.reactionsContainer}>
            <Pressable style={styles.reactionButton}>
                <TabBarIcon name="thumbs-up-outline" color={accentColor} />
                <StyledText style={styles.reactionText}>12</StyledText>
            </Pressable>
            <Pressable style={styles.reactionButton}>
                <TabBarIcon name="heart-outline" color={accentColor} />
                <StyledText style={styles.reactionText}>8</StyledText>
            </Pressable>
            <Pressable style={styles.reactionButton}>
                <TabBarIcon name="sparkles-outline" color={accentColor} />
                <StyledText style={styles.reactionText}>5</StyledText>
            </Pressable>
        </View>

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        <StyledText style={styles.commentsTitle}>Comments ({MOCK_COMMENTS.length})</StyledText>
        {MOCK_COMMENTS.map(comment => (
            <Card key={comment.id} style={styles.commentCard}>
                <StyledText style={styles.commentAuthor}>{comment.author}</StyledText>
                <StyledText>{comment.text}</StyledText>
            </Card>
        ))}
        <StyledTextInput placeholder="Add a comment..." style={{ marginTop: 8 }}/>
        <StyledButton title="Post Comment" variant="secondary" style={{ width: 'auto', alignSelf: 'flex-end', paddingHorizontal: 16, height: 40 }} />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 24,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    opacity: 0.2,
    marginVertical: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentCard: {
    padding: 12,
    marginVertical: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
  }
});