import React from 'react';
import { LogoIcon } from '../components/icons/LogoIcon';
import { BrowserMockup } from '../components/BrowserMockup';
import { ValueIcon } from '../components/icons/ValueIcon';
import { NegotiateIcon } from '../components/icons/NegotiateIcon';
import { PdfIcon } from '../components/icons/PdfIcon';
import { CalculatorIcon } from '../components/icons/CalculatorIcon';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-brand-surface/50 p-6 rounded-lg border border-brand-border transform transition-transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary/10 text-brand-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-brand-text mb-2">{title}</h3>
    <p className="text-sm text-brand-text-secondary">{children}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onGoToSignup }) => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col overflow-x-hidden">
      <header className="py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 bg-brand-bg/70 backdrop-blur-sm border-b border-brand-border">
        <nav className="flex items-center justify-between container mx-auto">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-brand-primary" />
            <span className="ml-3 text-2xl font-bold tracking-tight">IA Budget Generator</span>
          </div>
          <div className="space-x-2 sm:space-x-4">
            <button onClick={onGoToLogin} className="px-3 sm:px-4 py-2 text-sm font-medium text-brand-text-secondary hover:text-brand-text transition-colors">
              Entrar
            </button>
            <button onClick={onGoToSignup} className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors">
              Criar Conta Grátis
            </button>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
                Precifique projetos com <span className="text-brand-primary">Inteligência Artificial</span>.
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-brand-text-secondary mx-auto md:mx-0 mb-8">
                Deixe de chutar valores. Use nossa IA para criar orçamentos baseados em valor, analisar contrapropostas e gerar PDFs profissionais em minutos.
              </p>
              <button onClick={onGoToSignup} className="px-8 py-4 text-lg font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-transform transform hover:scale-105 shadow-lg shadow-brand-primary/20">
                Comece a Usar Agora
              </button>
            </div>
            <div>
              <BrowserMockup>
                <div className="p-4 bg-brand-bg h-full">
                    <div className="flex justify-between items-baseline mb-4">
                        <div className="w-2/5 h-8 bg-brand-primary/80 rounded animate-pulse"></div>
                        <div className="w-1/4 h-8 bg-brand-primary/80 rounded animate-pulse"></div>
                    </div>
                    <div className="p-3 bg-brand-bg/50 border border-brand-border rounded space-y-2">
                        <div className="h-3 w-3/4 bg-brand-text-secondary/50 rounded animate-pulse"></div>
                        <div className="h-3 w-full bg-brand-text-secondary/50 rounded animate-pulse"></div>
                    </div>
                     <div className="mt-4 p-4 bg-brand-surface rounded-lg border border-brand-border">
                        <div className="w-full h-4 bg-brand-border rounded animate-pulse mb-3"></div>
                        <div className="w-3/4 h-4 bg-brand-border rounded animate-pulse"></div>
                     </div>
                </div>
              </BrowserMockup>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-brand-surface/30 border-y border-brand-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Uma Plataforma Estratégica Completa</h2>
              <p className="mt-4 text-brand-text-secondary">Vá além de simples cálculos. Transforme cada orçamento em uma proposta de valor irrefutável.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<ValueIcon className="w-6 h-6" />} title="Precificação Baseada em Valor">
                Ancore seus preços no ROI real do cliente, justificando valores mais altos e aumentando suas margens de lucro.
              </FeatureCard>
              <FeatureCard icon={<NegotiateIcon className="w-6 h-6" />} title="Estrategista de Negociação">
                Receba análises táticas e converse em tempo real com a IA para tirar dúvidas e simular cenários de negociação.
              </FeatureCard>
              <FeatureCard icon={<CalculatorIcon className="w-6 h-6" />} title="Cálculo Preciso de Custos">
                Adicione dinamicamente os custos de ferramentas e tecnologias, que são somados automaticamente ao orçamento final.
              </FeatureCard>
               <FeatureCard icon={<PdfIcon className="w-6 h-6" />} title="Propostas Profissionais">
                Gere PDFs com sua marca, logotipo e termos de pagamento em segundos, prontos para enviar e impressionar seu cliente.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-12">Seu Orçamento Perfeito em 3 Passos</h2>
                 <div className="relative">
                    {/* Dashed line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-brand-border border-t border-dashed border-brand-border -translate-y-1/2"></div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="flex flex-col items-center p-6 bg-brand-surface rounded-lg">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white text-2xl font-bold mb-4 border-4 border-brand-bg">1</div>
                            <h3 className="text-xl font-semibold mb-2">Descreva o Projeto</h3>
                            <p className="text-brand-text-secondary text-sm">Preencha os campos com as métricas de impacto do cliente e os parâmetros técnicos da sua equipe.</p>
                        </div>
                         <div className="flex flex-col items-center p-6 bg-brand-surface rounded-lg">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white text-2xl font-bold mb-4 border-4 border-brand-bg">2</div>
                            <h3 className="text-xl font-semibold mb-2">Receba a Análise da IA</h3>
                            <p className="text-brand-text-secondary text-sm">Nossa IA calcula o orçamento ideal focado em valor e fornece uma justificativa estratégica para defendê-lo.</p>
                        </div>
                         <div className="flex flex-col items-center p-6 bg-brand-surface rounded-lg">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white text-2xl font-bold mb-4 border-4 border-brand-bg">3</div>
                            <h3 className="text-xl font-semibold mb-2">Exporte e Negocie</h3>
                            <p className="text-brand-text-secondary text-sm">Gere um PDF profissional com um clique ou use o chat com o estrategista para se preparar para a negociação.</p>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-brand-surface/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Pare de perder dinheiro. Comece a precificar com confiança.</h2>
                <p className="max-w-2xl text-lg text-brand-text-secondary mx-auto mb-8">
                    Junte-se a desenvolvedores e agências que estão transformando suas negociações.
                </p>
                <button onClick={onGoToSignup} className="px-8 py-4 text-lg font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-transform transform hover:scale-105 shadow-lg shadow-brand-primary/20">
                    Criar Minha Conta Grátis
                </button>
            </div>
        </section>
      </main>

      <footer className="text-center py-6 text-brand-text-secondary text-sm border-t border-brand-border">
        <p>&copy; {new Date().getFullYear()} IA Budget Generator. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};