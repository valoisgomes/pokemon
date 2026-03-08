'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-pokemon-red shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Zap size={16} className="text-pokemon-red" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">
                Centro Pokémon
              </span>
              <span className="text-red-200 text-xs ml-2">Pokédex Admin</span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-red-200 text-xs">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
