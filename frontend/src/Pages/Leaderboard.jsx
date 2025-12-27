import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderboard';
import { useUser } from '../context/UserContext';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useUser();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      if (response.success) {
        setLeaderboard(response.leaderboard || []);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
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

      {loading ? (
        <div className="animate-pulse text-muted-gray">Loading leaderboard...</div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gold w-12 text-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold">
                          {user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-0.5 bg-gold text-pure-black rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-gray mt-1">
                        Level {user.level} • {user.completed_challenges} completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-gold text-lg">
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

