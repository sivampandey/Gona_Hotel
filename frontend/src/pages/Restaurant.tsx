import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Bike } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { initialSeedData } from '../data/seedData';
import { useCart } from '../context/CartContext';

export const Restaurant: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { setIsCartOpen, totalItemsCount } = useCart();
  const menuItems = initialSeedData.menuItems;

  const categories = [
    'all',
    'Breakfast',
    'Indian Main Course',
    'Rice & Biryani',
    'Chinese',
    'South Indian',
    'Snacks & Thali',
    'Salad & Crispy',
    'Beverages'
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== 'all' && item.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [menuItems, activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Matching Official Menu Card Branding */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-4 py-1 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-xs font-bold uppercase tracking-widest border border-luxury-gold/40">
            A Delicious Food Restaurant
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D3B29]">
            Gona Restaurant Menu
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            Village- Semari, Post- Sarso, Rajgarh, Mirzapur (U.P.) 231201
          </p>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-md">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#0D3B29] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search dish (e.g. Paneer, Dosa...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-luxury-emerald"
            />
          </div>

        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        {/* Bottom Floating Order Online Banner */}
        <div className="bg-[#0D3B29] p-8 rounded-3xl border border-luxury-gold/40 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-luxury-gold text-[#0D3B29] flex items-center justify-center font-bold shrink-0 shadow-lg">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-gold-gradient">Order Online</h3>
              <p className="text-xs text-gray-200">Fresh Gona Restaurant dishes delivered to your room or table.</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-8 py-3.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-light text-[#0D3B29] font-bold text-sm tracking-wider shadow-lg flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> View Cart & Order ({totalItemsCount})
          </button>
        </div>

      </div>
    </div>
  );
};
