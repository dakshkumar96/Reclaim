import React from 'react';
import { Link } from 'react-router-dom';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import Button from '../Components/Button';
import { 
  Target, 
  Trophy, 
  Zap, 
  Users, 
  Sparkles,
  ArrowRight,
  Heart,
  Brain,
  TrendingUp
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <ScreenContainer className="pb-20 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-pure-white">
              About <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">Reclaim</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-body leading-relaxed">
              Your personal habit-building companion designed to help you reclaim control of your life, one challenge at a time.
            </p>
          </div>

        {/* Mission Section */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-pure-white" />
            </div>
            <div>
              <h2 className="font-body text-2xl font-bold mb-3 text-pure-white">
                Our Mission
              </h2>
              <p className="text-text-secondary leading-relaxed font-body">
                Reclaim was born from the belief that building good habits shouldn't feel like a chore. 
                We've created a platform that combines gamification, community support, and AI-powered coaching 
                to make your journey toward self-improvement engaging, rewarding, and sustainable.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-pure-white" />
              </div>
              <div>
                <h3 className="font-body text-xl font-bold mb-2 text-pure-white">
                  Gamification
                </h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Earn XP, level up, and unlock badges as you complete challenges. Turn habit-building into an exciting game.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-blue/25 rounded-2xl p-6 hover:border-blue/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue/40 rounded-full group-hover:bg-blue/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-pure-white" />
              </div>
              <div>
                <h3 className="font-body text-xl font-bold mb-2 text-pure-white">
                  Community
                </h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Compete on the leaderboard, see how others are progressing, and stay motivated through friendly competition.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 hover:border-purple/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 text-pure-white" />
              </div>
              <div>
                <h3 className="font-body text-xl font-bold mb-2 text-pure-white">
                  AI Coach
                </h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Get personalized guidance from our AI coach, tailored to your progress, challenges, and goals.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-emerald/25 rounded-2xl p-6 hover:border-emerald/50 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald/8 rounded-full blur-2xl"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald/40 rounded-full group-hover:bg-emerald/60 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-pure-white" />
              </div>
              <div>
                <h3 className="font-body text-xl font-bold mb-2 text-pure-white">
                  Progress Tracking
                </h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Visualize your progress with streaks, daily check-ins, and detailed statistics. See how far you've come.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <h2 className="font-body text-2xl font-bold mb-6 text-pure-white flex items-center gap-2 relative">
            <Sparkles className="w-6 h-6 text-purple" />
            How It Works
          </h2>
          <div className="space-y-4 relative">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center text-pure-white font-bold flex-shrink-0 shadow-lg">
                1
              </div>
              <div>
                <h3 className="font-body font-bold text-pure-white mb-1">Choose Your Challenge</h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Browse our curated list of habit challenges across health, productivity, mindfulness, and more.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center text-pure-white font-bold flex-shrink-0 shadow-lg">
                2
              </div>
              <div>
                <h3 className="font-body font-bold text-pure-white mb-1">Check In Daily</h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Build consistency by checking in every day. Track your streaks and watch your progress grow.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-emerald/70 flex items-center justify-center text-pure-white font-bold flex-shrink-0 shadow-lg">
                3
              </div>
              <div>
                <h3 className="font-body font-bold text-pure-white mb-1">Earn Rewards</h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">
                  Complete challenges to earn XP, unlock badges, and climb the leaderboard. Celebrate your achievements!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-gray">
            Ready to start your journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/challenges">
              <Button variant="outline">
                Browse Challenges
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-8 border-t border-purple/20">
          <p className="text-text-secondary text-sm flex items-center justify-center gap-2 font-body">
            Made with <Heart className="w-4 h-4 text-purple animate-pulse" /> for people who want to reclaim their lives
          </p>
        </div>
      </div>
      </ScreenContainer>
    </div>
  );
};

export default About;

