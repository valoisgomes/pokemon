import api from './api';
import { Pokemon, PokemonFormData } from '@/types';

export const pokemonService = {
  async getAll(): Promise<Pokemon[]> {
    const { data } = await api.get<Pokemon[]>('/pokemons');
    return data;
  },

  async getById(id: string): Promise<Pokemon> {
    const { data } = await api.get<Pokemon>(`/pokemons/${id}`);
    return data;
  },

  async create(pokemon: PokemonFormData): Promise<Pokemon> {
    const { data } = await api.post<Pokemon>('/pokemons', pokemon);
    return data;
  },

  async update(id: string, pokemon: Partial<PokemonFormData>): Promise<Pokemon> {
    const { data } = await api.patch<Pokemon>(`/pokemons/${id}`, pokemon);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pokemons/${id}`);
  },
};
