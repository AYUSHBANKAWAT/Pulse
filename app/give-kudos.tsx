import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledButton } from '@/components/StyledButton';
import { DropdownOption, StyledDropdown } from '@/components/StyledDropdown';
import { StyledText } from '@/components/StyledText';
import { StyledTextInput } from '@/components/StyledTextInput';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/services/toastService';
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';

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
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Fetch users to populate the dropdown
    const fetchUsers = async () => {
      if (!currentUser) return;
      console.log('Fetching users for kudos...',currentUser);
      try {
        const usersCollection = collection(firebaseDb, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const fetchedUsers = (usersSnapshot?.docs || [])
          .map((doc) => doc.data() as AppUser)
          .filter((u) => u.uid !== currentUser.uid) // Exclude current user
          .map((u) => ({ label: u.fullName, value: u.uid }));
        setUsers(fetchedUsers);
        console.log('Fetched users for kudos:', fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toastService.showError('Could not load users list.');
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleSendKudos = async () => {
    if (!recipient || !message.trim()) {
      toastService.showError('Please select a recipient and write a message.', 'Missing Fields');
      return;
    }
    if (!currentUser) {
      toastService.showError('You must be logged in to send kudos.');
      return;
    }

    setIsLoading(true);

    try {
      // Check kudos limit for the current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const kudosCollection = collection(firebaseDb, 'kudos');
      const monthlyKudosQuery = query(
        kudosCollection,
        where('fromId', '==', currentUser.uid),
        where('createdAt', '>=', startOfMonth)
      );
      const monthlyKudosSnapshot = await getDocs(monthlyKudosQuery);

      if (monthlyKudosSnapshot.size >= 2) {
        toastService.showError('You have already sent 2 kudos this month.', 'Limit Reached');
        setIsLoading(false);
        return;
      }

      // Use a batched write to perform both operations atomically
      const batch = writeBatch(firebaseDb);
      console.log('Sending kudos to:', recipient, 'with message:', message,' from user:', currentUser);
      // 1. Create the new kudo document
      const newKudoRef = doc(kudosCollection); // Create a new doc with a random ID
      setDoc(newKudoRef, {
        fromId: currentUser.uid,
        fromName: currentUser.displayName || 'Anonymous User',
        toId: recipient.value,
        toName: recipient.label,
        message,
        createdAt: serverTimestamp(),
      });

      // 2. Increment the kudos count for the recipient
      const userToUpdateRef = doc(firebaseDb, 'users', recipient.value);
      batch.update(userToUpdateRef, { kudosReceived: increment(1) });

      // Commit the batch
      await batch.commit();
      toastService.showSuccess(`You've successfully sent kudos to ${recipient.label}.`, 'Kudos Sent!');
      router.back();
    } catch (error) {
      console.error('Error sending kudos:', error);
      toastService.showError('There was a problem sending your kudos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  messageInput: { flex: 1, textAlignVertical: 'top', paddingTop: 16, height: 'auto' },
  actions: { paddingVertical: 16 },
});