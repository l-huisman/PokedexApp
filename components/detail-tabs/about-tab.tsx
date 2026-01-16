import { StyleSheet, Text, View } from 'react-native';
import { useThemedColors } from '@/hooks/use-themed-tokens';
import type { PokemonDetail } from '@/lib/api/types';

interface AboutTabProps {
  pokemon: PokemonDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
}

function InfoRow({ label, value, labelColor, valueColor }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

export function AboutTab({ pokemon }: AboutTabProps) {
  const colors = useThemedColors();
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
      <InfoRow label="Name" value={formattedName} labelColor={colors.midnight} valueColor={colors.midnight} />
      <InfoRow label="ID" value={formattedId} labelColor={colors.midnight} valueColor={colors.midnight} />
      <InfoRow
        label="Base"
        value={pokemon.base_experience ? `${pokemon.base_experience} XP` : '-'}
        labelColor={colors.midnight}
        valueColor={colors.midnight}
      />
      <InfoRow label="Weight" value={`${weightKg} kg`} labelColor={colors.midnight} valueColor={colors.midnight} />
      <InfoRow label="Height" value={`${heightM} m`} labelColor={colors.midnight} valueColor={colors.midnight} />
      <InfoRow label="Types" value={types} labelColor={colors.midnight} valueColor={colors.midnight} />
      <InfoRow label="Abilities" value={abilities} labelColor={colors.midnight} valueColor={colors.midnight} />
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
  },
  value: {
    flex: 1,
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.65,
    textTransform: 'capitalize',
  },
});
