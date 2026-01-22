import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
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
} from 'react-native-reanimated';
import PagerView, { PagerViewOnPageSelectedEvent, PagerViewOnPageScrollEvent } from 'react-native-pager-view';

import { TypeBadge } from '@/components/type-badge';
import { AboutTab } from '@/components/detail-tabs/about-tab';
import { StatsTab } from '@/components/detail-tabs/stats-tab';
import { EvolutionTab } from '@/components/detail-tabs/evolution-tab';
import { DesignTokens } from '@/constants/design-tokens';
import { useThemedTokens } from '@/hooks/use-themed-tokens';
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
  const { colors, detail: themeDetail } = useThemedTokens();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = id ? parseInt(id, 10) : undefined;

  const [activeTab, setActiveTab] = useState<TabName>('about');
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const { data, isLoading, isError, error } = usePokemonFullData(pokemonId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const pagerRef = useRef<PagerView>(null);

  const isFav = pokemonId ? isFavorite(pokemonId) : false;
  const tabWidth = tabBarWidth / TABS.length;

  // Animation values
  const heartScale = useSharedValue(1);
  const tabScrollPosition = useSharedValue(0);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Animated underline that follows swipe gesture
  const tabUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabScrollPosition.value * tabWidth }],
  }));

  const handleTabBarLayout = useCallback((e: LayoutChangeEvent) => {
    setTabBarWidth(e.nativeEvent.layout.width);
  }, []);

  const handlePageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    const pageIndex = e.nativeEvent.position;
    setActiveTab(TABS[pageIndex].key);
  }, []);

  const handlePageScroll = useCallback((e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    tabScrollPosition.value = position + offset;
  }, [tabScrollPosition]);

  const handleTabPress = useCallback((index: number) => {
    pagerRef.current?.setPage(index);
  }, []);

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
      <View
        style={[styles.centered, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.midnight }]}>Loading Pokémon...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View
        style={[styles.centered, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.midnight }]}>Error loading Pokémon</Text>
        <Text style={[styles.errorText, { color: colors.midnight }]}>
          {error?.message ?? 'Unknown error'}
        </Text>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}>
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
              color={colors.midnight}
            />
            <Text style={[styles.backText, { color: colors.midnight }]}>Back</Text>
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
                color={colors.midnight}
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
                  color={isFav ? themeDetail.favoriteActive : colors.midnight}
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>

        {/* Pokemon Info */}
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.midnight }]}>{formattedName}</Text>
          <Text style={[styles.id, { color: colors.midnight }]}>{formattedId}</Text>
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
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {/* Tab Bar */}
          <View style={styles.tabBar} onLayout={handleTabBarLayout}>
            {TABS.map((tab, index) => (
              <Pressable
                key={tab.key}
                style={styles.tab}
                onPress={() => handleTabPress(index)}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.key }}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.midnight },
                    activeTab !== tab.key && styles.tabTextInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
            {/* Animated underline indicator */}
            <Animated.View
              style={[
                styles.tabUnderline,
                { width: tabWidth, backgroundColor: themeDetail.tabUnderlineActive },
                tabUnderlineStyle,
              ]}
            />
          </View>

          {/* Swipeable Tab Content */}
          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={handlePageSelected}
            onPageScroll={handlePageScroll}
          >
            <View key="about" style={styles.pageContainer}>
              <AboutTab pokemon={detail} />
            </View>
            <View key="stats" style={styles.pageContainer}>
              <StatsTab pokemon={detail} />
            </View>
            <View key="evolution" style={styles.pageContainer}>
              <EvolutionTab chain={evolutionChain.chain} />
            </View>
          </PagerView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
  },
  errorTitle: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  },
  id: {
    fontFamily: 'Rubik_400Regular',
    fontSize: DesignTokens.sizes.detailIdFontSize,
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
    paddingTop: 74,
    paddingHorizontal: DesignTokens.spacing.screenPadding,
    paddingBottom: 40,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 10,
  },
  tabText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  tabTextInactive: {
    opacity: 0.5,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
  },
  pagerView: {
    flex: 1,
    minHeight: 300,
    marginTop: 24,
    marginHorizontal: -DesignTokens.spacing.screenPadding,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.screenPadding,
  },
});
