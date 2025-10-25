export type ToolCostType = 'Custo Único' | 'Custo Mensal';

export interface Tool {
  id: string;
  name: string;
  cost: number;
  costType: ToolCostType;
}

export interface ProjectData {
  clientValue: string;
  clientSize: 'Startup' | 'Pequena Empresa' | 'Média Empresa' | 'Grande Corporação';
  duration: number; // em horas
  tools: Tool[];
  complexity: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  
  // Novos campos do lado do cliente
  urgency: 'Normal' | 'Urgente' | 'Data Crítica';
  integrationNeeds: 'Nenhuma' | 'Simples (APIs públicas)' | 'Complexa (Sistemas legados, ERPs)';
  securityLevel: 'Padrão' | 'Elevada (Dados sensíveis)' | 'Máxima (Financeiro/Saúde)';
  
  // Novos campos do lado do desenvolvimento
  teamSize: number;
  teamSeniority: 'Júnior-Pleno' | 'Pleno-Sênior' | 'Especialistas';
  supportLevel: 'Básico (Horário comercial)' | 'Estendido (24/5)' | 'Premium (24/7)';
  desiredMargin: number; // porcentagem

  // Novos campos de métricas de impacto
  annualRevenue: string;
  processToOptimize: string;
  timeSpent: number; // horas/mês
  peopleInvolved: number;
  estimatedLoss: number; // R$/mês
}

export interface Quote {
  implementationFee: number;
  recurringFee: number;
  reasoning: string;
}

export interface ClientCounterOffer {
  implementation: number;
  recurring: number;
}

export enum Recommendation {
    ACCEPT = 'ACCEPT',
    COUNTER = 'COUNTER',
    DECLINE = 'DECLINE'
}

export interface CounterOfferAnalysis {
  analysis: string;
  recommendation: Recommendation;
  suggestedResponse: string;
  newOffer?: {
    implementationFee: number;
    recurringFee: number;
  };
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface PdfInfo {
  yourCompanyName: string;
  yourEmail: string;
  yourPhone: string;
  clientCompanyName: string;
  clientContactName: string;
  yourCompanyLogo?: string; // Base64 string of the logo
  paymentTerms: string;
}

export interface User {
  name: string;
  whatsapp: string;
  email: string;
}