import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import Button from '../Components/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const toast = useToastContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    if (result.success) {
      toast.success('Account created successfully! Welcome to Reclaim! 🎉');
      navigate('/dashboard');
    } else {
      const errorMessage = result.message || 'Signup failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-32 relative overflow-hidden bg-pure-black">
      {/* Website Theme Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-pure-black via-dark-gray to-dark-gray pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl pointer-events-none animate-pulse animation-delay-2000"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.12]"
        >
          <source src="/0_Geometric_Shapes_Circles_3840x2160.mp4" type="video/mp4" />
        </video>
        
        {/* Animated Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-pure-black/95 to-pure-black/90"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/8 rounded-full blur-[100px] animate-pulse animation-delay-2000 pointer-events-none"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Blurred Website Preview Elements - Pinterest style */}
      <div className="absolute inset-0 opacity-50 blur-xl pointer-events-none">
        {/* Simulated Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple/20 via-dark-gray/70 to-purple/20 border-b border-purple/20 flex items-center px-8">
          <div className="text-2xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent">Reclaim</div>
          <div className="ml-auto flex gap-4">
            <div className="w-20 h-8 bg-purple/30 rounded-lg"></div>
            <div className="w-20 h-8 bg-gold/30 rounded-lg"></div>
          </div>
        </div>
        
        {/* Simulated Content Cards */}
        <div className="absolute top-24 left-8 w-64 h-48 bg-gradient-to-br from-purple/20 to-dark-gray/60 rounded-2xl border border-purple/20 shadow-lg"></div>
        <div className="absolute top-32 right-8 w-72 h-56 bg-gradient-to-br from-gold/20 to-dark-gray/60 rounded-2xl border border-gold/20 shadow-lg"></div>
        <div className="absolute bottom-24 left-1/4 w-56 h-40 bg-gradient-to-br from-purple/20 to-dark-gray/60 rounded-2xl border border-purple/20 shadow-lg"></div>
        <div className="absolute bottom-32 right-1/4 w-64 h-48 bg-gradient-to-br from-gold/20 to-dark-gray/60 rounded-2xl border border-gold/20 shadow-lg"></div>
        
        {/* Simulated Stats */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8">
          <div className="w-32 h-24 bg-gradient-sunset/30 rounded-xl border border-gold/20 shadow-lg"></div>
          <div className="w-32 h-24 bg-purple/30 rounded-xl border border-purple/20 shadow-lg"></div>
          <div className="w-32 h-24 bg-gold/30 rounded-xl border border-gold/20 shadow-lg"></div>
        </div>
      </div>
      
      {/* Additional blur overlay */}
      <div className="absolute inset-0 bg-dark-gray/40 backdrop-blur-sm pointer-events-none"></div>

      {/* Main Modal Container - Exact Pinterest layout */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Modal Card */}
        <div className="bg-dark-gray/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-soft-gray/20 overflow-hidden">
          {/* Header Bar - Pinterest style */}
          <div className="px-6 pt-6 pb-4 border-b border-soft-gray/20">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-sunset rounded-full"></div>
              </div>
              <h2 className="text-xl font-heading font-bold text-pure-white flex-1 text-center">
                Welcome to Reclaim
              </h2>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - Side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-pure-white mb-1.5">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-4 py-3 bg-medium-gray/80 border border-soft-gray/30 rounded-lg text-pure-white placeholder-pure-white/50 focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30 transition-all text-base"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-pure-white mb-1.5">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-4 py-3 bg-medium-gray/80 border border-soft-gray/30 rounded-lg text-pure-white placeholder-pure-white/50 focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30 transition-all text-base"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-pure-white mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-medium-gray/80 border border-soft-gray/30 rounded-lg text-pure-white placeholder-pure-white/50 focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30 transition-all text-base"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-pure-white mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-medium-gray/80 border border-soft-gray/30 rounded-lg text-pure-white placeholder-pure-white/50 focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30 transition-all text-base"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-pure-white mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-medium-gray/80 border border-soft-gray/30 rounded-lg text-pure-white placeholder-pure-white/50 focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30 transition-all text-base"
                />
              </div>

              {/* Submit Button - Full width, Pinterest style */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-sunset text-pure-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base mt-2"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-soft-gray/20">
              <p className="text-sm text-pure-white/70 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-purple hover:text-purple-light font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
