import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DesignTokens } from '@/constants/design-tokens';
import { useThemedTokens } from '@/hooks/use-themed-tokens';
import { getPokemonImageUrl } from '@/lib/api/pokemon';

interface EvolutionCardProps {
  id: number;
  name: string;
  onPress: () => void;
}

export function EvolutionCard({ id, name, onPress }: EvolutionCardProps) {
  const { colors, shadows } = useThemedTokens();
  const formattedId = id.toString().padStart(3, '0');
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const imageUrl = getPokemonImageUrl(id);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.cardBackground },
        shadows.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityLabel={`${formattedName}, number ${formattedId}`}
      accessibilityRole="button"
    >
      <Image source={{ uri: imageUrl }} style={styles.image} contentFit="contain" />
      <View style={styles.info}>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{formattedId}</Text>
        </View>
        <Text style={[styles.name, { color: colors.midnight }]}>{formattedName}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: DesignTokens.borderRadius.card,
    padding: 12,
    gap: 16,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: 60,
    height: 60,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: DesignTokens.borderRadius.badge,
  },
  badgeText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  name: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
  },
});
