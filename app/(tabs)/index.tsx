import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTrendingFeed } from '@/hooks/useTrendingFeed';
import { sendCheckInNotification } from '@/services/notificationService';
import { toastService } from '@/services/toastService';

const STATUS_OPTIONS = [/* ... */]; // Assuming this is defined as in previous steps

export default function HomeScreen() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const cardColor = useThemeColor({}, 'cardBackground');
  const accentColor = useThemeColor({}, 'accent');

  const { trendingItems, isLoading: isTrendingLoading } = useTrendingFeed();

  const handleStatusUpdate = async (status: 'in-office' | 'wfh' | 'sick' | 'ooo') => {
    if (!user) {
      toastService.showError('You must be logged in to update your status.');
      return;
    }

    bottomSheetRef.current?.close();
    setIsCheckingIn(true);
    try {
      await sendCheckInNotification(user, status);
      toastService.showSuccess('Your team has been notified of your status.');
    } catch (error: any) {
      console.error('Failed to send notifications:', error);
      toastService.showError('Could not send notifications. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const showStatusOptions = () => {
    // This can be changed back to bottomSheetRef.current?.expand() if you prefer the bottom sheet
    Alert.alert(
      'Update Your Status',
      "Let your team know where you're working from today.",
      [
        { text: 'I am in office', onPress: () => handleStatusUpdate('in-office') },
        { text: 'Work From Home', onPress: () => handleStatusUpdate('wfh') },
        { text: 'Sick Leave', onPress: () => handleStatusUpdate('sick') },
        { text: 'Out of Office', onPress: () => handleStatusUpdate('ooo') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const getIconForType = (type: 'article' | 'kudo' | 'survey') => {
    switch (type) {
      case 'article':
        return 'newspaper-outline';
      case 'kudo':
        return 'ribbon-outline';
      case 'survey':
        return 'stats-chart-outline';
      default:
        return 'flash-outline';
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <StyledText style={styles.header}>Home</StyledText>

        <Card>
          <StyledText style={styles.cardTitle}>Office Check-in</StyledText>
          <StyledText style={styles.cardSubtitle}>Let your team know you've arrived.</StyledText>
          <StyledButton
            title="Update My Status"
            onPress={showStatusOptions}
            loading={isCheckingIn}
            style={{ marginTop: 8 }}
          />
        </Card>

        <Card>
          <StyledText style={styles.cardTitle}>What's Trending</StyledText>
          {isTrendingLoading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : (
            trendingItems.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.trendingItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={item.onPress}>
                <TabBarIcon
                  name={getIconForType(item.type)}
                  color={accentColor}
                  style={styles.trendingIcon}
                />
                <View style={{ flex: 1 }}>
                  <StyledText style={styles.trendingTitle}>{item.title}</StyledText>
                  <StyledText style={styles.trendingSubtitle}>{item.subtitle}</StyledText>
                </View>
              </Pressable>
            ))
          )}
        </Card>

        <Pressable onPress={() => router.push('/(tabs)/articles')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Company News</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Stay up to date with the latest announcements.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)/kudos')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Give Kudos</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Recognize a colleague for their hard work.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)/chat')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Company Chat</StyledText>
            <StyledText style={styles.cardSubtitle}>
              Join the real-time conversation.
            </StyledText>
          </Card>
        </Pressable>

        <Pressable onPress={() => toastService.showError('This feature is coming soon!')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Card>
            <StyledText style={styles.cardTitle}>Active Surveys</StyledText>
            <StyledText style={styles.cardSubtitle}>Share your valuable feedback with us.</StyledText>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    opacity: 0.7,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.3)',
  },
  trendingIcon: {
    marginRight: 16,
  },
  trendingTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  trendingSubtitle: {
    opacity: 0.7,
    fontSize: 13,
    marginTop: 2,
  },
});