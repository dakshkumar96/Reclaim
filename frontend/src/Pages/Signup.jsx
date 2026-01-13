import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ScreenContainer from '../Components/ScreenContainer';

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
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <ScreenContainer className="flex items-center justify-center min-h-screen pb-8 pt-24 relative z-10">
        <div className="w-full max-w-[440px] space-y-6 animate-slide-up">

          {/* Signup Form */}
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-8 shadow-xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
            
            <div className="relative space-y-5">
              {/* Form Header */}
              <div className="text-center">
                <h2 className="font-heading text-2xl font-bold text-pure-white mb-1">
                  Create Account
                </h2>
                <p className="text-sm text-text-secondary font-body">
                  Join thousands of habit builders
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-body">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-pure-white font-body">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="bg-dark-gray/60 border-purple/25 focus:border-purple/60 focus:ring-2 focus:ring-purple/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-pure-white font-body">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="bg-dark-gray/60 border-purple/25 focus:border-purple/60 focus:ring-2 focus:ring-purple/20"
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-pure-white font-body">
                    Username <span className="text-purple">*</span>
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    autoFocus
                    className="bg-dark-gray/60 border-purple/25 focus:border-purple/60 focus:ring-2 focus:ring-purple/20"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-pure-white font-body">
                    Email <span className="text-purple">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="bg-dark-gray/60 border-purple/25 focus:border-purple/60 focus:ring-2 focus:ring-purple/20"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-pure-white font-body">
                    Password <span className="text-purple">*</span>
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="bg-dark-gray/60 border-purple/25 focus:border-purple/60 focus:ring-2 focus:ring-purple/20"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full mt-4"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center pt-3 border-t border-purple/20">
                <p className="text-sm text-text-secondary font-body">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple hover:text-pink transition-colors font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
};

export default Signup;
