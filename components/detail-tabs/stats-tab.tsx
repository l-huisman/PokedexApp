import { StyleSheet, View } from 'react-native';
import { StatBar } from '@/components/stat-bar';
import type { PokemonDetail } from '@/lib/api/types';

interface StatsTabProps {
  pokemon: PokemonDetail;
}

export function StatsTab({ pokemon }: StatsTabProps) {
  return (
    <View style={styles.container}>
      {pokemon.stats.map((stat) => (
        <StatBar
          key={stat.stat.name}
          name={stat.stat.name}
          value={stat.base_stat}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});
