import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import type { User } from '../types';


interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-brand-bg border-b border-brand-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="ml-3 text-2xl md:text-3xl font-bold text-brand-text tracking-tight">
              IA Budget Generator
            </h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-brand-text-secondary">Olá, {user.name.split(' ')[0]}</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-brand-text-secondary hover:text-brand-text transition-colors"
                title="Sair"
              >
                <LogoutIcon className="h-6 w-6" />
                <span className="hidden md:inline text-sm">Sair</span>
              </button>
          </div>
        )}
      </div>
    </header>
  );
};