import { StyleSheet, Text, View } from 'react-native';
import { getPokemonTypeColor } from '@/constants/pokemon-types';
import { DesignTokens } from '@/constants/design-tokens';

interface TypeBadgeProps {
  typeName: string;
}

export function TypeBadge({ typeName }: TypeBadgeProps) {
  const typeColor = getPokemonTypeColor(typeName);
  const displayName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: typeColor }]} />
      <Text style={styles.text}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 9, 64, 0.08)',
    borderRadius: 99,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 4,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  text: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: DesignTokens.colors.midnight,
  },
});
