import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getAllChallenges, getActiveChallenges, checkinChallenge } from '../api/challenges';
import { getUserBadges } from '../api/badges';
import { getAnalytics } from '../api/user';
import ScreenContainer from '../Components/ScreenContainer';
import { SkeletonCard } from '../Components/LoadingSkeleton';
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
  ArrowRight,
  Plus,
  Sun,
  Moon,
  Sunrise,
  Star,
  ChevronRight,
  Rocket,
  Timer
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

  // Load data for authenticated users ONLY
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
      if (import.meta.env?.MODE === 'development') {
        console.error('Error loading homepage data:', error);
      }
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
      if (import.meta.env?.MODE === 'development') {
        console.error('Error checking in:', error);
      }
      toast.error('Failed to check in. Please try again.');
    } finally {
      setCheckingIn({ ...checkingIn, [challengeId]: false });
    }
  };

  // If authenticated, show personalized homepage
  if (isAuthenticated) {
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/20 via-dark-gray/95 to-purple/10 border border-purple/30 p-8 shadow-xl shadow-purple/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent"></div>
              
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gold/20 border border-gold/30">
                      <GreetingIcon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-gold font-clean text-sm font-medium uppercase tracking-wider">{greeting.text}</span>
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple to-blue flex items-center justify-center mb-3 shadow-lg shadow-purple/30">
                      <span className="font-mono text-3xl font-bold text-pure-white">{level}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold flex items-center justify-center border-2 border-dark-gray">
                      <Star className="w-4 h-4 text-dark-gray fill-current" />
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary font-clean uppercase tracking-wider">Level</span>
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-xs text-text-tertiary mb-1">
                      <span>{xp} XP</span>
                      <span>{nextLevelXP} XP</span>
                    </div>
                    <div className="w-24 h-1.5 bg-medium-gray/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple to-blue rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
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
                    <p className="text-xs font-clean text-text-tertiary uppercase tracking-wider mb-1">Today's Check-ins</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{pendingCheckIns}</p>
                    <p className="text-sm text-text-secondary font-clean mt-1">
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
                    <p className="text-xs font-clean text-text-tertiary uppercase tracking-wider mb-1">Current Streak</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{maxStreak}</p>
                    <p className="text-sm text-text-secondary font-clean mt-1">
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
                    <p className="text-xs font-clean text-text-tertiary uppercase tracking-wider mb-1">Badges Earned</p>
                    <p className="font-mono text-4xl font-bold text-pure-white">{totalBadges}</p>
                    <p className="text-sm text-text-secondary font-clean mt-1">
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
                  className="text-sm text-purple hover:text-purple/80 font-clean flex items-center gap-1 transition-colors"
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-pure-white font-body font-medium rounded-lg hover:opacity-90 transition-opacity"
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
                          <div className="flex items-center gap-3 text-xs text-text-tertiary font-clean mt-1">
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
                            className="px-3 py-1.5 bg-gradient-primary text-pure-white text-xs font-clean font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                          >
                            {checkingIn[challenge.challenge_id] ? '...' : 'Check In'}
                          </button>
                        ) : (
                          <span className="text-xs text-emerald font-clean font-medium px-2 py-1 bg-emerald/10 rounded-full flex-shrink-0">
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
                    onClick={() => navigate('/chat')}
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
                    <h3 className="font-clean text-lg font-semibold text-pure-white">Discover</h3>
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
                  const today = new Date();
                  const todayDayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
                  // Get the start of the week (Sunday)
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - todayDayOfWeek);
                  
                  // Create a map of day name to data
                  const activityMap = {};
                  if (weeklyActivity.length > 0) {
                    weeklyActivity.forEach((dayData) => {
                      const dayKey = dayData.day ? dayData.day.substring(0, 3).trim().toLowerCase() : null;
                      if (dayKey) {
                        // Map to full day name
                        const dayIndex = dayNames.findIndex(d => d.toLowerCase().startsWith(dayKey));
                        if (dayIndex !== -1) {
                          activityMap[dayNames[dayIndex]] = dayData;
                        }
                      }
                    });
                  }
                  
                  // Display days starting from Sunday
                  return dayNames.map((dayName, index) => {
                    const dayData = activityMap[dayName] || { day: dayName, checkins: 0, completed: 0 };
                    const isToday = index === todayDayOfWeek;
                    const isPast = index < todayDayOfWeek;
                    const isFuture = index > todayDayOfWeek;
                    // Check both checkins and completed fields from API
                    const hasActivity = (dayData.checkins || 0) > 0 || (dayData.completed || 0) > 0;
                    const isCompleted = hasActivity && isPast;
                    const isMissed = !hasActivity && isPast;
                    
                    return (
                      <div key={dayName} className="flex flex-col items-center gap-2 flex-1">
                        <span className={`text-xs font-body font-medium ${isToday ? 'text-purple' : 'text-text-tertiary'}`}>
                          {dayName}
                        </span>
                        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald/20 border-2 border-emerald'
                            : isMissed
                              ? 'bg-medium-gray/30 border-2 border-medium-gray/40'
                              : isToday
                                ? 'bg-dark-gray/50 border-2 border-purple'
                                : 'bg-medium-gray/10 border-2 border-dashed border-medium-gray/30'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald" />
                          ) : isMissed ? (
                            <span className="w-2 h-2 rounded-full bg-medium-gray/60"></span>
                          ) : isToday ? (
                            <span className="w-2 h-2 rounded-full bg-purple"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-transparent"></span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 pt-5 border-t border-purple/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald/20 border-2 border-emerald"></div>
                  <span className="text-xs text-text-tertiary font-body">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-medium-gray/30 border-2 border-medium-gray/40"></div>
                  <span className="text-xs text-text-tertiary font-body">Missed</span>
                </div>
              </div>
            </div>

            {/* Level Up Progress Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple/20 via-dark-gray/95 to-purple/20 border border-purple/30 p-6 shadow-xl shadow-purple/10">
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/30 via-purple/20 to-purple/30 border border-purple/40 p-8 sm:p-10 text-center backdrop-blur-sm shadow-xl shadow-purple/20">
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
                  <span className="text-xs text-purple font-clean font-medium uppercase tracking-wider">Discover More</span>
                </div>
                
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-pure-white mb-4">
                  Ready to take on a <span className="bg-gradient-to-r from-purple via-blue to-purple bg-clip-text text-transparent">new challenge</span>?
                </h3>
                
                <p className="text-text-secondary font-body text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  Explore our collection of habit-building challenges designed to help you grow every day.
                </p>
                
                <button
                  onClick={() => navigate('/challenges')}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-primary text-pure-white font-body font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple/30 hover:shadow-purple/50 relative overflow-hidden"
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

  // Marketing homepage for non-authenticated users (NO DATA, NO DATES, NO API CALLS)
  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-pure-black via-dark-gray to-dark-gray pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl pointer-events-none animate-pulse animation-delay-2000"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Top Section - Hero */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden min-h-[90vh] flex items-center">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-[0.15]"
          >
            <source src="/0_Geometric_Shapes_Circles_3840x2160.mp4" type="video/mp4" />
          </video>
          
          {/* Animated Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-pure-black/95 to-pure-black/90"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[150px] pointer-events-none"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.08)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center">
            {/* Pill Badge - Smaller and closer */}
            <div className="inline-flex items-center px-3 py-1.5 mb-3 bg-gradient-to-r from-purple/30 via-purple/20 to-purple/30 backdrop-blur-xl border border-purple/50 rounded-full shadow-lg glow-gold-soft animate-fade-in hover:scale-105 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Sparkles className="w-3 h-3 text-gold mr-1.5 animate-pulse-glow group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="text-[10px] sm:text-xs text-gold font-body font-semibold tracking-wider uppercase relative z-10">All-in-One Habit Toolkit</span>
            </div>

            {/* Main Headline - Enhanced Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold mb-4 sm:mb-6 leading-[1.1] text-pure-white tracking-tight px-4 animate-slide-up max-w-5xl mx-auto">
              <span className="block mb-2">Take control of your</span>
              <span className="block">
                <span className="text-pure-white">habits with </span>
                <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent relative inline-block">
                  clarity
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-purple via-pink to-gold rounded-full opacity-60 blur-sm"></span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple via-pink to-gold rounded-full"></span>
                </span>
              </span>
            </h1>

            {/* Subheadline - Enhanced */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 font-body font-light tracking-wide animate-slide-up animation-delay-200">
              All your progress insights, finally in one place.{' '}
              <span className="text-pure-white/90 font-medium">Track challenges, earn XP,</span> and reach your goals with ease.
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4 animate-slide-up animation-delay-300">
              <Link to="/signup" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold bg-gradient-primary text-pure-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/50 glow-soft hover:glow-effect group-hover:border-gold/50 border-2 border-transparent relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2.5">
                    Get Started for Free
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold text-pure-white hover:text-gold border-2 border-purple/50 hover:border-gold/70 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all duration-300 hover:bg-purple/20 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-xl bg-dark-gray/30">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-gray animate-fade-in animation-delay-400">
              <div className="flex items-center gap-2 group/trust hover:text-emerald-300 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover/trust:scale-110 transition-transform" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2 group/trust hover:text-blue-300 transition-colors">
                <Shield className="w-5 h-5 text-blue-400 group-hover/trust:scale-110 transition-transform" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 group/trust hover:text-gold transition-colors">
                <Zap className="w-5 h-5 text-gold group-hover/trust:scale-110 transition-transform" />
                <span>Instant Start</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/8 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/6 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Your <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              See your progress at a glance with our intuitive dashboard
            </p>
          </div>
          
          {/* Dashboard Preview Card */}
          <div className="relative bg-gradient-to-br from-medium-gray/80 via-dark-gray/60 to-medium-gray/80 backdrop-blur-2xl border-2 border-purple/30 rounded-3xl overflow-hidden shadow-2xl hover:border-purple/50 hover:shadow-purple/30 hover:scale-[1.01] transition-all duration-500 group smooth-hover">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple/20 to-transparent rounded-br-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple/15 to-transparent rounded-tl-3xl"></div>
            
            {/* Mock Dashboard Header */}
            <div className="relative bg-dark-gray/60 border-b border-soft-gray/20 px-6 py-4 flex items-center justify-between">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-pure-white font-heading font-semibold text-lg">Dashboard</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-dark-gray/80 border border-soft-gray/20 group-hover:border-purple/40 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-dark-gray/80 border border-soft-gray/20 group-hover:border-purple/40 transition-colors"></div>
                <div className="w-9 h-9 rounded-full bg-gradient-primary shadow-lg group-hover:scale-110 transition-transform"></div>
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-8 bg-dark-gray/10">
              <div className="grid md:grid-cols-3 gap-5 mb-6">
                {/* Stats Cards */}
                <div className="relative bg-gradient-to-br from-purple/10 to-purple/5 backdrop-blur-md border-2 border-purple/30 rounded-xl p-5 text-center hover:border-gold/50 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-gold/20 overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold/40 rounded-full"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-7 h-7 text-gold glow-effect-gold" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-pure-white mb-1.5 neon-text-gold">12</div>
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Level</div>
                </div>
                <div className="relative bg-gradient-to-br from-emerald/10 to-emerald/5 backdrop-blur-md border-2 border-emerald/30 rounded-xl p-5 text-center hover:border-emerald/50 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-emerald/20 overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald/40 rounded-full"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-xp/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Flame className="w-7 h-7 text-emerald glow-effect" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-pure-white mb-1.5 neon-text">45</div>
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Day Streak</div>
                </div>
                <div className="relative bg-gradient-to-br from-blue/10 to-blue/5 backdrop-blur-md border-2 border-blue/30 rounded-xl p-5 hover:border-blue/50 hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue/40 rounded-full"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary font-semibold">XP Progress</span>
                    <span className="text-sm text-gold font-mono font-bold neon-text-gold">1,250 / 1,300</span>
                  </div>
                  <div className="w-full h-3 bg-dark-gray/50 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-xp rounded-full transition-all duration-500 glow-effect" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>

              {/* Active Challenge Card */}
              <div className="relative bg-gradient-to-br from-purple/10 via-dark-gray/50 to-purple/5 backdrop-blur-md border-2 border-purple/30 rounded-xl p-6 hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
                <div className="absolute top-3 right-3 w-2 h-2 bg-purple/30 rounded-full"></div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-pure-white text-lg flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5 text-blue" />
                    </div>
                    Daily Exercise Challenge
                  </h3>
                  <span className="text-xs font-semibold text-emerald bg-emerald/20 border border-emerald/30 px-3 py-1 rounded-full flex items-center gap-1.5 group-hover:bg-emerald/30 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Checked In
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary mb-4 flex-wrap">
                  <span className="font-semibold text-pure-white">15 / 30 days</span>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-gold font-bold neon-text-gold">150 XP</span>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-emerald font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    7 day streak
                  </span>
                </div>
                <div className="w-full h-3 bg-dark-gray/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-xp rounded-full transition-all duration-500 glow-effect" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-purple/8 rounded-full blur-[110px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-purple/30 transition-shadow">
                  1
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Sign Up</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                  Create your free account in seconds. Get started instantly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-blue/30 transition-shadow">
                  2
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Start Challenges</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                  Browse and select challenges that match your goals. Start multiple at once.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                  3
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Level Up</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                  Check in daily, earn XP, and watch yourself climb the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald/8 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple/6 rounded-full blur-[110px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/4 rounded-full blur-[130px] pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              Everything you need to build lasting habits and achieve your goals
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Feature 1 - Gamification */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-gold/25 rounded-2xl p-8 group hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-gold/40 rounded-full group-hover:bg-gold/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gold/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-gold/30 transition-shadow">
                  <Trophy className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Gamification</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Earn XP, level up, and unlock achievements as you complete challenges. Make habit-building fun and rewarding.
                </p>
              </div>
            </div>

            {/* Feature 2 - Daily Challenges */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue/30 transition-shadow">
                  <Target className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Daily Challenges</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Choose from dozens of pre-built challenges or create your own. Track progress with visual indicators and streaks.
                </p>
              </div>
            </div>

            {/* Feature 3 - Leaderboards */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                  <BarChart3 className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Leaderboards</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Compete with others and see how you rank. Climb the leaderboard by earning XP and completing challenges.
                </p>
              </div>
            </div>

            {/* Feature 4 - AI Coach */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple/30 transition-shadow">
                  <Brain className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">AI Coach</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Get personalized guidance and motivation from our AI coach. Receive tips tailored to your progress and goals.
                </p>
              </div>
            </div>

            {/* Feature 5 - Streak Tracking */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-orange/25 rounded-2xl p-8 group hover:border-orange/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange/40 rounded-full group-hover:bg-orange/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-orange/30 transition-shadow">
                  <Flame className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Streak Tracking</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Build consistency with streak tracking. See your progress and maintain momentum with daily check-ins.
                </p>
              </div>
            </div>

            {/* Feature 6 - Badges & Achievements */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full z-10"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-blue flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple/30 transition-shadow">
                  <Award className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Badges & Achievements</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body flex-1">
                  Unlock badges and achievements as you reach milestones. Showcase your accomplishments and stay motivated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-gold/8 rounded-full blur-[110px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-pink/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Why Choose Reclaim?
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              The modern way to build better habits and achieve your goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Benefit 1 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-gold/25 rounded-2xl p-8 group hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-gold/40 rounded-full group-hover:bg-gold/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gold/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg group-hover:shadow-gold/30 transition-shadow">
                    <Zap className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Gamified Motivation</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Turn habit-building into a game. Earn XP, level up, and unlock achievements that keep you motivated and engaged every day.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center shadow-lg group-hover:shadow-blue/30 transition-shadow">
                    <Users className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Community & Competition</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Compete with friends and see how you stack up on the leaderboard. Community support makes staying consistent easier.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                    <TrendingUp className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Track Your Progress</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Visualize your journey with detailed progress tracking. See your streaks, XP growth, and challenge completion rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:shadow-purple/30 transition-shadow">
                    <Sparkles className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">AI-Powered Guidance</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Get personalized advice from our AI coach. Receive tips, motivation, and strategies tailored to your unique journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-orange/25 rounded-2xl p-8 group hover:border-orange/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange/40 rounded-full group-hover:bg-orange/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-lg group-hover:shadow-orange/30 transition-shadow">
                    <Clock className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Quick Daily Check-ins</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Spend just seconds a day checking in. No complex tracking or lengthy forms. Just simple, fast progress updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-teal/25 rounded-2xl p-8 group hover:border-teal/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Decorative blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal/8 rounded-full blur-3xl"></div>
              {/* Top border line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal/20 to-transparent"></div>
              {/* Top-right dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-teal/40 rounded-full group-hover:bg-teal/60 transition-colors z-10"></div>
              {/* Bottom-left dot */}
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-teal/30 rounded-full z-10"></div>
              <div className="relative flex gap-6 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center shadow-lg group-hover:shadow-teal/30 transition-shadow">
                    <Shield className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Free Forever</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm flex-1">
                    Start building better habits today. Completely free. No hidden fees, no limits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 pb-40">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-purple/10 via-blue/8 to-purple/6 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/10 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Decorative badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-purple/20 via-purple/15 to-purple/20 backdrop-blur-xl border border-purple/40 rounded-full shadow-lg hover:scale-105 transition-transform group">
            <Sparkles className="w-4 h-4 text-gold mr-2 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs text-gold font-body font-semibold tracking-wider uppercase">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-8 text-pure-white tracking-tighter">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-body font-normal leading-relaxed">
            Join thousands of users building better habits every day. Start your journey today. It's free and takes less than a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="w-full sm:w-auto group">
              <button className="relative w-full sm:w-auto text-base sm:text-lg font-body font-semibold bg-gradient-primary text-pure-white px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/30 glow-soft hover:glow-effect group-hover:border-gold/50 border-2 border-transparent overflow-hidden">
                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started for Free
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/challenges" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold text-pure-white hover:text-gold border-2 border-purple/50 hover:border-gold/70 px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-purple/10 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-xl">
                Browse Challenges
              </button>
            </Link>
          </div>
          
          {/* Final trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-gray">
            <div className="flex items-center gap-2 group/trust hover:text-emerald-300 transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover/trust:scale-110 transition-transform" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 group/trust hover:text-gold transition-colors cursor-default">
              <Zap className="w-4 h-4 text-gold group-hover/trust:scale-110 transition-transform" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2 group/trust hover:text-blue-300 transition-colors cursor-default">
              <Shield className="w-4 h-4 text-blue-400 group-hover/trust:scale-110 transition-transform" />
              <span>100% secure</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

