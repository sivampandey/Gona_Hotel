import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Phone, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { SEO } from '../components/SEO';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please enter an email address or phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name.trim(), email.trim(), password, phone.trim());
      if (res.success) {
        showToast(res.message || 'Registration successful! Welcome to Gona Hotel.', 'success');
        navigate('/profile');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-luxury-cream text-luxury-obsidian flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
      <SEO noindex title="Create Account | Gona Hotel" />
      <div className="w-full max-w-[360px] sm:max-w-md glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-luxury-gold/40 shadow-xl space-y-4 sm:space-y-5">

        <div className="text-center space-y-1 sm:space-y-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center mx-auto shadow-md font-bold">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-luxury-emerald-dark">Create Account</h1>
          <p className="text-[11px] sm:text-xs text-gray-600">Register with your Email or Mobile Number</p>
        </div>

        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-[11px] sm:text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                required
                placeholder="Enter your name"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Mobile Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Email Address (Optional if phone provided)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Password * (min. 6 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                minLength={6}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-luxury-emerald-dark font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer mt-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Register & Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] sm:text-xs text-center text-gray-600 pt-1">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-luxury-emerald hover:underline">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};
