import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getActiveChallenges, checkinChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';
import { SkeletonStats, SkeletonCard } from '../Components/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { Target, Trophy, Flame, Zap } from 'lucide-react';

const Dashboard = () => {
  const { username, xp, level, refreshUser, isAuthenticated, loading: userLoading } = useUser();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState({});
  const navigate = useNavigate();
  const toast = useToastContext();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [challengesResponse] = await Promise.all([
        getActiveChallenges(),
      ]);
      
      if (challengesResponse.success) {
        setActiveChallenges(challengesResponse.active_challenges || []);
      }
      await refreshUser();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (challengeId) => {
    setCheckingIn({ ...checkingIn, [challengeId]: true });
    try {
      const response = await checkinChallenge(challengeId);
      if (response.success) {
        const challenge = activeChallenges.find(c => c.challenge_id === challengeId);
        toast.success(`✅ Checked in! +${response.xp_gained || 5} XP${response.leveled_up ? ' 🎉 Level Up!' : ''}`);
        // Reload active challenges to get updated data
        await loadData();
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking in:', error);
      const errorMessage = error.response?.data?.message || 'Failed to check in. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCheckingIn({ ...checkingIn, [challengeId]: false });
    }
  };

  const nextLevelXP = (level + 1) * 100;

  if (userLoading || (isAuthenticated && loading)) {
    return (
      <ScreenContainer className="pb-20 pt-24">
        <div className="mb-8">
          <div className="h-8 bg-soft-gray rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-5 bg-soft-gray rounded w-96 animate-pulse"></div>
        </div>
        <div className="mb-6">
          <div className="h-24 bg-soft-gray rounded animate-pulse"></div>
        </div>
        <SkeletonStats />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </ScreenContainer>
    );
  }

  // Public dashboard view (not authenticated)
  if (!isAuthenticated) {
    return (
      <ScreenContainer className="pb-20 pt-20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 animate-slide-up">
            <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-sunset bg-clip-text text-transparent">
              Build Better Habits
            </h1>
            <p className="text-xl text-muted-gray mb-8">
              Gamified habit tracking that makes personal growth fun and rewarding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <GlassPanel className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-heading font-semibold mb-2">Challenge Yourself</h3>
              <p className="text-sm text-muted-gray">
                Take on daily challenges and build consistency
              </p>
            </GlassPanel>
            <GlassPanel className="p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-heading font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-gray">
                Gain XP, level up, and unlock achievements
              </p>
            </GlassPanel>
            <GlassPanel className="p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-heading font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-gray">
                Visualize your journey and see your growth
              </p>
            </GlassPanel>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  // Authenticated dashboard view
  return (
    <ScreenContainer className="pb-20 pt-24">
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-muted-gray text-sm">Welcome back,</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-pure-white">
            {username || 'Champion'} <span className="text-gold neon-text">⚡</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <GlassPanel className="text-center p-4 hover:border-gold transition-all duration-300 hover:scale-105 group">
            <Trophy className="w-6 h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-mono text-xl font-bold text-pure-white">{level}</p>
            <p className="text-xs text-muted-gray">Level</p>
          </GlassPanel>
          <GlassPanel className="text-center p-4 hover:border-gold transition-all duration-300 hover:scale-105 group">
            <Flame className="w-6 h-6 text-neon-magenta mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-mono text-xl font-bold text-pure-white">
              {activeChallenges.reduce((max, c) => Math.max(max, c.current_streak || 0), 0)}
            </p>
            <p className="text-xs text-muted-gray">Day Streak</p>
          </GlassPanel>
        </div>

        {/* XP Progress */}
        <GlassPanel className="p-4 sm:p-6">
          <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
        </GlassPanel>

        {/* Active Challenges */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-semibold text-pure-white flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-cyan" />
              Active Challenges
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/challenges')}
              className="text-gold hover:text-gold/80"
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="glass-panel h-32 animate-pulse" />
              ))}
            </div>
          ) : activeChallenges.length === 0 ? (
            <GlassPanel className="text-center py-8">
              <Target className="w-12 h-12 text-muted-gray mx-auto mb-3" />
              <p className="text-muted-gray mb-4">
                No active challenges yet
              </p>
              <Button 
                onClick={() => navigate('/challenges')} 
                variant="primary"
                className="tap-scale"
              >
                Browse Challenges
              </Button>
            </GlassPanel>
          ) : (
            <div className="space-y-3">
              {activeChallenges.map((challenge) => (
                <GlassPanel key={challenge.user_challenge_id} className="p-4 hover:border-gold/50 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading font-semibold text-pure-white">{challenge.title}</h3>
                        {challenge.checked_in_today && (
                          <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                            <span>✓</span> Checked In Today
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-gray mb-3 flex-wrap">
                        <span>{challenge.progress_days} / {challenge.total_days} days</span>
                        <span>•</span>
                        <span>{challenge.xp_reward} XP</span>
                        {challenge.current_streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-gold font-semibold flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {challenge.current_streak} day streak
                            </span>
                          </>
                        )}
                      </div>
                      <div className="w-full h-2 bg-dark-gray rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-xp transition-all duration-500"
                          style={{ width: `${challenge.progress_percentage || 0}%` }}
                        />
                      </div>
                      {!challenge.checked_in_today && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCheckIn(challenge.challenge_id)}
                          loading={checkingIn[challenge.challenge_id]}
                          className="tap-scale"
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
};

export default Dashboard;

