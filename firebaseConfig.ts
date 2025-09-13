import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

const firebaseAuth = auth();
const firebaseDb = firestore();
const firebaseRealtimeDb = database();

export { firebaseAuth, firebaseDb, firebaseRealtimeDb };
