import React from 'react';
import GlassPanel from './GlassPanel';

// Simple level up celebration modal
const LevelUpModal = ({ newLevel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <GlassPanel className="p-8 max-w-md w-full mx-4 text-center animate-scale-in">
        <div className="mb-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold bg-gradient-sunset bg-clip-text text-transparent mb-2">
            Level Up!
          </h2>
          <div className="text-5xl font-bold text-gold my-4">
            Level {newLevel}
          </div>
          <p className="text-muted-gray">
            Congratulations! You've reached a new level!
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition-colors"
        >
          Awesome!
        </button>
      </GlassPanel>
    </div>
  );
};

export default LevelUpModal;

