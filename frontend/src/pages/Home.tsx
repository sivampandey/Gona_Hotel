import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils, Star, Hotel, Tag, Phone, MapPin, Compass, Camera, ArrowRight,
  ChevronLeft, ChevronRight, Pause, Play
} from 'lucide-react';
import { RoomCard } from '../components/RoomCard';
import { FoodCard } from '../components/FoodCard';
import { initialSeedData } from '../data/seedData';
import { touristPlaces } from './Attractions';

export const Home: React.FC = () => {
  const featuredRooms = initialSeedData.rooms;
  const popularFoods = initialSeedData.menuItems
    .filter(item => item.id !== 'item_plain_roti' && item.id !== 'item_butter_roti')
    .slice(0, 6);
  const reviews = initialSeedData.reviews;

  // Responsive Desktop vs Mobile View State
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Rooms Automatic & Touch Slider State
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Food Automatic & Touch Slider State
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const touchFoodStartX = useRef<number | null>(null);

  // Tourist Attractions Automatic & Touch Slider State
  const [currentTouristIndex, setCurrentTouristIndex] = useState(0);
  const touchTouristStartX = useRef<number | null>(null);

  // Our Story Hotel Showcase Images & Automatic Slider State (6 Photos)
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
      desc: 'Covered sitting lounge with scenic mountain views'
    },
    {
      src: '/assets/restaurant-indoor-hall.jpg',
      title: 'Fine Dining Hall',
      desc: 'Luxe indoor dining hall with modern lighting & teak flooring'
    },
    {
      src: '/assets/hero-bg.jpg',
      title: 'Fountain & Pool View',
      desc: 'Crystal clear resort pool with 3-tier marble fountain'
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const touchStoryStartX = useRef<number | null>(null);

  // Preload hero & story images on mount for instant smooth display
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/hero-bg.jpg';
    storyImages.forEach(item => {
      const storyImg = new Image();
      storyImg.src = item.src;
    });
  }, []);

  // Auto-play timer for Rooms Showcase (slides every 3 seconds infinitely)
  useEffect(() => {
    const roomTimer = setInterval(() => {
      setCurrentRoomIndex((prev) => (prev + 1) % featuredRooms.length);
    }, 3000);
    return () => clearInterval(roomTimer);
  }, [featuredRooms.length]);

  // Auto-play timer for Food Showcase (slides every 3.2 seconds infinitely)
  useEffect(() => {
    const foodTimer = setInterval(() => {
      setCurrentFoodIndex((prev) => (prev + 1) % popularFoods.length);
    }, 3200);
    return () => clearInterval(foodTimer);
  }, [popularFoods.length]);

  // Auto-play timer for Tourist Attractions (slides every 3.6 seconds infinitely)
  useEffect(() => {
    const touristTimer = setInterval(() => {
      setCurrentTouristIndex((prev) => (prev + 1) % touristPlaces.length);
    }, 3600);
    return () => clearInterval(touristTimer);
  }, [touristPlaces.length]);

  // Auto-play timer for Story Hotel Slider (slides every 3.5 seconds)
  useEffect(() => {
    if (isStoryPaused) return;
    const storyTimer = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % storyImages.length);
    }, 3500);
    return () => clearInterval(storyTimer);
  }, [storyImages.length, isStoryPaused]);

  const handleNextRoom = () => {
    setCurrentRoomIndex((prev) => (prev + 1) % featuredRooms.length);
  };
  const handlePrevRoom = () => {
    setCurrentRoomIndex((prev) => (prev - 1 + featuredRooms.length) % featuredRooms.length);
  };

  const handleNextFood = () => {
    setCurrentFoodIndex((prev) => (prev + 1) % popularFoods.length);
  };
  const handlePrevFood = () => {
    setCurrentFoodIndex((prev) => (prev - 1 + popularFoods.length) % popularFoods.length);
  };

  const handleNextTourist = () => {
    setCurrentTouristIndex((prev) => (prev + 1) % touristPlaces.length);
  };
  const handlePrevTourist = () => {
    setCurrentTouristIndex((prev) => (prev - 1 + touristPlaces.length) % touristPlaces.length);
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % storyImages.length);
  };
  const handlePrevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + storyImages.length) % storyImages.length);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (diffX > 40) handleNextRoom();
    else if (diffX < -40) handlePrevRoom();
    touchStartX.current = null;
  };

  const handleFoodTouchStart = (e: React.TouchEvent) => {
    touchFoodStartX.current = e.touches[0].clientX;
  };
  const handleFoodTouchEnd = (e: React.TouchEvent) => {
    if (touchFoodStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchFoodStartX.current - touchEndX;
    if (diffX > 40) handleNextFood();
    else if (diffX < -40) handlePrevFood();
    touchFoodStartX.current = null;
  };

  const handleTouristTouchStart = (e: React.TouchEvent) => {
    touchTouristStartX.current = e.touches[0].clientX;
  };
  const handleTouristTouchEnd = (e: React.TouchEvent) => {
    if (touchTouristStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchTouristStartX.current - touchEndX;
    if (diffX > 40) handleNextTourist();
    else if (diffX < -40) handlePrevTourist();
    touchTouristStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian overflow-hidden">

      {/* HERO SECTION WITH AUTOMATIC BACKGROUND SLIDER */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center pt-24 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">

        {/* Single Fixed Background Photo */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/hero-bg.jpg"
            alt="Gona Hotel Outdoor Resort & Restaurant"
            loading="eager"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6 sm:space-y-8">

          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto backdrop-blur-md bg-black/40 p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-xl">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DC] via-luxury-gold to-[#F3E5AB]">Gona Hotel</span>
            </h1>
            <p className="text-sm sm:text-xl text-gray-100 font-medium tracking-wide max-w-2xl mx-auto drop-shadow-md">
              Luxury Hotel Rooms & Delicious Multi-Cuisine Restaurant
            </p>

            {/* 2 Pill Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/rooms"
                className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-xs sm:text-sm tracking-wide border border-luxury-gold/50 shadow-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Hotel className="w-4 h-4 text-luxury-gold" /> Book Your Room
              </Link>
              <Link
                to="/restaurant"
                className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-luxury-gold hover:bg-[#d4a82c] text-[#0D3B29] font-bold text-xs sm:text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Utensils className="w-4 h-4 text-[#0D3B29]" /> Order Food
              </Link>
            </div>
          </div>

          {/* 3 Feature Pills Under Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 max-w-4xl mx-auto">

            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl text-gray-900 border border-luxury-gold/40 shadow-xl text-left flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#0D3B29] text-luxury-gold flex items-center justify-center font-bold shrink-0 shadow-md">
                <Hotel className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#0D3B29]">Luxury Rooms</h4>
                <p className="text-xs text-gray-600 font-medium">Comfortable & Elegant Rooms</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl text-gray-900 border border-luxury-gold/40 shadow-xl text-left flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#0D3B29] text-luxury-gold flex items-center justify-center font-bold shrink-0 shadow-md">
                <Utensils className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#0D3B29]">Gona Restaurant</h4>
                <p className="text-xs text-gray-600 font-medium">Delicious Food Fresh & Tasty</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl text-gray-900 border border-luxury-gold/40 shadow-xl text-left flex items-center gap-4 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#0D3B29] text-luxury-gold flex items-center justify-center font-bold shrink-0 shadow-md">
                <Tag className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#0D3B29]">Best Price</h4>
                <p className="text-xs text-gray-600 font-medium">Great Value & Best Service</p>
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
                src="/assets/restaurant-indoor-hall.jpg"
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

      {/* ABOUT GONA HOTEL SECTION - COMPACT MOBILE OPTIMIZED */}
      <section id="about" className="py-10 sm:py-20 bg-[#0D3B29] text-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">

          {/* Title */}
          <div className="text-center space-y-1.5 sm:space-y-3">
            <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Our Story</span>
            <h2 className="font-serif text-2xl sm:text-5xl font-bold text-white">
              About <span className="text-gold-gradient">Gona Hotel</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-xs sm:text-base leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
              Nestled on the peaceful outskirts of the city, Gona Hotel offers a serene escape surrounded by nature with mountain views, cool breezes, and farm-fresh organic food.
            </p>
          </div>

          {/* TOP ROW: Owner Card (Left) + Uploaded Signpost Image (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-stretch">

            {/* Left: Owner Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-white/5 border border-luxury-gold/30 shadow-xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 space-y-3 sm:space-y-5">
              {/* Header info */}
              <div className="space-y-1">
                <div className="inline-block bg-luxury-gold text-[#0D3B29] font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md mb-1">
                  ⭐ Founder & Owner
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Mithlesh Singh</h3>
                <p className="text-luxury-gold text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Managing Director, Gona Hotel</p>
              </div>

              {/* Full Owner Image - Crisp, clean, full display */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-md aspect-[4/3] sm:aspect-[5/4] w-full bg-black/40">
                <img
                  src="/assets/owner.png?v=3"
                  alt="Gona Hotel Owner"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90&fit=crop';
                  }}
                />
              </div>

              {/* Quote & Contact */}
              <div className="space-y-3">
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed italic border-l-2 sm:border-l-4 border-luxury-gold/50 pl-3">
                  "Nestled on the peaceful outskirts of the city, our hotel offers a serene escape surrounded by nature. We will be honoured to serve you with organic foods grown in our own farm!"
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-[11px] sm:text-sm pt-2 border-t border-white/10">
                  <a href="tel:+919696631621" className="flex items-center gap-1.5 text-luxury-gold hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" /> +91 96966 31621 / +91 79050 79819
                  </a>
                  <a href="https://maps.app.goo.gl/BhUY7vjPVnFwfDbX9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-luxury-gold hover:text-white transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> Chunar Road, Sarso, Mirzapur
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Uploaded Signpost Image Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-white/5 border border-luxury-gold/30 shadow-xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 space-y-3 sm:space-y-5">
              {/* Header info */}
              <div className="space-y-1">
                <div className="inline-block bg-luxury-gold text-[#0D3B29] font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md mb-1">
                  🌳 Gona Group
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Gona Group Ventures</h3>
                <p className="text-luxury-gold text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Sister Organisations & Businesses</p>
              </div>

              {/* FULL SIGNPOST IMAGE - Object-Contain for 100% Zero Text Crop */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-md aspect-[4/3] sm:aspect-[5/4] w-full bg-black/40 flex items-center justify-center">
                <img
                  src="/assets/gona-venture-signpost.jpg?v=3"
                  alt="Gona Group Ventures Signpost"
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>

              {/* Details list */}
              <div className="space-y-2">
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                  Encompassing hospitality, education, organic farming & consultancy:
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:text-xs text-gray-300 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Gona Consultancy</span>
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Gona Foundation</span>
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Shyam Balram College</span>
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Gona Farm & Resort</span>
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Gona Dairy Products</span>
                  <span className="flex items-center gap-1"><span className="text-luxury-gold font-bold">•</span> Gona Restaurant</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: Hotel Image under both of them */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/5 border border-luxury-gold/30 shadow-2xl overflow-hidden p-4 sm:p-8 space-y-4 sm:space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-luxury-gold uppercase tracking-widest">Serene Ambiance & Resort Building</span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white">
                Gona Hotel & Resort Property
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
              {/* Hotel Automatic Image Slider */}
              <div 
                className="lg:col-span-7 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-luxury-gold/30 bg-black/40 relative group h-[260px] sm:h-[380px] w-full select-none"
                onMouseEnter={() => setIsStoryPaused(true)}
                onMouseLeave={() => setIsStoryPaused(false)}
                onTouchStart={handleStoryTouchStart}
                onTouchEnd={handleStoryTouchEnd}
              >
                {/* Images Stack */}
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
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Caption & Counter Badge */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white flex items-end justify-between gap-2 z-20">
                      <div className="space-y-0.5">
                        <span className="inline-block bg-luxury-gold text-[#0D3B29] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
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

                {/* Prev Arrow Button */}
                <button
                  onClick={handlePrevStory}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 text-white border border-luxury-gold/40 hover:bg-luxury-gold hover:text-[#0D3B29] transition-all opacity-80 group-hover:opacity-100 shadow-xl active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Next Arrow Button */}
                <button
                  onClick={handleNextStory}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 text-white border border-luxury-gold/40 hover:bg-luxury-gold hover:text-[#0D3B29] transition-all opacity-80 group-hover:opacity-100 shadow-xl active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Navigation Dots Indicator */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                  {storyImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStoryIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStoryIndex
                          ? 'w-6 bg-luxury-gold'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Hotel Info & Stats */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                  Situated near Mirzapur & Chunar, featuring AC rooms, manicured gardens, fountain view dining, and organic farming.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { val: '10+', label: 'Years Exp.' },
                    { val: '5000+', label: 'Happy Guests' },
                    { val: '50+', label: 'Dishes Served' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-luxury-gold/20">
                      <div className="font-serif text-lg sm:text-2xl font-bold text-luxury-gold">{s.val}</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs sm:text-sm hover:bg-[#F3E5AB] transition-colors shadow-lg"
                  >
                    Read Our Full Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FEATURED ROOMS SINGLE COMPACT AUTOMATIC SLIDER */}
      <section
        className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-[11px] font-bold uppercase tracking-widest border border-luxury-gold/40 inline-block mb-1">
              ✨ Featured Luxury Room
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D3B29]">
              Rooms & Suites Showcase
            </h2>
          </div>

          <Link
            to="/rooms"
            className="text-xs font-bold text-[#0D3B29] hover:text-luxury-gold flex items-center gap-1"
          >
            View All Rooms →
          </Link>
        </div>

        {/* Responsive Card Slider Frame with Left/Right Water Glass Arrows */}
        <div className="relative max-w-full md:max-w-7xl mx-auto px-1 sm:px-2">

          {/* Left Overlay Arrow Button - Water Glass Effect */}
          <button
            onClick={handlePrevRoom}
            className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/40 backdrop-blur-md text-[#0D3B29] border border-white/70 hover:bg-white/80 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
            title="Previous Room"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-[#0D3B29] drop-shadow-sm" />
          </button>

          {/* Right Overlay Arrow Button - Water Glass Effect */}
          <button
            onClick={handleNextRoom}
            className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/40 backdrop-blur-md text-[#0D3B29] border border-white/70 hover:bg-white/80 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
            title="Next Room"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#0D3B29] drop-shadow-sm" />
          </button>

          {/* Viewport Container - Zero inner padding for 100% clean mobile slider */}
          <div className="overflow-hidden w-full rounded-3xl py-2 px-0">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-0 md:gap-6"
              style={{
                transform: `translateX(-${currentRoomIndex * (isDesktop ? 33.3333 : 100)}%)`
              }}
            >
              {[...featuredRooms, ...featuredRooms].map((room, idx) => (
                <div
                  key={`${room.id}-${idx}`}
                  className="w-full md:w-[calc(33.333%-16px)] shrink-0 transition-all"
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Slider Pagination Indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {featuredRooms.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentRoomIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${currentRoomIndex === idx
                  ? 'w-8 bg-[#0D3B29]'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              title={`Go to Room ${idx + 1}`}
            />
          ))}
        </div>

      </section>

      {/* GOURMET RESTAURANT AUTOMATIC & TOUCH SLIDER */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
          onTouchStart={handleFoodTouchStart}
          onTouchEnd={handleFoodTouchEnd}
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-[11px] font-bold uppercase tracking-widest border border-luxury-gold/40 inline-block mb-1">
                🍛 Auto-Sliding Culinary Menu
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D3B29]">
                Our Special Restaurant Dishes
              </h2>
            </div>

            <Link
              to="/restaurant"
              className="text-xs font-bold text-[#0D3B29] hover:text-luxury-gold flex items-center gap-1"
            >
              Full Menu →
            </Link>
          </div>

          {/* Responsive Food Card Slider Frame with Left/Right Water Glass Arrows */}
          <div className="relative max-w-full md:max-w-7xl mx-auto px-1 sm:px-2">

            {/* Left Overlay Arrow Button - Water Glass Effect */}
            <button
              onClick={handlePrevFood}
              className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/40 backdrop-blur-md text-[#0D3B29] border border-white/70 hover:bg-white/80 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
              title="Previous Dish"
            >
              <ChevronLeft className="w-6 h-6 text-[#0D3B29] drop-shadow-sm" />
            </button>

            {/* Right Overlay Arrow Button - Water Glass Effect */}
            <button
              onClick={handleNextFood}
              className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/40 backdrop-blur-md text-[#0D3B29] border border-white/70 hover:bg-white/80 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
              title="Next Dish"
            >
              <ChevronRight className="w-6 h-6 text-[#0D3B29] drop-shadow-sm" />
            </button>

            {/* Viewport Container - Zero inner padding for 100% clean mobile slider */}
            <div className="overflow-hidden w-full rounded-3xl py-2 px-0">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-0 md:gap-6"
                style={{
                  transform: `translateX(-${currentFoodIndex * (isDesktop ? 33.3333 : 100)}%)`
                }}
              >
                {[...popularFoods, ...popularFoods].map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="w-full md:w-[calc(33.333%-16px)] shrink-0 transition-all"
                  >
                    <FoodCard item={item} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Slider Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {popularFoods.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFoodIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentFoodIndex === idx
                    ? 'w-8 bg-[#0D3B29]'
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                title={`Go to Dish ${idx + 1}`}
              />
            ))}
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

      {/* NEARBY TOURIST PLACES AUTOMATIC & TOUCH SLIDER */}
      <section className="py-14 sm:py-16 bg-[#0D3B29] text-white">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
          onTouchStart={handleTouristTouchStart}
          onTouchEnd={handleTouristTouchEnd}
        >

          <div className="flex items-center justify-between border-b border-luxury-gold/30 pb-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-luxury-gold text-[#0D3B29] text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md">
                <Compass className="w-3.5 h-3.5" /> Auto-Sliding Sightseeing Guide
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
                Famous Nearby Tourist Attractions
              </h2>
            </div>

            <Link
              to="/attractions"
              className="px-4 py-2 rounded-full bg-luxury-gold text-[#0D3B29] hover:bg-white font-bold text-xs transition-all inline-flex items-center justify-center gap-1 shadow-lg shrink-0"
            >
              Explore All Places →
            </Link>
          </div>

          {/* Responsive Tourist Card Slider Frame with Left/Right Water Glass Arrows */}
          <div className="relative max-w-full md:max-w-7xl mx-auto px-1 sm:px-2">

            {/* Left Overlay Arrow Button - Water Glass Effect */}
            <button
              onClick={handlePrevTourist}
              className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/60 hover:bg-white/60 hover:text-[#0D3B29] hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
              title="Previous Attraction"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
            </button>

            {/* Right Overlay Arrow Button - Water Glass Effect */}
            <button
              onClick={handleNextTourist}
              className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/60 hover:bg-white/60 hover:text-[#0D3B29] hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-2xl"
              title="Next Attraction"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
            </button>

            {/* Viewport Container - Zero inner padding for 100% clean mobile slider */}
            <div className="overflow-hidden w-full rounded-2xl py-2 px-0">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-0 md:gap-6"
                style={{
                  transform: `translateX(-${currentTouristIndex * (isDesktop ? 33.3333 : 100)}%)`
                }}
              >
                {[...touristPlaces, ...touristPlaces].map((place, idx) => (
                  <div key={`${place.id}-${idx}`} className="w-full md:w-[calc(33.333%-16px)] shrink-0 transition-all">
                    <div className="rounded-2xl bg-white/5 border border-luxury-gold/30 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-luxury-gold/60 transition-all h-full">
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#0D3B29]/90 text-luxury-gold text-[11px] font-bold px-2.5 py-1 rounded-full border border-luxury-gold/40">
                          📍 {place.distanceFromHotel}
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">{place.name}</h3>
                          <span className="text-[11px] text-luxury-gold font-bold block">{place.hindiName}</span>
                          <p className="text-xs text-gray-300 font-light mt-1.5 leading-relaxed line-clamp-2">
                            {place.shortDesc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-gray-400">🚗 {place.travelTime}</span>
                          <Link
                            to="/attractions"
                            className="text-xs text-luxury-gold font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            View Photos & Route →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Slider Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {touristPlaces.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTouristIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentTouristIndex === idx
                    ? 'w-8 bg-luxury-gold'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                title={`Go to Attraction ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
