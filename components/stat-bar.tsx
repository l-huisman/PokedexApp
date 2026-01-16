import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { DesignTokens } from '@/constants/design-tokens';

interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export function StatBar({ name, value, maxValue = 255 }: StatBarProps) {
  const displayName = STAT_DISPLAY_NAMES[name] ?? name;
  const percentage = Math.min((value / maxValue) * 100, 100);

  const widthProgress = useSharedValue(0);

  useEffect(() => {
    widthProgress.value = withTiming(percentage, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, widthProgress]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{displayName}</Text>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, animatedBarStyle]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    width: 90,
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: DesignTokens.colors.midnight,
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#DBDAE6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: 2,
  },
  value: {
    width: 36,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: DesignTokens.colors.midnight,
    textAlign: 'right',
  },
});
