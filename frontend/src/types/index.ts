export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Pokemon {
  id: string;
  name: string;
  types: string[];
  level: number;
  hp: number;
  pokedexNumber: number;
  imageUrl?: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PokemonFormData {
  name: string;
  types: string[];
  level: number;
  hp: number;
  pokedexNumber: number;
  imageUrl?: string;
}

export const POKEMON_TYPES = [
  'Normal', 'Fogo', 'Água', 'Elétrico', 'Grama', 'Gelo',
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto',
  'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada',
] as const;

export const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-400',
  Fogo: 'bg-orange-500',
  Água: 'bg-blue-500',
  Elétrico: 'bg-yellow-400',
  Grama: 'bg-green-500',
  Gelo: 'bg-cyan-300',
  Lutador: 'bg-red-700',
  Veneno: 'bg-purple-500',
  Terra: 'bg-yellow-600',
  Voador: 'bg-indigo-400',
  Psíquico: 'bg-pink-500',
  Inseto: 'bg-lime-500',
  Pedra: 'bg-yellow-800',
  Fantasma: 'bg-purple-800',
  Dragão: 'bg-indigo-700',
  Sombrio: 'bg-gray-700',
  Aço: 'bg-gray-500',
  Fada: 'bg-pink-300',
};
