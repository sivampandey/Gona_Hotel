import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, UserCheck, ArrowRight, AlertCircle, Loader2, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = emailOrPhone.trim();
    if (!input) {
      setError('Please enter your email address or phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(input, password);
      if (res.success) {
        showToast(res.message || 'Signed in successfully!', 'success');
        navigate(input.toLowerCase().includes('admin') ? '/admin' : '/profile');
      } else {
        setError(res.message || 'Invalid email/phone number or password.');
        showToast(res.message || 'Login failed', 'error');
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
      <div className="w-full max-w-[360px] sm:max-w-md glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-luxury-gold/40 shadow-xl space-y-4 sm:space-y-5">

        <div className="text-center space-y-1 sm:space-y-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center mx-auto shadow-md font-bold">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-luxury-emerald-dark">Royal Sign In</h1>
          <p className="text-[11px] sm:text-xs text-gray-600">Access stay reservations, gourmet orders & farm visits via Email or Phone</p>
        </div>

        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-[11px] sm:text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Email Address or Phone Number</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (error) setError(null);
                }}
                required
                placeholder="Email or 10-digit mobile number"
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-0.5 sm:mb-1 text-[11px] sm:text-xs">Password</label>
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
                placeholder="Enter your Password"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] sm:text-xs text-center text-gray-600 pt-1">
          New to Gona Hotel?{' '}
          <Link to="/register" className="font-bold text-luxury-emerald hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};
