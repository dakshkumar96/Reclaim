import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import { Zap } from 'lucide-react';

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
    <ScreenContainer className="flex items-center justify-center min-h-screen pb-6 pt-24">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/50">
            <Zap className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-pure-white">
            Reclaim
          </h1>
          <p className="text-muted-gray">
            Start your habit-building journey
          </p>
        </div>

        {/* Signup Form */}
        <GlassPanel className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold text-pure-white">
              Create Account
            </h2>
            <p className="text-sm text-muted-gray mt-1">
              Join thousands of habit builders
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm text-muted-gray">First Name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="bg-dark-gray/50 border-soft-gray focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm text-muted-gray">Last Name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="bg-dark-gray/50 border-soft-gray focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-muted-gray">Username *</label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                autoFocus
                className="bg-dark-gray/50 border-soft-gray focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-muted-gray">Email *</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bg-dark-gray/50 border-soft-gray focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-muted-gray">Password *</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="bg-dark-gray/50 border-soft-gray focus:border-gold"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full tap-scale glow-effect"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-gray">Already have an account? </span>
            <Link to="/login" className="text-gold hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </GlassPanel>
      </div>
    </ScreenContainer>
  );
};

export default Signup;
