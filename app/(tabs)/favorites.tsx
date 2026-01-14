import { StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavoritesScreen() {
  const { favorites, isLoading, error } = useFavorites();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading favorites...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error loading favorites</ThemedText>
        <ThemedText>{error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (favorites.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">No favorites yet</ThemedText>
        <ThemedText>
          Add Pokemon to your favorites from the Pokedex!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">
        {favorites.length} favorite{favorites.length === 1 ? '' : 's'}
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        Favorites list UI coming soon...
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
    padding: 16,
  },
  placeholder: {
    marginTop: 16,
    opacity: 0.6,
  },
});
