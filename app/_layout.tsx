import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SplashScreen, Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before we know the user's auth state.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) {
      // We are still checking the auth state, so do nothing.
      // The splash screen will remain visible.
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // User is signed in but is in the auth group.
      // Redirect them to the main app area.
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // User is not signed in and not in the auth group.
      // Redirect them to the login screen.
      router.replace('/(auth)/login');
    }

    // Hide the splash screen now that we have navigated.
    SplashScreen.hideAsync();
  }, [user, isLoading, segments]);

  // The initial layout is a simple stack with both groups.
  // The logic in useEffect will handle which one is actually shown.
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={colorScheme === 'dark' ? '#222' : '#fff'}
        animated
      />
      <RootLayoutNav />
    </AuthProvider>
  );
}