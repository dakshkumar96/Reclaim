import React, { useEffect, useState } from 'react';

// Simple component that shows "+X XP" notification
const XPNotification = ({ xpGained, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show notification for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for fade animation to complete, then call onComplete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 animate-slide-in-right"
      style={{
        animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 1.7s',
      }}
    >
      <div className="bg-dark-gray border border-gold/30 rounded-lg px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-gold font-bold text-lg">+{xpGained} XP</span>
          <span className="text-xl">✨</span>
        </div>
      </div>
    </div>
  );
};

export default XPNotification;

