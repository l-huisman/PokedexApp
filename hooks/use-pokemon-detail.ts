import { useQuery } from '@tanstack/react-query';
import {
  getPokemonDetail,
  getPokemonSpecies,
  getEvolutionChain,
  extractIdFromUrl,
} from '@/lib/api/pokemon';
import type {
  PokemonDetail,
  PokemonSpecies,
  EvolutionChain,
} from '@/lib/api/types';

export function usePokemonDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => getPokemonDetail(id!),
    enabled: id !== undefined,
  });
}

export function usePokemonSpecies(id: number | undefined) {
  return useQuery({
    queryKey: ['pokemon', 'species', id],
    queryFn: () => getPokemonSpecies(id!),
    enabled: id !== undefined,
  });
}

export function useEvolutionChain(speciesData: PokemonSpecies | undefined) {
  const chainId = speciesData
    ? extractIdFromUrl(speciesData.evolution_chain.url)
    : undefined;

  return useQuery({
    queryKey: ['pokemon', 'evolution', chainId],
    queryFn: () => getEvolutionChain(chainId!),
    enabled: chainId !== undefined,
  });
}

export interface PokemonFullData {
  detail: PokemonDetail;
  species: PokemonSpecies;
  evolutionChain: EvolutionChain;
}

export function usePokemonFullData(id: number | undefined) {
  const detailQuery = usePokemonDetail(id);
  const speciesQuery = usePokemonSpecies(id);
  const evolutionQuery = useEvolutionChain(speciesQuery.data);

  const isLoading =
    detailQuery.isLoading ||
    speciesQuery.isLoading ||
    evolutionQuery.isLoading;

  const isError =
    detailQuery.isError || speciesQuery.isError || evolutionQuery.isError;

  const error = detailQuery.error ?? speciesQuery.error ?? evolutionQuery.error;

  const data: PokemonFullData | undefined =
    detailQuery.data && speciesQuery.data && evolutionQuery.data
      ? {
          detail: detailQuery.data,
          species: speciesQuery.data,
          evolutionChain: evolutionQuery.data,
        }
      : undefined;

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
