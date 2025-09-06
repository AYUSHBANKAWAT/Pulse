import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/[id]" options={{ presentation: 'modal', title: 'Article' }} />
        <Stack.Screen name="article/write" options={{ presentation: 'modal', title: 'Write Article' }} />
        <Stack.Screen name="my-articles" options={{ presentation: 'modal', title: 'My Articles' }} />
        <Stack.Screen name="give-kudos" options={{ presentation: 'modal', title: 'Give Kudos' }} />
        <Stack.Screen name="create-survey" options={{ presentation: 'modal', title: 'Create Survey' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
