import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import type { User } from '@react-native-firebase/auth';
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
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = firebaseAuth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        // If user is logged in, listen for changes to their profile
        const userDocRef = firebaseDb.collection('users').doc(authUser.uid);
        const unsubscribeProfile = userDocRef.onSnapshot((doc) => {
          setUserProfile(doc?.exists ? (doc.data() as UserProfile) : null);
          setIsLoading(false);
        });
        // Return a function to unsubscribe from profile listener when auth state changes
        return unsubscribeProfile;
      } else {
        // User is logged out
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    // Unsubscribe to the listener when unmounting
    return unsubscribeAuth;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading }}>{children}</AuthContext.Provider>
  );
}