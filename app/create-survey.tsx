import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseRealtimeDb } from '@/firebaseConfig';
import database from '@react-native-firebase/database';

export default function CreateSurveyScreen() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with two options
  const { user } = useAuth();

  const handlePostSurvey = () => {
    if (!question || options.some((opt) => !opt.trim())) {
      Alert.alert('Missing Fields', 'Please enter a question and fill all option fields.');
      return;
    }
    if (!user) return;

    const messagesRef = firebaseRealtimeDb.ref('/chat/messages').push();
    messagesRef.set({
      type: 'survey',
      question,
      options,
      author: user.displayName,
      authorId: user.uid,
      avatar: user.photoURL,
      createdAt: database.ServerValue.TIMESTAMP,
      votes: { placeholder: -1 }, // Initialize votes object to ensure it exists
    });

    Alert.alert('Survey Posted!', 'Your survey is now live in the company chat.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
    <Screen style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  questionInput: { marginBottom: 16 },
  optionsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  actions: { marginTop: 'auto', paddingVertical: 16 },
});