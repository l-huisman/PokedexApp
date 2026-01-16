import { fetchApi } from './client';
import {
  PokemonListResponseSchema,
  PokemonDetailSchema,
  PokemonSpeciesSchema,
  EvolutionChainSchema,
  type PokemonListResponse,
  type PokemonDetail,
  type PokemonSpecies,
  type EvolutionChain,
} from './types';

const PAGE_SIZE = 50;

export async function getPokemonList(
  offset = 0,
  limit = PAGE_SIZE
): Promise<PokemonListResponse> {
  const data = await fetchApi<unknown>(`/pokemon?offset=${offset}&limit=${limit}`);
  return PokemonListResponseSchema.parse(data);
}

export async function getAllPokemonNames(): Promise<PokemonListResponse> {
  const data = await fetchApi<unknown>('/pokemon?limit=2000');
  return PokemonListResponseSchema.parse(data);
}

export async function getPokemonDetail(
  idOrName: number | string
): Promise<PokemonDetail> {
  const data = await fetchApi<unknown>(`/pokemon/${idOrName}`);
  return PokemonDetailSchema.parse(data);
}

export async function getPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const data = await fetchApi<unknown>(`/pokemon-species/${id}`);
  return PokemonSpeciesSchema.parse(data);
}

export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
  const data = await fetchApi<unknown>(`/evolution-chain/${id}`);
  return EvolutionChainSchema.parse(data);
}

export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/?$/);
  if (!matches) {
    throw new Error(`Could not extract ID from URL: ${url}`);
  }
  return parseInt(matches[1], 10);
}

export function getPokemonImageUrl(id: number, officialArtwork = false): string {
  const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  return officialArtwork
    ? `${base}/other/official-artwork/${id}.png`
    : `${base}/${id}.png`;
}
