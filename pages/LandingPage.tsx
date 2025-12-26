import React from 'react';
import { LogoIcon } from '../components/icons/LogoIcon';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onGoToSignup }) => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-brand-border">
        <nav className="flex items-center justify-between container mx-auto">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-brand-primary" />
            <span className="ml-3 text-xl font-bold tracking-tight">IA Budget Generator</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-sm font-medium text-brand-text border border-brand-border rounded-md hover:bg-brand-surface transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={onGoToSignup}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
            >
              Teste Grátis
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-brand-primary/50 bg-brand-primary/10 mb-8">
            <span className="text-yellow-400 mr-2">⚡</span>
            <span className="text-brand-primary font-semibold text-sm uppercase tracking-wide">
              Teste gratuitamente e se surpreenda
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            Pare de Perder Dinheiro
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-primary italic mb-8">
            Deixando Valor na Mesa
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-brand-text mb-4 max-w-3xl mx-auto">
            A única ferramenta que usa as técnicas do <strong>maior negociador do FBI</strong><br />
            para criar orçamentos que seus clientes <strong>PRECISAM</strong> aceitar
          </p>

          {/* Secondary text */}
          <p className="text-brand-text-secondary mb-10 max-w-2xl mx-auto">
            Enquanto você cria orçamentos genéricos, seus concorrentes estão fechando 3x
            mais negócios com IA. Quanto dinheiro você vai perder antes de agir?
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToSignup}
              className="px-8 py-4 text-lg font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-brand-primary/30 flex items-center"
            >
              <span className="mr-2">🔥</span>
              TESTE AGORA
            </button>
            <button
              onClick={onGoToLogin}
              className="px-8 py-4 text-lg font-medium text-brand-text border border-brand-border rounded-lg hover:bg-brand-surface transition-colors"
            >
              Já Tenho Conta
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-brand-text-secondary text-sm border-t border-brand-border">
        <p>&copy; {new Date().getFullYear()} IA Budget Generator. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};