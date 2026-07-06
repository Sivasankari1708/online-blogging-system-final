import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
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
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 animate-fade-in -mt-4 relative">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-block">
            <span className="text-4xl logo-font block">
              Blog.it
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-text-muted font-normal">Fill in your details to get started</p>
        </div>


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
                className="input-field input-icon-left h-12"
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
                className="input-field input-icon-left h-12"
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
                className="input-field input-icon-left h-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Password Strength Indicator */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              ></div>
            </div>
            <div className="text-xs text-right text-text-muted mt-1 h-4">
              {strength.label}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs text-left animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full h-12 text-base font-semibold shadow-lg shadow-white/5 hover:shadow-white/10 flex items-center justify-center gap-2 group mt-2"
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
          <Link to="/login" className="font-semibold text-white hover:underline transition-all">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
