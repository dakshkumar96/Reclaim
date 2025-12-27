import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getActiveChallenges, checkinChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import XPBar from '../Components/XPBar';
import Button from '../Components/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { username, xp, level, refreshUser, isAuthenticated, loading: userLoading } = useUser();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState({});
  const navigate = useNavigate();

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
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (challengeId) => {
    setCheckingIn({ ...checkingIn, [challengeId]: true });
    try {
      const response = await checkinChallenge(challengeId);
      if (response.success) {
        // Reload active challenges to get updated data
        await loadData();
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.response?.data?.message || 'Failed to check in. Please try again.');
    } finally {
      setCheckingIn({ ...checkingIn, [challengeId]: false });
    }
  };

  const nextLevelXP = (level + 1) * 100;

  if (userLoading || (isAuthenticated && loading)) {
    return (
      <ScreenContainer>
        <div className="animate-pulse text-muted-gray">Loading...</div>
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
    <ScreenContainer className="pb-20 pt-24 animate-fade-in">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome back, {username}!
        </h1>
        <p className="text-muted-gray">Track your progress and keep building habits</p>
      </div>

      <div className="mb-6 animate-slide-up">
        <GlassPanel>
          <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
        </GlassPanel>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">{xp}</div>
          <div className="text-xs text-muted-gray">Total XP</div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">{level}</div>
          <div className="text-xs text-muted-gray">Level</div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">
            {activeChallenges.length}
          </div>
          <div className="text-xs text-muted-gray">Active</div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-2xl font-mono font-bold text-gold mb-1">
            {activeChallenges.reduce((max, c) => Math.max(max, c.current_streak || 0), 0)}
          </div>
          <div className="text-xs text-muted-gray">Streak</div>
        </GlassPanel>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">Active Challenges</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/challenges')}
          >
            Browse All
          </Button>
        </div>

        {activeChallenges.length === 0 ? (
          <GlassPanel className="text-center py-8">
            <p className="text-muted-gray mb-4">No active challenges</p>
            <Button
              variant="primary"
              onClick={() => navigate('/challenges')}
            >
              Start a Challenge
            </Button>
          </GlassPanel>
        ) : (
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <GlassPanel key={challenge.user_challenge_id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold">{challenge.title}</h3>
                      {challenge.checked_in_today && (
                        <span className="text-xs text-green-400 font-semibold">✓ Checked In Today</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-gray mb-2">
                      <span>{challenge.progress_days} / {challenge.total_days} days</span>
                      <span>{challenge.xp_reward} XP</span>
                      {challenge.current_streak > 0 && (
                        <span className="text-gold font-semibold">🔥 {challenge.current_streak} day streak</span>
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
    </ScreenContainer>
  );
};

export default Dashboard;

