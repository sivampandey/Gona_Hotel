import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Phone, ShoppingBag, Menu, X, LogOut, ChevronDown, User as UserIcon, 
  LayoutDashboard, Heart, Trees
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Restaurant', path: '/restaurant' },
    { name: 'Explore Places', path: '/attractions' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && !path.includes('#') && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 light-warm-water-nav text-[#0D3B29] ${
        isScrolled ? 'py-2.5 shadow-md' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0D3B29] flex items-center justify-center text-luxury-gold shadow-md group-hover:scale-105 transition-transform border border-luxury-gold/50 shrink-0">
              <Trees className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl tracking-wider text-[#0D3B29] font-bold leading-none">
                GONA HOTEL
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-[#B8860B] uppercase font-bold mt-0.5 sm:mt-1">
                HOTEL ROOMS • RESTAURANT
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-wide font-bold transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#0D3B29]'
                    : 'text-gray-700 hover:text-[#0D3B29]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D3B29] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Profile Dropdown */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Phone Quick Call */}
            <a
              href="tel:+919696631621"
              className="p-2 text-[#0D3B29] hover:text-[#B8860B] transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Call Concierge: +91 96966 31621 / +91 79050 79819"
            >
              <Phone className="w-4 h-4 text-[#0D3B29]" />
              <span>+91 96966 31621</span>
            </a>

            {/* Food Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#0D3B29] hover:text-[#B8860B] transition-colors flex items-center justify-center"
              title="Food Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#0D3B29] text-white font-bold text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md border border-white leading-none">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Book Now Button */}
            <Link
              to="/rooms"
              className="px-6 py-2.5 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-xs tracking-wider border border-luxury-gold/50 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book Room
            </Link>

            {/* Profile Account Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D3B29]/10 hover:bg-[#0D3B29]/20 border border-[#0D3B29]/30 transition-all cursor-pointer shadow-sm text-[#0D3B29]"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#0D3B29]"
                  />
                  <span className="text-xs font-bold text-[#0D3B29] max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#0D3B29] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl text-gray-900 rounded-2xl shadow-2xl py-2 border border-luxury-gold/40 text-sm z-50 animate-in fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-[#0D3B29] truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#0D3B29]/10 text-[#0D3B29] text-[10px] uppercase font-bold rounded-full">
                          Admin Portal Access
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#0D3B29]/10 hover:text-[#0D3B29] font-medium transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#0D3B29]" /> My Profile & History
                    </Link>

                    <Link
                      to="/profile?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#0D3B29]/10 hover:text-[#0D3B29] font-medium transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#0D3B29]" /> Wishlist
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[#0D3B29] hover:bg-[#0D3B29]/10 font-bold transition-colors border-t border-gray-100"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left border-t border-gray-100 mt-1 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold text-[#0D3B29] hover:bg-[#0D3B29] hover:text-white px-4 py-2 rounded-xl transition-all border border-[#0D3B29]/40"
              >
                Sign In
              </Link>
            )}

          </div>

          {/* Mobile Right Menu Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#0D3B29] flex items-center justify-center"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#0D3B29] text-white font-bold text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md border border-white leading-none">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0D3B29] hover:text-[#B8860B] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden light-warm-water-nav text-[#0D3B29] border-b border-luxury-gold/40 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold border-b border-gray-200 ${
                isActive(link.path) ? 'text-[#0D3B29]' : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 space-y-2">
            <a
              href="tel:+919696631621"
              className="w-full block py-3 rounded-xl bg-[#0D3B29] text-white text-center font-bold text-sm shadow-md"
            >
              📞 Call Hotel: +91 96966 31621
            </a>
            <a
              href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-3 rounded-xl bg-[#0D3B29]/10 text-[#0D3B29] text-center font-bold text-sm border border-[#0D3B29]/30"
            >
              📍 Open Google Maps Location
            </a>
          </div>

          {isAuthenticated ? (
            <div className="pt-2 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block py-3 rounded-xl bg-white text-[#0D3B29] text-center font-bold text-sm border border border-gray-200"
              >
                My Profile ({user?.name})
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block py-3 rounded-xl bg-[#0D3B29] text-luxury-gold text-center font-bold text-sm"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl border border-red-500/40 text-red-600 text-center font-bold text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block py-3 rounded-xl bg-[#0D3B29] text-white text-center font-bold text-sm shadow-md"
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
