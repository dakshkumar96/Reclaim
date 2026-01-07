import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-purple/20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/98 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple/4 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-purple/3 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/dashboard" className="inline-block mb-4 group">
              <h2 className="text-2xl font-body font-bold text-purple group-hover:text-purple/80 transition-colors">
                Reclaim
              </h2>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-md leading-relaxed">
              Transform your habits into achievements. Build consistency. Level up your life with gamified habit tracking.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/dakshkumar96" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-10 h-10 bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-lg flex items-center justify-center hover:border-purple/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
                aria-label="GitHub"
              >
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
                <svg className="w-5 h-5 text-text-secondary group-hover:text-purple transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/dakshkumar96" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-10 h-10 bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-lg flex items-center justify-center hover:border-purple/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
                aria-label="LinkedIn"
              >
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
                <svg className="w-5 h-5 text-text-secondary group-hover:text-purple transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-body font-bold mb-4 text-pure-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-body font-bold mb-4 text-pure-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple" />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:dakshkumar2k2@gmail.com" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://github.com/dakshkumar96/Reclaim" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-purple transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></span>
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-text-secondary text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple/30 rounded-full"></span>
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-text-secondary text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple/30 rounded-full"></span>
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Reclaim. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm mt-2 sm:mt-0 flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-purple animate-pulse" /> by <a href="https://github.com/dakshkumar96" target="_blank" rel="noopener noreferrer" className="hover:text-purple transition-colors">Daksh Kumar</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

