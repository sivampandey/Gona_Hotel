import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or missing password reset token in URL. Please request a new link.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.resetPassword(token, password);
      if (res.status === 200 && res.data?.success) {
        setSuccess(true);
        showToast('Password reset successful! Please sign in with your new password.', 'success');
      } else {
        setError(res.data?.message || 'Failed to reset password. Token may be invalid or expired.');
      }
    } catch (err: any) {
      setError('Unable to connect to server to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-luxury-cream text-luxury-obsidian flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
      <div className="w-full max-w-[360px] sm:max-w-md glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-luxury-gold/40 shadow-xl space-y-4 sm:space-y-5">
        
        <div className="text-center space-y-1 sm:space-y-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center mx-auto shadow-md font-bold">
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-luxury-emerald-dark">Set New Password</h1>
          <p className="text-[11px] sm:text-xs text-gray-600">Enter a secure new password for your Gona Hotel account</p>
        </div>

        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-[11px] sm:text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!token ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-center space-y-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
            <p className="font-medium">No valid password reset token found in your link.</p>
            <Link
              to="/forgot-password"
              className="inline-block py-2 px-4 rounded-lg bg-luxury-gold text-luxury-emerald-dark font-bold text-xs shadow"
            >
              Request New Reset Link
            </Link>
          </div>
        ) : success ? (
          <div className="space-y-4 text-center animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold">Password Reset Successful!</p>
              <p className="text-[11px] text-emerald-700">Your account password has been updated. Your old password will no longer work.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-luxury-emerald-dark font-bold text-xs sm:text-sm shadow transition-all"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1 text-[11px] sm:text-xs">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 text-[11px] sm:text-xs">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="Re-enter your new password"
                  className="w-full pl-9 pr-10 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-luxury-gold"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}

        <p className="text-[11px] sm:text-xs text-center text-gray-600 pt-1">
          Back to{' '}
          <Link to="/login" className="font-bold text-luxury-emerald hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};
