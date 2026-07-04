import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Compass } from 'lucide-react';
import api from '../services/api';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple password strength calculator
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: '0%', color: 'bg-transparent', label: '' };
    if (password.length < 6) return { width: '33%', color: 'bg-red-500', label: 'Weak' };
    if (password.length < 10) return { width: '66%', color: 'bg-yellow-500', label: 'Fair' };
    return { width: '100%', color: 'bg-green-500', label: 'Strong' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-row-reverse animate-fade-in -mt-4">
      {/* Right side: Illustration / Gradient */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-bl from-accent/20 via-background to-primary/20 border-l border-border p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="bg-surface/50 backdrop-blur-md p-6 rounded-2xl border border-border inline-block mb-8 shadow-2xl">
            <Compass className="h-16 w-16 text-accent" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Join the community.</h1>
          <p className="text-text-muted text-lg max-w-md mx-auto">
            Create an account to start sharing your stories and discovering incredible content from around the globe.
          </p>
        </div>
      </div>

      {/* Left side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-text-muted">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted block">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  required
                  className="input-field pl-10 h-12"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  required
                  className="input-field pl-10 h-12"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted block">Password</label>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="password"
                  required
                  className="input-field pl-10 h-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-300 ${strength.color}`} 
                  style={{ width: strength.width }}
                ></div>
              </div>
              <div className="text-xs text-right text-text-muted mt-1 h-4">
                {strength.label}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
