import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import Button from '../Components/Button';
import { SkeletonChallengeCard } from '../Components/LoadingSkeleton';

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
    easy: 'text-green-400 bg-green-400/20',
    medium: 'text-yellow-400 bg-yellow-400/20',
    hard: 'text-red-400 bg-red-400/20',
  };

  const difficultyIcons = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  };

  if (loading) {
    return (
      <ScreenContainer className="pb-20 pt-24">
        <SkeletonChallengeCard />
      </ScreenContainer>
    );
  }

  if (!challenge) {
    return (
      <ScreenContainer className="pb-20 pt-24">
        <GlassPanel className="text-center py-12">
          <p className="text-muted-gray mb-4">Challenge not found</p>
          <Link to="/challenges">
            <Button variant="primary">Back to Challenges</Button>
          </Link>
        </GlassPanel>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="pb-20 pt-24 animate-fade-in">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center gap-2 text-muted-gray hover:text-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Challenges
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Challenge Header */}
        <GlassPanel className="p-6 sm:p-8 mb-6 border-2 border-gold/30">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-mono font-semibold ${difficultyColors[challenge.difficulty]}`}>
                  {difficultyIcons[challenge.difficulty]} {challenge.difficulty?.toUpperCase() || 'MEDIUM'}
                </span>
                {challenge.category && (
                  <span className="px-3 py-1 rounded-lg text-sm bg-soft-gray text-muted-gray">
                    {challenge.category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-pure-white">
                {challenge.title}
              </h1>
              <p className="text-lg text-muted-gray leading-relaxed">
                {challenge.description || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Challenge Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-soft-gray">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gold mb-1">
                {challenge.xp_reward}
              </div>
              <div className="text-xs text-muted-gray uppercase tracking-wide">XP Reward</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gold mb-1">
                {challenge.duration_days}
              </div>
              <div className="text-xs text-muted-gray uppercase tracking-wide">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gold mb-1">
                {challenge.difficulty === 'easy' ? '5' : challenge.difficulty === 'medium' ? '10' : '15'}
              </div>
              <div className="text-xs text-muted-gray uppercase tracking-wide">Daily XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gold mb-1">
                {challenge.difficulty === 'easy' ? '1x' : challenge.difficulty === 'medium' ? '1.5x' : '2x'}
              </div>
              <div className="text-xs text-muted-gray uppercase tracking-wide">Multiplier</div>
            </div>
          </div>
        </GlassPanel>

        {/* Challenge Details */}
        <GlassPanel className="p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-pure-white">Challenge Details</h2>
          <div className="space-y-4 text-muted-gray">
            <div>
              <h3 className="text-lg font-heading font-semibold text-pure-white mb-2">What You'll Do</h3>
              <p className="leading-relaxed">
                {challenge.description || 'Complete daily check-ins for this challenge. Each day you check in, you\'ll earn XP and maintain your streak!'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-pure-white mb-2">Rewards</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="text-gold font-semibold">{challenge.difficulty === 'easy' ? '5' : challenge.difficulty === 'medium' ? '10' : '15'} XP</span> per daily check-in</li>
                <li><span className="text-gold font-semibold">{challenge.xp_reward} XP</span> bonus upon completion</li>
                <li>Streak tracking to maintain consistency</li>
                <li>Progress visualization on your dashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-pure-white mb-2">Duration</h3>
              <p>
                This challenge lasts for <span className="text-gold font-semibold">{challenge.duration_days} days</span>. 
                Check in daily to complete it and earn your rewards!
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* How It Works */}
        <GlassPanel className="p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-pure-white">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center text-pure-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-heading font-semibold text-pure-white mb-1">Start the Challenge</h3>
                <p className="text-muted-gray text-sm">Click "Start Challenge" to begin your journey</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-retro-purple flex items-center justify-center text-pure-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-heading font-semibold text-pure-white mb-1">Check In Daily</h3>
                <p className="text-muted-gray text-sm">Visit your dashboard each day and click "Check In"</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-emerald flex items-center justify-center text-pure-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-heading font-semibold text-pure-white mb-1">Earn Rewards</h3>
                <p className="text-muted-gray text-sm">Complete all {challenge.duration_days} days to earn {challenge.xp_reward} XP bonus!</p>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4">
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
  );
};

export default ChallengeDetail;

