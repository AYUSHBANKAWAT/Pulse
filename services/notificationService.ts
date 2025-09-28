import { firebaseDb } from '@/firebaseConfig';
import type { User } from '@react-native-firebase/auth';
import { collection, deleteDoc, doc, getDocs } from '@react-native-firebase/firestore';

/**
 * Fetches all device tokens from Firestore and sends a check-in notification.
 * @param user The user who is checking in.
 */
export async function sendCheckInNotification(user: User) {
  // 1. Get all Expo push tokens from Firestore.
  const tokensCollection = collection(firebaseDb, 'deviceTokens');
  const tokensSnapshot = await getDocs(tokensCollection);

  const tokens: string[] = [];
  tokensSnapshot.forEach((docSnap) => {
    // Don't send a notification to the person who checked in.
    if (docSnap.data().uid !== user.uid) {
      tokens.push(docSnap.id);
    }
  });

  if (tokens.length === 0) {
    console.log('No other users to notify.');
    return; // Exit early if no one to notify
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

  // 3. Send notifications.
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  const responseBody = await response.json();
  console.log('Expo Push Response:', JSON.stringify(responseBody, null, 2));

  if (!response.ok) {
    throw new Error(`Failed to send notifications: ${response.statusText}`);
  }

  // 4. Clean up invalid tokens.
  const tickets = responseBody.data;
  if (Array.isArray(tickets)) {
    for (const ticket of tickets) {
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        const invalidToken = ticket.details.expoPushToken;
        const tokenRef = doc(firebaseDb, 'deviceTokens', invalidToken);
        await deleteDoc(tokenRef);
      }
    }
  }
}