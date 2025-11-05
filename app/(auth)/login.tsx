import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

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
  const { height } = useWindowDimensions();

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
    <View
      style={[styles.screen, { backgroundColor }]}>
      <ScrollView contentContainerStyle={[styles.container, { minHeight: height }]}>
        <View style={[styles.header, { alignItems: 'center' }]}>
          <Image source={require('@/assets/images/AppIcon2.png')} style={styles.logo} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    justifyContent: 'center',
    marginBottom: 48,
  },
  form: {
    justifyContent: 'center',
  },
  footer: {
    marginTop: 48,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode:'contain',
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
