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
          w-full bg-transparent border-b-2 border-soft-gray 
          text-pure-white placeholder-muted-gray
          focus:outline-none focus:border-gold focus:bg-dark-gray/30
          transition-colors duration-200
          px-2 py-2 font-body
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

