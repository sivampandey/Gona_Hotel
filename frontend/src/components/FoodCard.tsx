import React from 'react';
import { Plus, Clock, Star, Heart, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const { showToast } = useNotification();

  const cartItem = cart.find(i => i.id === item.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const wishlisted = isWishlisted(item.id, 'food');

  const isItemAvailable = item.isAvailable !== false;

  const handleAddToCart = () => {
    if (!isItemAvailable) {
      showToast(`${item.name} is currently sold out / unavailable`, 'error');
      return;
    }
    addToCart(item, 1);
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(item.id, 'food');
    showToast(wishlisted ? 'Removed from food wishlist' : 'Saved to food wishlist', 'success');
  };

  return (
    <div className="group rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 space-y-4">
      
      {/* Top Header Bar: Veg/Non-Veg Badge & Wishlist */}
      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${item.isVeg ? 'bg-green-50 border-green-600 text-green-700' : 'bg-red-50 border-red-600 text-red-700'}`}>
          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          {item.isVeg ? 'PURE VEG' : 'NON VEG'}
        </span>

        <div className="flex items-center gap-2">
          {!isItemAvailable ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px] uppercase tracking-wider border border-red-300">
              Sold Out
            </span>
          ) : item.popular && (
            <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold/20 text-[#0D3B29] font-bold text-[10px] uppercase tracking-wider border border-luxury-gold/40">
              Chef's Special
            </span>
          )}
          <button onClick={handleWishlist} className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-red-500 transition-colors">
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-luxury-gold" /> {item.prepTimeMinutes} mins</span>
          <span className="flex items-center gap-1 text-gray-700 font-bold"><Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" /> {item.rating}</span>
        </div>
        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0D3B29] group-hover:text-luxury-gold transition-colors leading-snug">
          {item.name.replace(/\s*\([\u0900-\u097F\s\w]+\)/g, '')}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Bottom Row: Price & Add Button */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D3B29]">₹{item.price}</span>
        
        {isItemAvailable ? (
          <button onClick={handleAddToCart} className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${inCartQty > 0 ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-[#0D3B29] hover:bg-[#134A35] text-white'}`}>
            {inCartQty > 0 ? <><Check className="w-3.5 h-3.5" /> Added ({inCartQty})</> : <><Plus className="w-3.5 h-3.5" /> Add</>}
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 font-bold text-xs border border-red-300">
            Unavailable / Sold Out
          </span>
        )}
      </div>


    </div>
  );
};
