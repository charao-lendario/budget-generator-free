import React, { useState, useMemo } from 'react';
import { authService } from '../services/authService';
import { LogoIcon } from '../components/icons/LogoIcon';
import { Spinner } from '../components/Spinner';
import type { User } from '../types';

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
  onGoToLogin: () => void;
}

const inputStyles = "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-md shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-brand-text-secondary transition-colors";
const labelStyles = "block text-sm font-medium text-brand-text-secondary mb-1";

export const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordValidation = useMemo(() => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough, isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValidation.isValid) {
        setError("A senha não atende a todos os critérios de segurança.");
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const user = await authService.signup(name, whatsapp, email, password);
      // Automatically log in after signup
      const loggedInUser = await authService.login(email, password);
      onSignupSuccess(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationIndicator: React.FC<{isValid: boolean; text: string}> = ({isValid, text}) => (
    <span className={`text-xs ${isValid ? 'text-green-400' : 'text-brand-text-secondary'}`}>
        {isValid ? '✓' : '•'} {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <LogoIcon className="h-10 w-10 text-brand-primary" />
          <h1 className="mt-4 text-3xl font-bold text-brand-text tracking-tight">
            Crie sua Conta
          </h1>
        </div>
        
        <div className="bg-brand-surface p-8 rounded-xl border border-brand-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={labelStyles}>Nome Completo</label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} required autoComplete="name"/>
            </div>
             <div>
              <label htmlFor="whatsapp" className={labelStyles}>WhatsApp</label>
              <input type="tel" id="whatsapp" name="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputStyles} required autoComplete="tel"/>
            </div>
            <div>
              <label htmlFor="email" className={labelStyles}>E-mail</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required autoComplete="email"/>
            </div>
            <div>
              <label htmlFor="password" className={labelStyles}>Senha</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required autoComplete="new-password"/>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <ValidationIndicator isValid={passwordValidation.isLongEnough} text="8+ caracteres" />
                <ValidationIndicator isValid={passwordValidation.hasUpperCase} text="1 maiúscula" />
                <ValidationIndicator isValid={passwordValidation.hasLowerCase} text="1 minúscula" />
                <ValidationIndicator isValid={passwordValidation.hasNumber} text="1 número" />
                <ValidationIndicator isValid={passwordValidation.hasSpecialChar} text="1 especial" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading || !passwordValidation.isValid}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Spinner /> : 'Criar Conta'}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-brand-text-secondary">
          Já tem uma conta?{' '}
          <button onClick={onGoToLogin} className="font-medium text-brand-primary hover:underline">
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};