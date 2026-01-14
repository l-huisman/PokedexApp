import { z } from 'zod';

// PokeAPI list response schema
export const NamedApiResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(NamedApiResourceSchema),
});

// Pokemon type schema
export const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: NamedApiResourceSchema,
});

// Pokemon stat schema
export const PokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: NamedApiResourceSchema,
});

// Pokemon ability schema
export const PokemonAbilitySchema = z.object({
  ability: NamedApiResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

// Pokemon sprites schema
export const PokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
  front_shiny: z.string().nullable(),
  back_default: z.string().nullable(),
  back_shiny: z.string().nullable(),
  other: z
    .object({
      'official-artwork': z
        .object({
          front_default: z.string().nullable(),
          front_shiny: z.string().nullable(),
        })
        .optional(),
    })
    .optional(),
});

// Full Pokemon detail schema
export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  types: z.array(PokemonTypeSlotSchema),
  stats: z.array(PokemonStatSchema),
  abilities: z.array(PokemonAbilitySchema),
  sprites: PokemonSpritesSchema,
  species: NamedApiResourceSchema,
});

// Pokemon species schema (for evolution chain)
export const PokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({
    url: z.string(),
  }),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: NamedApiResourceSchema,
      version: NamedApiResourceSchema,
    })
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: NamedApiResourceSchema,
    })
  ),
});

// Evolution chain schema
export const EvolutionDetailSchema = z.object({
  min_level: z.number().nullable(),
  trigger: NamedApiResourceSchema.nullable(),
  item: NamedApiResourceSchema.nullable(),
});

export const ChainLinkSchema: z.ZodType<ChainLink> = z.lazy(() =>
  z.object({
    species: NamedApiResourceSchema,
    evolution_details: z.array(EvolutionDetailSchema),
    evolves_to: z.array(ChainLinkSchema),
  })
);

export const EvolutionChainSchema = z.object({
  id: z.number(),
  chain: ChainLinkSchema,
});

// Inferred types
export type NamedApiResource = z.infer<typeof NamedApiResourceSchema>;
export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>;
export type PokemonTypeSlot = z.infer<typeof PokemonTypeSlotSchema>;
export type PokemonStat = z.infer<typeof PokemonStatSchema>;
export type PokemonAbility = z.infer<typeof PokemonAbilitySchema>;
export type PokemonSprites = z.infer<typeof PokemonSpritesSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionDetail = z.infer<typeof EvolutionDetailSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;

// Chain link interface for recursive type
export interface ChainLink {
  species: NamedApiResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}
