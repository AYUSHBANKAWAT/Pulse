import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock Data
const MOCK_USER = {
  name: 'Jane Doe',
  role: 'Lead Engineer',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  kudosReceived: 125,
  articlesPublished: 5,
};

export default function ProfileScreen() {
  const accentColor = useThemeColor({}, 'accent');

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
        <StyledText style={styles.name}>{MOCK_USER.name}</StyledText>
        <StyledText style={styles.role}>{MOCK_USER.role}</StyledText>
      </View>

      <Card>
        <StyledText style={styles.cardTitle}>My Stats</StyledText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <StyledText style={[styles.statValue, { color: accentColor }]}>
              {MOCK_USER.kudosReceived}
            </StyledText>
            <StyledText style={styles.statLabel}>Kudos Received</StyledText>
          </View>
          <View style={styles.statItem}>
            <StyledText style={[styles.statValue, { color: accentColor }]}>
              {MOCK_USER.articlesPublished}
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
        <StyledButton title="Logout" variant="secondary" onPress={() => router.replace('/login')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
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