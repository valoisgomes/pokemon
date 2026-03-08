'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pokemon, POKEMON_TYPES, PokemonFormData } from '@/types';
import { X, Save } from 'lucide-react';

const pokemonSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  types: z.array(z.string()).min(1, 'Selecione pelo menos 1 tipo'),
  level: z.coerce
    .number()
    .int()
    .min(1, 'Nível mínimo é 1')
    .max(100, 'Nível máximo é 100'),
  hp: z.coerce.number().int().min(1, 'HP mínimo é 1'),
  pokedexNumber: z.coerce
    .number()
    .int()
    .min(1, 'Número mínimo é 1')
    .max(10000),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

type PokemonFormSchema = z.infer<typeof pokemonSchema>;

interface PokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PokemonFormData) => Promise<void>;
  pokemon?: Pokemon | null;
  isLoading?: boolean;
}

export default function PokemonModal({
  isOpen,
  onClose,
  onSubmit,
  pokemon,
  isLoading,
}: PokemonModalProps) {
  const isEditing = !!pokemon;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PokemonFormSchema>({
    resolver: zodResolver(pokemonSchema),
    defaultValues: { types: [] },
  });

  const selectedTypes = watch('types') || [];

  useEffect(() => {
    if (pokemon) {
      reset({
        name: pokemon.name,
        types: pokemon.types,
        level: pokemon.level,
        hp: pokemon.hp,
        pokedexNumber: pokemon.pokedexNumber,
        imageUrl: pokemon.imageUrl || '',
      });
    } else {
      reset({ name: '', types: [], level: 1, hp: 1, pokedexNumber: 1, imageUrl: '' });
    }
  }, [pokemon, reset]);

  const toggleType = (type: string) => {
    const current = selectedTypes;
    if (current.includes(type)) {
      setValue('types', current.filter((t) => t !== type));
    } else if (current.length < 2) {
      setValue('types', [...current, type]);
    }
  };

  const handleFormSubmit = async (data: PokemonFormSchema) => {
    await onSubmit({
      ...data,
      imageUrl: data.imageUrl || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pokemon-red to-red-400 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">
            {isEditing ? `Editar ${pokemon.name}` : 'Adicionar Pokémon'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              {...register('name')}
              placeholder="Ex: Pikachu"
              className="input-field"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Número Pokédex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número da Pokédex *
            </label>
            <input
              {...register('pokedexNumber')}
              type="number"
              placeholder="Ex: 25"
              className="input-field"
            />
            {errors.pokedexNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.pokedexNumber.message}
              </p>
            )}
          </div>

          {/* Tipos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipos * (máx. 2)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {POKEMON_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`text-xs py-1.5 px-2 rounded-full font-semibold transition-all border-2 ${
                      isSelected
                        ? 'bg-pokemon-red text-white border-pokemon-red'
                        : 'bg-gray-100 text-gray-600 border-transparent hover:border-gray-300'
                    } ${
                      !isSelected && selectedTypes.length >= 2
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={!isSelected && selectedTypes.length >= 2}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            {errors.types && (
              <p className="mt-1 text-sm text-red-500">{errors.types.message}</p>
            )}
          </div>

          {/* Nível e HP */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível * (1-100)
              </label>
              <input
                {...register('level')}
                type="number"
                min={1}
                max={100}
                placeholder="Ex: 25"
                className="input-field"
              />
              {errors.level && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HP *
              </label>
              <input
                {...register('hp')}
                type="number"
                min={1}
                placeholder="Ex: 55"
                className="input-field"
              />
              {errors.hp && (
                <p className="mt-1 text-sm text-red-500">{errors.hp.message}</p>
              )}
            </div>
          </div>

          {/* URL da imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem (opcional)
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              placeholder="https://..."
              className="input-field"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
            >
              {isSubmitting || isLoading ? (
                <span className="animate-spin">⚪</span>
              ) : (
                <Save size={16} />
              )}
              {isEditing ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
