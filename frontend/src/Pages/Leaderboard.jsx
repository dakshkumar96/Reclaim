import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderboard';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import ErrorDisplay from '../Components/ErrorDisplay';
import { SkeletonLeaderboard } from '../Components/LoadingSkeleton';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRank, setUserRank] = useState(null);
  const { username } = useUser();
  const toast = useToastContext();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      if (response.success) {
        setLeaderboard(response.leaderboard || []);
        setUserRank(response.user_rank || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      const errorMessage = 'Failed to load leaderboard. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankGradient = (rank) => {
    if (rank <= 3) return 'bg-gradient-sunset';
    return '';
  };

  return (
    <ScreenContainer className="pb-20 animate-fade-in">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-3xl font-heading font-bold mb-4">Leaderboard</h1>
        <p className="text-muted-gray">Top performers in Reclaim</p>
      </div>

      {/* User's Rank Display */}
      {userRank && (
        <GlassPanel className="mb-6 border-2 border-gold bg-dark-gray/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                {userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : `#${userRank}`}
              </div>
              <div>
                <div className="text-sm text-muted-gray">Your Rank</div>
                <div className="text-2xl font-heading font-bold text-gold">
                  #{userRank}
                </div>
              </div>
            </div>
            <div className="text-right">
              {leaderboard.find(u => u.username === username) && (
                <>
                  <div className="text-sm text-muted-gray">Your XP</div>
                  <div className="text-xl font-mono font-bold text-gold">
                    {leaderboard.find(u => u.username === username).xp} XP
                  </div>
                </>
              )}
            </div>
          </div>
        </GlassPanel>
      )}

      {error && !loading && (
        <ErrorDisplay
          title="Failed to Load Leaderboard"
          message={error}
          onRetry={loadLeaderboard}
        />
      )}

      {loading ? (
        <SkeletonLeaderboard />
      ) : leaderboard.length === 0 ? (
        <GlassPanel className="text-center py-12">
          <p className="text-muted-gray">No rankings yet</p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const isCurrentUser = user.username === username;
            return (
              <GlassPanel
                key={index}
                className={`
                  ${isCurrentUser ? 'border-2 border-gold' : ''}
                  ${getRankGradient(user.rank)}
                `}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-gold w-10 sm:w-12 text-center flex-shrink-0">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-semibold truncate">
                          {user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-0.5 bg-gold text-pure-black rounded flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-gray mt-1">
                        Level {user.level} • {user.completed_challenges || 0} completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-gold text-base sm:text-lg">
                      {user.xp} XP
                    </div>
                    {user.badges_earned > 0 && (
                      <div className="text-xs text-muted-gray">
                        {user.badges_earned} badges
                      </div>
                    )}
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </ScreenContainer>
  );
};

export default Leaderboard;

