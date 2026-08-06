import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password, phone);
    if (success) {
      showToast('Registration successful! Welcome to Gona Hotel.', 'success');
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-obsidian flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-luxury-gold/40 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center mx-auto shadow-lg font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-dark">Create Guest Account</h1>
          <p className="text-xs text-gray-600">Join the Gona Privilege Club for exclusive stay & dining benefits</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Lady Eleanor Vance"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="eleanor@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-luxury-gold hover:bg-luxury-gold-light text-luxury-emerald-dark font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            Register & Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-center text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-luxury-emerald hover:underline">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};
