import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="glass-panel p-6">
      <div className="h-6 bg-medium-gray/50 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-medium-gray/50 rounded mb-2"></div>
      <div className="h-4 bg-medium-gray/50 rounded w-5/6"></div>
      <div className="mt-4 h-10 bg-medium-gray/50 rounded"></div>
    </div>
  );
};

export const SkeletonChallengeCard = () => {
  return (
    <div className="glass-panel p-4 sm:p-6">
      <div className="h-5 bg-medium-gray/50 rounded mb-3 w-2/3"></div>
      <div className="h-4 bg-medium-gray/50 rounded mb-2 w-full"></div>
      <div className="h-4 bg-medium-gray/50 rounded mb-4 w-4/5"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-medium-gray/50 rounded w-16"></div>
        <div className="h-6 bg-medium-gray/50 rounded w-20"></div>
        <div className="h-6 bg-medium-gray/50 rounded w-24"></div>
      </div>
      <div className="h-10 bg-medium-gray/50 rounded"></div>
    </div>
  );
};

export const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-panel p-4 text-center">
          <div className="h-8 bg-medium-gray/50 rounded mb-2 w-16 mx-auto"></div>
          <div className="h-3 bg-medium-gray/50 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonLeaderboard = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-8 w-8 bg-medium-gray/50 rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-medium-gray/50 rounded mb-2 w-32"></div>
                <div className="h-4 bg-medium-gray/50 rounded w-24"></div>
              </div>
            </div>
            <div className="h-6 bg-medium-gray/50 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonXPBar = () => {
  return (
    <div className="glass-panel p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-soft-gray rounded w-24"></div>
        <div className="h-6 bg-soft-gray rounded w-32"></div>
      </div>
      <div className="h-4 bg-soft-gray rounded-full w-full"></div>
    </div>
  );
};

// Shimmer effect component
export const Shimmer = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
};

