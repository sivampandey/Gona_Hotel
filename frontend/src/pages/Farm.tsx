import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Flame, Waves, Users, Calendar, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const Farm: React.FC = () => {
  const navigate = useNavigate();

  const [visitDate, setVisitDate] = useState('2026-08-15');
  const [guestCount, setGuestCount] = useState(4);
  const [selectedPackage, setSelectedPackage] = useState('Full Farm House Day Stay & Pool');

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/farm/book?date=${visitDate}&guests=${guestCount}&package=${encodeURIComponent(selectedPackage)}`);
  };

  const farmHouseOptions = [
    {
      id: 'fh_full',
      title: 'Full Farm House Overnight Stay',
      subtitle: 'Entire Private Estate + Swimming Pool + 4 Luxury Bedrooms',
      price: 18000,
      period: 'per night',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      description: 'Book the entire private Gona Farm House for your family or friends. Includes private swimming pool, 4 AC luxury bedrooms, kitchen staff, and private green lawn.',
      features: ['Private Swimming Pool', '4 Luxury Bedrooms', 'Sprawling Green Lawn', 'Private Kitchen & Chef', 'Outdoor Bonfire Lounge', '24/7 Butler Service']
    },
    {
      id: 'fh_day',
      title: 'Day Pool & Lawn Picnic Package',
      subtitle: 'Private Day Access (9 AM - 6 PM) for Groups & Families',
      price: 6500,
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      description: 'Ideal for weekend family picnics and day getaways. Enjoy exclusive private access to the swimming pool, outdoor gazebo, music system, and lush lawns.',
      features: ['Private Pool Access', 'Outdoor Gazebo Lounge', 'Music System & Wifi', 'Barbecue Grill Setup', 'Changing Rooms & Shower']
    },
    {
      id: 'fh_bonfire',
      title: 'Night Bonfire & BBQ Party',
      subtitle: 'Evening Gathering (6 PM - 11 PM) under the stars',
      price: 8500,
      period: 'per event',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      description: 'Host a cozy evening bonfire and barbecue night by the pool. Ambient lighting, live BBQ counters, outdoor seating, and background ambient music.',
      features: ['Live Bonfire Setup', 'Barbecue Grill & Chef', 'Poolside Night Lights', 'Outdoor Music Speaker', 'Buffet Dinner Table']
    },
    {
      id: 'fh_celebration',
      title: 'Private Celebration & Birthday Lawn',
      subtitle: 'Exclusive Event Grounds for Birthdays & Anniversaries',
      price: 12500,
      period: 'per event',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Celebrate special milestones in private elegance. Includes lawn floral decoration, sound system setup, pool access, and custom catering.',
      features: ['Event Decor & Flowers', 'High-Power Sound System', 'Private Pool Access', 'Dedicated Event Coordinator', 'Ample Private Parking']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Farm House Hero Banner with Real Luxury House Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-[#0D3B29] text-white flex items-center justify-center text-center">
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80"
            alt="Gona Luxury Private Farm House"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E20] via-[#0D3B29]/60 to-transparent" />

          <div className="relative z-10 max-w-3xl px-6 space-y-4">
            <span className="px-4 py-1 rounded-full bg-luxury-gold/20 text-luxury-gold text-xs font-bold uppercase tracking-widest border border-luxury-gold/40">
              Private Holiday Estate
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-gold-gradient">
              Gona Private Farm House
            </h1>
            <p className="text-base sm:text-xl text-gray-200 font-light max-w-2xl mx-auto">
              Your private 50-acre holiday estate with swimming pool, green lawns, 4 luxury bedrooms, and outdoor bonfire lounge
            </p>
          </div>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <Waves className="w-6 h-6 text-luxury-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0D3B29]">Private Pool</h3>
            <p className="text-[11px] text-gray-500">Filtered crystal clean pool</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <HomeIcon className="w-6 h-6 text-luxury-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0D3B29]">4 Luxury Bedrooms</h3>
            <p className="text-[11px] text-gray-500">AC rooms with pool view</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <Flame className="w-6 h-6 text-luxury-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0D3B29]">Bonfire & BBQ</h3>
            <p className="text-[11px] text-gray-500">Evening bonfire lounge</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-luxury-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0D3B29]">Sprawling Lawns</h3>
            <p className="text-[11px] text-gray-500">Lush green private grounds</p>
          </div>
        </div>

        {/* Quick Instant Farm House Booking Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-xl space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#0D3B29]">Book Gona Farm House</h2>
            <p className="text-xs text-gray-500">Select dates to reserve the private Farm House estate</p>
          </div>

          <form onSubmit={handleBookSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <label className="text-gray-500 block mb-1">Select Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-luxury-gold text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500 block mb-1">Guests / Group Size</label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-luxury-gold text-sm"
              >
                <option value={2}>2 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={8}>8 Guests (Family)</option>
                <option value={15}>15+ Guests (Event)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 block mb-1">Farm House Package</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-luxury-gold text-sm"
              >
                <option value="Full Farm House Overnight Stay">Full Farm House Overnight Stay (₹18,000)</option>
                <option value="Day Pool & Lawn Picnic Package">Day Pool & Lawn Picnic (₹6,500)</option>
                <option value="Night Bonfire & BBQ Party">Night Bonfire & BBQ Party (₹8,500)</option>
                <option value="Private Celebration & Birthday Lawn">Private Birthday Event (₹12,500)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-sm tracking-wider shadow-lg transition-all"
              >
                Book Farm House Now
              </button>
            </div>
          </form>
        </div>

        {/* Farm House Booking Packages Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">Farm House Stay & Event Options</h2>
            <p className="text-xs text-gray-600">Choose the perfect booking package for your holiday or gathering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {farmHouseOptions.map((pkg) => (
              <div key={pkg.id} className="group rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between">

                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-[#0D3B29] text-luxury-gold font-bold text-sm shadow-md">
                    ₹{pkg.price.toLocaleString('en-IN')} <span className="text-[10px] text-white font-normal">{pkg.period}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-[#0D3B29]">{pkg.title}</h3>
                    <p className="text-xs font-semibold text-luxury-gold uppercase">{pkg.subtitle}</p>
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">{pkg.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Package Highlights</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-[#0D3B29]">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    <Link
                      to={`/farm/book?package=${encodeURIComponent(pkg.title)}`}
                      className="px-6 py-2.5 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5"
                    >
                      Book This Farm House <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
