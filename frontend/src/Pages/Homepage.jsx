import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getAllChallenges, getActiveChallenges, checkinChallenge } from '../api/challenges';
import { getUserBadges } from '../api/badges';
import { getAnalytics } from '../api/user';
import ScreenContainer from '../Components/ScreenContainer';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';
import ChallengeCard from '../Components/ChallengeCard';
import { SkeletonStats, SkeletonCard } from '../Components/LoadingSkeleton';
import { 
  Target, 
  Trophy, 
  Flame,
  ArrowUpRight,
  Zap,
  BarChart3,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  Users,
  Clock,
  Shield,
  Brain,
  Calendar,
  ArrowRight,
  Plus,
  Sun,
  Moon,
  Sunrise,
  Star,
  ChevronRight,
  Rocket,
  Timer,
  Gift
} from 'lucide-react';

const Homepage = () => {
  const { isAuthenticated, username, xp, level, refreshUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToastContext();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [featuredChallenges, setFeaturedChallenges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState({});

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sunrise };
    if (hour < 18) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  // Load data for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [challengesResponse, activeResponse, badgesResponse, analyticsResponse] = await Promise.all([
        getAllChallenges(),
        getActiveChallenges().catch(() => ({ success: false, active_challenges: [] })),
        getUserBadges().catch(() => ({ success: false, badges: [] })),
        getAnalytics().catch(() => ({ success: false, analytics: null })),
      ]);
      
      if (challengesResponse.success) {
        setFeaturedChallenges(challengesResponse.challenges?.slice(0, 6) || []);
      }
      if (activeResponse.success) {
        setActiveChallenges(activeResponse.active_challenges || []);
      }
      if (badgesResponse.success) {
        setUserBadges(badgesResponse.badges || []);
      }
      if (analyticsResponse.success && analyticsResponse.analytics) {
        setWeeklyActivity(analyticsResponse.analytics.weeklyActivity || []);
      }
      await refreshUser();
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (challengeId) => {
    setCheckingIn({ ...checkingIn, [challengeId]: true });
    try {
      const response = await checkinChallenge(challengeId);
      if (response.success) {
        toast.success(`✅ Checked in! +${response.xp_gained || 5} XP${response.leveled_up ? ' 🎉 Level Up!' : ''}`);
        await loadUserData();
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in. Please try again.');
    } finally {
      setCheckingIn({ ...checkingIn, [challengeId]: false });
    }
  };

  const nextLevelXP = (level + 1) * 100;
  const xpProgress = Math.round((xp / nextLevelXP) * 100);
  const maxStreak = activeChallenges.reduce((max, c) => Math.max(max, c.current_streak || 0), 0);
  const totalBadges = userBadges.length;
  const pendingCheckIns = activeChallenges.filter(c => !c.checked_in_today).length;

  // Motivational quotes
  const quotes = [
    "Small daily improvements lead to staggering long-term results.",
    "The secret of getting ahead is getting started.",
    "You don't have to be great to start, but you have to start to be great.",
    "Success is the sum of small efforts repeated day in and day out.",
  ];
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  // If authenticated, show personalized homepage
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-pure-black relative overflow-hidden">
        {/* Enhanced Background with Theme Elements */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* Subtle Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
          >
            <source src="/0_Geometric_Shapes_Circles_3840x2160.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          
          {/* Animated Blobs - Subtle */}
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/8 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/5 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[150px] animate-pulse animation-delay-4000 pointer-events-none"></div>
        </div>

        <ScreenContainer className="pb-32 pt-24 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Hero Greeting Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/20 via-dark-gray/95 to-pink/10 border border-purple/30 p-8 shadow-xl shadow-purple/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent"></div>
              
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gold/20 border border-gold/30">
                      <GreetingIcon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-gold font-body text-sm font-medium uppercase tracking-wider">{greeting.text}</span>
                  </div>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-pure-white mb-3">
                    {username || 'Champion'}
                  </h1>
                  <p className="text-text-secondary font-body text-lg italic max-w-xl">
                    "{todayQuote}"
                  </p>
                </div>
                
                {/* Level Badge */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-dark-gray/60 border border-purple/20 backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple to-pink flex items-center justify-center mb-3 shadow-lg shadow-purple/30">
                      <span className="font-mono text-3xl font-bold text-pure-white">{level}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold flex items-center justify-center border-2 border-dark-gray">
                      <Star className="w-4 h-4 text-dark-gray fill-current" />
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary font-body uppercase tracking-wider">Level</span>
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-xs text-text-tertiary mb-1">
                      <span>{xp} XP</span>
                      <span>{nextLevelXP} XP</span>
                    </div>
                    <div className="w-24 h-1.5 bg-medium-gray/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple to-pink rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Focus Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pending Check-ins Card */}
              <div className={`relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] ${pendingCheckIns > 0 ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold/30 shadow-lg shadow-gold/10' : 'bg-gradient-to-br from-emerald/20 to-emerald/5 border-emerald/30 shadow-lg shadow-emerald/10'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-body text-text-tertiary uppercase tracking-wider mb-1">Today's Check-ins</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{pendingCheckIns}</p>
                    <p className="text-sm text-text-secondary font-body mt-1">
                      {pendingCheckIns > 0 ? 'challenges waiting' : 'all done! 🎉'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${pendingCheckIns > 0 ? 'bg-gold/20' : 'bg-emerald/20'}`}>
                    <Timer className={`w-6 h-6 ${pendingCheckIns > 0 ? 'text-gold' : 'text-emerald'}`} />
                  </div>
                </div>
              </div>

              {/* Streak Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 p-5 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange-500/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-body text-text-tertiary uppercase tracking-wider mb-1">Current Streak</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{maxStreak}</p>
                    <p className="text-sm text-text-secondary font-body mt-1">
                      {maxStreak > 0 ? 'days strong 🔥' : 'start today!'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500/20">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Badges Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple/20 to-purple/5 border border-purple/30 p-5 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-body text-text-tertiary uppercase tracking-wider mb-1">Badges Earned</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{totalBadges}</p>
                    <p className="text-sm text-text-secondary font-body mt-1">
                      {totalBadges > 0 ? 'achievements' : 'start earning!'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple/20">
                    <Award className="w-6 h-6 text-purple" />
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Tasks - Full Width */}
            <div className="rounded-xl bg-dark-gray/60 border border-purple/20 overflow-hidden backdrop-blur-sm shadow-lg shadow-purple/5">
              <div className="flex items-center justify-between p-5 border-b border-purple/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple/20">
                    <Rocket className="w-5 h-5 text-purple" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-pure-white">Today's Tasks</h2>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-purple hover:text-purple/80 font-body flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {[1, 2].map((i) => <SkeletonCard key={i} />)}
                  </div>
                ) : activeChallenges.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple/10 flex items-center justify-center">
                      <Target className="w-8 h-8 text-purple/50" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-pure-white mb-2">No Active Challenges</h3>
                    <p className="text-text-secondary font-body text-sm mb-4 max-w-xs mx-auto">
                      Start your journey by picking a challenge that interests you
                    </p>
                    <button
                      onClick={() => navigate('/challenges')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple to-pink text-pure-white font-body font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      Explore Challenges
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {activeChallenges.slice(0, 4).map((challenge) => (
                      <div 
                        key={challenge.user_challenge_id} 
                        className="flex items-center gap-4 p-4 rounded-xl bg-medium-gray/30 hover:bg-medium-gray/50 transition-colors border border-transparent hover:border-purple/20"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${challenge.checked_in_today ? 'bg-emerald/20' : 'bg-gold/20'}`}>
                          {challenge.checked_in_today ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald" />
                          ) : (
                            <Target className="w-5 h-5 text-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-semibold text-pure-white text-sm truncate">
                            {challenge.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-text-tertiary font-body mt-1">
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-400" />
                              {challenge.current_streak || 0}
                            </span>
                            <span>{challenge.progress_percentage || 0}%</span>
                          </div>
                        </div>
                        {!challenge.checked_in_today ? (
                          <button
                            onClick={() => handleCheckIn(challenge.challenge_id)}
                            disabled={checkingIn[challenge.challenge_id]}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple to-pink text-pure-white text-xs font-body font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                          >
                            {checkingIn[challenge.challenge_id] ? '...' : 'Check In'}
                          </button>
                        ) : (
                          <span className="text-xs text-emerald font-body font-medium px-2 py-1 bg-emerald/10 rounded-full flex-shrink-0">
                            Done ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Grid - Quick Access & Discover */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Navigation */}
              <div className="rounded-xl bg-dark-gray/60 border border-purple/20 p-5 backdrop-blur-sm shadow-lg shadow-purple/5">
                <h3 className="font-heading text-lg font-bold text-pure-white mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/challenges')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple/20 to-purple/5 border border-purple/20 hover:border-purple/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple/20">
                      <Target className="w-5 h-5 text-purple" />
                    </div>
                    <span className="text-sm font-body text-pure-white">Challenges</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue/20 to-blue/5 border border-blue/20 hover:border-blue/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-blue/20">
                      <BarChart3 className="w-5 h-5 text-blue" />
                    </div>
                    <span className="text-sm font-body text-pure-white">Dashboard</span>
                  </button>
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 hover:border-gold/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-gold/20">
                      <Trophy className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-sm font-body text-pure-white">Leaderboard</span>
                  </button>
                  <button
                    onClick={() => navigate('/ai-coach')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/20 hover:border-emerald/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald/20">
                      <Brain className="w-5 h-5 text-emerald" />
                    </div>
                    <span className="text-sm font-body text-pure-white">AI Coach</span>
                  </button>
                </div>
              </div>

              {/* Discover New Challenges */}
              <div className="rounded-xl bg-dark-gray/60 border border-purple/20 overflow-hidden backdrop-blur-sm shadow-lg shadow-purple/5">
                <div className="flex items-center justify-between p-5 border-b border-purple/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gold/20">
                      <Sparkles className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-pure-white">Discover</h3>
                  </div>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : featuredChallenges.length === 0 ? (
                    <p className="text-center text-text-secondary text-sm py-6">No challenges available</p>
                  ) : (
                    <div className="space-y-3">
                      {featuredChallenges.slice(0, 3).map((challenge) => {
                        const difficultyClasses = challenge.difficulty === 'easy' 
                          ? 'text-emerald bg-emerald/10 border border-emerald/30' 
                          : challenge.difficulty === 'hard' 
                            ? 'text-red bg-red/10 border border-red/30' 
                            : 'text-gold bg-gold/10 border border-gold/30';
                        
                        return (
                        <Link key={challenge.id} to={`/challenges/${challenge.id}`}>
                          <div className="p-3 rounded-lg bg-medium-gray/30 hover:bg-medium-gray/50 transition-colors border border-transparent hover:border-purple/20">
                            <h4 className="font-body font-medium text-pure-white text-sm mb-1.5 line-clamp-1">
                              {challenge.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-text-tertiary flex-wrap">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-purple" />
                                {challenge.xp_reward} XP
                              </span>
                              <span>•</span>
                              <span>{challenge.duration_days}d</span>
                              <span>•</span>
                              <span className={`capitalize px-2 py-0.5 rounded-md font-medium ${difficultyClasses}`}>
                                {challenge.difficulty}
                              </span>
                            </div>
                          </div>
                        </Link>
                      )})}
                      <button
                        onClick={() => navigate('/challenges')}
                        className="w-full py-2.5 text-center text-sm text-purple hover:text-purple/80 font-body font-medium transition-colors"
                      >
                        Browse All Challenges →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* This Week Activity Strip */}
            <div className="rounded-xl bg-dark-gray/60 border border-purple/20 p-6 backdrop-blur-sm shadow-lg shadow-purple/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/20">
                    <TrendingUp className="w-5 h-5 text-emerald" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-pure-white">This Week</h3>
                </div>
                <span className="text-xs text-text-tertiary font-body">
                  {(() => {
                    const sixDaysAgo = new Date();
                    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
                    const today = new Date();
                    return `${sixDaysAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                  })()}
                </span>
              </div>
              
              {/* Week Days Grid */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-2xl mx-auto">
                {(() => {
                  const todayDayOfWeek = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
                  if (weeklyActivity.length > 0) {
                    // Create a map of day name to data
                    // Backend returns day names using TO_CHAR(day, 'Dy') which gives 3-char abbreviations like 'Mon', 'Tue'
                    const activityMap = {};
                    weeklyActivity.forEach((dayData) => {
                      // Handle both full day names and abbreviated ones from backend
                      const dayKey = dayData.day ? dayData.day.substring(0, 3).trim() : null;
                      if (dayKey && dayNames.includes(dayKey)) {
                        activityMap[dayKey] = dayData;
                      }
                    });
                    
                    // Display in Sun-Sat order
                    return dayNames.map((dayName, index) => {
                      const dayData = activityMap[dayName] || { day: dayName, checkIns: 0, xp: 0 };
                      const isToday = index === todayDayOfWeek;
                      const hasActivity = (dayData.checkIns || 0) > 0;
                      const isPast = index < todayDayOfWeek;
                      
                      return (
                        <div key={dayName} className="flex flex-col items-center gap-2 flex-1">
                          <span className={`text-xs font-body ${isToday ? 'text-purple font-semibold' : 'text-text-tertiary'}`}>
                            {dayName}
                          </span>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                            isToday 
                              ? 'bg-gradient-to-br from-purple to-pink shadow-lg shadow-purple/30' 
                              : hasActivity 
                                ? 'bg-emerald/20 border border-emerald/30' 
                                : isPast 
                                  ? 'bg-medium-gray/30 border border-medium-gray/20' 
                                  : 'bg-medium-gray/10 border border-dashed border-medium-gray/20'
                          }`}>
                            {isToday ? (
                              <Star className="w-5 h-5 text-pure-white" />
                            ) : hasActivity ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald" />
                            ) : isPast ? (
                              <span className="w-2 h-2 rounded-full bg-medium-gray/50"></span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-medium-gray/30"></span>
                            )}
                          </div>
                          {hasActivity && (
                            <span className="text-[10px] text-emerald font-mono">+{dayData.xp || 0}XP</span>
                          )}
                        </div>
                      );
                    });
                  } else {
                    // Fallback: display empty week grid
                    return dayNames.map((dayName, index) => {
                      const isToday = index === todayDayOfWeek;
                      const isPast = index < todayDayOfWeek;
                      
                      return (
                        <div key={dayName} className="flex flex-col items-center gap-2 flex-1">
                          <span className={`text-xs font-body ${isToday ? 'text-purple font-semibold' : 'text-text-tertiary'}`}>
                            {dayName}
                          </span>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                            isToday 
                              ? 'bg-gradient-to-br from-purple to-pink shadow-lg shadow-purple/30' 
                              : isPast
                                ? 'bg-medium-gray/30 border border-medium-gray/20'
                                : 'bg-medium-gray/10 border border-dashed border-medium-gray/20'
                          }`}>
                            {isToday ? (
                              <Star className="w-5 h-5 text-pure-white" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-medium-gray/30"></span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  }
                })()}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 pt-5 border-t border-purple/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald/20 border border-emerald/30"></div>
                  <span className="text-xs text-text-tertiary font-body">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-purple to-pink"></div>
                  <span className="text-xs text-text-tertiary font-body">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-medium-gray/30 border border-medium-gray/20"></div>
                  <span className="text-xs text-text-tertiary font-body">Missed</span>
                </div>
              </div>
            </div>

            {/* Level Up Progress Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple/20 via-dark-gray/95 to-pink/20 border border-purple/30 p-6 shadow-xl shadow-purple/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent"></div>
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-gold" />
                    <span className="text-gold font-body text-sm font-medium uppercase tracking-wider">Level Up Progress</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-pure-white mb-2">
                    {nextLevelXP - xp} XP to Level {level + 1}
                  </h3>
                  <p className="text-text-secondary font-body text-sm">
                    Keep completing your daily check-ins to earn XP and unlock new achievements!
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    {/* Circular Progress */}
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-medium-gray/30"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${xpProgress * 3.52} 352`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-2xl font-bold text-pure-white">{xpProgress}%</span>
                      <span className="text-xs text-text-tertiary font-body">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Habit Tips Section */}
            <div className="rounded-xl bg-dark-gray/60 border border-purple/20 overflow-hidden backdrop-blur-sm shadow-lg shadow-purple/5">
              <div className="flex items-center justify-between p-5 border-b border-purple/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/20">
                    <Brain className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-pure-white">Habit Building Tips</h3>
                </div>
              </div>
              <div className="p-5 grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-medium-gray/20 border border-purple/10 hover:border-purple/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple/20">
                      <Clock className="w-4 h-4 text-purple" />
                    </div>
                    <h4 className="font-body font-semibold text-pure-white text-sm">Same Time Daily</h4>
                  </div>
                  <p className="text-text-secondary font-body text-xs leading-relaxed">
                    Anchor your habits to a specific time. Consistency in timing makes habits automatic.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-medium-gray/20 border border-purple/10 hover:border-purple/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald/20">
                      <Target className="w-4 h-4 text-emerald" />
                    </div>
                    <h4 className="font-body font-semibold text-pure-white text-sm">Start Small</h4>
                  </div>
                  <p className="text-text-secondary font-body text-xs leading-relaxed">
                    Begin with 2-minute versions of your habits. Small wins build momentum for bigger changes.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-medium-gray/20 border border-purple/10 hover:border-purple/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gold/20">
                      <Flame className="w-4 h-4 text-gold" />
                    </div>
                    <h4 className="font-body font-semibold text-pure-white text-sm">Never Miss Twice</h4>
                  </div>
                  <p className="text-text-secondary font-body text-xs leading-relaxed">
                    Missing once is an accident. Missing twice is a new habit. Get back on track immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/30 via-pink/20 to-purple/30 border border-purple/40 p-8 sm:p-10 text-center backdrop-blur-sm shadow-xl shadow-purple/20">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-purple/10 border border-purple/20 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple" />
                  <span className="text-xs text-purple font-body font-medium uppercase tracking-wider">Discover More</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-pure-white mb-4">
                  Ready to take on a <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">new challenge</span>?
                </h3>
                
                <p className="text-text-secondary font-body text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  Explore our collection of habit-building challenges designed to help you grow every day.
                </p>
                
                <button
                  onClick={() => navigate('/challenges')}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple via-pink to-purple text-pure-white font-body font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple/30 hover:shadow-purple/50 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Browse Challenges
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

          </div>
        </ScreenContainer>
      </div>
    );
  }

  // Simple marketing homepage for non-authenticated users (NO DATA LOADING)
  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Simple Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-pure-black via-dark-gray to-dark-gray pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl pointer-events-none animate-pulse animation-delay-2000"></div>
      
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.12]"
        >
          <source src="/0_Geometric_Shapes_Circles_3840x2160.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-pure-black/95 to-pure-black/90"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 z-10 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 mb-6 bg-gradient-to-r from-purple/30 via-purple/20 to-purple/30 backdrop-blur-xl border border-purple/50 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3 text-gold mr-1.5" />
            <span className="text-xs text-gold font-body font-semibold tracking-wider uppercase">All-in-One Habit Toolkit</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-6 leading-tight text-pure-white tracking-tight">
            <span className="block mb-3">Take control of your</span>
            <span className="block bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">
              habits with clarity
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-body">
            All your progress insights, finally in one place.{' '}
            <span className="text-pure-white/90 font-medium">Track challenges, earn XP,</span> and reach your goals with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16">
            <Link to="/signup" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto text-lg font-body font-semibold bg-gradient-to-r from-purple via-pink to-purple text-pure-white px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/50 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started for Free
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto text-lg font-body font-semibold text-pure-white hover:text-gold border-2 border-purple/50 hover:border-gold/70 px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-purple/20 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg">
                Sign In
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-gray">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Join Thousands</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold mb-4 text-pure-white">
              Everything you need to <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">succeed</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
              Powerful features designed to help you build lasting habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 hover:border-purple/40 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-bold text-pure-white mb-2">Track Progress</h3>
              <p className="text-text-secondary font-body">Monitor your daily habits and see your progress over time</p>
            </div>
            <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 hover:border-purple/40 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-purple/20 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple" />
              </div>
              <h3 className="text-xl font-heading font-bold text-pure-white mb-2">Earn Rewards</h3>
              <p className="text-text-secondary font-body">Level up, earn XP, and unlock achievements as you progress</p>
            </div>
            <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 hover:border-purple/40 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-pure-white mb-2">Analytics</h3>
              <p className="text-text-secondary font-body">Get insights into your habits with detailed analytics and charts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold mb-8 text-pure-white">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto font-body">
            Join thousands of users building better habits every day. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="w-full sm:w-auto group">
              <button className="relative w-full sm:w-auto text-lg font-body font-semibold bg-gradient-to-r from-purple via-pink to-purple text-pure-white px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/30 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started for Free
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
