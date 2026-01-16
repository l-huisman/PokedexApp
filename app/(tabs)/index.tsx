import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { usePokemonList, type PokemonListItem } from '@/hooks/use-pokemon-list';
import { getPokemonImageUrl } from '@/lib/api/pokemon';

const COLUMN_COUNT = 2;

export default function PokedexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePokemonList();

  const allPokemon = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPokemon;
    }
    const query = searchQuery.toLowerCase().trim();
    return allPokemon.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query)
    );
  }, [allPokemon, searchQuery]);

  const handlePokemonPress = useCallback(
    (id: number) => {
      router.push(`/pokemon/${id}`);
    },
    [router]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !searchQuery) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, searchQuery]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
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
    (item: PokemonListItem) => item.id.toString(),
    []
  );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <SearchBar onSearch={setSearchQuery} />
        <Text style={styles.title}>All Pokémon</Text>
      </View>
    ),
    []
  );

  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={DesignTokens.colors.primary} />
        </View>
      ) : null,
    [isFetchingNextPage]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `No Pokémon found for "${searchQuery}"`
            : 'No Pokémon available'}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.skeletonHeader}>
          <SearchBar onSearch={setSearchQuery} />
          <Text style={styles.title}>All Pokémon</Text>
        </View>
        <SkeletonList count={6} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Error loading Pokémon</Text>
        <Text style={styles.errorText}>{error?.message ?? 'Unknown error'}</Text>
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
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
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
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
    color: DesignTokens.colors.midnight,
    opacity: 0.6,
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
