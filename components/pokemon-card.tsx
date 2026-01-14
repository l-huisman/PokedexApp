import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DesignTokens } from '@/constants/design-tokens';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  onPress: () => void;
  onMenuPress?: () => void;
}

export function PokemonCard({
  id,
  name,
  imageUrl,
  onPress,
  onMenuPress,
}: PokemonCardProps) {
  const formattedId = id.toString().padStart(3, '0');
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel={`${formattedName}, number ${formattedId}`}
      accessibilityRole="button"
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formattedId}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={1}>
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
              color={DesignTokens.colors.midnight}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
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
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    height: DesignTokens.sizes.cardImageHeight,
    backgroundColor: DesignTokens.colors.imageBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: DesignTokens.colors.primary,
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
    color: DesignTokens.colors.midnight,
    lineHeight: 19.2,
  },
});
