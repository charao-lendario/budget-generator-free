import React from 'react';

export const BrowserMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg shadow-2xl shadow-brand-bg/50 overflow-hidden">
      <div className="h-9 flex items-center px-3 bg-brand-bg border-b border-brand-border">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
};
