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
        <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
          <div className="mb-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pure-white mb-3">
              <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-text-secondary text-base font-body">Top performers in Reclaim</p>
          </div>

          {/* User's Rank Display */}
          {userRank && (
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border-2 border-gold/50 rounded-xl p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : `#${userRank}`}
                  </div>
                  <div>
                    <div className="text-sm text-text-tertiary font-body">Your Rank</div>
                    <div className="text-2xl font-heading font-bold text-gold">
                      #{userRank}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {leaderboard.find(u => u.username === username) && (
                    <>
                      <div className="text-sm text-text-tertiary font-body">Your XP</div>
                      <div className="text-xl font-mono font-bold text-gold">
                        {leaderboard.find(u => u.username === username).xp} XP
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
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
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-12 text-center shadow-lg">
              <p className="text-text-secondary font-body">No rankings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, index) => {
                const isCurrentUser = user.username === username;
                return (
                  <div
                    key={index}
                    className={`relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border rounded-xl p-5 shadow-lg transition-all duration-300 ${
                      isCurrentUser ? 'border-2 border-gold/50' : 'border-purple/25'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl font-bold text-gold w-10 sm:w-12 text-center flex-shrink-0">
                          {getRankIcon(user.rank)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-semibold truncate text-pure-white">
                              {user.username}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs px-2 py-0.5 bg-gold text-pure-black rounded flex-shrink-0 font-body">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-tertiary mt-1 font-body">
                            Level {user.level} • {user.completed_challenges || 0} completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-gold text-base sm:text-lg">
                          {user.xp} XP
                        </div>
                        {user.badges_earned > 0 && (
                          <div className="text-xs text-text-tertiary font-body">
                            {user.badges_earned} badges
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
};

export default Leaderboard;

