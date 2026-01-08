import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  Target, 
  Trophy, 
  Flame,
  ArrowUpRight,
  Zap,
  BarChart3,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  Users,
  Clock,
  Shield,
  Brain
} from 'lucide-react';

const Homepage = () => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  // Handle hash navigation - scroll to section when hash is present in URL
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-pure-black via-dark-gray to-dark-gray pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl pointer-events-none animate-pulse animation-delay-2000"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Top Section - Hero */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden min-h-[90vh] flex items-center">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-[0.15]"
          >
            <source src="/0_Geometric_Shapes_Circles_3840x2160.mp4" type="video/mp4" />
          </video>
          
          {/* Animated Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-pure-black/95 to-pure-black/90"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[150px] pointer-events-none"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.08)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center">
            {/* Pill Badge - Smaller and closer */}
            <div className="inline-flex items-center px-3 py-1.5 mb-3 bg-gradient-to-r from-purple/30 via-purple/20 to-purple/30 backdrop-blur-xl border border-purple/50 rounded-full shadow-lg glow-gold-soft animate-fade-in hover:scale-105 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Sparkles className="w-3 h-3 text-gold mr-1.5 animate-pulse-glow group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="text-[10px] sm:text-xs text-gold font-body font-semibold tracking-wider uppercase relative z-10">All-in-One Habit Toolkit</span>
            </div>

            {/* Main Headline - Enhanced Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold mb-4 sm:mb-6 leading-[1.1] text-pure-white tracking-tight px-4 animate-slide-up">
              <span className="block mb-2">Take control of your</span>
              <span className="block">
                <span className="text-pure-white">habits with </span>
                <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent relative inline-block">
                  clarity
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-purple via-pink to-gold rounded-full opacity-60 blur-sm"></span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple via-pink to-gold rounded-full"></span>
                </span>
              </span>
            </h1>

            {/* Subheadline - Enhanced */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 font-body font-light tracking-wide animate-slide-up animation-delay-200">
              All your progress insights, finally in one place.{' '}
              <span className="text-pure-white/90 font-medium">Track challenges, earn XP,</span> and reach your goals with ease.
            </p>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4 animate-slide-up animation-delay-300">
              <Link to="/signup" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold bg-gradient-to-r from-purple via-pink to-purple text-pure-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/50 glow-soft hover:glow-effect group-hover:border-gold/50 border-2 border-transparent relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2.5">
                    Get Started for Free
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold text-pure-white hover:text-gold border-2 border-purple/50 hover:border-gold/70 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all duration-300 hover:bg-purple/20 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-xl bg-dark-gray/30">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-gray animate-fade-in animation-delay-400">
              <div className="flex items-center gap-2 group/trust hover:text-emerald-300 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover/trust:scale-110 transition-transform" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2 group/trust hover:text-blue-300 transition-colors">
                <Shield className="w-5 h-5 text-blue-400 group-hover/trust:scale-110 transition-transform" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 group/trust hover:text-gold transition-colors">
                <Zap className="w-5 h-5 text-gold group-hover/trust:scale-110 transition-transform" />
                <span>Instant Start</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/8 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/6 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Your <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              See your progress at a glance with our intuitive dashboard
            </p>
          </div>
          
          {/* Dashboard Preview Card */}
          <div className="relative bg-gradient-to-br from-medium-gray/80 via-dark-gray/60 to-medium-gray/80 backdrop-blur-2xl border-2 border-purple/30 rounded-3xl overflow-hidden shadow-2xl hover:border-purple/50 hover:shadow-purple/30 hover:scale-[1.01] transition-all duration-500 group smooth-hover">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple/20 to-transparent rounded-br-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple/15 to-transparent rounded-tl-3xl"></div>
            
            {/* Mock Dashboard Header */}
            <div className="relative bg-dark-gray/60 border-b border-soft-gray/20 px-6 py-4 flex items-center justify-between">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-sunset flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-pure-white font-heading font-semibold text-lg">Dashboard</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-dark-gray/80 border border-soft-gray/20 group-hover:border-purple/40 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-dark-gray/80 border border-soft-gray/20 group-hover:border-purple/40 transition-colors"></div>
                <div className="w-9 h-9 rounded-full bg-gradient-sunset shadow-lg group-hover:scale-110 transition-transform"></div>
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-8 bg-dark-gray/10">
              <div className="grid md:grid-cols-3 gap-5 mb-6">
                {/* Stats Cards */}
                <div className="relative bg-gradient-to-br from-purple/10 to-purple/5 backdrop-blur-md border-2 border-purple/30 rounded-xl p-5 text-center hover:border-gold/50 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-gold/20 overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold/40 rounded-full"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-7 h-7 text-gold glow-effect-gold" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-pure-white mb-1.5 neon-text-gold">12</div>
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Level</div>
                </div>
                <div className="relative bg-gradient-to-br from-emerald/10 to-emerald/5 backdrop-blur-md border-2 border-emerald/30 rounded-xl p-5 text-center hover:border-emerald/50 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-emerald/20 overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald/40 rounded-full"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-xp/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Flame className="w-7 h-7 text-emerald glow-effect" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-pure-white mb-1.5 neon-text">45</div>
                  <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Day Streak</div>
                </div>
                <div className="relative bg-gradient-to-br from-blue/10 to-blue/5 backdrop-blur-md border-2 border-blue/30 rounded-xl p-5 hover:border-blue/50 hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue/40 rounded-full"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary font-semibold">XP Progress</span>
                    <span className="text-sm text-gold font-mono font-bold neon-text-gold">1,250 / 1,300</span>
                  </div>
                  <div className="w-full h-3 bg-dark-gray/50 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-xp rounded-full transition-all duration-500 glow-effect" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>

              {/* Active Challenge Card */}
              <div className="relative bg-gradient-to-br from-purple/10 via-dark-gray/50 to-purple/5 backdrop-blur-md border-2 border-purple/30 rounded-xl p-6 hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
                <div className="absolute top-3 right-3 w-2 h-2 bg-purple/30 rounded-full"></div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-pure-white text-lg flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5 text-blue" />
                    </div>
                    Daily Exercise Challenge
                  </h3>
                  <span className="text-xs font-semibold text-emerald bg-emerald/20 border border-emerald/30 px-3 py-1 rounded-full flex items-center gap-1.5 group-hover:bg-emerald/30 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Checked In
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary mb-4 flex-wrap">
                  <span className="font-semibold text-pure-white">15 / 30 days</span>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-gold font-bold neon-text-gold">150 XP</span>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-emerald font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    7 day streak
                  </span>
                </div>
                <div className="w-full h-3 bg-dark-gray/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-xp rounded-full transition-all duration-500 glow-effect" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-purple/8 rounded-full blur-[110px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-purple/30 transition-shadow">
                  1
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Sign Up</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm">
                  Create your free account in seconds. Get started instantly.
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-blue/30 transition-shadow">
                  2
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Start Challenges</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm">
                  Browse and select challenges that match your goals. Start multiple at once.
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center text-3xl font-mono font-bold text-pure-white shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                  3
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Level Up</h3>
                <p className="text-text-secondary leading-relaxed font-body text-sm">
                  Check in daily, earn XP, and watch yourself climb the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald/8 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple/6 rounded-full blur-[110px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/4 rounded-full blur-[130px] pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              Everything you need to build lasting habits and achieve your goals
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 - Gamification */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-gold/25 rounded-2xl p-8 group hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-gold/40 rounded-full group-hover:bg-gold/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gold/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-gold/30 transition-shadow">
                  <Trophy className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Gamification</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Earn XP, level up, and unlock achievements as you complete challenges. Make habit-building fun and rewarding.
                </p>
              </div>
            </div>

            {/* Feature 2 - Daily Challenges */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue/30 transition-shadow">
                  <Target className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Daily Challenges</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Choose from dozens of pre-built challenges or create your own. Track progress with visual indicators and streaks.
                </p>
              </div>
            </div>

            {/* Feature 3 - Leaderboards */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                  <BarChart3 className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Leaderboards</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Compete with others and see how you rank. Climb the leaderboard by earning XP and completing challenges.
                </p>
              </div>
            </div>

            {/* Feature 4 - AI Coach */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple/30 transition-shadow">
                  <Brain className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">AI Coach</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Get personalized guidance and motivation from our AI coach. Receive tips tailored to your progress and goals.
                </p>
              </div>
            </div>

            {/* Feature 5 - Streak Tracking */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-orange/25 rounded-2xl p-8 group hover:border-orange/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange/40 rounded-full group-hover:bg-orange/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-orange/30 transition-shadow">
                  <Flame className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Streak Tracking</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Build consistency with streak tracking. See your progress and maintain momentum with daily check-ins.
                </p>
              </div>
            </div>

            {/* Feature 6 - Badges & Achievements */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-pink/25 rounded-2xl p-8 group hover:border-pink/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-pink/40 rounded-full group-hover:bg-pink/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-pink/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink/20 to-transparent"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-pink/30 transition-shadow">
                  <Award className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Badges & Achievements</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-body">
                  Unlock badges and achievements as you reach milestones. Showcase your accomplishments and stay motivated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-gold/8 rounded-full blur-[110px] animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-pink/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 text-pure-white tracking-tighter">
              Why Choose Reclaim?
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-body font-normal leading-relaxed">
              The modern way to build better habits and achieve your goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Benefit 1 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-gold/25 rounded-2xl p-8 group hover:border-gold/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-gold/40 rounded-full group-hover:bg-gold/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gold/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg group-hover:shadow-gold/30 transition-shadow">
                    <Zap className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Gamified Motivation</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Turn habit-building into a game. Earn XP, level up, and unlock achievements that keep you motivated and engaged every day.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-8 group hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center shadow-lg group-hover:shadow-blue/30 transition-shadow">
                    <Users className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Community & Competition</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Compete with friends and see how you stack up on the leaderboard. Community support makes staying consistent easier.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-8 group hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center shadow-lg group-hover:shadow-emerald/30 transition-shadow">
                    <TrendingUp className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Track Your Progress</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Visualize your journey with detailed progress tracking. See your streaks, XP growth, and challenge completion rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 group hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:shadow-purple/30 transition-shadow">
                    <Sparkles className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">AI-Powered Guidance</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Get personalized advice from our AI coach. Receive tips, motivation, and strategies tailored to your unique journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-orange/25 rounded-2xl p-8 group hover:border-orange/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange/40 rounded-full group-hover:bg-orange/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-lg group-hover:shadow-orange/30 transition-shadow">
                    <Clock className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Quick Daily Check-ins</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Spend just seconds a day checking in. No complex tracking or lengthy forms. Just simple, fast progress updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-teal/25 rounded-2xl p-8 group hover:border-teal/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal/8 rounded-full blur-3xl"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-teal/40 rounded-full group-hover:bg-teal/60 transition-colors"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-teal/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal/20 to-transparent"></div>
              <div className="relative flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-400 flex items-center justify-center shadow-lg group-hover:shadow-teal/30 transition-shadow">
                    <Shield className="w-8 h-8 text-pure-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-body font-bold mb-3 text-pure-white">Free Forever</h3>
                  <p className="text-text-secondary leading-relaxed font-body text-sm">
                    Start building better habits today. Completely free. No hidden fees, no limits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 pb-40">
        {/* Enhanced Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-purple/10 via-pink/8 to-gold/6 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/10 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Decorative badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-purple/20 via-purple/15 to-purple/20 backdrop-blur-xl border border-purple/40 rounded-full shadow-lg hover:scale-105 transition-transform group">
            <Sparkles className="w-4 h-4 text-gold mr-2 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs text-gold font-body font-semibold tracking-wider uppercase">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-8 text-pure-white tracking-tighter">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-body font-normal leading-relaxed">
            Join thousands of users building better habits every day. Start your journey today. It's free and takes less than a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="w-full sm:w-auto group">
              <button className="relative w-full sm:w-auto text-base sm:text-lg font-body font-semibold bg-gradient-primary text-pure-white px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-purple/30 glow-soft hover:glow-effect group-hover:border-gold/50 border-2 border-transparent overflow-hidden">
                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started for Free
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-purple to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link to="/challenges" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto text-base sm:text-lg font-body font-semibold text-pure-white hover:text-gold border-2 border-purple/50 hover:border-gold/70 px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-purple/10 hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-xl">
                Browse Challenges
              </button>
            </Link>
          </div>
          
          {/* Final trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-gray">
            <div className="flex items-center gap-2 group/trust hover:text-emerald-300 transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover/trust:scale-110 transition-transform" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 group/trust hover:text-gold transition-colors cursor-default">
              <Zap className="w-4 h-4 text-gold group-hover/trust:scale-110 transition-transform" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2 group/trust hover:text-blue-300 transition-colors cursor-default">
              <Shield className="w-4 h-4 text-blue-400 group-hover/trust:scale-110 transition-transform" />
              <span>100% secure</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

