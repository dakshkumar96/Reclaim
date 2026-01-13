import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderboard';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import ScreenContainer from '../Components/ScreenContainer';
import ErrorDisplay from '../Components/ErrorDisplay';
import { SkeletonLeaderboard } from '../Components/LoadingSkeleton';
import { Trophy, Medal, Award, Zap, Target, Flame } from 'lucide-react';

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

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gold via-yellow-400 to-gold flex items-center justify-center shadow-lg shadow-gold/30">
          <Trophy className="w-6 h-6 text-pure-black" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-dark-gray"></div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-300 flex items-center justify-center shadow-lg shadow-slate-400/30">
          <Medal className="w-6 h-6 text-pure-black" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-700/30">
          <Award className="w-6 h-6 text-pure-white" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-gray/80 to-medium-gray/80 border border-purple/30 flex items-center justify-center">
        <span className="font-mono font-bold text-purple text-sm">#{rank}</span>
      </div>
    );
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 text-pure-white" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}>
              <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>
                Leaderboard
              </span>
            </h1>
            <p className="text-text-secondary text-lg font-body">Top performers competing for the crown</p>
          </div>

          {/* User's Rank Display */}
          {userRank && leaderboard.find(u => u.username === username) && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/20 via-dark-gray/95 to-purple/10 border border-purple/30 p-6 shadow-xl shadow-purple/10 mb-8">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent"></div>
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {getRankBadge(userRank)}
                  <div>
                    <div className="text-xs text-text-tertiary font-body uppercase tracking-wider mb-1">Your Rank</div>
                    <div className="text-3xl font-heading font-bold text-pure-white">
                      #{userRank}
                    </div>
                  </div>
                  {userRank <= 3 && (
                    <div className="ml-2 px-3 py-1 bg-purple/20 border border-purple/30 rounded-full">
                      <span className="text-xs font-body font-semibold text-purple uppercase">Top 3</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-text-tertiary font-body uppercase tracking-wider mb-1">XP</div>
                    <div className="text-2xl font-mono font-bold text-purple">
                      {leaderboard.find(u => u.username === username).xp}
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-text-tertiary font-body uppercase tracking-wider mb-1">Level</div>
                    <div className="text-2xl font-mono font-bold text-blue">
                      {leaderboard.find(u => u.username === username).level}
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-text-tertiary font-body uppercase tracking-wider mb-1">Badges</div>
                    <div className="text-2xl font-mono font-bold text-gold">
                      {leaderboard.find(u => u.username === username).badges_earned || 0}
                    </div>
                  </div>
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-12 text-center shadow-lg">
              <Trophy className="w-16 h-16 text-purple/30 mx-auto mb-4" />
              <p className="text-text-secondary font-body text-lg">No rankings yet</p>
              <p className="text-text-tertiary font-body text-sm mt-2">Be the first to start earning XP!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, index) => {
                const isCurrentUser = user.username === username;
                const isTopThree = user.rank <= 3;
                
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                      isCurrentUser
                        ? 'bg-gradient-to-br from-purple/20 via-dark-gray/95 to-purple/10 border-2 border-purple/40 shadow-lg shadow-purple/10'
                        : isTopThree
                        ? 'bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 shadow-md'
                        : 'bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/20 shadow-sm hover:border-purple/30 hover:shadow-md'
                    }`}
                  >

                    <div className="relative flex items-center gap-6">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        {getRankBadge(user.rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-body font-semibold text-base truncate ${
                            isCurrentUser ? 'text-purple' : 'text-pure-white'
                          }`}>
                            {user.username}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 bg-purple/20 border border-purple/30 text-purple text-xs font-body font-medium rounded-full flex-shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-tertiary font-body">
                          <span className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            Level {user.level}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            {user.completed_challenges || 0} completed
                          </span>
                          {user.badges_earned > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              {user.badges_earned} badges
                            </span>
                          )}
                        </div>
                      </div>

                      {/* XP Display */}
                      <div className="flex-shrink-0 text-right">
                        <div className={`font-mono font-bold text-xl mb-0.5 ${
                          isTopThree ? 'text-purple' : 'text-purple'
                        }`}>
                          {user.xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-text-tertiary font-body uppercase tracking-wider">XP</div>
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
