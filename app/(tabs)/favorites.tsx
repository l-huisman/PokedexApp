import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonCard } from '@/components/pokemon-card';
import { SearchBar } from '@/components/search-bar';
import { SkeletonList } from '@/components/skeletons/skeleton-list';
import { DesignTokens } from '@/constants/design-tokens';
import { useFavoritePokemon, type FavoritePokemonItem } from '@/hooks/use-favorite-pokemon';
import { getPokemonImageUrl } from '@/lib/api/pokemon';

const COLUMN_COUNT = 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { pokemon, isLoading, isError, error, refresh } = useFavoritePokemon();

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) {
      return pokemon;
    }
    const query = searchQuery.toLowerCase().trim();
    return pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
    );
  }, [pokemon, searchQuery]);

  const handlePokemonPress = useCallback(
    (id: number) => {
      router.push(`/pokemon/${id}`);
    },
    [router]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const renderItem = useCallback(
    ({ item }: { item: FavoritePokemonItem }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
        imageUrl={getPokemonImageUrl(item.id)}
        onPress={() => handlePokemonPress(item.id)}
      />
    ),
    [handlePokemonPress]
  );

  const keyExtractor = useCallback(
    (item: FavoritePokemonItem) => item.id.toString(),
    []
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <SearchBar onSearch={setSearchQuery} placeholder="Search favorites..." />
        <Text style={styles.title}>My Favorites</Text>
      </View>
    ),
    []
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          {searchQuery ? 'No matches found' : 'No favorites yet'}
        </Text>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `No favorites match "${searchQuery}"`
            : 'Tap the heart icon on any Pokémon to add it here!'}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  if (isLoading && pokemon.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.skeletonHeader}>
          <SearchBar onSearch={setSearchQuery} placeholder="Search favorites..." />
          <Text style={styles.title}>My Favorites</Text>
        </View>
        <SkeletonList count={4} />
      </View>
    );
  }

  if (isError && pokemon.length === 0) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Error loading favorites</Text>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredPokemon}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={filteredPokemon.length > 0 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={DesignTokens.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.background,
    gap: 12,
  },
  listContent: {
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
    marginHorizontal: -DesignTokens.spacing.screenPadding + DesignTokens.spacing.searchMargin,
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: DesignTokens.sizes.headerFontSize,
    color: DesignTokens.colors.midnight,
    marginTop: 24,
    marginLeft: DesignTokens.spacing.screenPadding - DesignTokens.spacing.searchMargin,
  },
  row: {
    gap: DesignTokens.spacing.cardGap,
    marginBottom: DesignTokens.spacing.cardGap,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
    color: DesignTokens.colors.midnight,
  },
  emptyText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: DesignTokens.colors.midnight,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  skeletonHeader: {
    marginBottom: 16,
    marginHorizontal: DesignTokens.spacing.searchMargin,
  },
  errorTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
    color: DesignTokens.colors.midnight,
  },
  errorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: DesignTokens.colors.midnight,
    opacity: 0.6,
  },
});
