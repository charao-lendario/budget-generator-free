import React, { useState } from 'react';
import type { PdfInfo } from '../types';

interface PdfInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PdfInfo) => void;
}

const inputStyles = "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-md shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-brand-text-secondary transition-colors";
const labelStyles = "block text-sm font-medium text-brand-text-secondary mb-1";

export const PdfInfoModal: React.FC<PdfInfoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PdfInfo>({
    yourCompanyName: '',
    yourEmail: '',
    yourPhone: '',
    clientCompanyName: '',
    clientContactName: '',
    yourCompanyLogo: undefined,
    paymentTerms: '50% na assinatura do contrato, 50% na entrega do projeto.',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, yourCompanyLogo: base64String }));
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-brand-surface border border-brand-border rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-brand-border">
          <h2 className="text-xl font-bold text-brand-text">Informações para a Proposta</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text text-2xl leading-none">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-brand-text mb-2">Sua Empresa</legend>
              <div>
                <label htmlFor="yourCompanyLogo" className={labelStyles}>Logo da Sua Empresa</label>
                <input 
                    type="file" 
                    id="yourCompanyLogo" 
                    name="yourCompanyLogo" 
                    onChange={handleLogoChange} 
                    accept="image/png, image/jpeg"
                    className="w-full text-sm text-brand-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary-hover"
                />
                 {logoPreview && <img src={logoPreview} alt="Preview do logo" className="mt-2 h-16 w-auto object-contain bg-white/10 p-1 rounded" />}
              </div>
              <div>
                <label htmlFor="yourCompanyName" className={labelStyles}>Nome da Empresa</label>
                <input type="text" id="yourCompanyName" name="yourCompanyName" value={formData.yourCompanyName} onChange={handleChange} className={inputStyles} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="yourEmail" className={labelStyles}>Seu E-mail de Contato</label>
                    <input type="email" id="yourEmail" name="yourEmail" value={formData.yourEmail} onChange={handleChange} className={inputStyles} required />
                 </div>
                 <div>
                    <label htmlFor="yourPhone" className={labelStyles}>Seu Telefone</label>
                    <input type="tel" id="yourPhone" name="yourPhone" value={formData.yourPhone} onChange={handleChange} className={inputStyles} required />
                 </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-brand-text mb-2">Empresa do Cliente</legend>
              <div>
                <label htmlFor="clientCompanyName" className={labelStyles}>Nome da Empresa Cliente</label>
                <input type="text" id="clientCompanyName" name="clientCompanyName" value={formData.clientCompanyName} onChange={handleChange} className={inputStyles} required />
              </div>
              <div>
                <label htmlFor="clientContactName" className={labelStyles}>Nome do Contato</label>
                <input type="text" id="clientContactName" name="clientContactName" value={formData.clientContactName} onChange={handleChange} className={inputStyles} required />
              </div>
            </fieldset>
            
            <div>
              <label htmlFor="paymentTerms" className={labelStyles}>Condição de Pagamento</label>
              <textarea
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                rows={3}
                className={inputStyles}
                required
              />
            </div>

          </div>
          
          <footer className="p-4 bg-brand-bg/50 border-t border-brand-border rounded-b-xl">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary"
            >
              Gerar PDF
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};