import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.534a1.125 1.125 0 01-1.097-.707l-1.088-3.263a1.125 1.125 0 00-1.996 0L9.622 17.5l-1.097.707a1.125 1.125 0 01-1.097-.707l-3.722-.534A2.122 2.122 0 013 14.894V10.608c0-.97.616-1.813 1.5-2.097L6.6 8.249a1.125 1.125 0 01.996 0l1.193.341a1.125 1.125 0 00.996 0l1.193-.341a1.125 1.125 0 01.996 0l1.193.341a1.125 1.125 0 00.996 0l1.193-.341a1.125 1.125 0 01.996 0l2.403.686z" 
    />
  </svg>
);