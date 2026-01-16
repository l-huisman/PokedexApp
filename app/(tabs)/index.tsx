import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { PokemonCard } from '@/components/pokemon-card';
import { SearchBar } from '@/components/search-bar';
import { SkeletonList } from '@/components/skeletons/skeleton-list';
import { ThemeSelector } from '@/components/theme-selector';
import { DesignTokens } from '@/constants/design-tokens';
import { useThemedColors } from '@/hooks/use-themed-tokens';
import { usePokemonList, type PokemonListItem } from '@/hooks/use-pokemon-list';
import { usePokemonSearch } from '@/hooks/use-pokemon-search';
import { getPokemonImageUrl } from '@/lib/api/pokemon';

const COLUMN_COUNT = 2;

export default function PokedexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemedColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

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

  const {
    searchResults,
    isLoading: isSearchLoading,
    isSearching,
  } = usePokemonSearch(searchQuery);

  const allPokemon = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const displayedPokemon = useMemo(() => {
    if (isSearching) {
      return searchResults;
    }
    return allPokemon;
  }, [isSearching, searchResults, allPokemon]);

  const handlePokemonPress = useCallback(
    (id: number) => {
      router.push(`/pokemon/${id}`);
    },
    [router]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isSearching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isSearching]);

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
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar onSearch={setSearchQuery} />
          </View>
          <Pressable
            style={[styles.settingsButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => setShowSettings(true)}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <MaterialIcons name="settings" size={24} color={colors.midnight} />
          </Pressable>
        </View>
        {isSearching ? (
          <Text style={[styles.resultsCount, { color: colors.midnight }]}>
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </Text>
        ) : (
          <Text style={[styles.title, { color: colors.midnight }]}>All Pokémon</Text>
        )}
      </View>
    ),
    [isSearching, searchResults.length, colors.midnight, colors.cardBackground]
  );

  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null,
    [isFetchingNextPage, colors.primary]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        {isSearching && isSearchLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={[styles.emptyText, { color: colors.midnight }]}>
            {isSearching
              ? `No Pokémon found for "${searchQuery}"`
              : 'No Pokémon available'}
          </Text>
        )}
      </View>
    ),
    [isSearching, isSearchLoading, searchQuery, colors.midnight, colors.primary]
  );

  if (isLoading) {
    return (
      <View
        style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.skeletonHeader}>
          <SearchBar onSearch={setSearchQuery} />
          <Text style={[styles.title, { color: colors.midnight }]}>All Pokémon</Text>
        </View>
        <SkeletonList count={6} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.centered, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.midnight }]}>
          Error loading Pokémon
        </Text>
        <Text style={[styles.errorText, { color: colors.midnight }]}>
          {error?.message ?? 'Unknown error'}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <FlatList
        data={displayedPokemon}
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
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />

      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <ThemeSelector />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  listContent: {
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    paddingBottom: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: -DesignTokens.spacing.screenPadding + DesignTokens.spacing.searchMargin,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: DesignTokens.spacing.searchMargin,
  },
  searchContainer: {
    flex: 1,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: DesignTokens.sizes.headerFontSize,
    marginTop: 24,
    marginLeft: DesignTokens.spacing.screenPadding - DesignTokens.spacing.searchMargin,
  },
  resultsCount: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    marginTop: 16,
    marginLeft: DesignTokens.spacing.screenPadding - DesignTokens.spacing.searchMargin,
    opacity: 0.6,
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
    opacity: 0.6,
  },
  skeletonHeader: {
    marginBottom: 16,
    marginHorizontal: DesignTokens.spacing.searchMargin,
  },
  errorTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
});
