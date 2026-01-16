import { StyleSheet, View } from 'react-native';
import { SkeletonCard } from './skeleton-card';
import { DesignTokens } from '@/constants/design-tokens';

interface SkeletonListProps {
  count?: number;
}

export function SkeletonList({ count = 6 }: SkeletonListProps) {
  const rows = Math.ceil(count / 2);

  return (
    <View style={styles.container}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <SkeletonCard />
          {rowIndex * 2 + 1 < count && <SkeletonCard />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: DesignTokens.spacing.cardGap,
    paddingHorizontal: DesignTokens.spacing.screenPadding,
  },
  row: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.cardGap,
  },
});
