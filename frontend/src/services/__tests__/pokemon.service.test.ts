import { pokemonService } from '../pokemon.service';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

const mockPokemon = {
  id: 'poke-1',
  name: 'Pikachu',
  types: ['Elétrico'],
  level: 25,
  hp: 55,
  pokedexNumber: 25,
  createdById: 'user-1',
  createdBy: { id: 'user-1', name: 'Ash', email: 'ash@pokemon.com' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('pokemonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de Pokémons', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: [mockPokemon] });

      const result = await pokemonService.getAll();

      expect(result).toEqual([mockPokemon]);
      expect(mockedApi.get).toHaveBeenCalledWith('/pokemons');
    });
  });

  describe('getById', () => {
    it('deve retornar Pokémon pelo ID', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockPokemon });

      const result = await pokemonService.getById('poke-1');

      expect(result).toEqual(mockPokemon);
      expect(mockedApi.get).toHaveBeenCalledWith('/pokemons/poke-1');
    });
  });

  describe('create', () => {
    it('deve criar um Pokémon', async () => {
      (mockedApi.post as jest.Mock).mockResolvedValue({ data: mockPokemon });

      const result = await pokemonService.create({
        name: 'Pikachu',
        types: ['Elétrico'],
        level: 25,
        hp: 55,
        pokedexNumber: 25,
      });

      expect(result).toEqual(mockPokemon);
      expect(mockedApi.post).toHaveBeenCalledWith('/pokemons', {
        name: 'Pikachu',
        types: ['Elétrico'],
        level: 25,
        hp: 55,
        pokedexNumber: 25,
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um Pokémon', async () => {
      const updated = { ...mockPokemon, level: 30 };
      (mockedApi.patch as jest.Mock).mockResolvedValue({ data: updated });

      const result = await pokemonService.update('poke-1', { level: 30 });

      expect(result.level).toBe(30);
      expect(mockedApi.patch).toHaveBeenCalledWith('/pokemons/poke-1', {
        level: 30,
      });
    });
  });

  describe('delete', () => {
    it('deve excluir um Pokémon', async () => {
      (mockedApi.delete as jest.Mock).mockResolvedValue({});

      await pokemonService.delete('poke-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/pokemons/poke-1');
    });
  });
});
