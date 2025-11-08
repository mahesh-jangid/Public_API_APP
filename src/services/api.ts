import axios from 'axios';
import type { Pokemon, PokemonListResponse } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: API_URL,
});

export const getPokemons = async (offset = 0, limit = 20): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const getPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return response.data;
};

export const getAllPokemons = async (): Promise<Pokemon[]> => {
  // This limit should be high enough to get all Pokémon for client-side filtering.
  // The PokeAPI has around 1300 Pokémon as of now.
  const response = await api.get<PokemonListResponse>('/pokemon?limit=1500');
  const pokemonDetails = await Promise.all(
    response.data.results.map(pokemon => getPokemon(pokemon.name))
  );
  // Sort by ID by default
  pokemonDetails.sort((a, b) => a.id - b.id);
  return pokemonDetails;
};

export interface SearchParams {
  query: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export const searchPokemons = async ({ query, type, limit = 20, offset = 0 }: SearchParams): Promise<Pokemon[]> => {
  try {
    // Get the paginated list
    const paginatedResponse = await api.get<PokemonListResponse>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );

    if (!paginatedResponse.data.results.length) {
      return [];
    }

    // Get detailed information for this page
    const pokemonDetails = await Promise.all(
      paginatedResponse.data.results.map(pokemon => getPokemon(pokemon.name))
    );

    // Apply name filter if query exists
    let filteredPokemon = query
      ? pokemonDetails.filter(pokemon =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        )
      : pokemonDetails;

    // Apply type filter if specified
    if (type) {
      filteredPokemon = filteredPokemon.filter(pokemon =>
        pokemon.types.some(t => t.type.name === type)
      );
    }

    return filteredPokemon;
  } catch (error) {
    console.error('Error in searchPokemons:', error);
    return [];
  }
};