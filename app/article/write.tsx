import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { DropdownOption, StyledDropdown } from '@/components/StyledDropdown';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import firestore from '@react-native-firebase/firestore';

const ARTICLE_CATEGORIES: DropdownOption[] = [
  { label: 'Wellness', value: 'wellness' },
  { label: 'Tech Tips', value: 'tech-tips' },
  { label: 'Team Culture', value: 'team-culture' },
  { label: 'Company News', value: 'company-news' }
];
export default function WriteArticleScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { user } = useAuth();
  const [category, setCategory] = useState<DropdownOption | null>(null);

  const handleSave = async (status: 'published' | 'draft') => {
    if (!title || !content) {
      Alert.alert('Missing Fields', 'Please enter a title and some content before publishing.');
      return;
    }
    if (!user) {
      Alert.alert('Not Authenticated', 'You must be logged in to post an article.');
      return;
    }

    if (status === 'published') {
      setIsPublishing(true);
    } else {
      setIsSavingDraft(true);
    }

    try {
      await firebaseDb.collection('articles').add({
        title,
        category: category?.value || 'uncategorized',
        content,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp(),
        likeCount: 0,
        status,
      });

      Alert.alert('Success', `Your article has been ${status}!`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(`Error saving article as ${status}:`, error);
      Alert.alert('Error', 'There was a problem saving your article. Please try again.');
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <Screen style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StyledTextInput
        placeholder="Article Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      <StyledButton  disabled={true} title="Upload Cover Image" variant="secondary" style={styles.uploadButton} />

      <StyledDropdown
        options={ARTICLE_CATEGORIES}
        placeholder="Select Category"
        selectedValue={category?.value}
        onSelect={setCategory}
      />

      <StyledTextInput
        placeholder="Start writing your article here..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.contentInput}
      />

      <View style={styles.actions}>
        <StyledButton
          title="Save Draft"
          variant="secondary"
          onPress={() => handleSave('draft')}
          loading={isSavingDraft}
        />
        <StyledButton
          title="Publish"
          onPress={() => handleSave('published')}
          loading={isPublishing}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 0,
    height: 'auto',
    paddingVertical: 12,
  },
  uploadButton: {
    marginBottom: 16,
    
  },
  contentInput: {
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 16,
    height: 'auto',
  },
  actions: {
    paddingVertical: 16,
  },
});