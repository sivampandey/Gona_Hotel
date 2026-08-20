import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { SEO } from '../components/SEO';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { showToast } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.forgotPassword(cleanEmail);
      if (res.status === 200 && res.data?.success) {
        setSubmitted(true);
        setSuccessMessage(res.data.message || 'If an account exists with this email, a password reset link has been sent.');
        showToast('Reset link request processed', 'success');
      } else {
        setError(res.data?.message || 'Failed to request password reset. Please try again.');
      }
    } catch (err: any) {
      setError('Unable to connect to password reset server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-luxury-cream text-luxury-obsidian flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
      <SEO noindex title="Forgot Password | Gona Hotel" />
      <div className="w-full max-w-[360px] sm:max-w-md glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-luxury-gold/40 shadow-xl space-y-4 sm:space-y-5">
        
        <div className="text-center space-y-1 sm:space-y-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center mx-auto shadow-md font-bold">
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-luxury-emerald-dark">Recover Account</h1>
          <p className="text-[11px] sm:text-xs text-gray-600">Enter your registered email address to receive a secure password reset link</p>
        </div>

        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-[11px] sm:text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-center animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold">{successMessage}</p>
              <p className="text-[11px] text-emerald-700">Please check your inbox (and spam folder) for the password reset email.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-luxury-gold text-luxury-emerald-dark font-bold text-xs sm:text-sm shadow"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1 text-[11px] sm:text-xs">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="Enter your registered email"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Reset Link...
                </>
              ) : (
                <>
                  Send Password Reset Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-[11px] sm:text-xs text-center text-gray-600 pt-1">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-luxury-emerald hover:underline">
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};
