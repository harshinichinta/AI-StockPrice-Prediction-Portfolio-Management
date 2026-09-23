import React from 'react';

export const BackgroundGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary top-center indigo radial glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/15 via-blue-600/5 to-transparent rounded-full blur-3xl opacity-70" />
      
      {/* Secondary bottom-right cyan accent glow */}
      <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-gradient-to-t from-cyan-600/10 to-transparent rounded-full blur-3xl opacity-50" />
      
      {/* Subtle financial grid lines overlay */}
      <div className="absolute inset-0 financial-grid opacity-30" />
    </div>
  );
};
