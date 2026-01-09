import React from 'react';
import { 
  Star, 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  PlayCircle, 
  CheckCircle, 
  Shield, 
  Heart, 
  Clock, 
  Brain,
  Award
} from 'lucide-react';

const iconMap = {
  'star': Star,
  'star-fill': Star,
  'trophy': Trophy,
  'crown': Crown,
  'fire': Flame,
  'fire-fill': Flame,
  'lightning': Zap,
  'play-circle': PlayCircle,
  'check-circle': CheckCircle,
  'shield-check': Shield,
  'heart': Heart,
  'clock': Clock,
  'brain': Brain,
  'default': Award
};

const categoryColors = {
  'xp': 'from-purple-500 to-purple-600',
  'streak': 'from-orange-500 to-red-500',
  'challenge': 'from-blue-500 to-cyan-500',
  'health': 'from-green-500 to-emerald-500',
  'productivity': 'from-yellow-500 to-orange-500',
  'mindfulness': 'from-pink-500 to-purple-500',
  'education': 'from-indigo-500 to-blue-500'
};

const BadgeCard = ({ badge, earned = false, size = 'md' }) => {
  const IconComponent = iconMap[badge.icon] || iconMap.default;
  const categoryColor = categoryColors[badge.category] || categoryColors.xp;
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl'
  };

  return (
    <div 
      className={`
        relative rounded-2xl p-4 
        bg-gradient-to-br ${categoryColor}
        ${earned ? 'opacity-100' : 'opacity-40'}
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        ${earned ? 'hover:shadow-purple-500/50' : ''}
        group
      `}
      title={badge.description}
    >
      <div className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        text-white
        group-hover:scale-110 transition-transform
      `}>
        <IconComponent className="w-full h-full" />
      </div>
      
      {earned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
          <span className="text-xs">✓</span>
        </div>
      )}
      
      <div className="mt-2 text-center">
        <p className={`text-white font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {badge.name}
        </p>
        {badge.xp_requirement > 0 && (
          <p className="text-white/70 text-xs mt-1">
            {badge.xp_requirement} XP
          </p>
        )}
        {badge.streak_requirement > 0 && (
          <p className="text-white/70 text-xs mt-1">
            {badge.streak_requirement} day streak
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;

