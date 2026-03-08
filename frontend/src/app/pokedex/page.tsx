'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { pokemonService } from '@/services/pokemon.service';
import { Pokemon, PokemonFormData } from '@/types';
import Navbar from '@/components/Navbar';
import PokemonCard from '@/components/PokemonCard';
import PokemonModal from '@/components/PokemonModal';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';
import { Plus, Search, RefreshCw } from 'lucide-react';

export default function PokedexPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filtered, setFiltered] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const loadPokemons = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pokemonService.getAll();
      setPokemons(data);
      setFiltered(data);
    } catch {
      toast.error('Erro ao carregar Pokémons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadPokemons();
    }
  }, [user, loadPokemons]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      pokemons.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.types.some((t) => t.toLowerCase().includes(q)) ||
          String(p.pokedexNumber).includes(q),
      ),
    );
  }, [search, pokemons]);

  const handleCreate = async (data: PokemonFormData) => {
    try {
      setIsSaving(true);
      await pokemonService.create(data);
      toast.success(`${data.name} adicionado à Pokédex!`);
      setIsModalOpen(false);
      loadPokemons();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erro ao adicionar Pokémon';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: PokemonFormData) => {
    if (!selectedPokemon) return;
    try {
      setIsSaving(true);
      await pokemonService.update(selectedPokemon.id, data);
      toast.success(`${data.name} atualizado!`);
      setIsModalOpen(false);
      setSelectedPokemon(null);
      loadPokemons();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erro ao atualizar Pokémon';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPokemon) return;
    try {
      setIsDeleting(true);
      await pokemonService.delete(selectedPokemon.id);
      toast.success(`${selectedPokemon.name} removido da Pokédex`);
      setIsDeleteModalOpen(false);
      setSelectedPokemon(null);
      loadPokemons();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erro ao excluir Pokémon';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const openDeleteModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedPokemon(null);
    setIsModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-3">⚪</div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Pokédex Administrativa
            </h1>
            <p className="text-gray-500 mt-1">
              {pokemons.length} Pokémon{pokemons.length !== 1 ? 's' : ''}{' '}
              registrados
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadPokemons}
              className="btn-secondary flex items-center gap-2 py-2.5 px-4"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-2 py-2.5 px-5"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por nome, tipo ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Grid de Pokémons */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl animate-bounce mb-4">⚪</div>
            <p className="text-gray-500 text-lg">Carregando Pokémons...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {search ? 'Nenhum Pokémon encontrado' : 'Pokédex vazia'}
            </h3>
            <p className="text-gray-400 mb-6">
              {search
                ? `Nenhum resultado para "${search}"`
                : 'Adicione o primeiro Pokémon ao Centro!'}
            </p>
            {!search && (
              <button
                onClick={openCreateModal}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar Pokémon
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                currentUserId={user?.id || ''}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Criar/Editar */}
      <PokemonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPokemon(null);
        }}
        onSubmit={selectedPokemon ? handleUpdate : handleCreate}
        pokemon={selectedPokemon}
        isLoading={isSaving}
      />

      {/* Modal Confirmar Delete */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Pokémon"
        message={`Tem certeza que deseja excluir ${selectedPokemon?.name}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedPokemon(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
