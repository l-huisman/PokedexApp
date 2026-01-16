import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPokemonNames, extractIdFromUrl } from '@/lib/api/pokemon';
import type { PokemonListItem } from './use-pokemon-list';

const THIRTY_MINUTES = 30 * 60 * 1000;

export function usePokemonSearch(query: string) {
  const {
    data: allPokemon,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pokemon', 'all-names'],
    queryFn: async () => {
      const response = await getAllPokemonNames();
      return response.results.map((pokemon): PokemonListItem => ({
        id: extractIdFromUrl(pokemon.url),
        name: pokemon.name,
      }));
    },
    staleTime: THIRTY_MINUTES,
  });

  const searchResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery || !allPokemon) {
      return [];
    }
    return allPokemon.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(trimmedQuery) ||
        pokemon.id.toString().includes(trimmedQuery)
    );
  }, [query, allPokemon]);

  return {
    searchResults,
    isLoading,
    isError,
    error,
    isSearching: query.trim().length > 0,
  };
}
