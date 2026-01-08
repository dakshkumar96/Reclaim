import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import Button from '../Components/Button';
import { SkeletonChallengeCard } from '../Components/LoadingSkeleton';
import { Target, Trophy, Calendar, Zap, ArrowLeft } from 'lucide-react';

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

  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30',
    medium: 'text-gold bg-gold/20 border-gold/30',
    hard: 'text-red-400 bg-red-400/20 border-red-400/30',
  };

  const difficultyIcons = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <ScreenContainer className="pb-32 pt-24 relative z-10">
          <SkeletonChallengeCard />
        </ScreenContainer>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-pure-black relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <ScreenContainer className="pb-32 pt-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-8 text-center shadow-lg">
              <p className="text-text-tertiary mb-4 font-body">Challenge not found</p>
              <Link to="/challenges">
                <Button variant="primary">Back to Challenges</Button>
              </Link>
            </div>
          </div>
        </ScreenContainer>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-text-tertiary hover:text-gold transition-colors font-body group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Challenges
          </button>

          {/* Hero Section - Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Challenge Header */}
              <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 sm:p-8 shadow-lg hover:border-purple/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-sm font-mono font-semibold border ${difficultyColors[challenge.difficulty]}`}>
                    {difficultyIcons[challenge.difficulty]} {challenge.difficulty?.toUpperCase() || 'MEDIUM'}
                  </span>
                  {challenge.category && (
                    <span className="px-3 py-1 rounded-lg text-sm bg-medium-gray/60 text-text-tertiary border border-soft-gray/30">
                      {challenge.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 text-pure-white">
                  {challenge.title}
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed font-body">
                  {challenge.description || 'No description available.'}
                </p>
              </div>

              {/* Challenge Details */}
              <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 sm:p-8 shadow-lg hover:border-purple/40 transition-all duration-300">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-pure-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple" />
                  What You'll Do
                </h2>
                <div className="space-y-4 text-text-secondary font-body">
                  <p className="leading-relaxed text-base">
                    {challenge.description || 'Complete daily check-ins for this challenge. Each day you check in, you\'ll earn XP and maintain your streak!'}
                  </p>
                  <div className="pt-4 border-t border-purple/20">
                    <h3 className="text-lg font-heading font-semibold text-pure-white mb-3">Rewards</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-1">•</span>
                        <span><span className="text-gold font-semibold">{challenge.difficulty === 'easy' ? '5' : challenge.difficulty === 'medium' ? '10' : '15'} XP</span> per daily check-in</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-1">•</span>
                        <span><span className="text-gold font-semibold">{challenge.xp_reward} XP</span> bonus upon completion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-1">•</span>
                        <span>Streak tracking to maintain consistency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-1">•</span>
                        <span>Progress visualization on your dashboard</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 sm:p-8 shadow-lg hover:border-purple/40 transition-all duration-300">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-pure-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-gold" />
                  How It Works
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-sunset flex items-center justify-center text-pure-white font-bold shadow-lg text-lg">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Start the Challenge</h3>
                      <p className="text-text-secondary font-body">Click "Start Challenge" to begin your journey</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-retro-purple flex items-center justify-center text-pure-white font-bold shadow-lg text-lg">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Check In Daily</h3>
                      <p className="text-text-secondary font-body">Visit your dashboard each day and click "Check In"</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-xp flex items-center justify-center text-pure-white font-bold shadow-lg text-lg">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-pure-white mb-1 text-lg">Earn Rewards</h3>
                      <p className="text-text-secondary font-body">Complete all {challenge.duration_days} days to earn {challenge.xp_reward} XP bonus!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Stats & CTA */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-6 shadow-lg hover:border-purple/40 transition-all duration-300 sticky top-24">
                <h3 className="text-xl font-heading font-semibold mb-6 text-pure-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold" />
                  Challenge Stats
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-medium-gray/40 rounded-lg border border-purple/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-sunset/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary font-body uppercase tracking-wide">XP Reward</div>
                        <div className="text-2xl font-mono font-bold text-gold">{challenge.xp_reward}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-medium-gray/40 rounded-lg border border-purple/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-retro-purple/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple" />
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary font-body uppercase tracking-wide">Duration</div>
                        <div className="text-2xl font-mono font-bold text-purple">{challenge.duration_days} days</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-medium-gray/40 rounded-lg border border-purple/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-xp/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary font-body uppercase tracking-wide">Daily XP</div>
                        <div className="text-2xl font-mono font-bold text-emerald-400">
                          {challenge.difficulty === 'easy' ? '5' : challenge.difficulty === 'medium' ? '10' : '15'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-medium-gray/40 rounded-lg border border-purple/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary font-body uppercase tracking-wide">Multiplier</div>
                        <div className="text-2xl font-mono font-bold text-gold">
                          {challenge.difficulty === 'easy' ? '1x' : challenge.difficulty === 'medium' ? '1.5x' : '2x'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 pt-6 border-t border-purple/20 space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartChallenge}
                    loading={starting}
                    disabled={starting}
                    className="w-full text-lg py-4"
                  >
                    Start Challenge
                  </Button>
                  <Link to="/challenges">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-lg py-4"
                    >
                      Browse More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
};

export default ChallengeDetail;
