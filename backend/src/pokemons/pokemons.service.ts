import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonsRepository: Repository<Pokemon>,
  ) {}

  async create(
    createPokemonDto: CreatePokemonDto,
    userId: string,
  ): Promise<Pokemon> {
    const existing = await this.pokemonsRepository.findOne({
      where: { pokedexNumber: createPokemonDto.pokedexNumber },
    });

    if (existing) {
      throw new ConflictException(
        `Pokémon com número de Pokédex ${createPokemonDto.pokedexNumber} já existe`,
      );
    }

    const pokemon = this.pokemonsRepository.create({
      ...createPokemonDto,
      createdById: userId,
    });

    return this.pokemonsRepository.save(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonsRepository.find({
      order: { pokedexNumber: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonsRepository.findOne({ where: { id } });

    if (!pokemon) {
      throw new NotFoundException(`Pokémon #${id} não encontrado`);
    }

    return pokemon;
  }

  async update(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
    userId: string,
  ): Promise<Pokemon> {
    const pokemon = await this.findOne(id);

    if (pokemon.createdById !== userId) {
      throw new ForbiddenException(
        'Você só pode editar Pokémons que você cadastrou',
      );
    }

    if (
      updatePokemonDto.pokedexNumber &&
      updatePokemonDto.pokedexNumber !== pokemon.pokedexNumber
    ) {
      const existing = await this.pokemonsRepository.findOne({
        where: { pokedexNumber: updatePokemonDto.pokedexNumber },
      });
      if (existing) {
        throw new ConflictException(
          `Pokémon com número de Pokédex ${updatePokemonDto.pokedexNumber} já existe`,
        );
      }
    }

    Object.assign(pokemon, updatePokemonDto);
    return this.pokemonsRepository.save(pokemon);
  }

  async remove(id: string, userId: string): Promise<void> {
    const pokemon = await this.findOne(id);

    if (pokemon.createdById !== userId) {
      throw new ForbiddenException(
        'Você só pode excluir Pokémons que você cadastrou',
      );
    }

    await this.pokemonsRepository.remove(pokemon);
  }
}
