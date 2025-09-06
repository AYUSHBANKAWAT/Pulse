import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const handleCheckIn = () => {
    Alert.alert('Checked In!', 'You have successfully notified that you are in the office.');
  };

  return (
    <Screen contentContainerStyle={styles.contentContainer}>
      <StyledText style={styles.header}>Home</StyledText>

      <Card>
        <StyledText style={styles.cardTitle}>Office Check-in</StyledText>
        <StyledText style={styles.cardSubtitle}>
          Let your team know you've arrived.
        </StyledText>
        <StyledButton title="I am in office" onPress={handleCheckIn} style={{ marginTop: 8 }} />
      </Card>

      <Pressable onPress={() => router.push('/(tabs)/articles')}>
        <Card>
          <StyledText style={styles.cardTitle}>Company News</StyledText>
          <StyledText style={styles.cardSubtitle}>
            Stay up to date with the latest announcements.
          </StyledText>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/(tabs)/kudos')}>
        <Card>
          <StyledText style={styles.cardTitle}>Give Kudos</StyledText>
          <StyledText style={styles.cardSubtitle}>
            Recognize a colleague for their hard work.
          </StyledText>
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/(tabs)/chat')}>
        <Card>
          <StyledText style={styles.cardTitle}>Company Chat</StyledText>
          <StyledText style={styles.cardSubtitle}>
            Join the real-time conversation.
          </StyledText>
        </Card>
      </Pressable>

      <Card>
        <StyledText style={styles.cardTitle}>Active Surveys</StyledText>
        <StyledText style={styles.cardSubtitle}>Share your valuable feedback with us.</StyledText>
      </Card>

      <Card>
        <StyledText style={styles.cardTitle}>Account</StyledText>
        <StyledButton title="Logout" variant="secondary" onPress={() => router.replace('/login')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    opacity: 0.7,
  },
});