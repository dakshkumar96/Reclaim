import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Input from '../Components/Input';
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
      navigate('/dashboard');
    } else {
      setError(result.message || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-sunset bg-clip-text text-transparent">
            Sign Up
          </h1>
          <p className="text-muted-gray">Create your account to get started</p>
        </div>

        <div className="glass-panel">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <Input
              label="First Name (Optional)"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <Input
              label="Last Name (Optional)"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-gray text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
