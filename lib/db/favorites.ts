import { getDatabase } from './client';

export interface FavoriteRecord {
  id: number;
  pokemon_id: number;
  added_at: string;
}

export async function addFavorite(pokemonId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR IGNORE INTO favorites (pokemon_id) VALUES (?)',
    pokemonId
  );
}

export async function removeFavorite(pokemonId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM favorites WHERE pokemon_id = ?', pokemonId);
}

export async function getFavorites(): Promise<number[]> {
  const db = await getDatabase();
  const results = await db.getAllAsync<FavoriteRecord>(
    'SELECT pokemon_id FROM favorites ORDER BY added_at DESC'
  );
  return results.map((row) => row.pokemon_id);
}

export async function isFavorite(pokemonId: number): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<FavoriteRecord>(
    'SELECT id FROM favorites WHERE pokemon_id = ?',
    pokemonId
  );
  return result !== null;
}

export async function toggleFavorite(pokemonId: number): Promise<boolean> {
  const isFav = await isFavorite(pokemonId);
  if (isFav) {
    await removeFavorite(pokemonId);
    return false;
  } else {
    await addFavorite(pokemonId);
    return true;
  }
}
