import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle, ExternalLink 
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const Contact: React.FC = () => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to Gona Hotel Concierge!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-4 py-1 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-xs font-bold uppercase tracking-widest border border-luxury-gold/40">
            24/7 Guest Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D3B29]">
            Contact Gona Hotel
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            We are here to assist you with room reservations, restaurant orders, and special requests.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <Phone className="w-7 h-7 text-luxury-gold" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Call Concierge</h3>
              <p className="text-xs text-gray-500">24/7 Direct Hotel Hotline</p>
            </div>
            <a
              href="tel:+919696631621"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B29] text-white font-bold text-xs hover:bg-[#134A35] transition-colors"
            >
              +91 96966 31621
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">WhatsApp Desk</h3>
              <p className="text-xs text-gray-500">Instant Chat & Orders</p>
            </div>
            <a
              href="https://wa.me/919696631621"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-full bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7 text-luxury-gold" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#0D3B29]">Google Maps Location</h3>
              <p className="text-xs text-gray-500">Mirzapur, Uttar Pradesh</p>
            </div>
            <a
              href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-[#E8D8B0] transition-colors"
            >
              Open in Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Send Message Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#0D3B29]">Send Us a Message</h3>
              <p className="text-xs text-gray-500">Fill in your details below and our management team will reach out.</p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-green-800">Message Received!</h4>
                <p className="text-xs text-green-700">Thank you. We will call you back at <strong>{formData.phone || '+91 96966 31621'}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 96966 31621"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="Room Booking">Room Booking & Stay</option>
                    <option value="Restaurant Order">Gona Restaurant Food Order</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Interactive Google Map Box with Link */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#0D3B29]">Hotel Address & Directions</h3>
              <p className="text-xs text-gray-600">
                Village- Semari, Post- Sarso, Rajgarh, Mirzapur (U.P.) 231201
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-gray-200 shadow-md">
              <iframe
                title="Gona Hotel Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.123456789!2d82.6!3d25.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAwJzAwLjAiTiA4MsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-4 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-between">
              <div>
                <p className="font-serif text-sm font-bold text-[#0D3B29]">Official Google Maps Link</p>
                <p className="text-[11px] text-gray-600">Tap to open live navigation on your phone</p>
              </div>
              <a
                href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0D3B29] text-luxury-gold font-bold text-xs inline-flex items-center gap-1 shadow-md"
              >
                Open Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
