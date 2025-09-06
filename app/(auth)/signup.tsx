import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { firebaseAuth } from '../../firebaseConfig';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        console.log('User account created & signed in!', userCredential.user);
        router.replace('/(tabs)');
      })
      .catch((error) => {
        Alert.alert('Signup Error', error.message);
      });
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Create Account</StyledText>
        <StyledText style={styles.subtitle}>Let's get you started.</StyledText>
      </View>

      <View style={styles.form}>
        <StyledTextInput placeholder="Full Name" />
        <StyledTextInput
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <StyledTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <StyledButton title="Create Account" onPress={handleSignUp} />
      </View>

      <View style={styles.footer}>
        <StyledText style={styles.footerText} onPress={() => router.back()}>
          Already have an account? <StyledText style={styles.link}>Sign In</StyledText>
        </StyledText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 40,
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
