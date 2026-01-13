import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import Button from '../Components/Button';
import { SkeletonChallengeCard } from '../Components/LoadingSkeleton';
import { 
  ArrowLeft, 
  Target, 
  Zap, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  Award,
  Flame
} from 'lucide-react';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const toast = useToastContext();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadChallenge();
  }, [id, isAuthenticated, navigate]);

  const loadChallenge = async () => {
    try {
      const response = await getAllChallenges();
      if (response.success) {
        const foundChallenge = response.challenges.find(c => c.id === parseInt(id));
        if (foundChallenge) {
          setChallenge(foundChallenge);
        } else {
          toast.error('Challenge not found');
          navigate('/challenges');
        }
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
      toast.error('Failed to load challenge details');
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async () => {
    setStarting(true);
    try {
      const response = await startChallenge(challenge.id);
      if (response.success) {
        toast.success(`🎉 "${challenge.title}" started successfully! Start checking in daily to earn XP.`);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start challenge';
      toast.error(errorMessage);
    } finally {
      setStarting(false);
    }
  };

  const difficultyConfig = {
    easy: {
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
      borderColor: 'border-emerald/30',
      iconColor: 'text-emerald',
      label: 'Easy',
      gradient: 'from-emerald/20 to-emerald/5'
    },
    medium: {
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      borderColor: 'border-gold/30',
      iconColor: 'text-gold',
      label: 'Medium',
      gradient: 'from-gold/20 to-gold/5'
    },
    hard: {
      color: 'text-red',
      bgColor: 'bg-red/10',
      borderColor: 'border-red/30',
      iconColor: 'text-red',
      label: 'Hard',
      gradient: 'from-red/20 to-red/5'
    }
  };

  const config = difficultyConfig[challenge?.difficulty] || difficultyConfig.medium;

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black relative overflow-hidden">
        <ScreenContainer className="pb-20 pt-24">
          <SkeletonChallengeCard />
        </ScreenContainer>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-pure-black relative overflow-hidden">
        <ScreenContainer className="pb-20 pt-24">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-12 text-center shadow-lg">
            <Target className="w-16 h-16 text-purple/30 mx-auto mb-4" />
            <p className="text-text-secondary font-body text-lg mb-4">Challenge not found</p>
            <Link to="/challenges">
              <Button variant="primary">Back to Challenges</Button>
            </Link>
          </div>
        </ScreenContainer>
      </div>
    );
  }

  const dailyXP = challenge.difficulty === 'easy' ? 5 : challenge.difficulty === 'medium' ? 10 : 15;

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <ScreenContainer className="pb-32 pt-24 relative z-10 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-text-secondary hover:text-purple transition-colors font-body animate-slide-up"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Challenges</span>
          </button>

          {/* Challenge Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/20 via-dark-gray/95 to-purple/10 border border-purple/30 p-8 shadow-xl shadow-purple/10 animate-slide-up animation-delay-200">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative space-y-6">
              {/* Difficulty & Category Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-lg text-sm font-body font-semibold border ${config.bgColor} ${config.borderColor} ${config.color}`}>
                  {config.label}
                </span>
                {challenge.category && (
                  <span className="px-4 py-2 rounded-lg text-sm bg-purple/10 border border-purple/25 text-purple font-body">
                    {challenge.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 leading-tight text-pure-white" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}>
                <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>
                  {challenge.title}
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-text-secondary leading-relaxed font-body max-w-3xl">
                {challenge.description || 'Complete this challenge by checking in daily. Build consistency and earn rewards as you progress!'}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-purple/20">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/20">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className={`text-2xl font-mono font-bold ${config.color} mb-1`}>
                    {challenge.xp_reward}
                  </div>
                  <div className="text-xs text-text-tertiary font-body uppercase tracking-wider">Total XP</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-blue" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-blue mb-1">
                    {challenge.duration_days}
                  </div>
                  <div className="text-xs text-text-tertiary font-body uppercase tracking-wider">Days</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald/10 to-emerald/5 border border-emerald/20">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-emerald" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald mb-1">
                    {dailyXP}
                  </div>
                  <div className="text-xs text-text-tertiary font-body uppercase tracking-wider">Daily XP</div>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-5 h-5 text-gold" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-gold mb-1">
                    {challenge.duration_days}
                  </div>
                  <div className="text-xs text-text-tertiary font-body uppercase tracking-wider">Streak Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Details Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 p-8 shadow-lg animate-slide-up animation-delay-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            
            <h2 className="text-2xl font-heading font-bold text-pure-white mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-purple" />
              Challenge Details
            </h2>
            
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-medium-gray/30 border border-purple/10">
                <h3 className="text-lg font-heading font-semibold text-pure-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  What You'll Do
                </h3>
                <p className="text-text-secondary leading-relaxed font-body">
                  {challenge.description || 'This challenge requires daily commitment. Check in each day to track your progress and maintain your streak. Consistency is key to building lasting habits!'}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-medium-gray/30 border border-purple/10">
                <h3 className="text-lg font-heading font-semibold text-pure-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" />
                  Rewards & Benefits
                </h3>
                <ul className="space-y-3 text-text-secondary font-body">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mt-2 flex-shrink-0"></div>
                    <span><span className="text-purple font-semibold">{dailyXP} XP</span> per daily check-in</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mt-2 flex-shrink-0"></div>
                    <span><span className="text-purple font-semibold">{challenge.xp_reward} XP</span> bonus upon completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mt-2 flex-shrink-0"></div>
                    <span>Streak tracking to maintain consistency and build momentum</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple mt-2 flex-shrink-0"></div>
                    <span>Progress visualization on your dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-medium-gray/30 border border-purple/10">
                <h3 className="text-lg font-heading font-semibold text-pure-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue" />
                  Duration & Commitment
                </h3>
                <p className="text-text-secondary leading-relaxed font-body">
                  This challenge lasts for <span className="text-blue font-semibold">{challenge.duration_days} days</span>. 
                  Check in daily to complete it and earn your rewards! Missing a day won't reset your progress, but consistency will help you build strong habits.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 p-8 shadow-lg animate-slide-up animation-delay-400">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            
            <h2 className="text-2xl font-heading font-bold text-pure-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple" />
              How It Works
            </h2>
            
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-blue flex items-center justify-center text-pure-white font-mono font-bold shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Start the Challenge</h3>
                  <p className="text-text-secondary text-sm font-body leading-relaxed">Click "Start Challenge" below to begin your journey. The challenge will appear on your dashboard immediately.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue to-emerald flex items-center justify-center text-pure-white font-mono font-bold shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Check In Daily</h3>
                  <p className="text-text-secondary text-sm font-body leading-relaxed">Visit your dashboard each day and click "Check In" for this challenge. You'll earn {dailyXP} XP per check-in!</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-purple flex items-center justify-center text-pure-white font-mono font-bold shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Earn Rewards</h3>
                  <p className="text-text-secondary text-sm font-body leading-relaxed">Complete all {challenge.duration_days} days to earn your {challenge.xp_reward} XP completion bonus! Your streak and progress will be tracked automatically.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-500">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartChallenge}
              loading={starting}
              disabled={starting}
              className="flex-1 text-lg px-8 py-4"
            >
              Start Challenge
            </Button>
            <Link to="/challenges" className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg px-8 py-4"
              >
                Browse More Challenges
              </Button>
            </Link>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
};

export default ChallengeDetail;
