import React, { useState } from 'react';
import { Sparkles, Play, X } from 'lucide-react';
import { initialSeedData } from '../data/seedData';
import type { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const galleryItems = initialSeedData.gallery;
  const categories = ['all', 'rooms', 'restaurant', 'food', 'farm', 'events', 'videos'];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-luxury-emerald uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-luxury-gold" /> Gona Visual Gallery
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-luxury-emerald-dark">
            Capturing Everyday Royalty
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Explore our curated high-resolution photography and video walkthroughs of suites, fine dining dishes, organic farm harvests, and bespoke events.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-luxury-gold text-luxury-emerald-dark shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 bg-black cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {item.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-luxury-gold text-luxury-emerald-dark flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider">{item.category}</span>
                <h4 className="font-serif text-lg font-bold truncate">{item.title}</h4>
                {item.caption && <p className="text-xs text-gray-300 line-clamp-1">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>

        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="relative max-w-4xl w-full max-h-[90vh] bg-luxury-emerald-dark rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/40 flex flex-col">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center text-white">
                <div>
                  <span className="text-xs text-luxury-gold uppercase font-bold tracking-wider">{activeLightboxItem.category}</span>
                  <h3 className="font-serif text-lg font-bold">{activeLightboxItem.title}</h3>
                </div>
                <button
                  onClick={() => setActiveLightboxItem(null)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-4">
                {activeLightboxItem.videoUrl ? (
                  <iframe
                    src={activeLightboxItem.videoUrl}
                    title={activeLightboxItem.title}
                    className="w-full aspect-video rounded-2xl"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={activeLightboxItem.imageUrl}
                    alt={activeLightboxItem.title}
                    className="max-h-[70vh] object-contain rounded-2xl"
                  />
                )}
              </div>

              {activeLightboxItem.caption && (
                <div className="p-4 bg-black/40 text-xs text-gray-300 text-center border-t border-gray-800">
                  {activeLightboxItem.caption}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
