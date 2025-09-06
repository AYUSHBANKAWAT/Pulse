import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledTextInput } from '@/components/StyledTextInput';

export default function WriteArticleScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = () => {
    if (!title || !content) {
      Alert.alert('Missing Fields', 'Please enter a title and some content before publishing.');
      return;
    }
    // In a real app, you would send this data to your backend API
    console.log('Publishing article:', { title, content });
    Alert.alert('Success', 'Your article has been published!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <Screen style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StyledTextInput
        placeholder="Article Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      <StyledButton title="Upload Cover Image" variant="secondary" style={styles.uploadButton} />

      <StyledTextInput
        placeholder="Start writing your article here..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.contentInput}
      />

      <View style={styles.actions}>
        <StyledButton title="Save Draft" variant="secondary" />
        <StyledButton title="Publish" onPress={handlePublish} />
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