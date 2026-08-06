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

  const handleAddToCart = () => {
    addToCart(item, 1);
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(item.id, 'food');
    showToast(wishlisted ? 'Removed from food wishlist' : 'Saved to food wishlist', 'success');
  };

  return (
    <div className="group rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold flex items-center gap-1.5 shadow border ${item.isVeg ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          {item.isVeg ? 'PURE VEG' : 'NON VEG'}
        </span>

        {/* Wishlist */}
        <button onClick={handleWishlist} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 transition-colors shadow">
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {item.popular && (
          <span className="absolute bottom-3 left-3 px-3 py-0.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-[10px] uppercase tracking-wider shadow">
            Chef's Special
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1.5">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-luxury-gold" /> {item.prepTimeMinutes} mins</span>
            <span className="flex items-center gap-1 text-gray-700 font-bold"><Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" /> {item.rating}</span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[#0D3B29] group-hover:text-luxury-gold transition-colors leading-snug">{item.name.replace(/\s*\([\u0900-\u097F\s\w]+\)/g, '')}</h4>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
        </div>
        <div className="pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#0D3B29]">₹{item.price}</span>
          <button onClick={handleAddToCart} className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md ${inCartQty > 0 ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-[#0D3B29] hover:bg-[#134A35] text-white'}`}>
            {inCartQty > 0 ? <><Check className="w-3.5 h-3.5" /> Added ({inCartQty})</> : <><Plus className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};
