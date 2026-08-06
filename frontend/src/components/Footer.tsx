import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Trees, Globe, Share2, MessageCircle, ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A2E20] text-gray-300 border-t border-luxury-gold/30">
      
      {/* Top Banner */}
      <div className="border-b border-gray-800 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-luxury-gold text-[#0D3B29] flex items-center justify-center font-bold">
            <Trees className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-gold-gradient">GONA HOTEL</h3>
            <p className="text-xs text-luxury-champagne">Gona Hotel Rooms • Gona Restaurant • Mirzapur, U.P.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <a
            href="tel:+919696631621"
            className="px-5 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] hover:bg-white transition-all flex items-center gap-2 shadow-lg"
          >
            <Phone className="w-4 h-4" /> Call: +91 96966 31621
          </a>
          <a
            href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/10 text-white border border-luxury-gold/40 hover:bg-luxury-gold hover:text-[#0D3B29] transition-all flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-luxury-gold" /> Open Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-white">About Gona Hotel</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Gona Hotel offers comfortable luxury room accommodations and gourmet multi-cuisine dining at Gona Restaurant in Mirzapur, Uttar Pradesh.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-800 text-luxury-gold hover:bg-luxury-gold hover:text-[#0D3B29] transition-all" title="View Map Location">
              <Globe className="w-4 h-4" />
            </a>
            <a href="https://wa.me/919696631621" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-800 text-luxury-gold hover:bg-luxury-gold hover:text-[#0D3B29] transition-all" title="WhatsApp Us">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif text-lg font-bold text-white">Our Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/rooms" className="hover:text-luxury-gold transition-colors">1. Gona Hotel Rooms</Link></li>
            <li><Link to="/restaurant" className="hover:text-luxury-gold transition-colors">2. Gona Restaurant</Link></li>
            <li><Link to="/#about" className="hover:text-luxury-gold transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif text-lg font-bold text-white">Guest Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/profile" className="hover:text-luxury-gold transition-colors">My Profile & Bookings</Link></li>
            <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Help Desk & Concierge</Link></li>
            <li><Link to="/admin" className="hover:text-luxury-gold transition-colors">Admin Management Portal</Link></li>
            <li><a href="tel:+919696631621" className="hover:text-luxury-gold transition-colors">Call Hotel: +91 96966 31621</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif text-lg font-bold text-white">Official Location</h4>
          <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-2">
            <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
            <span>Village- Semari, Post- Sarso, Rajgarh, Mirzapur (U.P.) 231201</span>
          </p>
          <div className="pt-2">
            <a
              href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-luxury-gold hover:underline inline-flex items-center gap-1 font-bold"
            >
              Get Driving Directions →
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Gona Hotel (Rooms & Restaurant). Contact: +91 96966 31621</p>
      </div>

    </footer>
  );
};
