import app from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

// This configuration is extracted from your `google-services.json`
// It is required for Firebase to work correctly in development environments like Expo Go.
const firebaseConfig = {
  apiKey: 'AIzaSyDuAxSI7MmyUYx9kCalMO0Tm9l3_8jinVA',
  authDomain: 'attendance-tracker-custom.firebaseapp.com',
  projectId: 'attendance-tracker-custom',
  storageBucket: 'attendance-tracker-custom.appspot.com',
  messagingSenderId: '776198429140',
  appId: '1:776198429140:android:9638b9ee6da2dde0875e41',
  databaseURL: 'https://attendance-tracker-custom-default-rtdb.firebaseio.com',
};

// To fix the initialization error, we must ensure the app is initialized
// before we try to use any of the services.
if (app.apps.length === 0) {
  app.initializeApp(firebaseConfig);
}

const firebaseAuth = auth();
const firebaseDb = firestore();
const firebaseRealtimeDb = database();

export { firebaseAuth, firebaseDb, firebaseRealtimeDb };
