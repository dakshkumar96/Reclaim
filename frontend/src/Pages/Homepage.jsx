import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../Components/Button';
import GlassPanel from '../Components/GlassPanel';
import { 
  Zap, 
  Target, 
  Trophy, 
  TrendingUp, 
  Users, 
  Award, 
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const Homepage = () => {
  const { isAuthenticated } = useUser();

  // Homepage is accessible to everyone - no redirect needed

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pure-black via-dark-gray to-pure-black">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-sunset rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-retro-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-emerald rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-panel border-gold/50 hover:border-gold transition-colors">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-mono font-semibold">Level Up Your Life</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-6 leading-tight px-4">
              <span className="bg-gradient-sunset bg-clip-text text-transparent">
                Build Better Habits
              </span>
              <br />
              <span className="text-pure-white">
                Through <span className="neon-text">Gamification</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-gray mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Transform your daily routines into achievements. Earn XP, level up, and compete on leaderboards while building lasting positive habits.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-4 shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto glow-effect group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-4 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <GlassPanel className="p-4 text-center hover:border-gold transition-all duration-300 hover:scale-105 group">
                <Users className="w-6 h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-mono font-bold text-pure-white mb-1">10K+</div>
                <div className="text-xs text-muted-gray uppercase tracking-wide">Active Users</div>
              </GlassPanel>
              <GlassPanel className="p-4 text-center hover:border-gold transition-all duration-300 hover:scale-105 group">
                <Target className="w-6 h-6 text-neon-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-mono font-bold text-pure-white mb-1">50+</div>
                <div className="text-xs text-muted-gray uppercase tracking-wide">Challenges</div>
              </GlassPanel>
              <GlassPanel className="p-4 text-center hover:border-gold transition-all duration-300 hover:scale-105 group">
                <CheckCircle2 className="w-6 h-6 text-neon-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-mono font-bold text-pure-white mb-1">1M+</div>
                <div className="text-xs text-muted-gray uppercase tracking-wide">Check-ins</div>
              </GlassPanel>
              <GlassPanel className="p-4 text-center hover:border-gold transition-all duration-300 hover:scale-105 group">
                <TrendingUp className="w-6 h-6 text-neon-magenta mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl sm:text-3xl font-mono font-bold text-pure-white mb-1">95%</div>
                <div className="text-xs text-muted-gray uppercase tracking-wide">Success Rate</div>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-panel border-gold/30">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-gray font-mono">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-sunset bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-gray max-w-2xl mx-auto">
              Powerful features designed to keep you motivated and on track
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Gamification */}
            <GlassPanel className="p-6 sm:p-8 hover:border-gold transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-sunset opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-gradient-sunset/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-pure-white">Gamification</h3>
                <p className="text-muted-gray text-sm leading-relaxed">
                  Earn XP, level up, and unlock achievements as you complete challenges. Make habit-building fun and rewarding.
                </p>
              </div>
            </GlassPanel>

            {/* Feature 2 - Daily Challenges */}
            <GlassPanel className="p-6 sm:p-8 hover:border-gold transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-retro-purple opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-gradient-retro-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-pure-white">Daily Challenges</h3>
                <p className="text-muted-gray text-sm leading-relaxed">
                  Choose from dozens of pre-built challenges or create your own. Track progress with visual indicators and streaks.
                </p>
              </div>
            </GlassPanel>

            {/* Feature 3 - Leaderboards */}
            <GlassPanel className="p-6 sm:p-8 hover:border-gold transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-emerald opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-gradient-emerald/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-pure-white">Leaderboards</h3>
                <p className="text-muted-gray text-sm leading-relaxed">
                  Compete with others and see how you rank. Climb the leaderboard by earning XP and completing challenges.
                </p>
              </div>
            </GlassPanel>

            {/* Feature 4 - AI Coach */}
            <GlassPanel className="p-6 sm:p-8 hover:border-gold transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-sunset opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-gradient-sunset/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-neon-magenta" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-pure-white">AI Coach</h3>
                <p className="text-muted-gray text-sm leading-relaxed">
                  Get personalized guidance and motivation from our AI coach. Receive tips tailored to your progress and goals.
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-gray/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-panel border-gold/30">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-gray font-mono">Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4">
              How It <span className="bg-gradient-sunset bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-gray max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <GlassPanel className="p-8 text-center hover:border-gold transition-all duration-300 hover:scale-105 group animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-sunset flex items-center justify-center text-3xl font-mono font-bold text-pure-white group-hover:scale-110 transition-transform shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3 text-pure-white">Sign Up</h3>
              <p className="text-muted-gray leading-relaxed">
                Create your free account in seconds. No credit card required.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 text-center hover:border-gold transition-all duration-300 hover:scale-105 group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-retro-purple flex items-center justify-center text-3xl font-mono font-bold text-pure-white group-hover:scale-110 transition-transform shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3 text-pure-white">Start Challenges</h3>
              <p className="text-muted-gray leading-relaxed">
                Browse and select challenges that match your goals. Start multiple at once.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 text-center hover:border-gold transition-all duration-300 hover:scale-105 group animate-slide-up md:col-span-1 sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-emerald flex items-center justify-center text-3xl font-mono font-bold text-pure-white group-hover:scale-110 transition-transform shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3 text-pure-white">Level Up</h3>
              <p className="text-muted-gray leading-relaxed">
                Check in daily, earn XP, and watch yourself climb the leaderboard.
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-sunset rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-retro-purple rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-slide-up">
          <GlassPanel className="p-8 sm:p-12 border-2 border-gold/50 hover:border-gold transition-all duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-panel border-gold/30 w-auto mx-auto">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-gray font-mono">Join Today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
              Ready to <span className="bg-gradient-sunset bg-clip-text text-transparent">Transform</span> Your Life?
            </h2>
            <p className="text-lg sm:text-xl text-muted-gray mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are building better habits every day. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 sm:px-10 py-4 shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto glow-effect group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/challenges" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 sm:px-10 py-4 w-full sm:w-auto"
                >
                  Browse Challenges
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

