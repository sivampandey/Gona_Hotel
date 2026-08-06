import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Hotel } from 'lucide-react';
import { RoomCard } from '../components/RoomCard';
import { initialSeedData } from '../data/seedData';

export const Rooms: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [maxGuestsFilter, setMaxGuestsFilter] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const rooms = initialSeedData.rooms;
  const categories = ['all', 'Family Room', 'Executive Room', 'Deluxe Room', 'Standard Room', 'Single Room'];

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (selectedCategory !== 'all' && room.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (room.pricePerNight > priceRange) {
        return false;
      }
      if (maxGuestsFilter > 0 && room.maxGuests < maxGuestsFilter) {
        return false;
      }
      if (
        searchTerm &&
        !room.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !room.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [rooms, selectedCategory, priceRange, maxGuestsFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D3B29]">
            Our Rooms & Suites
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Find your perfect room for an unforgettable luxury stay
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#0D3B29] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Rooms' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-luxury-emerald"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Max Price Per Night</span>
                <span className="font-bold text-[#0D3B29]">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={5000}
                step={500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0D3B29]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Guests Capacity</span>
                <span className="font-bold text-[#0D3B29]">{maxGuestsFilter === 0 ? 'Any' : `${maxGuestsFilter}+ Guests`}</span>
              </div>
              <select
                value={maxGuestsFilter}
                onChange={(e) => setMaxGuestsFilter(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-semibold focus:outline-none focus:border-luxury-emerald"
              >
                <option value={0}>All Capacities</option>
                <option value={2}>2+ Guests</option>
                <option value={3}>3+ Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

      </div>
    </div>
  );
};
