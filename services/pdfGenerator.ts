import { jsPDF } from "jspdf";
import type { PdfInfo, Quote } from "../types";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export const generateProposalPdf = (info: PdfInfo, quote: Quote) => {
    const doc = new jsPDF();
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 7);

    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

    let headerY = 20;

    // --- Logo ---
    if (info.yourCompanyLogo) {
        try {
            const imgProps = doc.getImageProperties(info.yourCompanyLogo);
            const logoHeight = 15;
            const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
            doc.addImage(info.yourCompanyLogo, 'PNG', 20, 15, logoWidth, logoHeight);
            headerY = 40; // Push down the header text if logo exists
        } catch (e) {
            console.error("Error adding logo to PDF:", e);
        }
    }

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Proposta de Projeto", 105, headerY, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Data de Emissão: ${formatDate(today)}`, 105, headerY + 10, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0); // Red color for expiry
    doc.text(`Válido até: ${formatDate(expiryDate)}`, 105, headerY + 17, { align: "center" });
    doc.setTextColor(0, 0, 0);

    // --- Company Info ---
    const startY = headerY + 35;
    doc.setLineWidth(0.5);
    doc.line(20, startY - 5, 190, startY - 5);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("De:", 20, startY);
    doc.text("Para:", 110, startY);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(info.yourCompanyName, 20, startY + 7);
    doc.text(info.yourEmail, 20, startY + 12);
    doc.text(info.yourPhone, 20, startY + 17);

    doc.text(info.clientCompanyName, 110, startY + 7);
    doc.text(`A/C: ${info.clientContactName}`, 110, startY + 12);
    
    doc.line(20, startY + 25, 190, startY + 25);

    // --- Quote Details ---
    const quoteY = startY + 40;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Valores do Investimento", 105, quoteY, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Taxa de Implementação (única):", 20, quoteY + 15);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(quote.implementationFee), 190, quoteY + 15, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    doc.text("Taxa Recorrente (mensal):", 20, quoteY + 22);
    doc.setFont("helvetica", "bold");
    doc.text(`${formatCurrency(quote.recurringFee)} / mês`, 190, quoteY + 22, { align: "right" });
    
    // --- Justification ---
    const reasoningY = quoteY + 40;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Justificativa Baseada em Valor e ROI", 20, reasoningY);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const reasoningText = doc.splitTextToSize(`"${quote.reasoning}"`, 170);
    doc.text(reasoningText, 20, reasoningY + 8);

    // --- Payment Terms ---
    const reasoningHeight = (doc.getTextDimensions(reasoningText).h);
    const paymentY = reasoningY + 8 + reasoningHeight + 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Condições de Pagamento", 20, paymentY);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const paymentTermsText = doc.splitTextToSize(info.paymentTerms, 170);
    doc.text(paymentTermsText, 20, paymentY + 8);

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Agradecemos a oportunidade de apresentar esta proposta.", 105, pageHeight - 20, { align: "center" });
    doc.text(`Proposta gerada por: ${info.yourCompanyName}`, 105, pageHeight - 15, { align: "center" });

    doc.save(`proposta-${info.clientCompanyName.replace(/\s/g, '_')}.pdf`);
};