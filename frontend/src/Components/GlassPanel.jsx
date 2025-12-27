import React from 'react';

const GlassPanel = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        glass-panel p-4 sm:p-6
        ${onClick ? 'cursor-pointer hover:border-gold transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassPanel;

