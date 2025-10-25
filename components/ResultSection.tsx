import React, { useState } from 'react';
import type { Quote, ClientCounterOffer, CounterOfferAnalysis } from '../types';
import { Recommendation } from '../types';
import { Spinner } from './Spinner';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface ResultSectionProps {
  quote: Quote;
  analysis: CounterOfferAnalysis | null;
  onAnalyzeCounterOffer: (clientOffer: ClientCounterOffer) => void;
  isLoadingAnalysis: boolean;
  onReset: () => void;
  onOpenChat: () => void;
  onOpenPdfModal: (finalQuote: Quote) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(amount);
}

const RecommendationBadge: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full inline-block border";
    switch (recommendation) {
        case Recommendation.ACCEPT:
            return <span className={`${baseClasses} bg-green-500/10 text-green-300 border-green-500/30`}>Aceitar</span>;
        case Recommendation.COUNTER:
            return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-300 border-yellow-500/30`}>Contraproposta</span>;
        case Recommendation.DECLINE:
            return <span className={`${baseClasses} bg-red-500/10 text-red-300 border-red-500/30`}>Recusar</span>;
        default:
            return null;
    }
}

const inputStyles = "mt-1 w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-md shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-brand-text-secondary transition-colors";
const labelStyles = "block text-sm font-medium text-brand-text-secondary";
const primaryButtonStyles = "w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors";

export const ResultSection: React.FC<ResultSectionProps> = ({ quote, analysis, onAnalyzeCounterOffer, isLoadingAnalysis, onReset, onOpenChat, onOpenPdfModal }) => {
  const [counterOffer, setCounterOffer] = useState<ClientCounterOffer>({ implementation: 0, recurring: 0 });

  const handleCounterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCounterOffer(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyzeCounterOffer(counterOffer);
  };

  const handleGenerateOriginalPdf = () => {
    onOpenPdfModal(quote);
  };

  const handleGenerateAcceptedPdf = () => {
    onOpenPdfModal({
      implementationFee: counterOffer.implementation,
      recurringFee: counterOffer.recurring,
      reasoning: `Proposta do cliente aceita. Justificativa original: ${quote.reasoning}`
    });
  };

  const handleGenerateCounterPdf = () => {
    if (analysis?.newOffer) {
      onOpenPdfModal({
        implementationFee: analysis.newOffer.implementationFee,
        recurringFee: analysis.newOffer.recurringFee,
        reasoning: `Contraproposta baseada na análise. Justificativa original: ${quote.reasoning}`
      });
    }
  };


  return (
    <div className="space-y-8">
      {/* AI Generated Quote Card */}
      <div className="bg-brand-surface p-6 md:p-8 rounded-xl border border-brand-border relative">
        <button onClick={onReset} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text transition-colors" title="Iniciar Novo Orçamento">
          <ArrowPathIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-brand-text mb-2 text-center">Orçamento Gerado por IA</h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-baseline gap-4 md:gap-8 my-6 text-center">
            <div>
                <p className="text-lg text-brand-text-secondary">Taxa de Implementação</p>
                <p className="text-4xl font-bold text-brand-primary">{formatCurrency(quote.implementationFee)}</p>
            </div>
            <div className="text-2xl font-light text-brand-border">+</div>
            <div>
                <p className="text-lg text-brand-text-secondary">Taxa Recorrente</p>
                <p className="text-4xl font-bold text-brand-primary">{formatCurrency(quote.recurringFee)}<span className="text-xl font-medium text-brand-text-secondary">/mês</span></p>
            </div>
        </div>
        <div className="bg-brand-bg/50 p-4 rounded-lg border border-brand-border mb-6">
            <h4 className="font-semibold text-brand-text-secondary mb-1">Justificativa Baseada em Valor e ROI:</h4>
            <p className="text-brand-text italic">"{quote.reasoning}"</p>
        </div>
        <div className="mt-4">
            <button onClick={handleGenerateOriginalPdf} className={primaryButtonStyles}>
                Gerar PDF da Proposta
            </button>
        </div>
      </div>

      {/* Counter Offer and Analysis Section */}
      <div className="bg-brand-surface p-6 md:p-8 rounded-xl border border-brand-border">
        {!analysis ? (
             <form onSubmit={handleCounterSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-brand-text text-center">Analisar Contraproposta do Cliente</h3>
                <p className="text-center text-brand-text-secondary text-sm pb-2">Insira a proposta do cliente para obter aconselhamento de negociação com IA.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="implementation" className={labelStyles}>Oferta de Implementação do Cliente</label>
                        <input type="number" name="implementation" value={counterOffer.implementation || ''} onChange={handleCounterChange} className={inputStyles} placeholder="Ex: 40000" required />
                    </div>
                    <div>
                        <label htmlFor="recurring" className={labelStyles}>Oferta Recorrente do Cliente (/mês)</label>
                        <input type="number" name="recurring" value={counterOffer.recurring || ''} onChange={handleCounterChange} className={inputStyles} placeholder="Ex: 4500" required />
                    </div>
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={isLoadingAnalysis} className={primaryButtonStyles}>
                        {isLoadingAnalysis ? <Spinner /> : 'Analisar Oferta'}
                    </button>
                </div>
             </form>
        ) : (
            <div>
                <h3 className="text-2xl font-bold text-brand-text mb-4 text-center">Análise Tática da Negociação</h3>
                <div className="text-center mb-6">
                    <RecommendationBadge recommendation={analysis.recommendation} />
                </div>
                <div className="space-y-6">
                    <div className="bg-brand-bg/50 p-4 rounded-lg border border-brand-border">
                        <h4 className="font-semibold text-brand-text-secondary mb-1">Análise Tática do Estrategista:</h4>
                        <p className="text-brand-text">{analysis.analysis}</p>
                    </div>

                    {analysis.recommendation === Recommendation.COUNTER && analysis.newOffer && (
                        <div className="border-2 border-dashed border-yellow-500/50 bg-yellow-500/10 p-4 rounded-lg text-center">
                            <h4 className="font-semibold text-yellow-300">Sugestão de Contra-Contraproposta:</h4>
                             <p className="text-xl font-bold text-yellow-200 mt-2">
                                {formatCurrency(analysis.newOffer.implementationFee)} (implementação) + {formatCurrency(analysis.newOffer.recurringFee)}/mês (recorr.)
                            </p>
                        </div>
                    )}

                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                        <h4 className="font-semibold text-blue-300 mb-1">Resposta Sugerida ao Cliente:</h4>
                        <p className="text-blue-200 italic">"{analysis.suggestedResponse}"</p>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                        {analysis.recommendation === Recommendation.ACCEPT && (
                            <button onClick={handleGenerateAcceptedPdf} className={primaryButtonStyles}>
                                Aceitar Oferta do Cliente e Gerar PDF
                            </button>
                        )}
                        {analysis.recommendation === Recommendation.COUNTER && (
                             <button onClick={handleGenerateCounterPdf} className={primaryButtonStyles}>
                                Usar Contraproposta e Gerar PDF
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button 
        onClick={onOpenChat}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary transition-transform transform hover:scale-110"
        title="Converse com o Estrategista de IA"
      >
        <ChatBubbleIcon className="h-7 w-7" />
      </button>
    </div>
  );
};