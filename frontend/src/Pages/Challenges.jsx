import React, { useEffect, useState } from 'react';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import ChallengeCard from '../Components/ChallengeCard';
import Button from '../Components/Button';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: 'all', category: 'all' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await getAllChallenges();
      if (response.success) {
        setChallenges(response.challenges || []);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challengeId) => {
    try {
      const response = await startChallenge(challengeId);
      if (response.success) {
        setError('');
        // Show success message
        alert('Challenge started successfully!');
        // Optionally reload challenges
        loadChallenges();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start challenge');
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter.difficulty !== 'all' && challenge.difficulty !== filter.difficulty) {
      return false;
    }
    if (filter.category !== 'all' && challenge.category !== filter.category) {
      return false;
    }
    return true;
  });

  const categories = [...new Set(challenges.map((c) => c.category).filter(Boolean))];
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <ScreenContainer className="pb-20 animate-fade-in">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-3xl font-heading font-bold mb-4">Available Challenges</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm text-muted-gray mb-2">Difficulty</label>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
              className="bg-dark-gray border border-soft-gray rounded px-3 py-2 text-pure-white focus:outline-none focus:border-gold"
            >
              <option value="all">All</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-2">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="bg-dark-gray border border-soft-gray rounded px-3 py-2 text-pure-white focus:outline-none focus:border-gold"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-gray">Loading challenges...</div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-gray">No challenges found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onStart={handleStartChallenge}
            />
          ))}
        </div>
      )}
    </ScreenContainer>
  );
};

export default Challenges;

