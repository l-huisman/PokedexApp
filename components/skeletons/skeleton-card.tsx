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
import { useTheme } from '@/contexts/theme-context';
import { useThemedTokens } from '@/hooks/use-themed-tokens';

const SHIMMER_DURATION = 1000;

export function SkeletonCard() {
  const { isDark } = useTheme();
  const { colors, shadows } = useThemedTokens();
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

  const shimmerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)';
  const placeholderColor = isDark ? '#3A3A3A' : '#E0E0E0';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground },
        shadows.card,
      ]}
      accessibilityLabel="Loading Pokemon card"
      accessibilityRole="progressbar"
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.imageBackground }]}>
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', shimmerColor, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
        <View style={[styles.badge, { backgroundColor: placeholderColor }]} />
      </View>
      <View style={styles.footer}>
        <View style={[styles.namePlaceholder, { backgroundColor: placeholderColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: DesignTokens.borderRadius.card,
    overflow: 'hidden',
  },
  imageContainer: {
    height: DesignTokens.sizes.cardImageHeight,
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
    borderRadius: DesignTokens.borderRadius.badge,
  },
  footer: {
    padding: DesignTokens.spacing.cardPadding,
  },
  namePlaceholder: {
    height: 19,
    width: '70%',
    borderRadius: 4,
  },
});
