import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock Data
const MOCK_MESSAGES = [
  { id: 'm4', type: 'text', author: 'Chris Green', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', text: 'Has anyone seen the latest design mockups?' },
  { id: 's1', type: 'survey', author: 'Alex Ray', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', question: 'Team lunch next Friday?', options: ['Yes, I’m in!', 'No, I can’t make it'] },
  { id: 'm3', type: 'text', author: 'Mia Wong', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', text: 'Great work everyone on the Q3 goals! 🎉' },
  { id: 'm2', type: 'text', author: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', text: 'Welcome to the company chat!' },
  { id: 'm1', type: 'text', author: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', text: 'Hello team!' },
].reverse(); // Reverse for inverted FlatList

const MessageItem = ({ item }: { item: any }) => {
  const messageBubbleColor = useThemeColor({}, 'messageBubble');
  return (
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <StyledText style={styles.authorName}>{item.author}</StyledText>
        <View style={[styles.messageBubble, { backgroundColor: messageBubbleColor }]}>
          <StyledText>{item.text}</StyledText>
        </View>
      </View>
    </View>
  );
};

const SurveyItem = ({ item }: { item: any }) => {
  const [voted, setVoted] = useState(false);
  return (
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <StyledText style={styles.authorName}>{item.author} posted a survey</StyledText>
        <Card style={styles.surveyCard}>
          <StyledText style={styles.surveyQuestion}>{item.question}</StyledText>
          {item.options.map((option: string, index: number) => (
            <StyledButton
              key={index}
              title={option}
              variant={voted ? 'primary' : 'secondary'}
              onPress={() => setVoted(true)}
              style={{ marginVertical: 4 }}
            />
          ))}
          {voted && <StyledText style={styles.surveyResults}>Thanks for voting! (Results would show here)</StyledText>}
        </Card>
      </View>
    </View>
  );
};

export default function CompanyChatScreen() {
  const [message, setMessage] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'cardBackground');
  const accentColor = useThemeColor({}, 'accent');
  const borderColor = useThemeColor({}, 'border');

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'survey':
        return <SurveyItem item={item} />;
      case 'text':
      default:
        return <MessageItem item={item} />;
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor }]}>
      <StyledText style={styles.header}>Company Chat</StyledText>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}>
        <FlatList
          data={MOCK_MESSAGES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.listContentContainer}
        />
        <View style={[styles.inputContainer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
          <Pressable onPress={() => router.push('/create-survey')}>
            <TabBarIcon name="add-circle-outline" color={accentColor} style={{ marginRight: 8 }} />
          </Pressable>
          <StyledTextInput
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            style={styles.textInput}
          />
          <StyledButton title="Send" style={styles.sendButton} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  header: { fontSize: 36, fontWeight: 'bold', paddingVertical: 16, paddingHorizontal: 16 },
  listContentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, marginTop: 4 },
  messageContent: { flex: 1 },
  authorName: { fontWeight: 'bold', marginBottom: 4 },
  messageBubble: { padding: 12, borderRadius: 12 },
  surveyCard: { padding: 16, borderWidth: 0 },
  surveyQuestion: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  surveyResults: { textAlign: 'center', marginTop: 8, opacity: 0.7 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1 },
  textInput: { flex: 1, marginVertical: 0, height: 40 },
  sendButton: { width: 'auto', height: 40, paddingHorizontal: 16, marginLeft: 8, marginVertical: 0 },
});