import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { TypeBadge } from '@/components/type-badge';
import { AboutTab } from '@/components/detail-tabs/about-tab';
import { StatsTab } from '@/components/detail-tabs/stats-tab';
import { EvolutionTab } from '@/components/detail-tabs/evolution-tab';
import { DesignTokens } from '@/constants/design-tokens';
import { usePokemonFullData } from '@/hooks/use-pokemon-detail';
import { useFavorites } from '@/hooks/use-favorites';
import { getPokemonImageUrl } from '@/lib/api/pokemon';

type TabName = 'about' | 'stats' | 'evolution';

const TABS: { key: TabName; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'stats', label: 'Stats' },
  { key: 'evolution', label: 'Evolution' },
];

export default function PokemonDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = id ? parseInt(id, 10) : undefined;

  const [activeTab, setActiveTab] = useState<TabName>('about');
  const { data, isLoading, isError, error } = usePokemonFullData(pokemonId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = pokemonId ? isFavorite(pokemonId) : false;

  // Animation values
  const heartScale = useSharedValue(1);
  const tabOpacity = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const tabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabOpacity.value,
  }));

  // Animate tab content on tab change (skip initial mount)
  const isFirstRender = useSharedValue(true);

  useEffect(() => {
    if (isFirstRender.value) {
      isFirstRender.value = false;
      return;
    }
    tabOpacity.value = withSequence(
      withTiming(0, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
  }, [activeTab, tabOpacity, isFirstRender]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFavoriteToggle = useCallback(async () => {
    // Trigger heart pulse animation
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );

    if (pokemonId) {
      await toggleFavorite(pokemonId);
    }
  }, [pokemonId, toggleFavorite, heartScale]);

  const handleShare = useCallback(async () => {
    if (!data?.detail) return;

    const pokemon = data.detail;
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const formattedId = pokemon.id.toString().padStart(3, '0');

    try {
      await Share.share({
        message: `Check out ${name} (#${formattedId}) in the Pokédex!`,
        title: `${name} - Pokédex`,
      });
    } catch {
      // User cancelled or error occurred
    }
  }, [data?.detail]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={DesignTokens.colors.primary} />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Error loading Pokémon</Text>
        <Text style={styles.errorText}>{error?.message ?? 'Unknown error'}</Text>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const { detail, evolutionChain } = data;
  const formattedName = detail.name.charAt(0).toUpperCase() + detail.name.slice(1);
  const formattedId = `#${detail.id.toString().padStart(3, '0')}`;
  const imageUrl = getPokemonImageUrl(detail.id, true);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={handleBack}
            hitSlop={8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={DesignTokens.colors.midnight}
            />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerButton}
              onPress={handleShare}
              hitSlop={8}
              accessibilityLabel="Share"
              accessibilityRole="button"
            >
              <MaterialIcons
                name="share"
                size={24}
                color={DesignTokens.colors.midnight}
              />
            </Pressable>

            <Pressable
              style={styles.headerButton}
              onPress={handleFavoriteToggle}
              hitSlop={8}
              accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
            >
              <Animated.View style={heartAnimatedStyle}>
                <MaterialIcons
                  name={isFav ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={isFav ? DesignTokens.detail.favoriteActive : DesignTokens.colors.midnight}
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>

        {/* Pokemon Info */}
        <View style={styles.titleRow}>
          <Text style={styles.name}>{formattedName}</Text>
          <Text style={styles.id}>{formattedId}</Text>
        </View>

        {/* Type Badges */}
        <View style={styles.typeBadges}>
          {detail.types.map((t) => (
            <TypeBadge key={t.type.name} typeName={t.type.name} />
          ))}
        </View>

        {/* Pokemon Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.pokemonImage}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* White Card */}
        <View style={styles.card}>
          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      activeTab === tab.key
                        ? DesignTokens.detail.tabUnderlineActive
                        : DesignTokens.detail.tabUnderlineInactive,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.key }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab !== tab.key && styles.tabTextInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content with fade animation */}
          <Animated.View style={[styles.tabContent, tabAnimatedStyle]}>
            {activeTab === 'about' && <AboutTab pokemon={detail} />}
            {activeTab === 'stats' && <StatsTab pokemon={detail} />}
            {activeTab === 'evolution' && (
              <EvolutionTab chain={evolutionChain.chain} />
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.background,
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
    color: DesignTokens.colors.midnight,
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
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    color: DesignTokens.colors.midnight,
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    marginTop: 8,
  },
  name: {
    fontFamily: 'Rubik_700Bold',
    fontSize: DesignTokens.sizes.detailNameFontSize,
    color: DesignTokens.colors.midnight,
  },
  id: {
    fontFamily: 'Rubik_400Regular',
    fontSize: DesignTokens.sizes.detailIdFontSize,
    color: DesignTokens.colors.midnight,
    opacity: 0.3,
  },
  typeBadges: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    marginTop: 12,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: -50,
    zIndex: 1,
  },
  pokemonImage: {
    width: DesignTokens.sizes.detailImageSize,
    height: DesignTokens.sizes.detailImageSize,
  },
  card: {
    backgroundColor: DesignTokens.colors.cardBackground,
    paddingTop: 74,
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    paddingBottom: 40,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: DesignTokens.colors.midnight,
    textAlign: 'center',
  },
  tabTextInactive: {
    opacity: 0.5,
  },
  tabContent: {
    flex: 1,
  },
});
