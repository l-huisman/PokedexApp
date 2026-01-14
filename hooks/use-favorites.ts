import { useCallback, useEffect, useState } from 'react';
import {
  getFavorites,
  addFavorite as addFavoriteDb,
  removeFavorite as removeFavoriteDb,
  toggleFavorite as toggleFavoriteDb,
} from '@/lib/db/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const favs = await getFavorites();
      setFavorites(favs);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load favorites'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(
    async (pokemonId: number) => {
      try {
        await addFavoriteDb(pokemonId);
        setFavorites((prev) => [pokemonId, ...prev]);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to add favorite'));
        throw e;
      }
    },
    []
  );

  const removeFavorite = useCallback(
    async (pokemonId: number) => {
      try {
        await removeFavoriteDb(pokemonId);
        setFavorites((prev) => prev.filter((id) => id !== pokemonId));
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error('Failed to remove favorite')
        );
        throw e;
      }
    },
    []
  );

  const toggleFavorite = useCallback(
    async (pokemonId: number) => {
      try {
        const isFav = await toggleFavoriteDb(pokemonId);
        if (isFav) {
          setFavorites((prev) => [pokemonId, ...prev]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== pokemonId));
        }
        return isFav;
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error('Failed to toggle favorite')
        );
        throw e;
      }
    },
    []
  );

  const isFavorite = useCallback(
    (pokemonId: number) => favorites.includes(pokemonId),
    [favorites]
  );

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}
