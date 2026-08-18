import bcrypt from 'bcryptjs';

const initialAdminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeAdminPass123!';

export const initialSeedData = {
  users: [
    {
      id: 'usr_admin',
      name: 'Mithlesh Singh',
      email: 'admin@gonahotel.com',
      passwordHash: bcrypt.hashSync(initialAdminPassword, 10),
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
    // ══════ BREAKFAST ══════
    { id: 'item_aloo_paratha',   name: 'Aloo Paratha',         category: 'Breakfast',           price: 40,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.9,  popular: true,  description: 'Stuffed potato whole wheat paratha cooked on tava with fresh butter.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_paratha', name: 'Paneer Paratha',       category: 'Breakfast',           price: 60,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.95, popular: true,  description: 'Fresh cottage cheese stuffed paratha with Indian herbs.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_gobhi_paratha',  name: 'Gobhi Paratha',        category: 'Breakfast',           price: 60,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.8,  popular: false, description: 'Freshly grated cauliflower seasoned paratha roasted on hot tava.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_pyaz_paratha',   name: 'Pyaz Paratha',        category: 'Breakfast',           price: 40,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.85, popular: false, description: 'Spiced chopped onion filled crispy whole wheat paratha.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_plain_roti',     name: 'Plain Roti',           category: 'Breakfast',           price: 10,  isVeg: true, isAvailable: true, prepTimeMinutes: 5,  rating: 4.9,  popular: false, description: 'Fresh tandoori wheat roti baked in clay oven.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_butter_roti',    name: 'Butter Roti',          category: 'Breakfast',           price: 15,  isVeg: true, isAvailable: true, prepTimeMinutes: 5,  rating: 4.92, popular: true,  description: 'Tandoori wheat roti brushed with fresh white butter.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },

    // ══════ INDIAN MAIN COURSE ══════
    { id: 'item_p_butter',       name: 'Paneer Butter Masala', category: 'Indian Main Course',  price: 200, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.98, popular: true,  description: 'Rich tomato butter cashew gravy with soft cottage cheese cubes.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_matar_paneer',   name: 'Matar Paneer',         category: 'Indian Main Course',  price: 180, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.9,  popular: true,  description: 'Fresh cottage cheese and sweet green peas in spiced onion tomato curry.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_kadhai_paneer',  name: 'Kadhai Paneer',        category: 'Indian Main Course',  price: 200, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.94, popular: true,  description: 'Paneer tossed with capsicum, onions and freshly ground kadhai masala.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_shahi_paneer',   name: 'Shahi Paneer',         category: 'Indian Main Course',  price: 220, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.96, popular: true,  description: 'Royal creamy Mughlai paneer curry cooked with saffron and almonds.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_aloo_jeera',     name: 'Aloo Jeera',           category: 'Indian Main Course',  price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.8,  popular: false, description: 'Golden potatoes dry fried with roasted cumin seeds and coriander.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_mix_veg',        name: 'Mix Veg',              category: 'Indian Main Course',  price: 180, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.88, popular: true,  description: 'Assorted seasonal garden vegetables in North Indian spiced curry.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_dal_fry',        name: 'Dal Fry',              category: 'Indian Main Course',  price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.89, popular: true,  description: 'Yellow arhar dal tempered with garlic, tomatoes and green chillies.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_dal_tadka',      name: 'Dal Tadka',            category: 'Indian Main Course',  price: 120, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.93, popular: true,  description: 'Creamy yellow dal with aromatic red chili and desi ghee flame tadka.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },

    // ══════ RICE & BIRYANI ══════
    { id: 'item_plain_rice',     name: 'Plain Rice',           category: 'Rice & Biryani',      price: 70,  isVeg: true, isAvailable: true, prepTimeMinutes: 10, rating: 4.8,  popular: false, description: 'Fluffy long grain steamed Basmati rice.', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_jeera_rice',     name: 'Jeera Rice',           category: 'Rice & Biryani',      price: 90,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.9,  popular: true,  description: 'Fragrant Basmati rice tempered with ghee and cumin seeds.', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_veg_biryani',    name: 'Veg Biryani',          category: 'Rice & Biryani',      price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.94, popular: true,  description: 'Layered Basmati rice cooked dum-style with vegetables and whole spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_biryani', name: 'Paneer Biryani',       category: 'Rice & Biryani',      price: 120, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.96, popular: true,  description: 'Rich dum biryani loaded with marinated cottage cheese cubes.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },

    // ══════ CHINESE ══════
    { id: 'item_veg_chowmein',   name: 'Veg Chowmein',         category: 'Chinese',             price: 80,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.9,  popular: true,  description: 'Wok-tossed noodles with shredded vegetables and garlic soy sauce.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_chowmein',name: 'Paneer Chowmein',     category: 'Chinese',             price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.92, popular: true,  description: 'Hakka noodles tossed with fried paneer strips and spring onions.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_veg_manchurian', name: 'Veg Manchurian',      category: 'Chinese',             price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.91, popular: true,  description: 'Crispy veggie balls in spicy dark garlic sauce.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_chilli',  name: 'Paneer Chilli',        category: 'Chinese',             price: 180, isVeg: true, isAvailable: true, prepTimeMinutes: 20, rating: 4.97, popular: true,  description: 'Crispy fried cottage cheese in spicy Indo-Chinese chili garlic sauce.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_fried_rice',name:'Paneer Fried Rice',  category: 'Chinese',             price: 140, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.89, popular: false, description: 'Indo-Chinese wok tossed fried rice with spiced paneer.', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' },

    // ══════ SOUTH INDIAN ══════
    { id: 'item_paper_dosa',     name: 'Paper Dosa',           category: 'South Indian',        price: 60,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.88, popular: false, description: 'Paper thin crispy South Indian crepe with sambar and coconut chutney.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_masala_dosa',    name: 'Masala Dosa',          category: 'South Indian',        price: 80,  isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.95, popular: true,  description: 'Golden crisp rice dosa filled with flavorful spiced potato masala.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_dosa',    name: 'Paneer Dosa',          category: 'South Indian',        price: 160, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.93, popular: true,  description: 'Crispy dosa stuffed with grated paneer and South Indian spices.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },

    // ══════ SNACKS & THALI ══════
    { id: 'item_chole_bhature',  name: 'Chole Bhature',        category: 'Snacks & Thali',      price: 100, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.96, popular: true,  description: '2 Fluffy deep-fried bhaturas with authentic spicy Punjabi chole.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_paneer_pakoda',  name: 'Paneer Pakoda',        category: 'Snacks & Thali',      price: 140, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.91, popular: true,  description: 'Deep fried crispy paneer fritters served with green mint chutney.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_sada_thali',     name: 'Sada Thali Bhojan',    category: 'Snacks & Thali',      price: 150, isVeg: true, isAvailable: true, prepTimeMinutes: 15, rating: 4.99, popular: true,  description: 'Complete Indian Thali: 4 Rotis, Rice, Dal, Sabzi, Pickle and Salad.', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80' },

    // ══════ SALAD & CRISPY ══════
    { id: 'item_green_salad',    name: 'Green Salad',          category: 'Salad & Crispy',      price: 60,  isVeg: true, isAvailable: true, prepTimeMinutes: 5,  rating: 4.8,  popular: false, description: 'Fresh sliced cucumbers, tomatoes, onions and lemon.', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80' },

    // ══════ BEVERAGES ══════
    { id: 'item_tea',            name: 'Special Chai',         category: 'Beverages',           price: 20,  isVeg: true, isAvailable: true, prepTimeMinutes: 5,  rating: 4.9,  popular: true,  description: 'Hot aromatic ginger cardamom milk tea.', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_coffee',         name: 'Hot Coffee',          category: 'Beverages',           price: 35,  isVeg: true, isAvailable: true, prepTimeMinutes: 5,  rating: 4.88, popular: true,  description: 'Frothy hot milk espresso coffee.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { id: 'item_water',          name: 'Mineral Water Bottle (1L)', category: 'Beverages',    price: 20,  isVeg: true, isAvailable: true, prepTimeMinutes: 1,  rating: 4.95, popular: false, description: '1 Litre chilled purified packaged mineral drinking water.', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80' }
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
