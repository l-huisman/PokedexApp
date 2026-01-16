import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { DesignTokens } from '@/constants/design-tokens';

const SHIMMER_DURATION = 1000;

export function SkeletonCard() {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 150 }],
  }));

  return (
    <View
      style={styles.container}
      accessibilityLabel="Loading Pokemon card"
      accessibilityRole="progressbar"
    >
      <View style={styles.imageContainer}>
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
        <View style={styles.badge} />
      </View>
      <View style={styles.footer}>
        <View style={styles.namePlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.cardBackground,
    borderRadius: DesignTokens.borderRadius.card,
    overflow: 'hidden',
    ...DesignTokens.shadows.card,
  },
  imageContainer: {
    height: DesignTokens.sizes.cardImageHeight,
    backgroundColor: DesignTokens.colors.imageBackground,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 40,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: DesignTokens.borderRadius.badge,
  },
  footer: {
    padding: DesignTokens.spacing.cardPadding,
  },
  namePlaceholder: {
    height: 19,
    width: '70%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});
