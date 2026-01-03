import React from 'react';
import GlassPanel from './GlassPanel';
import Button from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  actionLabel = 'Try Again',
  variant = 'default' 
}) => {
  const variants = {
    default: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <GlassPanel className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center ${variants[variant]}`}>
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-pure-white mb-2">
            {title}
          </h3>
          <p className="text-muted-gray text-sm max-w-md mx-auto">
            {message || 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            className="mt-4 tap-scale"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            {actionLabel}
          </Button>
        )}
      </div>
    </GlassPanel>
  );
};

export default ErrorDisplay;

