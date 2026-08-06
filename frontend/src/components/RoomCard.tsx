import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { Room } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { toggleWishlist, isWishlisted } = useAuth();
  const { showToast } = useNotification();
  const wishlisted = isWishlisted(room.id, 'rooms');

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(room.id, 'rooms');
    showToast(wishlisted ? 'Removed from your wishlist' : 'Saved to your wishlist', 'success');
  };

  return (
    <div className="group rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 text-luxury-gold text-[10px] font-bold uppercase tracking-wider border border-luxury-gold/30 backdrop-blur-sm">
          {room.category}
        </span>

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:text-red-500 transition-colors shadow"
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
          <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
          <span>{room.rating}</span>
          <span className="text-gray-300">({room.reviewCount})</span>
        </div>
      </div>

      {/* Content — compact white card */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#0D3B29] group-hover:text-amber-700 transition-colors mb-1">
            {room.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Starting from</span>
            <span className="font-serif text-xl font-bold text-[#0D3B29]">
              ₹{room.pricePerNight.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-gray-500 ml-1">/ night</span>
          </div>
          <Link
            to={`/rooms/${room.slug}`}
            className="px-4 py-2 rounded-xl bg-[#0D3B29] hover:bg-luxury-gold hover:text-[#0D3B29] text-white font-bold text-xs tracking-wide flex items-center gap-1 shadow transition-all duration-300"
          >
            Book Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
