import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';

describe('PokemonsService', () => {
  let service: PokemonsService;

  const userId = 'user-uuid-1';
  const otherUserId = 'user-uuid-2';

  const mockPokemon: Pokemon = {
    id: 'poke-uuid-1',
    name: 'Pikachu',
    types: ['Elétrico'],
    level: 25,
    hp: 55,
    pokedexNumber: 25,
    imageUrl: null,
    createdById: userId,
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um Pokémon com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPokemon);
      mockRepository.save.mockResolvedValue(mockPokemon);

      const result = await service.create(
        {
          name: 'Pikachu',
          types: ['Elétrico'],
          level: 25,
          hp: 55,
          pokedexNumber: 25,
        },
        userId,
      );

      expect(result.name).toBe('Pikachu');
      expect(result.createdById).toBe(userId);
    });

    it('deve lançar ConflictException se número da Pokédex já existe', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);

      await expect(
        service.create(
          {
            name: 'Pikachu2',
            types: ['Elétrico'],
            level: 10,
            hp: 40,
            pokedexNumber: 25,
          },
          userId,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de Pokémons ordenada', async () => {
      mockRepository.find.mockResolvedValue([mockPokemon]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { pokedexNumber: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um Pokémon pelo ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);

      const result = await service.findOne('poke-uuid-1');
      expect(result.name).toBe('Pikachu');
    });

    it('deve lançar NotFoundException se Pokémon não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar Pokémon pelo criador', async () => {
      const updated = { ...mockPokemon, level: 30 };
      mockRepository.findOne.mockResolvedValue(mockPokemon);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(
        'poke-uuid-1',
        { level: 30 },
        userId,
      );
      expect(result.level).toBe(30);
    });

    it('deve lançar ForbiddenException se outro usuário tentar editar', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);

      await expect(
        service.update('poke-uuid-1', { level: 30 }, otherUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deve remover Pokémon pelo criador', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(
        service.remove('poke-uuid-1', userId),
      ).resolves.toBeUndefined();
    });

    it('deve lançar ForbiddenException se outro usuário tentar excluir', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);

      await expect(
        service.remove('poke-uuid-1', otherUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
