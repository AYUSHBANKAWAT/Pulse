import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useAuth } from '@/context/AuthContext';
import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import { toastService } from '@/toastService';

export default function ProfileScreen() {
  const { user, userProfile } = useAuth();
  const accentColor = useThemeColor({}, 'accent');
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();
  const [publishedArticleCount, setPublishedArticleCount] = useState(0);

  // Fetch the count of published articles
  useEffect(() => {
    if (!user) return;

    const unsubscribe = firebaseDb()
      .collectionGroup('articles')
      .where('authorId', '==', user.uid)
      .where('status', '==', 'published')
      .onSnapshot((querySnapshot) => {
        setPublishedArticleCount(querySnapshot?.size || 0);
      });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    firebaseAuth().signOut().catch((error) => {
      console.error('Sign out error', error);
      toastService.showError('Failed to sign out.');
    });
    // The root layout will handle redirecting the user automatically.
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              // Use a placeholder if avatar is not available
              uri: user?.photoURL ?? `https://i.pravatar.cc/150?u=${user?.uid}`,
            }}
            style={styles.avatar}
          />
          <StyledText style={styles.name}>{user?.displayName ?? 'Anonymous User'}</StyledText>
          <StyledText style={styles.role}>{user?.email}</StyledText>
        </View>

        <Card>
          <StyledText style={styles.cardTitle}>My Stats</StyledText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <StyledText style={[styles.statValue, { color: accentColor }]}>{userProfile?.kudosReceived ?? 0}</StyledText>
              <StyledText style={styles.statLabel}>Kudos Received</StyledText>
            </View>
            <View style={styles.statItem}>
              <StyledText style={[styles.statValue, { color: accentColor }]}>
                {publishedArticleCount}
              </StyledText>
              <StyledText style={styles.statLabel}>Articles Published</StyledText>
            </View>
          </View>
        </Card>

        <Pressable onPress={() => router.push('/my-articles')}>
          <Card>
            <StyledText style={styles.cardTitle}>My Articles & Drafts</StyledText>
            <StyledText style={styles.cardSubtitle}>View and manage your posts.</StyledText>
          </Card>
        </Pressable>

        <Card>
          <StyledText style={styles.cardTitle}>Account</StyledText>
          <StyledButton title="Logout" variant="secondary" onPress={handleLogout} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
});