import { StyleSheet, Text, View } from 'react-native';
import { DesignTokens } from '@/constants/design-tokens';
import type { PokemonDetail } from '@/lib/api/types';

interface AboutTabProps {
  pokemon: PokemonDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function AboutTab({ pokemon }: AboutTabProps) {
  const formattedId = pokemon.id.toString().padStart(3, '0');
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const heightM = (pokemon.height / 10).toFixed(1);
  const types = pokemon.types.map((t) => t.type.name).join(', ');
  const abilities = pokemon.abilities
    .filter((a) => !a.is_hidden)
    .map((a) => a.ability.name.replace('-', ' '))
    .join(', ');
  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <View style={styles.container}>
      <InfoRow label="Name" value={formattedName} />
      <InfoRow label="ID" value={formattedId} />
      <InfoRow
        label="Base XP"
        value={pokemon.base_experience ? `${pokemon.base_experience} XP` : '-'}
      />
      <InfoRow label="Weight" value={`${weightKg} kg`} />
      <InfoRow label="Height" value={`${heightM} m`} />
      <InfoRow label="Types" value={types} />
      <InfoRow label="Abilities" value={abilities} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: DesignTokens.colors.midnight,
  },
  value: {
    flex: 1,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    lineHeight: 18,
    color: DesignTokens.colors.midnight,
    opacity: 0.65,
    textTransform: 'capitalize',
  },
});
