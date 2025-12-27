import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-heading font-medium rounded-lg transition-all duration-200 tap-scale focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pure-black';
  
  const variants = {
    primary: 'bg-gradient-sunset text-pure-white hover:opacity-90 glow-effect',
    secondary: 'bg-gradient-retro-purple text-pure-white hover:opacity-90 glow-effect',
    outline: 'border-2 border-soft-gray text-pure-white hover:border-gold hover:text-gold',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

