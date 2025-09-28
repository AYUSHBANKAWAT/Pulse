import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { sendCheckInNotification } from '@/services/notificationService';
import { toastService } from '@/services/toastService';

export default function HomeScreen() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');

  const handleCheckIn = async () => {
    if (!user) {
      toastService.showError('You must be logged in to check in.');
      return;
    }

    setIsCheckingIn(true);
    try {
      await sendCheckInNotification(user);
      toastService.showSuccess('Check-in successful! Notifications have been sent.');
    } catch (error: any) {
      console.error('Failed to send notifications:', error);
      toastService.showError('Could not send notifications. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <StyledText style={styles.header}>Home</StyledText>

        <Card>
          <StyledText style={styles.cardTitle}>Office Check-in</StyledText>
          <StyledText style={styles.cardSubtitle}>
            Let your team know you've arrived.
          </StyledText>
          <StyledButton
            title="I am in office"
            onPress={handleCheckIn}
            loading={isCheckingIn}
            style={{ marginTop: 8 }}
          />
        </Card>

        <Pressable onPress={() => router.push('/(tabs)/articles')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Company News</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Stay up to date with the latest announcements.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)/kudos')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Give Kudos</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Recognize a colleague for their hard work.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)/chat')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Company Chat</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Join the real-time conversation.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => toastService.showError('This feature is coming soon!')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Active Surveys</StyledText>
            <StyledText style={styles.cardSubtitle}>Share your valuable feedback with us.</StyledText>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
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