import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePokemonDetail } from '@/hooks/use-pokemon-detail';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = id ? parseInt(id, 10) : undefined;
  const { data, isLoading, isError, error } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading Pokemon...</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error loading Pokemon</ThemedText>
        <ThemedText>{error?.message ?? 'Unknown error'}</ThemedText>
      </ThemedView>
    );
  }

  if (!data) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Pokemon not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.name}>
        {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
      </ThemedText>
      <ThemedText type="subtitle">#{data.id.toString().padStart(3, '0')}</ThemedText>
      <ThemedView style={styles.types}>
        {data.types.map((t) => (
          <ThemedText key={t.type.name} style={styles.type}>
            {t.type.name}
          </ThemedText>
        ))}
      </ThemedView>
      <ThemedText style={styles.placeholder}>
        Full detail UI with tabs coming soon...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    textTransform: 'capitalize',
  },
  types: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  type: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  placeholder: {
    marginTop: 24,
    opacity: 0.6,
  },
});
