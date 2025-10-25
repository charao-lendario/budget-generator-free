import React, { useState } from 'react';
import type { ProjectData, Tool, ToolCostType } from '../types';
import { Spinner } from './Spinner';

interface QuoteFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading: boolean;
}

const inputStyles = "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-md shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-brand-text-secondary transition-colors";
const labelStyles = "block text-sm font-medium text-brand-text-secondary mb-1";
const fieldsetStyles = "border border-brand-border rounded-lg p-4 space-y-6";
const legendStyles = "px-2 text-base font-semibold text-brand-text";

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProjectData>({
    clientValue: '',
    clientSize: 'Média Empresa',
    duration: 160,
    teamSize: 2,
    tools: [
      { id: crypto.randomUUID(), name: 'Servidor de Produção (AWS)', cost: 500, costType: 'Custo Mensal'},
      { id: crypto.randomUUID(), name: 'Licença de Software X', cost: 2000, costType: 'Custo Único'},
    ],
    complexity: 'Média',
    urgency: 'Normal',
    integrationNeeds: 'Simples (APIs públicas)',
    securityLevel: 'Padrão',
    teamSeniority: 'Pleno-Sênior',
    supportLevel: 'Básico (Horário comercial)',
    desiredMargin: 30,
    annualRevenue: 'R$ 5-20 milhões',
    processToOptimize: 'Envio manual de orçamentos para clientes',
    timeSpent: 40,
    peopleInvolved: 2,
    estimatedLoss: 25000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numberFields = ['duration', 'teamSize', 'desiredMargin', 'timeSpent', 'peopleInvolved', 'estimatedLoss'];
    setFormData(prev => ({ ...prev, [name]: numberFields.includes(name) ? Number(value) : value }));
  };

  const handleToolChange = (id: string, field: keyof Tool, value: string | number) => {
    setFormData(prev => ({
        ...prev,
        tools: prev.tools.map(tool => 
            tool.id === id ? { ...tool, [field]: field === 'cost' ? Number(value) : value } : tool
        )
    }));
  };

  const handleAddTool = () => {
    setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, { id: crypto.randomUUID(), name: '', cost: 0, costType: 'Custo Único' }]
    }));
  };

  const handleRemoveTool = (id: string) => {
    setFormData(prev => ({
        ...prev,
        tools: prev.tools.filter(tool => tool.id !== id)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-brand-surface p-6 md:p-8 rounded-xl border border-brand-border">
      <h2 className="text-2xl font-bold text-brand-text mb-6 text-center">Descreva Seu Projeto</h2>
      <form onSubmit={handleSubmit} className="space-y-8">

        <fieldset className={fieldsetStyles}>
            <legend className={legendStyles}>Métricas de Impacto no Negócio</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="annualRevenue" className={labelStyles}>Faturamento Anual do Cliente</label>
                    <input type="text" id="annualRevenue" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} className={inputStyles} placeholder="Ex: R$ 10 milhões" required />
                </div>
                <div>
                    <label htmlFor="estimatedLoss" className={labelStyles}>Custo/Perda Mensal Estimada (R$)</label>
                    <input type="number" id="estimatedLoss" name="estimatedLoss" value={formData.estimatedLoss} onChange={handleChange} min="0" className={inputStyles} placeholder="Ex: 50000" required />
                </div>
            </div>
            <div>
              <label htmlFor="processToOptimize" className={labelStyles}>
                Processo a ser Otimizado
              </label>
              <input
                type="text"
                id="processToOptimize"
                name="processToOptimize"
                value={formData.processToOptimize}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Ex: Envio manual de orçamentos, gestão de leads..."
                required
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="timeSpent" className={labelStyles}>Tempo Gasto Atualmente (horas/mês)</label>
                    <input type="number" id="timeSpent" name="timeSpent" value={formData.timeSpent} onChange={handleChange} min="0" className={inputStyles} placeholder="Ex: 80" required />
                </div>
                <div>
                    <label htmlFor="peopleInvolved" className={labelStyles}>Pessoas Envolvidas no Processo</label>
                    <input type="number" id="peopleInvolved" name="peopleInvolved" value={formData.peopleInvolved} onChange={handleChange} min="1" className={inputStyles} placeholder="Ex: 3" required />
                </div>
            </div>
        </fieldset>

        <fieldset className={fieldsetStyles}>
            <legend className={legendStyles}>Detalhes do Cliente</legend>
            <div>
              <label htmlFor="clientValue" className={labelStyles}>
                Proposta de Valor para o Cliente
              </label>
              <textarea
                id="clientValue"
                name="clientValue"
                value={formData.clientValue}
                onChange={handleChange}
                rows={3}
                className={inputStyles}
                placeholder="Ex: Reduzir o tempo de envio de orçamentos de 5 dias para 10 minutos, aumentando a taxa de conversão."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientSize" className={labelStyles}>Tamanho do Cliente</label>
                <select id="clientSize" name="clientSize" value={formData.clientSize} onChange={handleChange} className={inputStyles}>
                  <option>Startup</option>
                  <option>Pequena Empresa</option>
                  <option>Média Empresa</option>
                  <option>Grande Corporação</option>
                </select>
              </div>
              <div>
                <label htmlFor="urgency" className={labelStyles}>Urgência do Projeto</label>
                <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange} className={inputStyles}>
                  <option>Normal</option>
                  <option>Urgente</option>
                  <option>Data Crítica</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="integrationNeeds" className={labelStyles}>Necessidades de Integração</label>
                    <select id="integrationNeeds" name="integrationNeeds" value={formData.integrationNeeds} onChange={handleChange} className={inputStyles}>
                      <option>Nenhuma</option>
                      <option>Simples (APIs públicas)</option>
                      <option>Complexa (Sistemas legados, ERPs)</option>
                    </select>
                 </div>
                 <div>
                    <label htmlFor="securityLevel" className={labelStyles}>Nível de Segurança</label>
                    <select id="securityLevel" name="securityLevel" value={formData.securityLevel} onChange={handleChange} className={inputStyles}>
                      <option>Padrão</option>
                      <option>Elevada (Dados sensíveis)</option>
                      <option>Máxima (Financeiro/Saúde)</option>
                    </select>
                 </div>
            </div>
        </fieldset>

        <fieldset className={fieldsetStyles}>
            <legend className={legendStyles}>Parâmetros da Equipe & Ferramentas</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="complexity" className={labelStyles}>Complexidade do Projeto</label>
                  <select id="complexity" name="complexity" value={formData.complexity} onChange={handleChange} className={inputStyles}>
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                    <option>Muito Alta</option>
                  </select>
                </div>
                 <div>
                    <label htmlFor="teamSeniority" className={labelStyles}>Senioridade da Equipe</label>
                    <select id="teamSeniority" name="teamSeniority" value={formData.teamSeniority} onChange={handleChange} className={inputStyles}>
                      <option>Júnior-Pleno</option>
                      <option>Pleno-Sênior</option>
                      <option>Especialistas</option>
                    </select>
                 </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="duration" className={labelStyles}>Duração Estimada (horas)</label>
                    <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="1" className={inputStyles} required />
                </div>
                <div>
                    <label htmlFor="teamSize" className={labelStyles}>Tamanho da Equipe</label>
                    <input type="number" id="teamSize" name="teamSize" value={formData.teamSize} onChange={handleChange} min="1" className={inputStyles} required />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="supportLevel" className={labelStyles}>Nível de Suporte Pós-Lançamento</label>
                    <select id="supportLevel" name="supportLevel" value={formData.supportLevel} onChange={handleChange} className={inputStyles}>
                      <option>Básico (Horário comercial)</option>
                      <option>Estendido (24/5)</option>
                      <option>Premium (24/7)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="desiredMargin" className={labelStyles}>Margem de Lucro Desejada (%)</label>
                    <input type="number" id="desiredMargin" name="desiredMargin" value={formData.desiredMargin} onChange={handleChange} min="0" max="100" className={inputStyles} required />
                </div>
            </div>
            
            {/* Dynamic Tools Section */}
            <div className="space-y-4">
                <label className={labelStyles}>Ferramentas & Tecnologias (Custos Fixos)</label>
                {formData.tools.map((tool, index) => (
                    <div key={tool.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Nome da Ferramenta"
                            value={tool.name}
                            onChange={(e) => handleToolChange(tool.id, 'name', e.target.value)}
                            className={`${inputStyles} md:col-span-3`}
                        />
                         <input
                            type="number"
                            placeholder="Custo (R$)"
                            value={tool.cost || ''}
                            onChange={(e) => handleToolChange(tool.id, 'cost', e.target.value)}
                            className={`${inputStyles} md:col-span-2`}
                            min="0"
                        />
                        <select
                            value={tool.costType}
                            onChange={(e) => handleToolChange(tool.id, 'costType', e.target.value)}
                            className={`${inputStyles} md:col-span-2`}
                        >
                            <option>Custo Único</option>
                            <option>Custo Mensal</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => handleRemoveTool(tool.id)}
                            className="text-red-400 hover:text-red-300 md:col-span-1 h-10 w-10 flex items-center justify-center rounded-md bg-brand-bg border border-brand-border"
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddTool}
                    className="w-full px-4 py-2 text-sm font-medium text-brand-primary border-2 border-dashed border-brand-border hover:bg-brand-border/50 rounded-md transition-colors"
                >
                    Adicionar Ferramenta +
                </button>
            </div>
        </fieldset>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Spinner /> : 'Gerar Orçamento com IA'}
          </button>
        </div>
      </form>
    </div>
  );
};