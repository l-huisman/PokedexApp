import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonList, extractIdFromUrl } from '@/lib/api/pokemon';

const PAGE_SIZE = 50;

export interface PokemonListItem {
  id: number;
  name: string;
}

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getPokemonList(pageParam, PAGE_SIZE);
      const items: PokemonListItem[] = response.results.map((pokemon) => ({
        id: extractIdFromUrl(pokemon.url),
        name: pokemon.name,
      }));
      return {
        items,
        nextOffset: response.next ? pageParam + PAGE_SIZE : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}
