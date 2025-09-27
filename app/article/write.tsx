import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledButton } from '@/components/StyledButton';
import { DropdownOption, StyledDropdown } from '@/components/StyledDropdown';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/toastService';

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
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const handleSave = async (status: 'published' | 'draft') => {
    if (!title || !content) {
      toastService.showError('Please enter a title and some content before publishing.', 'Missing Fields');
      return;
    }
    if (!user) {
      toastService.showError('You must be logged in to post an article.', 'Not Authenticated');
      return;
    }

    if (status === 'published') {
      setIsPublishing(true);
    } else {
      setIsSavingDraft(true);
    }

    try {
      await firebaseDb().collection('articles').add({
        title,
        category: category?.value || 'uncategorized',
        content,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: firebaseDb.FieldValue.serverTimestamp(),
        likeCount: 0,
        status,
      });

      toastService.showSuccess(`Your article has been ${status}!`);
      router.back();
    } catch (error) {
      console.error(`Error saving article as ${status}:`, error);
      toastService.showError('There was a problem saving your article. Please try again.');
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <StyledTextInput
          placeholder="Article Title"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />

        <StyledButton disabled={true} title="Upload Cover Image" variant="secondary" style={styles.uploadButton} />

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
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