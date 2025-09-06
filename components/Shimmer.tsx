import React, { useEffect } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/useThemeColor';

export function Shimmer(props: ViewProps) {
  const shimmerColor = useThemeColor({}, 'messageBubble'); // A good neutral color
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true // reverse
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View {...props} style={[styles.shimmer, { backgroundColor: shimmerColor }, animatedStyle, props.style]} />;
}

const styles = StyleSheet.create({
  shimmer: {
    overflow: 'hidden',
  },
});