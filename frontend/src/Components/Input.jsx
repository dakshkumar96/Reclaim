import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-heading text-muted-gray mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full bg-dark-gray/50 border border-soft-gray rounded-lg
          text-pure-white placeholder-muted-gray
          focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20
          transition-all duration-200
          px-4 py-2.5 font-body
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;

