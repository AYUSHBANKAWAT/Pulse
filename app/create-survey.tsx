import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseRealtimeDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/services/toastService';
import { push, ref, serverTimestamp, set } from '@react-native-firebase/database';

export default function CreateSurveyScreen() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with two options
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const handlePostSurvey = () => {
    if (!question || options.some((opt) => !opt.trim())) {
      toastService.showError('Please enter a question and fill all option fields.', 'Missing Fields');
      return;
    }
    if (!user) return;

    const messagesListRef = ref(firebaseRealtimeDb, '/chat/messages');
    const newMessageRef = push(messagesListRef);
    set(newMessageRef, {
      type: 'survey',
      question,
      options,
      author: user.displayName,
      authorId: user.uid,
      avatar: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      votes: { placeholder: -1 }, // Initialize votes object to ensure it exists
    });

    toastService.showSuccess('Your survey is now live in the company chat.', 'Survey Posted!');
    router.back();
  };

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <StyledText style={styles.title}>Create a Poll</StyledText>
        <StyledTextInput
          placeholder="What is your question?"
          value={question}
          onChangeText={setQuestion}
          style={styles.questionInput}
        />

        <StyledText style={styles.optionsTitle}>Options</StyledText>
        {options.map((option, index) => (
          <StyledTextInput
            key={index}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(text) => handleOptionChange(text, index)}
          />
        ))}

        {options.length < 5 && <StyledButton title="Add Option" variant="secondary" onPress={addOption} />}

        <View style={styles.actions}>
          <StyledButton title="Post to Company Chat" onPress={handlePostSurvey} />
          <StyledButton title="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  questionInput: { marginBottom: 16 },
  optionsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  actions: { marginTop: 'auto', paddingVertical: 16 },
});