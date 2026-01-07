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
import { Target, Trophy, Flame, Zap, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <ScreenContainer className="pb-20 pt-24 relative z-10">
        <div className="space-y-6 animate-slide-up">
          {/* Page Title */}
          <div className="space-y-1 mb-2">
            <p className="text-text-secondary text-sm font-body">Dashboard</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-pure-white">
              Your <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">Progress</span>
            </h1>
          </div>

          {/* Header */}
          <div className="space-y-2 mb-4">
            <p className="text-text-secondary text-sm font-body">Welcome back,</p>
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-pure-white">
              {username || 'Champion'} <span className="text-purple">⚡</span>
            </h2>
            <p className="text-text-secondary text-sm max-w-2xl font-body leading-relaxed">
              Track your progress, complete daily check-ins, and watch your habits transform. Every day is a new opportunity to level up!
            </p>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl text-center p-5 hover:border-purple/50 hover:scale-105 transition-all duration-300 group shadow-xl hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-purple/30">
                <Trophy className="w-6 h-6 text-pure-white" />
              </div>
              <p className="font-mono text-3xl font-bold text-pure-white mb-1">{level}</p>
              <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Level</p>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-xl text-center p-5 hover:border-emerald/50 hover:scale-105 transition-all duration-300 group shadow-xl hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-emerald/30">
                <Flame className="w-6 h-6 text-pure-white" />
              </div>
              <p className="font-mono text-3xl font-bold text-pure-white mb-1">
                {activeChallenges.reduce((max, c) => Math.max(max, c.current_streak || 0), 0)}
              </p>
              <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Day Streak</p>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
          <div className="relative">
            <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
          </div>
        </div>

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
                <div key={challenge.user_challenge_id} className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-5 hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
                  <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
                <div className="flex items-start justify-between gap-4 relative">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-body font-bold text-pure-white text-lg flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Target className="w-4 h-4 text-pure-white" />
                          </div>
                          {challenge.title}
                        </h3>
                      {challenge.checked_in_today && (
                          <span className="text-xs text-emerald font-semibold bg-emerald/20 border border-emerald/30 px-3 py-1 rounded-full flex items-center gap-1.5 group-hover:bg-emerald/30 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Checked In
                          </span>
                      )}
                    </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary mb-4 flex-wrap font-body">
                      <span className="font-semibold text-pure-white">{challenge.progress_days} / {challenge.total_days} days</span>
                        <span className="text-text-tertiary">•</span>
                      <span className="text-purple font-bold">{challenge.xp_reward} XP</span>
                      {challenge.current_streak > 0 && (
                          <>
                            <span className="text-text-tertiary">•</span>
                            <span className="text-emerald font-bold flex items-center gap-1.5">
                              <Flame className="w-4 h-4" />
                              {challenge.current_streak} day streak
                            </span>
                          </>
                      )}
                    </div>
                    <div className="w-full h-3 bg-dark-gray/50 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-purple via-pink to-purple rounded-full transition-all duration-500"
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
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      </ScreenContainer>
    </div>
  );
};

export default Dashboard;

