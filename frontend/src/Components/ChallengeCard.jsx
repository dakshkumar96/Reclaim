import React from 'react';

const ChallengeCard = ({ challenge, onStart, isActive = false }) => {
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };

  const difficultyGradients = {
    easy: 'from-green-500/20 to-emerald-500/20',
    medium: 'from-yellow-500/20 to-orange-500/20',
    hard: 'from-red-500/20 to-pink-500/20',
  };

  return (
    <div
      className={`
        glass-panel p-4 sm:p-6
        border-2
        bg-gradient-to-br ${difficultyGradients[challenge.difficulty] || 'from-dark-gray to-dark-gray'}
        hover:border-gold transition-all duration-300
        tap-scale cursor-pointer
        animate-fade-in
      `}
      onClick={() => !isActive && onStart && onStart(challenge.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-pure-white mb-2">
            {challenge.title}
          </h3>
          <p className="text-sm text-muted-gray line-clamp-2 mb-3">
            {challenge.description}
          </p>
        </div>
        {isActive && (
          <span className="ml-2 px-2 py-1 text-xs font-mono bg-gradient-xp text-pure-black rounded">
            Active
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs font-mono font-semibold ${difficultyColors[challenge.difficulty]}`}>
          {challenge.difficulty?.toUpperCase() || 'MEDIUM'}
        </span>
        <span className="text-xs text-muted-gray">•</span>
        <span className="text-xs font-mono text-gold">
          {challenge.xp_reward} XP
        </span>
        <span className="text-xs text-muted-gray">•</span>
        <span className="text-xs text-muted-gray">
          {challenge.duration_days} days
        </span>
        {challenge.category && (
          <>
            <span className="text-xs text-muted-gray">•</span>
            <span className="text-xs px-2 py-0.5 bg-soft-gray rounded text-muted-gray">
              {challenge.category}
            </span>
          </>
        )}
      </div>

      {!isActive && (
        <button
          className="w-full mt-2 px-4 py-2 bg-gradient-sunset text-pure-white rounded-lg font-heading text-sm hover:opacity-90 transition-opacity tap-scale"
          onClick={(e) => {
            e.stopPropagation();
            onStart && onStart(challenge.id);
          }}
        >
          Start Challenge
        </button>
      )}
    </div>
  );
};

export default ChallengeCard;

