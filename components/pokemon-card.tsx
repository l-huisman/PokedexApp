import { useCallback } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DesignTokens } from '@/constants/design-tokens';
import { useThemedTokens } from '@/hooks/use-themed-tokens';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  onPress: () => void;
  onMenuPress?: () => void;
}

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 100,
} as const;

export function PokemonCard({
  id,
  name,
  imageUrl,
  onPress,
  onMenuPress,
}: PokemonCardProps) {
  const { colors, shadows } = useThemedTokens();
  const formattedId = id.toString().padStart(3, '0');
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground },
        shadows.card,
        animatedStyle,
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`${formattedName}, number ${formattedId}`}
        accessibilityRole="button"
      >
        <View style={[styles.imageContainer, { backgroundColor: colors.imageBackground }]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{formattedId}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.name, { color: colors.midnight }]} numberOfLines={1}>
            {formattedName}
          </Text>
          {onMenuPress && (
            <Pressable
              onPress={onMenuPress}
              hitSlop={8}
              accessibilityLabel="Options"
              accessibilityRole="button"
            >
              <MaterialIcons
                name="more-vert"
                size={20}
                color={colors.midnight}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 2,
    borderRadius: DesignTokens.borderRadius.badge,
  },
  badgeText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: DesignTokens.sizes.badgeFontSize,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignTokens.spacing.cardPadding,
  },
  name: {
    flex: 1,
    fontFamily: 'Rubik_500Medium',
    fontSize: DesignTokens.sizes.nameFontSize,
    lineHeight: 19.2,
  },
});
