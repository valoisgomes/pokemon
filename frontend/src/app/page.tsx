'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/pokedex');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pokemon-red">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-spin">⚪</div>
        <p className="text-xl font-bold">Carregando Centro Pokémon...</p>
      </div>
    </div>
  );
}
