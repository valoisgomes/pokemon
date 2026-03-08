import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'ash@pokemon.com',
    name: 'Ash Ketchum',
    password: '$2a$10$hashedpassword',
    role: 'trainer',
    pokemons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('deve registrar um novo usuário e retornar token', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });

      expect(result.user.email).toBe('ash@pokemon.com');
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'ash@pokemon.com',
        name: 'Ash Ketchum',
        password: 'pikachu123',
      });
    });

    it('deve lançar ConflictException se e-mail já existe', async () => {
      usersService.create.mockRejectedValue(
        new ConflictException('E-mail já cadastrado'),
      );

      await expect(
        service.register({
          email: 'ash@pokemon.com',
          name: 'Ash',
          password: 'pikachu123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve autenticar usuário com credenciais válidas', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        email: 'ash@pokemon.com',
        password: 'pikachu123',
      });

      expect(result.user.email).toBe('ash@pokemon.com');
      expect(result.accessToken).toBe('mock.jwt.token');
    });

    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'fake@pokemon.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se senha for inválida', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'ash@pokemon.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
