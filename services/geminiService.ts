import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectData, Quote, ClientCounterOffer, CounterOfferAnalysis, Recommendation, ChatMessage, Tool } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quoteSchema = {
    type: Type.OBJECT,
    properties: {
        implementationFee: { type: Type.NUMBER, description: "Taxa única de implementação do projeto. DEVE incluir o custo total de ferramentas de Custo Único." },
        recurringFee: { type: Type.NUMBER, description: "Taxa mensal recorrente para manutenção e suporte. DEVE incluir o custo total de ferramentas de Custo Mensal." },
        reasoning: { type: Type.STRING, description: "Justificativa da precificação, focada no ROI e no valor gerado para o cliente. Exemplo: 'Com base na sua economia mensal de R$X, nosso orçamento representa um investimento que se paga em Y meses...'" }
    },
    required: ["implementationFee", "recurringFee", "reasoning"]
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: { type: Type.STRING, description: "Avaliação tática e detalhada da contraproposta do cliente, considerando o ROI do projeto e os custos fixos de ferramentas." },
        recommendation: { type: Type.STRING, enum: ['ACCEPT', 'COUNTER', 'DECLINE'], description: "A recomendação final: ACEITAR, CONTRAOFERTA, ou RECUSAR." },
        suggestedResponse: { type: Type.STRING, description: "Uma mensagem profissional e estratégica para enviar ao cliente, usando técnicas de negociação e ancorando a conversa no valor e ROI." },
        newOffer: {
            type: Type.OBJECT,
            properties: {
                implementationFee: { type: Type.NUMBER },
                recurringFee: { type: Type.NUMBER }
            },
            nullable: true,
        }
    },
    required: ["analysis", "recommendation", "suggestedResponse"]
};

const processTools = (tools: Tool[]) => {
    const totalUniqueCost = tools.filter(t => t.costType === 'Custo Único').reduce((sum, t) => sum + t.cost, 0);
    const totalMonthlyCost = tools.filter(t => t.costType === 'Custo Mensal').reduce((sum, t) => sum + t.cost, 0);
    const toolsSummary = tools.length > 0
        ? tools.map(t => `- ${t.name}: R$ ${t.cost} (${t.costType})`).join('\n')
        : 'Nenhuma ferramenta específica listada.';
    
    return { totalUniqueCost, totalMonthlyCost, toolsSummary };
}


export const generateQuote = async (projectData: ProjectData): Promise<Quote> => {
    const { totalUniqueCost, totalMonthlyCost, toolsSummary } = processTools(projectData.tools);

    const prompt = `
        Você é um Estrategista de Negociação Digital, especialista em precificação baseada em valor (Value-Based Pricing), modelado com base nos princípios de Chris Voss. Sua tarefa é gerar um orçamento que reflita o imenso impacto da solução no negócio do cliente, incorporando custos fixos de ferramentas.
        O mercado tem alta demanda e poucos especialistas. Sua precificação deve ser premium e ancorada no valor, não no custo.

        **Análise de Impacto e ROI (Dados Fornecidos pelo Cliente):**
        - Faturamento Anual do Cliente: ${projectData.annualRevenue}
        - Processo a ser Otimizado: ${projectData.processToOptimize}
        - Tempo Gasto Atualmente no Processo: ${projectData.timeSpent} horas/mês
        - Pessoas Envolvidas no Processo: ${projectData.peopleInvolved}
        - Custo ou Perda de Receita Mensal Estimada com o Processo Atual: R$ ${projectData.estimatedLoss}

        **Custos de Ferramentas (Fixos e Não Negociáveis):**
        ${toolsSummary}
        - Custo Único Total das Ferramentas: R$ ${totalUniqueCost}
        - Custo Mensal Total das Ferramentas: R$ ${totalMonthlyCost}

        **Detalhes Técnicos do Projeto:**
        - Proposta de Valor para o Cliente: ${projectData.clientValue}
        - Tamanho do Cliente: ${projectData.clientSize}
        - Complexidade do Projeto: ${projectData.complexity}
        - Urgência: ${projectData.urgency}
        - Necessidades de Integração: ${projectData.integrationNeeds}
        - Nível de Segurança: ${projectData.securityLevel}
        
        **Parâmetros da Equipe e Negócio:**
        - Duração Estimada (horas): ${projectData.duration}
        - Tamanho da Equipe: ${projectData.teamSize} pessoa(s)
        - Senioridade da Equipe: ${projectData.teamSeniority}
        - Nível de Suporte Pós-lançamento: ${projectData.supportLevel}
        - Margem de Lucro Desejada: ${projectData.desiredMargin}%

        **Sua Tarefa:**
        1.  **Ancore o preço no VALOR, não no custo.** Use a "Perda de Receita Mensal Estimada" como a principal referência.
        2.  Calcule um orçamento com 'taxa de implementação' e 'taxa recorrente' que cubra os custos da equipe, a margem de lucro e o valor percebido.
        3.  **ADICIONE OBRIGATORIAMENTE os custos fixos das ferramentas aos valores finais:**
            - 'implementationFee' DEVE ser = (seu preço de implementação baseado em valor) + ${totalUniqueCost}.
            - 'recurringFee' DEVE ser = (seu preço recorrente baseado em valor) + ${totalMonthlyCost}.
        4.  Na 'reasoning', crie uma justificativa poderosa que demonstre o ROI para o cliente. Frame o seu preço como um investimento inteligente, não um custo.
        5.  A moeda é BRL, mas retorne apenas os números nos campos de preço.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: quoteSchema,
        }
    });

    const text = response.text.trim();
    return JSON.parse(text) as Quote;
};

export const analyzeCounterOffer = async (projectData: ProjectData, originalQuote: Quote, clientOffer: ClientCounterOffer): Promise<CounterOfferAnalysis> => {
    const { totalUniqueCost, totalMonthlyCost, toolsSummary } = processTools(projectData.tools);
    
    const prompt = `
        Você é um Estrategista de Negociação Digital, modelado com base nos princípios de Chris Voss. Você forneceu um orçamento estratégico e o cliente fez uma contraproposta. Sua tarefa é analisar a oferta e aconselhar os próximos passos com tática e precisão.

        **Contexto Chave (ROI do Projeto):**
        - Custo/Perda Mensal que a Solução Resolve: R$ ${projectData.estimatedLoss}
        - Ganho Anual para o Cliente com a Solução: R$ ${projectData.estimatedLoss * 12}

        **Custos Fixos de Ferramentas (Não Negociáveis):**
        - Custo Único Total: R$ ${totalUniqueCost}
        - Custo Mensal Total: R$ ${totalMonthlyCost}

        **Nosso Orçamento Inicial (Baseado em Valor + Custos Fixos):**
        - Implementação: R$${originalQuote.implementationFee}
        - Recorrente: R$${originalQuote.recurringFee}/mês

        **Contraproposta do Cliente:**
        - Implementação: R$${clientOffer.implementation}
        - Recorrente: R$${clientOffer.recurring}/mês

        **Sua Tarefa:**
        1.  Analise a contraproposta. A oferta do cliente cobre pelo menos os custos fixos das ferramentas (R$${totalUniqueCost} na implementação e R$${totalMonthlyCost} na recorrência)?
        2.  A contraproposta desvaloriza o imenso valor da solução e compromete sua margem de lucro?
        3.  Forneça uma recomendação: "ACCEPT", "COUNTER", ou "DECLINE". A oferta deve ser recusada se não cobrir os custos das ferramentas.
        4.  Se recomendar "COUNTER", forneça uma nova oferta tática (newOffer) que seja justa e cubra os custos fixos.
        5.  Sua 'suggestedResponse' ao cliente deve ser estratégica. **Traga a conversa de volta para o VALOR**, mas você pode mencionar sutilmente os custos de ferramentas se necessário.
        6.  A moeda é BRL, mas retorne apenas os números nos campos de preço.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        }
    });

    const text = response.text.trim();
    const parsed = JSON.parse(text);
    return {
        ...parsed,
        recommendation: parsed.recommendation as Recommendation,
    } as CounterOfferAnalysis;
};

export const getChatResponse = async (projectData: ProjectData, quote: Quote, history: ChatMessage[]): Promise<string> => {
    const { toolsSummary } = processTools(projectData.tools);
    const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'Usuário' : 'Estrategista'}: ${msg.text}`).join('\n');

    const prompt = `
        Você é um Estrategista de Negociação Digital, especialista em precificação baseada em valor, modelado com base nos princípios de Chris Voss. Você está em uma conversa para ajudar o usuário a negociar o orçamento de um projeto.
        Seja conciso, tático e direto ao ponto. Use sua expertise para dar conselhos acionáveis.

        **Resumo do Projeto e Orçamento (Contexto):**
        - Processo a ser Otimizado: ${projectData.processToOptimize}
        - Custo/Perda Mensal que a Solução Resolve: R$ ${projectData.estimatedLoss}
        - Orçamento Proposto (Implementação): R$ ${quote.implementationFee}
        - Orçamento Proposto (Recorrente): R$ ${quote.recurringFee}/mês
        - Ferramentas e Tecnologias (Custos inclusos no orçamento):
        ${toolsSummary}

        **Histórico da Conversa Atual:**
        ${formattedHistory}

        **Sua Tarefa:**
        Com base em todo o contexto acima, responda à ÚLTIMA mensagem do usuário de forma útil e estratégica. Lembre-se que os custos das ferramentas são fixos.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};