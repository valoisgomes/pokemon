import {
  IsString,
  IsArray,
  IsInt,
  Min,
  Max,
  IsUrl,
  IsOptional,
  ArrayMinSize,
  MinLength,
} from 'class-validator';

export const POKEMON_TYPES = [
  'Normal', 'Fogo', 'Água', 'Elétrico', 'Grama', 'Gelo',
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto',
  'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada',
] as const;

export class CreatePokemonDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Pokémon deve ter pelo menos 1 tipo' })
  @IsString({ each: true })
  types: string[];

  @IsInt()
  @Min(1, { message: 'Nível mínimo é 1' })
  @Max(100, { message: 'Nível máximo é 100' })
  level: number;

  @IsInt()
  @Min(1, { message: 'HP mínimo é 1' })
  hp: number;

  @IsInt()
  @Min(1, { message: 'Número da Pokédex mínimo é 1' })
  @Max(10000)
  pokedexNumber: number;

  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem inválida' })
  imageUrl?: string;
}
