import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from '../PokemonCard';
import { Pokemon } from '@/types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockPokemon: Pokemon = {
  id: 'poke-1',
  name: 'Pikachu',
  types: ['Elétrico'],
  level: 25,
  hp: 55,
  pokedexNumber: 25,
  imageUrl: undefined,
  createdById: 'user-1',
  createdBy: { id: 'user-1', name: 'Ash', email: 'ash@pokemon.com' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('PokemonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar informações do Pokémon', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="user-1"
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Elétrico')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('deve mostrar botões de editar/excluir para o criador', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="user-1"
        {...mockHandlers}
      />,
    );

    expect(screen.getByTitle('Editar')).toBeInTheDocument();
    expect(screen.getByTitle('Excluir')).toBeInTheDocument();
  });

  it('não deve mostrar botões de ação para outros usuários', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="other-user"
        {...mockHandlers}
      />,
    );

    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument();
  });

  it('deve chamar onEdit ao clicar em editar', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="user-1"
        {...mockHandlers}
      />,
    );

    fireEvent.click(screen.getByTitle('Editar'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockPokemon);
  });

  it('deve chamar onDelete ao clicar em excluir', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="user-1"
        {...mockHandlers}
      />,
    );

    fireEvent.click(screen.getByTitle('Excluir'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockPokemon);
  });

  it('deve exibir o nome do criador', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        currentUserId="user-1"
        {...mockHandlers}
      />,
    );

    expect(screen.getByText('Ash')).toBeInTheDocument();
  });
});
