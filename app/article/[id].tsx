import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ArticleDetailPlaceholder } from '@/components/placeholders/ArticleDetailPlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/services/toastService';
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import type { Article } from '../(tabs)/articles';

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: any; // Firestore Timestamp
}

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const accentColor = useThemeColor({}, 'accent');
  const separatorColor = useThemeColor({}, 'border');
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();


  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const docRef = doc(firebaseDb, 'articles', id as string);

    const unsubscribeArticle = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setArticle({ id: docSnap.id, ...docSnap.data() } as Article);
      } else {
        setArticle(undefined);
      }
      setIsLoading(false);
    });

    const commentsCollection = collection(docRef, 'comments');
    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'));

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {

      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Comment);
      setComments(fetchedComments);
    });

    return () => {
      unsubscribeArticle();
      unsubscribeComments();
    };
  }, [id]);


  const handleLike = async () => {
    if (!id || !user) return;
    const docRef = doc(firebaseDb, 'articles', id as string);
    try {
      await updateDoc(docRef, {
        likeCount: increment(1),
      });
    } catch (error) {
      console.error('Error liking article: ', error);
      toastService.showError('Could not like the article.');
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !user || !id) return;
    setIsPostingComment(true);
    try {
      const newCommentData = {
        text: newComment,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: serverTimestamp(),
      };
      console.log('Posting comment: ', newCommentData, id as string);
      const commentsCollection = collection(firebaseDb, 'articles', id as string, 'comments');
      await addDoc(commentsCollection, newCommentData);
      setNewComment(''); // Clear input
    } catch (error) {
      console.error('Error posting comment: ', error);
      toastService.showError('Could not post your comment.');
    } finally {
      setIsPostingComment(false);
    }
  };

  if (isLoading) {
    return <ArticleDetailPlaceholder />;
  }

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <StyledText style={styles.title}>Article Not Found</StyledText>
        <StyledButton title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView>
        <Image source={{ uri: `https://picsum.photos/seed/${article.id}/400/200` }} style={styles.coverImage} />
        <View style={styles.contentContainer}>
          <StyledText style={styles.title}>{article.title}</StyledText>
          <StyledText style={styles.author}>
            By {article.authorName} • Published on{' '}
            {article.createdAt?.toDate().toLocaleDateString() ?? '...'}
          </StyledText>
          <StyledText style={styles.content}>{article.content}</StyledText>

          <View style={styles.reactionsContainer}>
              <Pressable style={styles.reactionButton} onPress={handleLike}>
                  <TabBarIcon name="thumbs-up-outline" color={accentColor} />
                  <StyledText style={styles.reactionText}>{article.likeCount ?? 0}</StyledText>
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

          <StyledText style={styles.commentsTitle}>Comments ({comments.length})</StyledText>
          <View style={styles.commentInputContainer}>
            <StyledTextInput
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              style={{ flex: 1, marginVertical: 0, height: 40 }}
            />
            <StyledButton
              title="Post"
              onPress={handlePostComment}
              loading={isPostingComment}
              style={{ width: 'auto', alignSelf: 'flex-end', paddingHorizontal: 16, height: 40, marginLeft: 8, marginVertical: 0 }}
            />
          </View>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card key={item.id} style={styles.commentCard}>
                <StyledText style={styles.commentAuthor}>{item.authorName}</StyledText>
                <StyledText>{item.text}</StyledText>
              </Card>
            )}
            scrollEnabled={false} // Since it's inside a ScrollView
          />
        </View>
      </ScrollView>
    </View>
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
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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