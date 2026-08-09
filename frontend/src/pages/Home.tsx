import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils, Star, Hotel, Tag, Phone, MapPin
} from 'lucide-react';
import { RoomCard } from '../components/RoomCard';
import { FoodCard } from '../components/FoodCard';
import { initialSeedData } from '../data/seedData';

export const Home: React.FC = () => {
  const featuredRooms = initialSeedData.rooms;
  const popularFoods = initialSeedData.menuItems.slice(0, 4);
  const reviews = initialSeedData.reviews;

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center pt-24 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">

        {/* Background Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.jpg?v=3"
            alt="Gona Hotel Outdoor Resort & Restaurant"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2E20]/90 via-[#0D3B29]/75 to-[#0A2E20]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6 sm:space-y-10">

          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Welcome to <span className="text-gold-gradient">Gona Hotel</span>
            </h1>
            <p className="text-sm sm:text-xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
              Luxury Hotel Rooms & Delicious Multi-Cuisine Restaurant
            </p>
          </div>

          {/* 2 Pill Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Link
              to="/rooms"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-xs sm:text-sm tracking-wide border border-luxury-gold/50 shadow-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Hotel className="w-4 h-4 text-luxury-gold" /> Book Your Room
            </Link>
            <Link
              to="/restaurant"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-gold font-bold text-xs sm:text-sm tracking-wide border border-luxury-gold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Utensils className="w-4 h-4" /> Order Food
            </Link>
          </div>

          {/* 3 Feature Pills Under Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">

            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-luxury-gold/30 shadow-md text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center font-bold shrink-0">
                <Hotel className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold">Luxury Rooms</h4>
                <p className="text-xs text-gray-600">Comfortable & Elegant Rooms</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-luxury-gold/30 shadow-md text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center font-bold shrink-0">
                <Utensils className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold">Gona Restaurant</h4>
                <p className="text-xs text-gray-600">Delicious Food Fresh & Tasty</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-luxury-gold/30 shadow-md text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-[#0D3B29] flex items-center justify-center font-bold shrink-0">
                <Tag className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold">Best Price</h4>
                <p className="text-xs text-gray-600">Great Value & Best Service</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* OUR HIGHLIGHTS SECTION */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3B29]">
            Our Highlights
          </h2>
          <p className="text-xs text-gray-600 tracking-wide uppercase font-semibold">
            Experience the best of Gona Hotel & Restaurant
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div className="group rounded-3xl overflow-hidden bg-[#0D3B29] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/assets/room-2person-deluxe.jpg?v=2"
                alt="Comfortable Rooms"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B29] via-transparent to-transparent" />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-white">Comfortable Rooms</h3>
              <Link
                to="/rooms"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-gold hover:text-white transition-colors"
              >
                View Rooms →
              </Link>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-[#0D3B29] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/assets/delicious-food.jpg?v=2"
                alt="Delicious Food"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B29] via-transparent to-transparent" />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-white">Delicious Food</h3>
              <Link
                to="/restaurant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-gold hover:text-white transition-colors"
              >
                View Menu →
              </Link>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-[#0D3B29] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/assets/restaurant-dining.jpg?v=2"
                alt="Fine Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B29] via-transparent to-transparent" />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-white">Fine Dining</h3>
              <Link
                to="/restaurant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-gold hover:text-white transition-colors"
              >
                Reserve Table →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT GONA HOTEL SECTION */}
      <section id="about" className="py-20 bg-[#0D3B29] text-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Title */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Our Story</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              About <span className="text-gold-gradient">Gona Hotel</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-light">
              Nestled on the peaceful outskirts of the city, Gona Hotel offers a serene escape surrounded by nature.
              Enjoy breathtaking mountain views, a nearby river, cool breezes, lush greenery, and farm-fresh organic food grown right on our own farm.
            </p>
          </div>

          {/* Two column: Hotel info + Owner card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: Hotel Info */}
            <div className="space-y-8">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-luxury-gold/20">
                <img
                  src="/assets/hero-bg.jpg?v=3"
                  alt="Gona Hotel Resort & Fountain"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: '10+', label: 'Years in Business' },
                  { val: '5000+', label: 'Happy Guests' },
                  { val: '50+', label: 'Delicious Dishes' },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 rounded-2xl bg-white/5 border border-luxury-gold/20">
                    <div className="font-serif text-3xl font-bold text-luxury-gold">{s.val}</div>
                    <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-sm hover:bg-[#F3E5AB] transition-colors shadow-lg"
              >
                Read Our Full Story →
              </Link>
            </div>

            {/* Right: Owner Card */}
            <div className="space-y-6">
              {/* Owner Portrait Card */}
              <div className="rounded-3xl bg-white/5 border border-luxury-gold/30 shadow-xl overflow-hidden">
                <div className="relative">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src="/assets/owner.png?v=3"
                      alt="Gona Hotel Owner"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B29] via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-block bg-luxury-gold text-[#0D3B29] font-bold text-xs px-3 py-1 rounded-full mb-2">
                      ⭐ Founder & Owner
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white">Mithlesh Singh</h3>
                    <p className="text-luxury-gold text-xs font-semibold uppercase tracking-wider">Managing Director, Gona Hotel</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-200 text-sm leading-relaxed italic border-l-4 border-luxury-gold/50 pl-4">
                    "Nestled on the peaceful outskirts of the city, our hotel offers a serene escape surrounded by nature. With breathtaking mountain views and a beautiful river nearby, it feels far away from the noise of city life. We will be honoured to serve you with organic foods grown in our own farm!"
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <a href="tel:+919696631621" className="flex items-center gap-2 text-luxury-gold hover:text-white transition-colors">
                      <Phone className="w-4 h-4" /> +91 96966 31621
                    </a>
                    <a href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-luxury-gold hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" /> Chunar Road, Sarso, Mirzapur
                    </a>
                  </div>
                </div>
              </div>

              {/* Values Quick Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏨', title: 'Comfortable Rooms', desc: 'Modern AC rooms with all amenities' },
                  { icon: '🍽️', title: 'Fresh Food Daily', desc: 'Authentic multi-cuisine restaurant' },
                  { icon: '🤝', title: 'Honest Service', desc: 'Transparent pricing, zero hidden costs' },
                  { icon: '📞', title: '24/7 Support', desc: 'Always available for your needs' },
                ].map(v => (
                  <div key={v.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-luxury-gold/30 transition-colors">
                    <div className="text-2xl mb-2">{v.icon}</div>
                    <h5 className="font-bold text-white text-sm">{v.title}</h5>
                    <p className="text-xs text-gray-400 mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FEATURED ROOMS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0D3B29] uppercase tracking-wider">Acclaimed Suites</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3B29]">
              Featured Rooms & Suites
            </h2>
          </div>
          <Link
            to="/rooms"
            className="text-xs font-bold text-[#0D3B29] hover:text-luxury-gold flex items-center gap-1"
          >
            View All Rooms →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* GOURMET RESTAURANT SHOWCASE */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3B29]">
              Our Special Restaurant Dishes
            </h2>
            <p className="text-xs text-gray-600 tracking-wide uppercase font-semibold">
              Freshly prepared with love & authentic spices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularFoods.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/restaurant"
              className="px-8 py-3.5 rounded-full bg-[#0D3B29] text-white font-bold text-xs tracking-wider inline-block hover:bg-[#134A35] transition-colors"
            >
              Explore Full Restaurant Menu
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3B29]">
              What Our Guests Say
            </h2>
            <p className="text-xs text-gray-600">Real reviews from real guests</p>
          </div>

          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            View All Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-8 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-luxury-gold gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="w-10 h-10 rounded-full object-cover border border-luxury-gold"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-gray-900">{rev.userName}</h4>
                  <span className="text-[10px] text-gray-500 uppercase">{rev.entityType} Guest</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
