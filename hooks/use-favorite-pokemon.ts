import { useQueries } from '@tanstack/react-query';
import { getPokemonDetail } from '@/lib/api/pokemon';
import { useFavorites } from './use-favorites';

export interface FavoritePokemonItem {
  id: number;
  name: string;
}

export function useFavoritePokemon() {
  const { favorites, isLoading: isFavoritesLoading, error: favoritesError, refresh } = useFavorites();

  const pokemonQueries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ['pokemon', 'detail', id],
      queryFn: () => getPokemonDetail(id),
      staleTime: Infinity,
      enabled: !isFavoritesLoading,
    })),
  });

  const isLoading = isFavoritesLoading || pokemonQueries.some((q) => q.isLoading);
  const isError = favoritesError !== null || pokemonQueries.some((q) => q.isError);
  const error = favoritesError ?? pokemonQueries.find((q) => q.error)?.error ?? null;

  const pokemon: FavoritePokemonItem[] = pokemonQueries
    .filter((q) => q.data !== undefined)
    .map((q) => ({
      id: q.data!.id,
      name: q.data!.name,
    }));

  return {
    pokemon,
    isLoading,
    isError,
    error,
    refresh,
  };
}
