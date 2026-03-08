import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'ash@pokemon.com',
    name: 'Ash Ketchum',
    password: 'hashed_password',
    role: 'trainer',
    pokemons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar usuário com senha hasheada', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);

      const result = await service.create({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });

      expect(result.email).toBe('ash@pokemon.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('pikachu123', 10);
    });

    it('deve lançar ConflictException se e-mail já existe', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: 'ash@pokemon.com',
          name: 'Ash',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário pelo e-mail', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('ash@pokemon.com');
      expect(result.email).toBe('ash@pokemon.com');
    });

    it('deve retornar null se usuário não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('ghost@pokemon.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('deve retornar usuário pelo ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('user-uuid-1');
      expect(result.id).toBe('user-uuid-1');
    });
  });
});
