import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, MapPin, Star, Award, Users, Heart,
  CheckCircle2, Utensils, Hotel, Quote, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { value: '10+', label: 'Years of Excellence', icon: Award },
    { value: '5000+', label: 'Happy Guests', icon: Users },
    { value: '50+', label: 'Menu Items', icon: Utensils },
    { value: '4.9★', label: 'Guest Rating', icon: Star },
  ];

  const storyImages = [
    {
      src: '/assets/hotel-entrance.jpg',
      title: 'Grand Entrance Gate',
      desc: 'Gona Hotel Main Entrance & Welcome Arch'
    },
    {
      src: '/assets/hotel-courtyard-night.jpg',
      title: 'Resort Night View',
      desc: 'Spacious illuminated courtyard & balcony suites'
    },
    {
      src: '/assets/hotel-facade.jpg',
      title: 'Modern Wood Exterior',
      desc: 'Eco-friendly wooden finish campus with lush greenery'
    },
    {
      src: '/assets/hotel-terrace-lounge.jpg',
      title: 'Terrace Open Lounge',
      desc: 'Covered seating lounge with scenic mountain views'
    },
    {
      src: '/assets/restaurant-indoor-hall.jpg',
      title: 'Fine Dining Hall',
      desc: 'Luxe indoor dining hall with modern lighting & teak flooring'
    },
    {
      src: '/assets/resort-pool-fountain.jpg',
      title: 'Fountain & Pool View',
      desc: 'Crystal clear resort pool with 3-tier marble fountain'
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const touchStoryStartX = useRef<number | null>(null);

  // Auto-play timer for About page story slider (slides every 3.5s)
  useEffect(() => {
    if (isStoryPaused) return;
    const timer = setInterval(() => {
      setCurrentStoryIndex(prev => (prev + 1) % storyImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [storyImages.length, isStoryPaused]);

  const handleNextStory = () => {
    setCurrentStoryIndex(prev => (prev + 1) % storyImages.length);
  };
  const handlePrevStory = () => {
    setCurrentStoryIndex(prev => (prev - 1 + storyImages.length) % storyImages.length);
  };

  const handleStoryTouchStart = (e: React.TouchEvent) => {
    touchStoryStartX.current = e.touches[0].clientX;
  };
  const handleStoryTouchEnd = (e: React.TouchEvent) => {
    if (touchStoryStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStoryStartX.current - touchEndX;
    if (diffX > 40) handleNextStory();
    else if (diffX < -40) handlePrevStory();
    touchStoryStartX.current = null;
  };

  const values = [
    { title: 'Warm Hospitality', desc: 'Every guest is family. We greet you with genuine warmth and care from the moment you arrive.' },
    { title: 'Fresh & Pure Food', desc: 'Our kitchen uses only fresh, locally-sourced ingredients. No compromise on taste or hygiene.' },
    { title: 'Comfortable Stay', desc: 'Clean, modern AC rooms with all amenities for a peaceful, restful experience.' },
    { title: 'Honest Service', desc: 'Transparent pricing, no hidden charges. We believe in earning your trust every single time.' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EB]">

      {/* ── HERO ── */}
      <section className="relative h-72 sm:h-96 flex items-end pb-12 overflow-hidden">
        <img
          src="/assets/about-hero.jpg"
          alt="Gona Hotel & Estate"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B29]/90 via-[#0D3B29]/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs text-luxury-gold font-bold uppercase tracking-widest">Our Story</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2">
            About <span className="text-gold-gradient">Gona Hotel</span>
          </h1>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-[#0D3B29] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center space-y-1">
              <Icon className="w-7 h-7 text-luxury-gold mx-auto mb-2" />
              <div className="font-serif text-3xl font-bold text-luxury-gold">{value}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Who We Are</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3B29] mt-2 leading-tight">
                A Hotel Built on<br />Trust & Taste
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Nestled on the peaceful outskirts of the city, Gona Hotel offers a serene escape surrounded by nature.
              With breathtaking mountain views and a beautiful river nearby, it feels far away from the noise of city life.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The cool breeze, lush greenery, and quiet surroundings create a relaxing atmosphere. It is the perfect place
              to unwind, enjoy scenic views, and reconnect with nature for a calm, happy quality time with your friends and family.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Organic foods grown in our own farm',
                'Breathtaking mountain views & nearby river',
                'Peaceful city outskirts & lush greenery',
                'AC Rooms with modern amenities & 24/7 Service',
                'Multi-cuisine Gona Restaurant & Free Parking'
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Automatic Image Slider */}
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-2 border-luxury-gold/40 relative group bg-black/40 select-none"
              onMouseEnter={() => setIsStoryPaused(true)}
              onMouseLeave={() => setIsStoryPaused(false)}
              onTouchStart={handleStoryTouchStart}
              onTouchEnd={handleStoryTouchEnd}
            >
              {storyImages.map((img, idx) => (
                <div
                  key={img.src}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentStoryIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark gradient for caption readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Caption & Counter */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-2 z-20">
                    <div>
                      <span className="inline-block bg-luxury-gold text-[#0D3B29] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mb-1 shadow">
                        {img.title}
                      </span>
                      <p className="text-[11px] sm:text-xs text-gray-200 font-light line-clamp-1">
                        {img.desc}
                      </p>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md border border-luxury-gold/40 text-luxury-gold font-mono text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shrink-0 shadow">
                      {idx + 1} / {storyImages.length}
                    </div>
                  </div>
                </div>
              ))}

              {/* Prev Button */}
              <button
                onClick={handlePrevStory}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white border border-luxury-gold/40 hover:bg-luxury-gold hover:text-[#0D3B29] transition-all opacity-80 group-hover:opacity-100 shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextStory}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white border border-luxury-gold/40 hover:bg-luxury-gold hover:text-[#0D3B29] transition-all opacity-80 group-hover:opacity-100 shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dots */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
                {storyImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStoryIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStoryIndex
                        ? 'w-5 bg-luxury-gold'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Clean Location Bar below image */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-luxury-gold/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D3B29] text-luxury-gold flex items-center justify-center shrink-0 shadow">
                  <MapPin className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <p className="font-bold text-[#0D3B29] text-xs sm:text-sm">Chunar Road, Sarso, Rajgarh</p>
                  <p className="text-[11px] text-gray-500">Mirzapur, Uttar Pradesh - 231201</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-[11px] hover:bg-[#F3E5AB] transition shrink-0 shadow"
              >
                View Map 📍
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── OWNER SECTION ── */}
      <section className="py-20 bg-[#0D3B29] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Message From Founder</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
              A Warm Welcome to <span className="text-gold-gradient">Gona Hotel</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Owner Image */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-luxury-gold/50 shadow-2xl">
                  <img
                    src="/assets/owner.png?v=3"
                    alt="Gona Hotel Owner"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90&fit=crop&face';
                    }}
                  />
                </div>
                {/* Gold ring decoration */}
                <div className="absolute -inset-3 rounded-full border-2 border-luxury-gold/20 pointer-events-none" />
                {/* Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-luxury-gold text-[#0D3B29] font-bold text-xs px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                  ⭐ Founder & Owner
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-4xl font-bold text-white">Mithlesh Singh</h3>
                <p className="text-luxury-gold font-semibold text-sm mt-1 uppercase tracking-wider">Founder & Managing Director, Gona Hotel</p>
              </div>

              {/* Quote */}
              <div className="relative pl-6 border-l-4 border-luxury-gold/60">
                <Quote className="w-8 h-8 text-luxury-gold/40 absolute -top-2 -left-1" />
                <p className="text-gray-200 italic text-base leading-relaxed">
                  "Nestled on the peaceful outskirts of the city, our hotel offers a serene escape surrounded by nature. With breathtaking mountain views and a beautiful river nearby, it feels far away from the noise of city life. The cool breeze, lush greenery, and quiet surroundings create a relaxing atmosphere. It is the perfect place to unwind, enjoy scenic views, and reconnect with nature and experience a calm happy quality time with your friends and family. We will be honoured to serve you, we provide organic foods grown in our own farm, an environment to feel the life and such things. Visit to us for such experience."
                </p>
              </div>

              <div className="space-y-3 text-gray-200 text-sm leading-relaxed">
                <p>
                  With years of dedicated service in hospitality, our founder created Gona Hotel to bring a perfect blend of <strong className="text-white">nature, luxury, and farm-fresh organic dining</strong> to Mirzapur.
                </p>
                <p>
                  At Gona Restaurant, we take pride in serving meals prepared with <strong className="text-white">organic ingredients grown directly in our own farm</strong> — ensuring pure taste, high nutrition, and authentic home-style flavor for every guest.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="tel:+919696631621"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs sm:text-sm hover:bg-[#F3E5AB] transition-colors shadow-lg"
                >
                  <Phone className="w-4 h-4" /> +91 96966 31621
                </a>
                <a
                  href="tel:+917905079819"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-luxury-gold/40 font-bold text-xs sm:text-sm hover:bg-luxury-gold hover:text-[#0D3B29] transition-colors"
                >
                  <Phone className="w-4 h-4 text-luxury-gold" /> +91 79050 79819
                </a>
                <a
                  href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-luxury-gold/50 text-luxury-gold font-bold text-xs sm:text-sm hover:bg-luxury-gold/10 transition-colors"
                >
                  <MapPin className="w-4 h-4" /> View Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GONA GROUP VENTURES ── */}
      <section className="py-20 bg-[#F7F4EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-luxury-gold/30 aspect-[5/4] w-full bg-black/10">
              <img
                src="/assets/gona-venture-signpost.jpg?v=3"
                alt="Gona Group Signpost"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Our Ecosystem</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3B29] mt-2">
                  Gona Group of Ventures
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Under the vision of our management, Gona Group has grown into a trusted network of multi-sector enterprises dedicated to excellence, community empowerment, education, organic living, and world-class hospitality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800 font-medium">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Gona Consultancy Services Pvt. Ltd.
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Gona Foundation Trust
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Shri Shyam Balram Singh Intermediate College
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Gona Farm and Holiday Home
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Gona Agri & Dairy Products
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shrink-0"></span>
                  Gona Resort & Restaurant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">What Drives Us</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3B29] mt-2">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map(({ title, desc }) => (
            <div key={title} className="p-7 rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-luxury-gold" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0D3B29]">{title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GUEST REVIEWS ── */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#0D3B29]">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', role: 'Business Traveler', comment: 'The rooms are very clean and comfortable. Paneer Butter Masala in the restaurant is absolutely amazing. Will come back again!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop' },
              { name: 'Priya Sharma', role: 'Family Guest', comment: 'Stayed for 3 nights with family. Staff is very helpful and caring. Dal Tadka and Aloo Paratha are must-try dishes. Highly recommended!', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&fit=crop' },
              { name: 'Amit Singh', role: 'Tourist', comment: 'Best hotel near Chunar. The owner is very welcoming. Sada Thali Bhojan is the best value meal I have had in a long time!', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop' },
            ].map((rev) => (
              <div key={rev.name} className="p-8 rounded-3xl bg-[#F7F4EB] border border-gray-200 shadow-md space-y-4">
                <div className="flex text-luxury-gold gap-1">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{rev.comment}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border-2 border-luxury-gold/30" />
                  <div>
                    <p className="font-bold text-[#0D3B29] text-sm">{rev.name}</p>
                    <p className="text-[11px] text-gray-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#0D3B29] text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Ready to Visit <span className="text-gold-gradient">Gona Hotel?</span>
          </h2>
          <p className="text-gray-300 text-sm">Book your room or reserve your table today. We are always happy to host you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/rooms" className="px-8 py-3.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-sm flex items-center gap-2 hover:bg-[#F3E5AB] transition-colors shadow-lg">
              <Hotel className="w-4 h-4" /> Book a Room <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/restaurant" className="px-8 py-3.5 rounded-full border-2 border-luxury-gold text-luxury-gold font-bold text-sm flex items-center gap-2 hover:bg-luxury-gold/10 transition-colors">
              <Utensils className="w-4 h-4" /> View Menu
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
