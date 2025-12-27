import React from 'react';

const XPBar = ({ currentXP, nextLevelXP, level }) => {
  const xpForCurrentLevel = (level - 1) * 100;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = nextLevelXP - xpForCurrentLevel;
  const percentage = Math.min((xpProgress / xpNeeded) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-mono">
          Level {level}
        </div>
        <div className="text-sm font-mono text-gold">
          {xpProgress} / {xpNeeded} XP
        </div>
      </div>
      <div className="w-full h-3 bg-dark-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-xp transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar;
