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
  Normal: '#9ca3af',
  Fogo: '#f97316',
  Água: '#3b82f6',
  Elétrico: '#facc15',
  Grama: '#22c55e',
  Gelo: '#67e8f9',
  Lutador: '#b91c1c',
  Veneno: '#a855f7',
  Terra: '#ca8a04',
  Voador: '#818cf8',
  Psíquico: '#ec4899',
  Inseto: '#84cc16',
  Pedra: '#92400e',
  Fantasma: '#6b21a8',
  Dragão: '#4338ca',
  Sombrio: '#374151',
  Aço: '#6b7280',
  Fada: '#f9a8d4',
};
