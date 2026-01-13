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

  // Only show categories that have at least 3 challenges (meaningful categories only)
  const categoryCounts = {};
  challenges.forEach(challenge => {
    const category = challenge.category;
    if (category && category.trim() !== '' && category.toLowerCase() !== 'other') {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });
  const categories = Object.keys(categoryCounts)
    .filter(cat => categoryCounts[cat] >= 3) // Only show categories with 3+ challenges
    .sort();
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <ScreenContainer className="pb-20 pt-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 text-pure-white" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}>
          <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>
            Challenges
          </span>
        </h1>
        <p className="text-text-tertiary text-sm">Choose your next challenge and start building better habits</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        {/* Search Bar */}
        <GlassPanel className="p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search challenges..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none text-pure-white placeholder-text-tertiary text-sm"
            />
            {filter.search && (
              <button
                onClick={() => setFilter({ ...filter, search: '' })}
                className="text-text-tertiary hover:text-pure-white transition-colors text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </GlassPanel>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary font-medium">Difficulty:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilter({ ...filter, difficulty: 'all' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter.difficulty === 'all'
                    ? 'bg-gradient-primary text-pure-white'
                    : 'glass-panel text-text-tertiary hover:text-pure-white'
                }`}
              >
                All
              </button>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter({ ...filter, difficulty: d })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter.difficulty === d
                      ? 'bg-gradient-primary text-pure-white'
                      : 'glass-panel text-text-tertiary hover:text-pure-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter - Only show if there are meaningful categories */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary font-medium">Category:</span>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="glass-panel border-soft-gray rounded-lg px-2.5 py-1.5 text-xs text-pure-white focus:outline-none focus:border-purple transition-all"
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-text-tertiary font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-panel border-soft-gray rounded-lg px-2.5 py-1.5 text-xs text-pure-white focus:outline-none focus:border-purple transition-all"
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
        <div className="mb-4 text-xs text-text-tertiary">
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
          <div className="text-6xl mb-4">🎯</div>
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

