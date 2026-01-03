import React, { useEffect, useState } from 'react';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import ChallengeCard from '../Components/ChallengeCard';
import Button from '../Components/Button';
import GlassPanel from '../Components/GlassPanel';
import ErrorDisplay from '../Components/ErrorDisplay';
import { SkeletonChallengeCard } from '../Components/LoadingSkeleton';
import { useToastContext } from '../context/ToastContext';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: 'all', category: 'all', search: '' });
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const toast = useToastContext();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await getAllChallenges();
      if (response.success) {
        // Remove duplicates based on challenge ID
        const uniqueChallenges = [];
        const seenIds = new Set();
        (response.challenges || []).forEach(challenge => {
          if (!seenIds.has(challenge.id)) {
            seenIds.add(challenge.id);
            uniqueChallenges.push(challenge);
          }
        });
        setChallenges(uniqueChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load challenges. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challengeId) => {
    try {
      const response = await startChallenge(challengeId);
      if (response.success) {
        setError('');
        const challenge = challenges.find(c => c.id === challengeId);
        toast.success(`🎉 "${challenge?.title || 'Challenge'}" started successfully! Start checking in daily to earn XP.`);
        // Optionally reload challenges
        loadChallenges();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start challenge';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesSearch = 
        challenge.title.toLowerCase().includes(searchLower) ||
        challenge.description?.toLowerCase().includes(searchLower) ||
        challenge.category?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Difficulty filter
    if (filter.difficulty !== 'all' && challenge.difficulty !== filter.difficulty) {
      return false;
    }
    
    // Category filter
    if (filter.category !== 'all' && challenge.category !== filter.category) {
      return false;
    }
    
    return true;
  });

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'xp-high':
        return b.xp_reward - a.xp_reward;
      case 'xp-low':
        return a.xp_reward - b.xp_reward;
      case 'duration-short':
        return a.duration_days - b.duration_days;
      case 'duration-long':
        return b.duration_days - a.duration_days;
      case 'difficulty':
        const diffOrder = { easy: 1, medium: 2, hard: 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const categories = [...new Set(challenges.map((c) => c.category).filter(Boolean))];
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <ScreenContainer className="pb-20 pt-24 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3">
          Available <span className="bg-gradient-sunset bg-clip-text text-transparent">Challenges</span>
        </h1>
        <p className="text-muted-gray text-lg">Choose your next challenge and start building better habits</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-muted-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search challenges..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none text-pure-white placeholder-muted-gray"
            />
            {filter.search && (
              <button
                onClick={() => setFilter({ ...filter, search: '' })}
                className="text-muted-gray hover:text-pure-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </GlassPanel>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-gray">Difficulty:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter({ ...filter, difficulty: 'all' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter.difficulty === 'all'
                    ? 'bg-gradient-sunset text-pure-white'
                    : 'glass-panel text-muted-gray hover:text-gold'
                }`}
              >
                All
              </button>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter({ ...filter, difficulty: d })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filter.difficulty === d
                      ? 'bg-gradient-sunset text-pure-white'
                      : 'glass-panel text-muted-gray hover:text-gold'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-gray">Category:</span>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="glass-panel border-soft-gray rounded-lg px-3 py-2 text-sm text-pure-white focus:outline-none focus:border-gold"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-gray">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-panel border-soft-gray rounded-lg px-3 py-2 text-sm text-pure-white focus:outline-none focus:border-gold"
            >
              <option value="default">Default</option>
              <option value="xp-high">XP: High to Low</option>
              <option value="xp-low">XP: Low to High</option>
              <option value="duration-short">Duration: Shortest</option>
              <option value="duration-long">Duration: Longest</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>

        {error && !loading && (
          <ErrorDisplay
            title="Failed to Load Challenges"
            message={error}
            onRetry={loadChallenges}
          />
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6 text-sm text-muted-gray">
          Showing {sortedChallenges.length} of {challenges.length} challenges
        </div>
      )}

      {/* Challenges Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonChallengeCard key={i} />
          ))}
        </div>
      ) : sortedChallenges.length === 0 ? (
        <GlassPanel className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-heading font-semibold mb-2 text-pure-white">No challenges found</p>
          <p className="text-muted-gray mb-6">Try adjusting your filters or search term</p>
          <Button
            variant="outline"
            onClick={() => setFilter({ difficulty: 'all', category: 'all', search: '' })}
          >
            Clear Filters
          </Button>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      )}
    </ScreenContainer>
  );
};

export default Challenges;

