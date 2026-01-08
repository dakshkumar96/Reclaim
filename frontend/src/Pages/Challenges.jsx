import React, { useEffect, useState } from 'react';
import { getAllChallenges, startChallenge } from '../api/challenges';
import ScreenContainer from '../Components/ScreenContainer';
import ChallengeCard from '../Components/ChallengeCard';
import Button from '../Components/Button';
import GlassPanel from '../Components/GlassPanel';
import ErrorDisplay from '../Components/ErrorDisplay';
import { SkeletonChallengeCard } from '../Components/LoadingSkeleton';
import { useToastContext } from '../context/ToastContext';
import { Grid3x3, List, Target, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: 'all', category: 'all', search: '' });
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const toast = useToastContext();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await getAllChallenges();
      if (response.success) {
        // Remove duplicates based on challenge ID and title
        const uniqueChallenges = [];
        const seenIds = new Set();
        const seenTitles = new Set();
        
        (response.challenges || []).forEach(challenge => {
          const id = challenge.id;
          const title = challenge.title?.toLowerCase().trim();
          
          // Check both ID and title to catch duplicates
          if (!seenIds.has(id) && (!title || !seenTitles.has(title))) {
            seenIds.add(id);
            if (title) seenTitles.add(title);
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pure-white mb-3">
              Discover <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">Challenges</span>
            </h1>
            <p className="text-text-secondary text-base font-body max-w-2xl">
              Choose your next challenge and start building habits that transform your life
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-4 shadow-lg hover:border-purple/40 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="flex-1 bg-transparent border-none outline-none text-pure-white placeholder-text-tertiary font-body"
                />
                {filter.search && (
                  <button
                    onClick={() => setFilter({ ...filter, search: '' })}
                    className="text-text-tertiary hover:text-purple transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary font-body font-medium">Difficulty</span>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                  className="bg-dark-gray/50 border border-purple/25 rounded-lg px-3 py-2 text-sm text-pure-white focus:outline-none focus:border-purple/50 font-body hover:border-purple/40 transition-colors"
            >
              <option value="all">All</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-tertiary font-body font-medium">Category</span>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    className="bg-dark-gray/50 border border-purple/25 rounded-lg px-3 py-2 text-sm text-pure-white focus:outline-none focus:border-purple/50 font-body hover:border-purple/40 transition-colors"
            >
              <option value="all">All</option>
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
                <span className="text-xs text-text-tertiary font-body font-medium">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-dark-gray/50 border border-purple/25 rounded-lg px-3 py-2 text-sm text-pure-white focus:outline-none focus:border-purple/50 font-body hover:border-purple/40 transition-colors"
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

          {/* Results Count and View Toggle */}
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-text-secondary font-body">
                <span className="text-pure-white font-semibold">{sortedChallenges.length}</span> of <span className="text-pure-white font-semibold">{challenges.length}</span> challenges
              </div>
              <div className="flex items-center gap-2 bg-dark-gray/50 border border-purple/25 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-purple/20 text-purple'
                      : 'text-text-tertiary hover:text-purple'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-purple/20 text-purple'
                      : 'text-text-tertiary hover:text-purple'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Challenges Display */}
      {loading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonChallengeCard key={i} />
                ))}
        </div>
      ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-5 shadow-lg animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-dark-gray/50 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-dark-gray/50 rounded w-3/4"></div>
                        <div className="h-4 bg-dark-gray/50 rounded w-full"></div>
                        <div className="h-3 bg-dark-gray/50 rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-8 bg-dark-gray/50 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : sortedChallenges.length === 0 ? (
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-12 text-center shadow-lg">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl font-body font-semibold mb-2 text-pure-white">No challenges found</p>
              <p className="text-text-secondary mb-6 font-body">Try adjusting your filters or search term</p>
              <Button
                variant="outline"
                onClick={() => setFilter({ difficulty: 'all', category: 'all', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
          ) : (
            <div className="space-y-3">
              {sortedChallenges.map((challenge) => {
                const difficultyConfig = {
                  easy: { color: 'text-emerald', bgColor: 'bg-emerald/10', borderColor: 'border-emerald/30' },
                  medium: { color: 'text-gold', bgColor: 'bg-gold/10', borderColor: 'border-gold/30' },
                  hard: { color: 'text-pink', bgColor: 'bg-pink/10', borderColor: 'border-pink/30' }
                };
                const config = difficultyConfig[challenge.difficulty] || difficultyConfig.medium;
                
                return (
                  <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="block">
                    <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-xl p-5 hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-lg group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-2xl"></div>
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Target className={`w-6 h-6 ${config.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h3 className="text-lg font-body font-bold text-pure-white truncate">
                              {challenge.title}
                            </h3>
                            <div className={`flex items-center gap-1 px-2.5 py-0.5 ${config.bgColor} border ${config.borderColor} rounded-lg flex-shrink-0`}>
                              <span className={`text-xs font-body font-semibold ${config.color}`}>
                                {challenge.difficulty?.charAt(0).toUpperCase() + challenge.difficulty?.slice(1) || 'Medium'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-1 mb-2 font-body">
                            {challenge.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-purple" />
                              <span className="font-body text-purple font-semibold">{challenge.xp_reward} XP</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue" />
                              <span className="font-body text-text-tertiary">{challenge.duration_days} days</span>
                            </div>
                            {challenge.category && (
                              <span className="text-xs px-2 py-0.5 bg-purple/10 border border-purple/25 text-purple rounded font-body">
                                {challenge.category}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="px-4 py-2 bg-gradient-primary text-pure-white rounded-lg font-body text-sm font-semibold group-hover:opacity-90 transition-opacity">
                            View
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
    </ScreenContainer>
    </div>
  );
};

export default Challenges;

