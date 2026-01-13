import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Calendar } from 'lucide-react';

const ChallengeCard = ({ challenge, onStart, isActive = false }) => {
  const difficultyConfig = {
    easy: {
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
      borderColor: 'border-emerald/30',
      iconColor: 'text-emerald'
    },
    medium: {
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      borderColor: 'border-gold/30',
      iconColor: 'text-gold'
    },
    hard: {
      color: 'text-red',
      bgColor: 'bg-red/10',
      borderColor: 'border-red/30',
      iconColor: 'text-red'
    }
  };

  const config = difficultyConfig[challenge.difficulty] || difficultyConfig.medium;

  const CardContent = (
    <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-5 hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-lg group overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple/5 rounded-full blur-2xl"></div>
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Target className={`w-4 h-4 ${config.iconColor}`} />
              </div>
              <h3 className="text-lg font-body font-bold text-pure-white">
                {challenge.title}
              </h3>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2 mb-4 font-body leading-relaxed">
              {challenge.description}
            </p>
          </div>
          {isActive && (
            <span className="ml-2 px-2.5 py-1 text-xs font-body bg-emerald/20 text-emerald border border-emerald/30 rounded-full flex-shrink-0">
              Active
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 ${config.bgColor} border ${config.borderColor} rounded-lg`}>
            <span className={`text-xs font-body font-semibold ${config.color}`}>
              {challenge.difficulty?.charAt(0).toUpperCase() + challenge.difficulty?.slice(1) || 'Medium'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Zap className="w-3.5 h-3.5 text-purple" />
            <span className="font-body text-purple font-semibold">
              {challenge.xp_reward} XP
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue" />
            <span className="font-body text-text-tertiary">
              {challenge.duration_days} days
            </span>
          </div>
          {challenge.category && (
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 bg-purple/10 border border-purple/25 text-purple rounded font-body">
                {challenge.category}
              </span>
            </div>
          )}
        </div>

        {!isActive && (
          <div className="w-full px-4 py-2.5 bg-gradient-primary text-pure-white rounded-lg font-body text-sm font-semibold hover:opacity-90 transition-opacity text-center group-hover:shadow-lg group-hover:shadow-purple/20">
            View Details
          </div>
        )}
      </div>
    </div>
  );

  // If active, return as-is. Otherwise, wrap in Link
  if (isActive) {
    return CardContent;
  }

  return (
    <Link to={`/challenges/${challenge.id}`} className="block">
      {CardContent}
    </Link>
  );
};

export default ChallengeCard;

