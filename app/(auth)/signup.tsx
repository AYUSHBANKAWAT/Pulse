import { createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { StyledButton } from '@/components/StyledButton';
import { StyledDropdown, type DropdownOption } from '@/components/StyledDropdown';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/services/toastService';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

const LOCATION_OPTIONS: DropdownOption[] = [
  { label: 'Delhi', value: 'delhi' },
  { label: 'Noida', value: 'noida' },
  { label: 'Pune', value: 'pune' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Hyderabad', value: 'hyderabad' },
];

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [baseLocation, setBaseLocation] = useState<DropdownOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');

  const handleSignUp = () => {
    if (!email || !password || !fullName || !baseLocation) {
      toastService.showError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Create promises for both profile update and Firestore write
        const profileUpdatePromise = updateProfile(user, {
          displayName: fullName,
        });
        const firestorePromise = setDoc(doc(firebaseDb, 'users', user.uid), {
          uid: user.uid,
          fullName: fullName,
          email: email,
          photoURL: user.photoURL, // Add photoURL during creation
          baseLocation: baseLocation.value, // Save the selected location value
          createdAt: serverTimestamp(),
          kudosReceived: 0,
        });
        return Promise.all([profileUpdatePromise, firestorePromise]);
      })
      .then(() => {
        console.log('User account created & user data saved to Firestore!');
        router.replace('/(tabs)');
      })
      .catch((error) => {
        toastService.showError(error.message, 'Signup Error');
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
          <StyledText style={styles.title}>Create Account</StyledText>
          <StyledText style={styles.subtitle}>Let's get you started.</StyledText>
        </View>

        <View style={styles.form}>
          <StyledTextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          <StyledTextInput
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <StyledTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <StyledDropdown
            options={LOCATION_OPTIONS}
            placeholder="Select Base Location"
            selectedValue={baseLocation?.value}
            onSelect={setBaseLocation}
          />
          <StyledButton title="Create Account" onPress={handleSignUp} loading={isLoading} style={{ marginTop: 16 }} />
        </View>

        <View style={styles.footer}>
          <StyledText style={styles.footerText} onPress={() => router.back()}>
            Already have an account? <StyledText style={styles.link}>Sign In</StyledText>
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
