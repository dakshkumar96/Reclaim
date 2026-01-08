import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getActiveChallenges, checkinChallenge } from '../api/challenges';
import { getUserBadges } from '../api/badges';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';
import { SkeletonStats, SkeletonCard } from '../Components/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { Target, Trophy, Flame, Zap, CheckCircle2, Award, BarChart3, TrendingUp, Calendar, Sparkles, Brain } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const { username, xp, level, refreshUser, isAuthenticated, loading: userLoading } = useUser();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
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
      const [challengesResponse, badgesResponse] = await Promise.all([
        getActiveChallenges(),
        getUserBadges().catch(() => ({ success: false, badges: [] })),
      ]);
      
      if (challengesResponse.success) {
        setActiveChallenges(challengesResponse.active_challenges || []);
      }
      if (badgesResponse.success) {
        setUserBadges(badgesResponse.badges || []);
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

  // Calculate additional stats
  const totalActiveChallenges = activeChallenges.length;
  const totalXPFromChallenges = activeChallenges.reduce((sum, c) => sum + (c.xp_reward || 0), 0);
  const completedChallenges = activeChallenges.filter(c => c.progress_percentage >= 100).length;
  const totalBadges = userBadges.length;
  const maxStreak = activeChallenges.reduce((max, c) => Math.max(max, c.current_streak || 0), 0);

  // Generate weekly activity data (mock data for now - can be replaced with real API data)
  const getWeeklyActivityData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    return days.map((day, index) => {
      // Simulate check-ins based on active challenges
      const checkIns = Math.floor(Math.random() * totalActiveChallenges) + (totalActiveChallenges > 0 ? 1 : 0);
      return {
        day,
        checkIns: checkIns,
        xp: checkIns * 5, // Assuming 5 XP per check-in
      };
    });
  };

  // Generate category distribution data
  const getCategoryData = () => {
    const categories = {};
    activeChallenges.forEach(challenge => {
      const category = challenge.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    const colors = ['#7C3AED', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const weeklyData = getWeeklyActivityData();
  const categoryData = getCategoryData();

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

      <ScreenContainer className="pb-32 pt-24 relative z-10">
        <div className="max-w-7xl mx-auto space-y-10 animate-slide-up">
          {/* Page Title Section */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pure-white mb-3">
              Welcome back, <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">{username || 'Champion'}</span>
        </h1>
            <p className="text-text-secondary text-base font-body max-w-2xl">
              Track your progress, complete daily check-ins, and watch your habits transform.
            </p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 text-center hover:border-purple/40 transition-all duration-300 shadow-lg overflow-hidden">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-pure-white" />
            </div>
            <p className="font-mono text-3xl font-bold text-pure-white mb-1">{level}</p>
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Level</p>
          </div>
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-xl p-6 text-center hover:border-emerald/40 transition-all duration-300 shadow-lg overflow-hidden">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center">
              <Flame className="w-5 h-5 text-pure-white" />
            </div>
            <p className="font-mono text-3xl font-bold text-pure-white mb-1">{maxStreak}</p>
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Day Streak</p>
          </div>
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-xl p-6 text-center hover:border-blue/40 transition-all duration-300 shadow-lg overflow-hidden">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center">
              <Zap className="w-5 h-5 text-pure-white" />
            </div>
            <p className="font-mono text-3xl font-bold text-pure-white mb-1">{xp}</p>
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Total XP</p>
          </div>
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 text-center hover:border-purple/40 transition-all duration-300 shadow-lg overflow-hidden">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center">
              <Award className="w-5 h-5 text-pure-white" />
            </div>
            <p className="font-mono text-3xl font-bold text-pure-white mb-1">{totalBadges}</p>
            <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider font-body">Badges</p>
          </div>
      </div>

          {/* XP Progress Section */}
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-xl p-6 shadow-lg">
            <h3 className="font-body font-semibold text-pure-white text-base mb-4">Level Progress</h3>
          <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
          </div>

          {/* Charts Section */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-pure-white mb-6">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Activity Chart */}
              <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 shadow-lg">
                <h3 className="font-body font-semibold text-pure-white text-base mb-5">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
                  <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20,20,20,0.95)', 
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '8px',
                      color: '#F8F8F8'
                    }} 
                  />
                  <Bar dataKey="checkIns" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
                </ResponsiveContainer>
      </div>

              {/* Category Distribution Chart */}
              <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 shadow-lg">
                <h3 className="font-body font-semibold text-pure-white text-base mb-5">Challenges by Category</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(20,20,20,0.95)', 
                          border: '1px solid rgba(124,58,237,0.3)',
                          borderRadius: '8px',
                          color: '#F8F8F8'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[220px] text-text-tertiary">
                    <p className="text-sm font-body">No challenges yet</p>
                  </div>
                )}
              </div>
          </div>

            {/* XP Progress Over Time Chart */}
            {weeklyData.length > 0 && (
              <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-xl p-6 shadow-lg mt-6">
                <h3 className="font-body font-semibold text-pure-white text-base mb-5">XP Earned This Week</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" />
                    <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20,20,20,0.95)', 
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: '8px',
                        color: '#F8F8F8'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
          </div>
            )}
      </div>

          {/* Active Challenges Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-pure-white">Active Challenges</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/challenges')}
                className="text-purple hover:text-purple/80"
          >
                View All
          </Button>
        </div>
            <div className="space-y-4">

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="glass-panel h-32 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : activeChallenges.length === 0 ? (
              <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 text-center shadow-xl">
                <Target className="w-16 h-16 text-muted-gray mx-auto mb-4 opacity-50" />
                <p className="text-text-secondary mb-6 font-body text-lg">
                  No active challenges yet. Start your journey today!
                </p>
            <Button
                  onClick={() => navigate('/challenges')} 
              variant="primary"
                  className="tap-scale"
            >
                  Browse Challenges
            </Button>
              </div>
        ) : (
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
                    <div key={challenge.user_challenge_id} className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-5 hover:border-purple/40 transition-all duration-300 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-body font-semibold text-pure-white text-lg">
                              {challenge.title}
                            </h3>
                      {challenge.checked_in_today && (
                              <span className="text-xs text-emerald font-semibold bg-emerald/20 border border-emerald/30 px-2 py-1 rounded-full flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Checked In
                              </span>
                      )}
                    </div>
                          <div className="flex items-center gap-3 text-sm text-text-secondary mb-3 flex-wrap font-body">
                            <span className="font-semibold text-pure-white">{challenge.progress_days} / {challenge.total_days} days</span>
                            <span className="text-text-tertiary">•</span>
                            <span className="text-purple font-semibold">{challenge.xp_reward} XP</span>
                      {challenge.current_streak > 0 && (
                              <>
                                <span className="text-text-tertiary">•</span>
                                <span className="text-emerald font-semibold flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {challenge.current_streak} day streak
                                </span>
                              </>
                      )}
                    </div>
                          <div className="w-full h-2 bg-dark-gray/50 rounded-full overflow-hidden mb-3">
                      <div
                              className="h-full bg-gradient-to-r from-purple to-pink rounded-full transition-all duration-500"
                        style={{ width: `${challenge.progress_percentage || 0}%` }}
                      />
                    </div>
                    {!challenge.checked_in_today && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCheckIn(challenge.challenge_id)}
                        loading={checkingIn[challenge.challenge_id]}
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

          {/* Motivation Section */}
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 shadow-lg">
            <h3 className="font-body font-semibold text-pure-white text-base mb-3">Daily Motivation</h3>
            <p className="text-text-secondary font-body leading-relaxed mb-4">
              {maxStreak > 0 
                ? `🔥 Amazing! You're on a ${maxStreak}-day streak! Keep the momentum going.`
                : totalActiveChallenges > 0
                ? `💪 You have ${totalActiveChallenges} active challenge${totalActiveChallenges > 1 ? 's' : ''}. Every check-in brings you closer to your goals!`
                : `🌟 Ready to start your journey? Browse challenges and begin building habits that last.`
              }
            </p>
          </div>
      </div>
    </ScreenContainer>
    </div>
  );
};

export default Dashboard;

