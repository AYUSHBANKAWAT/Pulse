import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';

import { Card } from '@/components/Card';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { user } = useAuth();

  const handleCheckIn = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to check in.');
      return;
    }

    setIsCheckingIn(true);
    try {
      // 1. Get all Expo push tokens from Firestore.
      const tokensSnapshot = await firestore().collection('deviceTokens').get();

      const tokens: string[] = [];
      tokensSnapshot.forEach((doc) => {
        // Don't send a notification to the person who checked in.
        if (doc.data().uid !== user.uid) {
          tokens.push(doc.id);
        }
      });

      if (tokens.length === 0) {
        console.log('No other users to notify.');
        Alert.alert('Success', 'You have checked in!');
        return;
      }

      // 2. Construct the notification messages for Expo's API.
      const userName = user.displayName || 'A colleague';
      const messages = tokens.map((token) => ({
        to: token,
        sound: 'default',
        title: 'Office Arrival',
        body: `${userName} has arrived at the office.`,
        data: { screen: 'home' },
      }));

      // 3. Send notifications in batches. Expo's API can handle up to 100 per request.
      const chunks = [];
      for (let i = 0; i < messages.length; i += 100) {
        chunks.push(messages.slice(i, i + 100));
      }

      await Promise.all(
        chunks.map(async (chunk) => {
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(chunk),
          });

          // Log the raw response for debugging
          const responseBody = await response.json();
          console.log('Expo Push Response:', JSON.stringify(responseBody, null, 2));

          if (!response.ok) {
            throw new Error(`Failed to send notifications: ${response.statusText}`);
          }

          // Check for errors within the tickets returned by Expo
          const tickets = responseBody.data;
          if (Array.isArray(tickets)) {
            tickets.forEach((ticket: any) => {
              if (ticket.status === 'error') {
                // If a token is invalid, automatically remove it from Firestore.
                if (ticket.details?.error === 'DeviceNotRegistered') {
                  const invalidToken = ticket.details.expoPushToken;
                  console.log(`Removing invalid token from Firestore: ${invalidToken}`);
                  firestore().collection('deviceTokens').doc(invalidToken).delete();
                } else {
                  console.error(`Error sending notification: ${ticket.message}`, ticket.details);
                }
              }
            });
          }
        })
      );

      console.log(`Successfully sent notifications to ${tokens.length} devices.`);
      Alert.alert('Success', 'Check-in successful! Notifications have been sent.');
    } catch (error: any) {
      console.error('Failed to send notifications:', error);
      Alert.alert('Error', 'Could not send notifications. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
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
    </ScrollView>
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