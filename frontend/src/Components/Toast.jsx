import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`
        glass-panel border-2 ${typeStyles[type]}
        px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl
        flex items-center gap-3
        animate-slide-up w-full
      `}
    >
      <span className="text-xl sm:text-2xl flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 font-medium text-sm sm:text-base">{message}</p>
      <button
        onClick={onClose}
        className="text-muted-gray hover:text-pure-white transition-colors flex-shrink-0 text-lg"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;

