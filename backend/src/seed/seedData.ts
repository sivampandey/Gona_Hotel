import bcrypt from 'bcryptjs';

export const initialSeedData = {
  users: [
    {
      id: 'usr_admin',
      name: 'Mithlesh Singh',
      email: 'admin@gonahotel.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      phone: '+91 96966 31621',
      role: 'admin',
      avatar: '/assets/owner.png?v=2',
      wishlist: { rooms: [] as string[], food: [] as string[] }
    }
  ],

  rooms: [
    {
      id: 'room_4person',
      title: 'Family Quad Room (4 Person)',
      slug: 'quad-family-room',
      category: 'Family Room',
      pricePerNight: 4000,
      maxGuests: 4,
      sizeSqFt: 400,
      bedType: '1 Double Bed + 4-Seater Dining',
      description: 'Spacious family room featuring a cozy double bed, 4-seater dining table & chairs, air conditioning, and elegant wooden wardrobe.',
      amenities: ['AC', 'Free WiFi', 'Smart TV', 'Dining Table & Chairs', 'Wooden Wardrobe', 'Room Service', 'Attached Bathroom'],
      images: ['/assets/room-4person.jpg?v=2'],
      isAvailable: true,
      blockedDates: [],
      rating: 4.95,
      reviewCount: 48
    },
    {
      id: 'room_3person',
      title: 'Triple Executive Room (3 Person)',
      slug: 'triple-executive-room',
      category: 'Executive Room',
      pricePerNight: 3500,
      maxGuests: 3,
      sizeSqFt: 350,
      bedType: '1 Super King Bed',
      description: 'Premium air-conditioned room featuring ambient false ceiling LED lighting, split AC, spacious wooden wardrobe, and tufted headboard bed.',
      amenities: ['Split AC', 'Free WiFi', 'Smart TV', 'Ceiling LED Lighting', 'Spacious Wardrobe', 'Room Service', 'Attached Bathroom'],
      images: ['/assets/room-3person.jpg?v=2'],
      isAvailable: true,
      blockedDates: [],
      rating: 4.92,
      reviewCount: 42
    },
    {
      id: 'room_2person_deluxe',
      title: 'Deluxe Double Room (2 Person)',
      slug: 'deluxe-double-room',
      category: 'Deluxe Room',
      pricePerNight: 2500,
      maxGuests: 2,
      sizeSqFt: 280,
      bedType: '1 King Bed',
      description: 'Modern deluxe double room equipped with wall-mounted Smart TV, marble coffee table with seating, AC, and attached bathroom.',
      amenities: ['AC', 'Free WiFi', 'Wall Mounted Smart TV', 'Marble Coffee Table', 'Attached Bathroom', 'Room Service'],
      images: ['/assets/room-2person-deluxe.jpg?v=2'],
      isAvailable: true,
      blockedDates: [],
      rating: 4.88,
      reviewCount: 36
    },
    {
      id: 'room_2person_standard',
      title: 'Standard Double Room (2 Person)',
      slug: 'standard-double-room',
      category: 'Standard Room',
      pricePerNight: 2000,
      maxGuests: 2,
      sizeSqFt: 240,
      bedType: '1 Double Bed',
      description: 'Clean and comfortable double room with rich teak wood flooring, wooden wardrobe, AC, and ceiling fan.',
      amenities: ['AC', 'Free WiFi', 'Wooden Wardrobe', 'Teak Wood Flooring', 'Room Service'],
      images: ['/assets/room-2person-standard.jpg?v=2'],
      isAvailable: true,
      blockedDates: [],
      rating: 4.84,
      reviewCount: 30
    },
    {
      id: 'room_1person',
      title: 'Single Deluxe Room (1 Person)',
      slug: 'single-deluxe-room',
      category: 'Single Room',
      pricePerNight: 1500,
      maxGuests: 1,
      sizeSqFt: 180,
      bedType: '1 Single / Double Bed',
      description: 'Ideal room for solo travelers featuring comfortable bedding, wooden closet, high-speed WiFi, AC, and peaceful privacy.',
      amenities: ['AC', 'Free WiFi', 'Wooden Closet', 'Attached Bathroom', 'Room Service'],
      images: ['/assets/room-1person.jpg?v=2'],
      isAvailable: true,
      blockedDates: [],
      rating: 4.80,
      reviewCount: 24
    }
  ],

  menuItems: [
    {
      id: 'item_aloo_paratha',
      name: 'Aloo Paratha',
      category: 'Breakfast',
      price: 40,
      description: 'Stuffed potato whole wheat paratha cooked on tava with fresh butter.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.9,
      popular: true
    },
    {
      id: 'item_paneer_paratha',
      name: 'Paneer Paratha',
      category: 'Breakfast',
      price: 60,
      description: 'Grate fresh cottage cheese stuffed whole wheat paratha.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.95,
      popular: true
    },
    {
      id: 'item_p_butter',
      name: 'Paneer Butter Masala',
      category: 'Indian Main Course',
      price: 200,
      description: 'Rich tomato, butter and cashew gravy with soft cottage cheese cubes.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 20,
      rating: 4.98,
      popular: true
    },
    {
      id: 'item_matar_paneer',
      name: 'Matar Paneer',
      category: 'Indian Main Course',
      price: 180,
      description: 'Cottage cheese and green peas in North Indian curry sauce.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 20,
      rating: 4.9,
      popular: true
    },
    {
      id: 'item_shahi_paneer',
      name: 'Shahi Paneer',
      category: 'Indian Main Course',
      price: 220,
      description: 'Royal creamy Mughlai paneer curry cooked with saffron and cream.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 20,
      rating: 4.96,
      popular: true
    },
    {
      id: 'item_dal_tadka',
      name: 'Dal Tadka',
      category: 'Indian Main Course',
      price: 120,
      description: 'Classic yellow dal finished with double ghee & red chili tadka.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.93,
      popular: true
    },
    {
      id: 'item_jeera_rice',
      name: 'Jeera Rice',
      category: 'Rice & Biryani',
      price: 90,
      description: 'Basmati rice tempered with ghee and aromatic cumin seeds.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.9,
      popular: true
    },
    {
      id: 'item_veg_biryani',
      name: 'Veg Biryani',
      category: 'Rice & Biryani',
      price: 100,
      description: 'Aromatic basmati rice cooked with fresh farm vegetables and whole spices.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 20,
      rating: 4.94,
      popular: true
    },
    {
      id: 'item_paneer_chilli',
      name: 'Paneer Chilli',
      category: 'Chinese',
      price: 180,
      description: 'Crispy cottage cheese cubes tossed with capsicum, onion and green chili sauce.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 20,
      rating: 4.97,
      popular: true
    },
    {
      id: 'item_masala_dosa',
      name: 'Masala Dosa',
      category: 'South Indian',
      price: 80,
      description: 'Crispy rice dosa stuffed with spiced potato masala served with sambar.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.95,
      popular: true
    },
    {
      id: 'item_chole_bhature',
      name: 'Chole Bhature',
      category: 'Snacks & Thali',
      price: 100,
      description: '2 Fluffy deep-fried bhaturas served with spicy Punjabi chole.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.96,
      popular: true
    },
    {
      id: 'item_sada_thali',
      name: 'Sada Thali Bhojan',
      category: 'Snacks & Thali',
      price: 150,
      description: 'Complete North Indian meal: 4 Rotis, Rice, Dal, Sabzi, Pickle & Salad.',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: 15,
      rating: 4.99,
      popular: true
    }
  ],

  gallery: [],

  reviews: [],

  coupons: [
    {
      id: 'c1',
      code: 'GONA20',
      discountPercentage: 20,
      maxDiscount: 1000,
      minSpend: 2000,
      validUntil: '2026-12-31',
      isActive: true
    }
  ]
};
