import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';

export default function GiveKudosScreen() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSendKudos = () => {
    if (!recipient || !message) {
      Alert.alert('Missing Fields', 'Please select a recipient and write a message.');
      return;
    }
    // In a real app, you would send this data to your backend API
    console.log('Sending Kudos:', { recipient, message });
    Alert.alert('Kudos Sent!', `You've successfully sent kudos to ${recipient}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <Screen style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StyledText style={styles.title}>Give Kudos</StyledText>
      <StyledTextInput
        placeholder="To: (e.g., John Smith)"
        value={recipient}
        onChangeText={setRecipient}
      />
      <StyledTextInput
        placeholder="Write your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.messageInput}
      />
      <View style={styles.actions}>
        <StyledButton title="Send Kudos" onPress={handleSendKudos} />
        <StyledButton title="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  messageInput: { flex: 1, textAlignVertical: 'top', paddingTop: 16, height: 'auto' },
  actions: { paddingVertical: 16 },
});