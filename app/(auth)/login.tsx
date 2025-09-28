import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { firebaseAuth } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/services/toastService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');

  const handleLogin = () => {
    if (!email || !password) {
      toastService.showError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log('User signed in!', userCredential.user);
        router.replace('/(tabs)');
      })
      .catch((error) => {
        toastService.showError(error.message, 'Login Error');
        console.log('Error',error.message)
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <StyledText style={styles.title}>Pulse</StyledText>
          <StyledText style={styles.subtitle}>Welcome back. Sign in to continue.</StyledText>
        </View>

        <View style={styles.form}>
          <StyledTextInput
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <StyledTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <StyledButton title="Sign In" onPress={handleLogin} loading={isLoading} />
        </View>

        <View style={styles.footer}>
          <StyledButton
            title="Sign In with SSO"
            variant="secondary"
            onPress={() => toastService.showError('SSO is not yet available.', 'Coming Soon')}
          />
          <StyledText style={styles.footerText} onPress={() => router.push('/signup')}>
            Don't have an account? <StyledText style={styles.link}>Sign Up</StyledText>
          </StyledText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    flex: 2,
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  link: {
    fontWeight: 'bold',
    opacity: 1,
  },
});
