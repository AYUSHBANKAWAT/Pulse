import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { StyledButton } from '@/components/StyledButton';
import { DropdownOption, StyledDropdown } from '@/components/StyledDropdown';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import firestore from '@react-native-firebase/firestore';

interface AppUser {
  uid: string;
  fullName: string;
}

export default function GiveKudosScreen() {
  const [recipient, setRecipient] = useState<DropdownOption | null>(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // Fetch users to populate the dropdown
    const fetchUsers = async () => {
      if (!currentUser) return;
      console.log('Fetching users for kudos...',currentUser);
      try {
        const usersSnapshot = await firebaseDb.collection('users').get();
        const fetchedUsers = (usersSnapshot?.docs || [])
          .map((doc) => doc.data() as AppUser)
          .filter((u) => u.uid !== currentUser.uid) // Exclude current user
          .map((u) => ({ label: u.fullName, value: u.uid }));
        setUsers(fetchedUsers);
        console.log('Fetched users for kudos:', fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Could not load users list.');
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleSendKudos = async () => {
    if (!recipient || !message.trim()) {
      Alert.alert('Missing Fields', 'Please select a recipient and write a message.');
      return;
    }
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to send kudos.');
      return;
    }

    setIsLoading(true);

    try {
      // Check kudos limit for the current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const kudosRef = firebaseDb.collection('kudos');
      const monthlyKudosQuery = await kudosRef
        .where('fromId', '==', currentUser.uid)
        .where('createdAt', '>=', startOfMonth)
        .get();

      if (monthlyKudosQuery.size >= 2) {
        Alert.alert('Limit Reached', 'You have already sent 2 kudos this month.');
        setIsLoading(false);
        return;
      }

      // Use a batched write to perform both operations atomically
      const batch = firebaseDb.batch();
      console.log('Sending kudos to:', recipient, 'with message:', message,' from user:', currentUser);
      // 1. Create the new kudo document
      const newKudoRef = kudosRef.doc();
      batch.set(newKudoRef, {
        fromId: currentUser.uid,
        fromName: currentUser.displayName,
        toId: recipient.value,
        toName: recipient.label,
        message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Increment the kudos count for the recipient
      const userToUpdateRef = firebaseDb.collection('users').doc(recipient.value);
      batch.update(userToUpdateRef, { kudosReceived: firestore.FieldValue.increment(1) });

      // Commit the batch
      await batch.commit();
      Alert.alert('Kudos Sent!', `You've successfully sent kudos to ${recipient.label}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error sending kudos:', error);
      Alert.alert('Error', 'There was a problem sending your kudos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StyledText style={styles.title}>Give Kudos</StyledText>
      <StyledDropdown
        placeholder="To: (Select a colleague)"
        options={users}
        selectedValue={recipient?.value}
        onSelect={setRecipient}
      />
      <StyledTextInput
        placeholder="Write your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.messageInput}
      />
      <View style={styles.actions}>
        <StyledButton title="Send Kudos" onPress={handleSendKudos} loading={isLoading} />
        <StyledButton title="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  messageInput: { flex: 1, textAlignVertical: 'top', paddingTop: 16, height: 'auto' },
  actions: { paddingVertical: 16 },
});