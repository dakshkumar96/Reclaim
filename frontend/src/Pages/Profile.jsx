import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getProfile } from '../api/user';
import { getUserBadges } from '../api/badges';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';
import ErrorDisplay from '../Components/ErrorDisplay';
import BadgeCard from '../Components/BadgeCard';
import { Trophy as TrophyIcon, Target as TargetIcon, Award as AwardIcon, Calendar as CalendarIcon, TrendingUp as TrendingUpIcon, User as UserIcon, LogOut as LogOutIcon } from 'lucide-react';

const Profile = () => {
  const { username, xp, level, logout } = useUser();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToastContext();

  useEffect(() => {
    loadProfile();
    loadBadges();
  }, []);

  const loadProfile = async () => {
    try {
      setError(null);
      const response = await getProfile();
      if (response.success) {
        setProfile(response.profile);
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load profile. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadBadges = async () => {
    try {
      const response = await getUserBadges();
      if (response.success) {
        setBadges(response.badges);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const nextLevelXP = (level + 1) * 100;

  if (loading) {
    return (
      <ScreenContainer className="pb-20 pt-24">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-soft-gray rounded w-48"></div>
          <div className="h-32 bg-soft-gray rounded"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-soft-gray rounded"></div>
            ))}
          </div>
        </div>
      </ScreenContainer>
    );
  }

  if (error && !profile) {
    return (
      <ScreenContainer className="pb-20 pt-24">
        <ErrorDisplay
          title="Failed to Load Profile"
          message={error}
          onRetry={loadProfile}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="pb-20 pt-24">
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-muted-gray text-sm">Your Profile</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-pure-white">
            {username || 'User'} <span className="text-gold neon-text">⚡</span>
          </h1>
        </div>

        {/* Profile Card */}
        <GlassPanel className="p-6 sm:p-8 hover:border-gold/50 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-sunset flex items-center justify-center text-2xl font-bold text-pure-white flex-shrink-0">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-heading font-semibold mb-2 text-pure-white">
                {username}
              </h2>
              <div className="flex items-center gap-2 text-muted-gray text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</span>
              </div>
            </div>
          </div>
          <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
        </GlassPanel>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <GlassPanel className="text-center p-4 hover:border-gold transition-all duration-300 hover:scale-105 group">
            <TargetIcon className="w-6 h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-mono text-xl sm:text-2xl font-bold text-pure-white mb-1">
              {profile?.total_challenges || 0}
            </p>
            <p className="text-xs text-muted-gray uppercase tracking-wide">Total Challenges</p>
          </GlassPanel>
          <GlassPanel className="text-center p-4 hover:border-gold transition-all duration-300 hover:scale-105 group">
            <TrophyIcon className="w-6 h-6 text-neon-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-mono text-xl sm:text-2xl font-bold text-pure-white mb-1">
              {profile?.completed_challenges || 0}
            </p>
            <p className="text-xs text-muted-gray uppercase tracking-wide">Completed</p>
          </GlassPanel>
          <GlassPanel className="text-center p-4 hover:border-gold transition-all duration-300 hover:scale-105 group col-span-2 sm:col-span-1">
            <AwardIcon className="w-6 h-6 text-neon-magenta mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-mono text-xl sm:text-2xl font-bold text-pure-white mb-1">
              {profile?.total_badges || 0}
            </p>
            <p className="text-xs text-muted-gray uppercase tracking-wide">Badges</p>
          </GlassPanel>
        </div>

        {/* Badges Section */}
        <GlassPanel className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-pure-white flex items-center gap-2">
            <AwardIcon className="w-5 h-5 text-gold" />
            Your Badges ({badges.length})
          </h3>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned={true} size="sm" />
              ))}
            </div>
          ) : (
            <p className="text-muted-gray text-sm text-center py-8">
              No badges earned yet. Complete challenges and build streaks to earn badges!
            </p>
          )}
        </GlassPanel>

        {/* Account Actions */}
        <GlassPanel className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-pure-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gold" />
            Account Settings
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full tap-scale group"
          >
            <LogOutIcon className="w-4 h-4 mr-2 inline group-hover:translate-x-1 transition-transform" />
            Logout
          </Button>
        </GlassPanel>

        {/* Error Display (if error but profile loaded) */}
        {error && profile && (
          <div className="text-sm text-yellow-400 bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-3">
            ⚠️ {error}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
};

export default Profile;

