import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import { Zap } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const toast = useToastContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      const errorMessage = result.message || 'Login failed';
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
            Continue your habit-building journey
          </p>
        </div>

        {/* Login Form */}
        <GlassPanel className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold text-pure-white">
              Sign In
            </h2>
            <p className="text-sm text-muted-gray mt-1">
              Welcome back! Sign in to continue
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-muted-gray">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
                className="bg-dark-gray/50 border-soft-gray focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-muted-gray">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-dark-gray/50 border-soft-gray focus:border-gold"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full tap-scale glow-effect"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-gray">Don't have an account? </span>
            <Link to="/signup" className="text-gold hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </GlassPanel>
      </div>
    </ScreenContainer>
  );
};

export default Login;
