'use client';

import Image from 'next/image';
import { Pokemon } from '@/types';
import TypeBadge from './TypeBadge';
import { Edit2, Trash2, Shield } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon;
  currentUserId: string;
  onEdit: (pokemon: Pokemon) => void;
  onDelete: (pokemon: Pokemon) => void;
}

export default function PokemonCard({
  pokemon,
  currentUserId,
  onEdit,
  onDelete,
}: PokemonCardProps) {
  const isOwner = pokemon.createdById === currentUserId;
  const defaultImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300 group">
      {/* Header com número da Pokédex */}
      <div className="bg-gradient-to-r from-pokemon-red to-red-400 px-4 py-2 flex items-center justify-between">
        <span className="text-white font-bold text-sm">
          #{String(pokemon.pokedexNumber).padStart(3, '0')}
        </span>
        {isOwner && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(pokemon)}
              className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-md transition-colors"
              title="Editar"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(pokemon)}
              className="p-1.5 bg-white/20 hover:bg-red-900/60 text-white rounded-md transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Imagem */}
      <div className="relative h-40 bg-gray-50 flex items-center justify-center p-4">
        <Image
          src={pokemon.imageUrl || defaultImage}
          alt={pokemon.name}
          width={120}
          height={120}
          className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
      </div>

      {/* Informações */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 capitalize mb-2">
          {pokemon.name}
        </h3>

        {/* Tipos */}
        <div className="flex flex-wrap gap-1 mb-3">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} small />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <span className="font-semibold">Nv.</span>
            <span className="text-pokemon-blue font-bold">{pokemon.level}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Shield size={14} className="text-green-500" />
            <span className="font-semibold">HP:</span>
            <span className="text-green-600 font-bold">{pokemon.hp}</span>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((pokemon.hp / 255) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Criador */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Cadastrado por{' '}
            <span className="font-semibold text-gray-600">
              {pokemon.createdBy?.name || 'Desconhecido'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
