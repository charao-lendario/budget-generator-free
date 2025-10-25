import React, { useState } from 'react';
import { authService } from '../services/authService';
import { LogoIcon } from '../components/icons/LogoIcon';
import { Spinner } from '../components/Spinner';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onGoToSignup: () => void;
}

const inputStyles = "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-md shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-brand-text-secondary transition-colors";
const labelStyles = "block text-sm font-medium text-brand-text-secondary mb-1";

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <LogoIcon className="h-10 w-10 text-brand-primary" />
          <h1 className="mt-4 text-3xl font-bold text-brand-text tracking-tight">
            Acesse sua Conta
          </h1>
        </div>
        
        <div className="bg-brand-surface p-8 rounded-xl border border-brand-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={labelStyles}>E-mail</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required autoComplete="email"/>
            </div>
            <div>
              <label htmlFor="password" className={labelStyles}>Senha</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required autoComplete="current-password"/>
            </div>
             {error && <p className="text-sm text-red-400">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Spinner /> : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-brand-text-secondary">
          Não tem uma conta?{' '}
          <button onClick={onGoToSignup} className="font-medium text-brand-primary hover:underline">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};