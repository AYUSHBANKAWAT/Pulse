import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ChatMessagePlaceholder } from '@/components/placeholders/ChatMessagePlaceholder';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseRealtimeDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { limitToLast, onValue, push, query, ref, serverTimestamp, set } from '@react-native-firebase/database';

interface Message {
  id: string;
  type: 'text' | 'survey';
  author: string;
  authorId: string;
  avatar: string;
  text?: string;
  question?: string;
  options?: string[];
  createdAt: number;
  votes?: { [key: string]: number }; // userId: optionIndex
}

const MessageItem = ({ item }: { item: Message }) => {
  const messageBubbleColor = useThemeColor({}, 'messageBubble');
  return (
    <View style={styles.messageContainer}>
      <Image
        source={{ uri: item.avatar ?? `https://i.pravatar.cc/150?u=${item.authorId}` }}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <StyledText style={styles.authorName}>{item.author}</StyledText>
        <View style={[styles.messageBubble, { backgroundColor: messageBubbleColor }]}>
          <StyledText>{item.text}</StyledText>
        </View>
      </View>
    </View>
  );
};

const SurveyItem = ({ item }: { item: Message }) => {
  const { user } = useAuth();
  const accentColor = useThemeColor({}, 'accent');
  const borderColor = useThemeColor({}, 'border');

  // Determine if the current user has voted and which option they chose
  const userVoteIndex = user ? item.votes?.[user.uid] : undefined;
  const hasVoted = userVoteIndex !== undefined;

  const handleVote = (optionIndex: number) => {
    if (!user || hasVoted || !item.id) return;

    const voteRef = ref(firebaseRealtimeDb, `/chat/messages/${item.id}/votes/${user.uid}`);
    set(voteRef, optionIndex).catch((error) => {
      console.error('Error voting:', error);
    });
  };

  // Calculate results
  const voteCounts =
    item.options?.map((_, index) => {
      if (!item.votes) return 0;
      // Exclude the placeholder vote from counts
      return Object.values(item.votes).filter((vote) => vote === index).length;
    }) ?? [];
  const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0);

  return (
    <View style={styles.messageContainer}>
      <Image
        source={{ uri: item.avatar ?? `https://i.pravatar.cc/150?u=${item.authorId}` }}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <StyledText style={styles.authorName}>{item.author} posted a survey</StyledText>
        <Card style={styles.surveyCard}>
          <StyledText style={styles.surveyQuestion}>{item.question}</StyledText>
          {item.options?.map((option: string, index: number) => {
            const isUserChoice = hasVoted && userVoteIndex === index;
            const votesForOption = voteCounts[index] ?? 0;
            const percentage = totalVotes > 0 ? (votesForOption / totalVotes) * 100 : 0;
            return (
              <Pressable
                key={index}
                onPress={() => handleVote(index)}
                disabled={hasVoted}
                style={[styles.optionContainer, { borderColor }, isUserChoice && { borderColor: accentColor }]}>
                <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: accentColor }]} />
                <View style={styles.optionTextContainer}>
                  <StyledText style={styles.optionText}>{option}</StyledText>
                  {hasVoted && <StyledText style={styles.voteCount}>{votesForOption}</StyledText>}
                </View>
              </Pressable>
            );
          })}
          {totalVotes > 0 && <StyledText style={styles.surveyResults}>{`${totalVotes} total votes`}</StyledText>}
        </Card>
      </View>
    </View>
  );
};

export default function CompanyChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'cardBackground');
  const accentColor = useThemeColor({}, 'accent');
  const borderColor = useThemeColor({}, 'border');
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();

  useEffect(() => {
    const messagesQuery = query(ref(firebaseRealtimeDb, '/chat/messages'), limitToLast(50));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => b.createdAt - a.createdAt); // Sort descending for inverted list
        setMessages(messageList);
      }
      setIsLoading(false);
    });

    // Stop listening for updates when no longer required
    return () => unsubscribe();
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const messagesListRef = ref(firebaseRealtimeDb, '/chat/messages');
    const newMessageRef = push(messagesListRef);
    set(newMessageRef, {
      type: 'text',
      text: message,
      author: user.displayName,
      authorId: user.uid,
      avatar: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setMessage('');
  };

  const renderItem = ({ item }: { item: Message }) => {
    switch (item.type) {
      case 'survey':
        return <SurveyItem item={item} />;
      case 'text':
      default:
        return <MessageItem item={item} />;
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={tabBarHeight}>
        <StyledText style={styles.header}>Company Chat</StyledText>
        <FlatList
          data={isLoading ? Array.from({ length: 8 }) : messages}
          renderItem={isLoading ? () => <ChatMessagePlaceholder /> : renderItem}
          keyExtractor={(item, index) => (isLoading ? index.toString() : item.id)}
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
          <StyledButton title="Send" style={styles.sendButton} onPress={handleSendMessage} />
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
  optionContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  optionText: {
    fontWeight: '500',
  },
  voteCount: {
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.1,
  },
  surveyResults: { textAlign: 'right', marginTop: 8, opacity: 0.7, fontSize: 12 },
  inputContainer: { flexDirection: 'row', alignItems:'center' ,padding: 8, borderTopWidth: 1,marginVertical: 0},
  textInput: { flex: 1, marginVertical: 0, height: 40 },
  sendButton: { width: 'auto', height: 40, paddingHorizontal: 16, marginLeft: 8, marginVertical: 0 },
});