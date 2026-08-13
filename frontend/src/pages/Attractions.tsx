import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Compass, Camera, Navigation, Phone, ExternalLink, 
  Sparkles, X, ChevronRight, CheckCircle2, Clock, Car, Sun
} from 'lucide-react';

export interface TouristPlace {
  id: string;
  name: string;
  hindiName: string;
  category: 'waterfall' | 'fort' | 'temple' | 'nature';
  categoryLabel: string;
  distanceFromHotel: string;
  travelTime: string;
  bestTime: string;
  image: string;
  galleryImages: string[];
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  googleMapsUrl: string;
}

export const touristPlaces: TouristPlace[] = [
  {
    id: 'lakhaniya-dari',
    name: 'Lakhaniya Dari Waterfall',
    hindiName: 'लखनिया दरी झरना',
    category: 'waterfall',
    categoryLabel: 'Waterfall & Nature Trek',
    distanceFromHotel: '18 km from Gona Hotel',
    travelTime: '25 mins drive',
    bestTime: 'Monsoon & Winter (July to March)',
    image: '/assets/tourist/lakhaniya-dari.jpg',
    galleryImages: [
      '/assets/tourist/lakhaniya-dari.jpg',
      '/assets/tourist/wyndham-falls.jpg',
      '/assets/tourist/siddhanath-dari.jpg'
    ],
    shortDesc: 'A breathtaking 150-meter roaring waterfall surrounded by rocky cliffs, lush jungle gorges, natural stream pools, and prehistoric cave rock paintings.',
    fullDesc: 'Lakhaniya Dari is one of the most famous and spectacular natural waterfalls in the Vindhya region near Ahraura and Rajgarh. Tucked inside dense forest reserves, the waterfall drops down 150 meters into a cool turquoise river pool. Visitors can enjoy nature walking trails, stream bathing, and witness ancient prehistoric rock paintings carved into surrounding sandstone caves.',
    highlights: [
      '150-meter majestic cascading waterfall pool',
      'Prehistoric cave rock paintings & archaeological sites',
      'Popular for eco-trekking & stream bathing',
      'Just 25 mins drive from Gona Hotel & Resort'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Lakhaniya+Dari+Waterfall+Mirzapur'
  },
  {
    id: 'chunar-fort',
    name: 'Historic Chunar Fort',
    hindiName: 'चुनार का ऐतिहासिक किला',
    category: 'fort',
    categoryLabel: 'Historic Heritage Fort',
    distanceFromHotel: '28 km from Gona Hotel',
    travelTime: '35 mins drive',
    bestTime: 'All Year Round (October to March best)',
    image: '/assets/tourist/chunar-fort.jpg',
    galleryImages: [
      '/assets/tourist/chunar-fort.jpg',
      '/assets/hotel-exterior.jpg',
      '/assets/gona-venture-signpost.jpg'
    ],
    shortDesc: 'Iconic ancient fortress perched high on a cliff overlooking the calm Ganges River. Features King Bhartihari Samadhi, Sonwa Mandap, and massive sandstone ramparts.',
    fullDesc: 'Chunar Fort is an ancient Indian fortress steeped in legendary history dating back to King Vikramaditya, Sher Shah Suri, the Mughal Empire, and the British Era. Situated majestically on a high rocky promontory overlooking a dramatic bend in the holy River Ganges, the fort offers rich historical monuments including the underground Sonwa Mandap, Bhartihari Samadhi, deep well structures, and breathtaking river views.',
    highlights: [
      'Commanding panoramic views over holy River Ganges',
      'Sonwa Mandap & King Bhartihari underground Samadhi',
      'Massive 16th-century stone ramparts & cannon posts',
      'Easily accessible via Chunar Road from Gona Hotel'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Chunar+Fort+Mirzapur'
  },
  {
    id: 'vindhyachal-dham',
    name: 'Vindhyachal Dham & Maa Vindhyavasini Temple',
    hindiName: 'विन्ध्याचल माता मंदिर',
    category: 'temple',
    categoryLabel: 'Sacred Shaktipeeth Pilgrimage',
    distanceFromHotel: '38 km from Gona Hotel',
    travelTime: '45 mins drive',
    bestTime: 'All Year Round (Grand Navratri Mela)',
    image: '/assets/tourist/vindhyachal-dham.jpg',
    galleryImages: [
      '/assets/tourist/vindhyachal-dham.jpg',
      '/assets/tourist/chunar-fort.jpg'
    ],
    shortDesc: 'One of India\'s most revered holy Shaktipeeth temples situated on the holy banks of River Ganga, featuring Ashtabhuja Temple & Kali Khoh cave shrine.',
    fullDesc: 'Vindhyachal Dham is a premier Hindu pilgrimage destination dedicated to Goddess Durga (Maa Vindhyavasini). Unlike many other Shaktipeeths situated on mountains, Maa Vindhyavasini resides right on the banks of River Ganga. Pilgrims perform the sacred "Trikona Parikrama" covering Maa Vindhyavasini Temple, Ashtabhuja Devi Temple atop the hill, and Kali Khoh cave temple.',
    highlights: [
      'Sacred Shaktipeeth on the holy banks of River Ganga',
      'Complete Trikona Parikrama circuit (Vindhyavasini, Ashtabhuja, Kali Khoh)',
      'Holy Ganges Ghats for holy dip & evening Aarti',
      'Direct highway drive from Gona Hotel'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Vindhyavasini+Devi+Temple+Vindhyachal'
  },
  {
    id: 'wyndham-falls',
    name: 'Wyndham Falls',
    hindiName: 'विंडम फॉल्स झरना',
    category: 'waterfall',
    categoryLabel: 'Picturesque Waterfall & Park',
    distanceFromHotel: '30 km from Gona Hotel',
    travelTime: '35 mins drive',
    bestTime: 'August to February',
    image: '/assets/tourist/wyndham-falls.jpg',
    galleryImages: [
      '/assets/tourist/wyndham-falls.jpg',
      '/assets/tourist/lakhaniya-dari.jpg'
    ],
    shortDesc: 'A picturesque multi-tiered waterfall cascading over smooth Vindhya rocks, featuring a scenic nature park, small zoo, and surrounding hill viewpoints.',
    fullDesc: 'Named after a British Collector, Wyndham Falls is a enchanting natural waterfall where water cascades smoothly over layered rock formations. Surrounded by green Vindhya hillocks, the area has been developed with a children\'s nature park, manicured gardens, and scenic view points, making it an ideal half-day picnic spot for hotel guests.',
    highlights: [
      'Gentle multi-step rock waterfall streams',
      'Family park and nature gardens',
      'Scenic Vindhya mountain valley background',
      'Convenient parking and picnic spots'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Wyndham+Falls+Mirzapur'
  },
  {
    id: 'sirsi-dam',
    name: 'Sirsi Dam & Water Reservoir',
    hindiName: 'सिरसी बाँध एवं झील',
    category: 'nature',
    categoryLabel: 'Reservoir Lake & Scenic Dam',
    distanceFromHotel: '22 km from Gona Hotel',
    travelTime: '30 mins drive',
    bestTime: 'July to March',
    image: '/assets/tourist/sirsi-dam.jpg',
    galleryImages: [
      '/assets/tourist/sirsi-dam.jpg',
      '/assets/tourist/siddhanath-dari.jpg'
    ],
    shortDesc: 'A vast blue water reservoir dam surrounded by rolling green hills, offering serene waterside vistas, sunset views, and seasonal water spillways.',
    fullDesc: 'Sirsi Dam is a major water reservoir built across the Sirsi river near Rajgarh. The sprawling lake is enclosed by lush green hills, creating a tranquil waterscape. During monsoon and post-monsoon months, the dam spillways release roaring sheets of water, attracting photographers and nature lovers.',
    highlights: [
      'Vast tranquil reservoir lake with hill backdrop',
      'Spectacular water spillway during monsoon season',
      'Peaceful sunset viewpoint & photography destination',
      'Just 22 km south of Gona Hotel'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Sirsi+Dam+Rajgarh+Mirzapur'
  },
  {
    id: 'siddhanath-dari',
    name: 'Siddhanath Ki Dari Waterfall',
    hindiName: 'सिद्धनाथ दरी झरना',
    category: 'waterfall',
    categoryLabel: 'Forest Waterfall & Trekking',
    distanceFromHotel: '24 km from Gona Hotel',
    travelTime: '30 mins drive',
    bestTime: 'Monsoon & Winter',
    image: '/assets/tourist/siddhanath-dari.jpg',
    galleryImages: [
      '/assets/tourist/siddhanath-dari.jpg',
      '/assets/tourist/lakhaniya-dari.jpg'
    ],
    shortDesc: 'A pristine forest waterfall nestled near Saktesgarh and Chunar, popular for cool stream pools, forest trekking, and peaceful natural surroundings.',
    fullDesc: 'Siddhanath Ki Dari is a pristine natural waterfall hidden within rocky forest terrain near Saktesgarh. The stream cascades over rocky ledges into crystal clear natural pools. It is a favorite spot for visitors seeking offbeat nature trails away from city crowds.',
    highlights: [
      'Pristine uncrowded natural forest waterfall',
      'Cool stream pools surrounded by greenery',
      'Great for nature walks & adventure photography',
      '30 mins scenic drive from Gona Hotel'
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/Siddhanath+Ki+Dari+Mirzapur'
  }
];

export const Attractions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);

  const filteredPlaces = selectedCategory === 'all' 
    ? touristPlaces 
    : touristPlaces.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-luxury-obsidian pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-luxury-gold/20 text-[#0D3B29] text-xs font-bold uppercase tracking-widest border border-luxury-gold/40 inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-luxury-gold" /> Explore Mirzapur & Chunar
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D3B29]">
            Nearby Tourist Attractions
          </h1>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Discover majestic waterfalls, historic Ganga fortresses, and sacred Shaktipeeth temples conveniently located just a short drive from <strong>Gona Hotel & Resort</strong>.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-[#0D3B29] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🌟 All Tourist Places ({touristPlaces.length})
          </button>
          <button
            onClick={() => setSelectedCategory('waterfall')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedCategory === 'waterfall'
                ? 'bg-[#0D3B29] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🌊 Waterfalls & Nature
          </button>
          <button
            onClick={() => setSelectedCategory('fort')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedCategory === 'fort'
                ? 'bg-[#0D3B29] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🏰 Historic Ganga Forts
          </button>
          <button
            onClick={() => setSelectedCategory('temple')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedCategory === 'temple'
                ? 'bg-[#0D3B29] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🛕 Spiritual Shaktipeeth
          </button>
        </div>

        {/* Tourist Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container - Sleek 16:10 aspect ratio */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-[#0D3B29]/90 text-luxury-gold text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-luxury-gold/30 shadow-md flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-luxury-gold" /> {place.distanceFromHotel}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-luxury-gold text-[#0D3B29] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {place.categoryLabel}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#0D3B29]">{place.name}</h3>
                  <span className="text-[11px] text-luxury-gold font-bold block">{place.hindiName}</span>
                  <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-2">
                    {place.shortDesc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Car className="w-3.5 h-3.5 text-[#0D3B29]" /> Drive Time:
                    </span>
                    <span className="font-bold text-[#0D3B29]">{place.travelTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Sun className="w-3.5 h-3.5 text-luxury-gold" /> Best Season:
                    </span>
                    <span className="font-medium text-gray-800 text-[11px]">{place.bestTime}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setSelectedPlace(place)}
                    className="flex-1 py-3 rounded-xl bg-[#0D3B29] hover:bg-[#134A35] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Camera className="w-4 h-4 text-luxury-gold" /> View Photos & Details
                  </button>
                  <a
                    href={place.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold text-[#0D3B29] font-bold text-xs flex items-center justify-center transition-colors shadow-sm"
                    title="Open Route Directions on Google Maps"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Concierge Cab & Travel Desk Banner */}
        <div className="p-8 rounded-3xl bg-[#0D3B29] text-white border border-luxury-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3.5 py-1 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs uppercase tracking-widest">
              Gona Hotel Concierge Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
              Need a Private Cab or Sightseeing Guide?
            </h3>
            <p className="text-xs text-gray-300 max-w-xl font-light">
              We arrange comfortable private AC taxis, local drivers, and sightseeing packages for all nearby waterfalls, Chunar Fort, and Vindhyachal Dham straight from Gona Hotel lobby.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+919696631621"
              className="px-6 py-3.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" /> Call: +91 96966 31621
            </a>
            <a
              href="tel:+917905079819"
              className="px-6 py-3.5 rounded-full bg-white/10 text-white border border-luxury-gold/40 font-bold text-xs hover:bg-luxury-gold hover:text-[#0D3B29] transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-luxury-gold" /> +91 79050 79819
            </a>
          </div>
        </div>

      </div>

      {/* Place Details Modal with Gallery */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-4xl bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden my-6 border border-luxury-gold max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#0D3B29] text-white flex items-center justify-between shrink-0 border-b border-luxury-gold/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold text-[#0D3B29] font-bold text-[10px] uppercase tracking-wider">
                    {selectedPlace.categoryLabel}
                  </span>
                  <span className="text-xs text-luxury-gold font-bold">{selectedPlace.distanceFromHotel}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient mt-1">
                  {selectedPlace.name} <span className="text-sm font-sans font-normal opacity-80">({selectedPlace.hindiName})</span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Photo Gallery Grid */}
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-[#0D3B29] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-luxury-gold" /> Real Photo Gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedPlace.galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-black">
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Overview */}
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-[#0D3B29]">Overview & History</h4>
                <p className="text-sm text-gray-700 leading-relaxed font-light">
                  {selectedPlace.fullDesc}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
                <h4 className="font-serif text-base font-bold text-[#0D3B29]">Key Highlights & Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-800">
                  {selectedPlace.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-100 text-xs">
                <div>
                  <span className="font-bold text-gray-500 uppercase block mb-0.5">Distance from Hotel</span>
                  <p className="font-bold text-sm text-[#0D3B29]">{selectedPlace.distanceFromHotel}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase block mb-0.5">Approx Drive Time</span>
                  <p className="font-bold text-sm text-[#0D3B29]">{selectedPlace.travelTime}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase block mb-0.5">Best Visiting Months</span>
                  <p className="font-bold text-sm text-[#0D3B29]">{selectedPlace.bestTime}</p>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                📍 Location: Mirzapur District, Uttar Pradesh
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={selectedPlace.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#0D3B29] text-white font-bold text-xs hover:bg-[#134A35] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Navigation className="w-4 h-4 text-luxury-gold" /> Get Driving Directions
                </a>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
