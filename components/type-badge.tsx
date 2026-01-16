import { StyleSheet, Text, View } from 'react-native';
import { getPokemonTypeColor } from '@/constants/pokemon-types';
import { useTheme } from '@/contexts/theme-context';
import { useThemedColors } from '@/hooks/use-themed-tokens';

interface TypeBadgeProps {
  typeName: string;
}

export function TypeBadge({ typeName }: TypeBadgeProps) {
  const { isDark } = useTheme();
  const colors = useThemedColors();
  const typeColor = getPokemonTypeColor(typeName);
  const displayName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

  const containerBgColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 9, 64, 0.08)';

  return (
    <View style={[styles.container, { backgroundColor: containerBgColor }]}>
      <View style={[styles.dot, { backgroundColor: typeColor }]} />
      <Text style={[styles.text, { color: colors.midnight }]}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});
