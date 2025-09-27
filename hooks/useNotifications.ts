import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// This is standard Expo setup for notifications. It determines how a notification
// is handled when the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // You can optionally show an alert to the user here.
      console.log('Failed to get push token for push notification!');
      return;
    }
    // This is the Expo Push Token.
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    console.log('Expo Push Token:', token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export function useNotifications() {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (user) {
      const registerToken = async () => {
        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            console.log('Attempting to save Expo Push Token to Firestore:', token, 'for user:', user.uid);
            setExpoPushToken(token);
            // Save the token to Firestore, using the token itself as the document ID.
            const tokenRef = firebaseDb().collection('deviceTokens').doc(token);
            await tokenRef.set({
              expoPushToken: token, // Store the token explicitly in the document data as well
              uid: user.uid,
              createdAt: firebaseDb.FieldValue.serverTimestamp(),
            });
          }
        } catch (error) {
          console.error('Error during push token registration:', error);
          // You might want to add an Alert here for the user in a real app
        }
      };
      registerToken();
    }

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received while foregrounded:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification.
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
      // Navigate to a specific screen based on notification data.
      const data = response.notification.request.content.data;
      const screen = data?.screen as string | undefined;
      if (screen) {
        router.push(screen as `/${string}`);
      }
    });

    return () => {
      // The new API for removing a subscription is to call .remove() on the subscription object
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user]);

  return { expoPushToken };
}