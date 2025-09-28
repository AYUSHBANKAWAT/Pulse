import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { FirebaseAuthTypes, onAuthStateChanged } from '@react-native-firebase/auth';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define a type for our custom user profile data from Firestore
export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  baseLocation: string;
  kudosReceived: number;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
});

// Custom hook to access the auth context from any component
export function useAuth() {
  return useContext(AuthContext);
}

// The provider component that wraps the app and provides auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (authUser) => {
      setUser(authUser);

      // Clean up the previous profile listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }

      if (authUser) {
        // If user is logged in, listen for changes to their profile
        const userDocRef = doc(firebaseDb, 'users', authUser.uid);
        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          setUserProfile(docSnap?.exists() ? (docSnap.data() as UserProfile) : null);
          setIsLoading(false);
        });
      } else {
        // User is logged out
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    // Unsubscribe to the listener when unmounting
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading }}>{children}</AuthContext.Provider>
  );
}