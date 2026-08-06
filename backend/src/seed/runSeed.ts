import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import User from '../models/User';
import Room from '../models/Room';
import MenuItem from '../models/MenuItem';
import Review from '../models/Review';
import Coupon from '../models/Coupon';

// Fix Node.js DNS SRV resolution error on Windows for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if custom DNS server override is restricted
}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Vrc-admin:Shivam9454@cluster0.slnhlei.mongodb.net/gona_hotel?retryWrites=true&w=majority&appName=Cluster0';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully to MongoDB Atlas!');

    // Clear existing collection data
    console.log('Clearing old database records...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Inserting seed data into MongoDB Atlas...');

    // 1. Seed Users
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const guestPasswordHash = await bcrypt.hash('guest123', 10);

    const users = await User.insertMany([
      {
        id: 'usr_admin',
        name: 'Mithlesh Singh',
        email: 'admin@gonahotel.com',
        password: adminPasswordHash,
        phone: '+91 96966 31621',
        role: 'admin',
        avatar: '/assets/owner.png?v=2',
        wishlist: { rooms: ['room_2person_deluxe'], food: [] }
      },
      {
        id: 'usr_guest',
        name: 'Alexander Wright',
        email: 'guest@gonahotel.com',
        password: guestPasswordHash,
        phone: '+91 98765 12345',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        wishlist: { rooms: ['room_2person_deluxe'], food: ['item_p_butter'] }
      }
    ]);
    console.log(`✅ Seeded ${users.length} Users (Admin & Guest)`);

    // 2. Seed Rooms
    const rooms = await Room.insertMany([
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
    ]);
    console.log(`✅ Seeded ${rooms.length} Hotel Rooms`);

    // 3. Seed Restaurant Menu Items
    const menuItems = await MenuItem.insertMany([
      {
        id: 'item_aloo_paratha',
        name: 'Aloo Paratha',
        category: 'Breakfast',
        price: 40,
        description: 'Stuffed potato whole wheat paratha cooked on tava with fresh butter.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883c6696?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        prepTimeMinutes: 15,
        rating: 4.99,
        popular: true
      }
    ]);
    console.log(`✅ Seeded ${menuItems.length} Restaurant Menu Items`);

    // 4. Seed Reviews
    const reviews = await Review.insertMany([
      {
        id: 'rev_1',
        userName: 'Rajesh Kumar',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Gona Hotel is amazing! Staying in the Deluxe Room and tasting Paneer Butter Masala was a great experience.',
        entityType: 'hotel',
        isApproved: true
      }
    ]);
    console.log(`✅ Seeded ${reviews.length} Reviews`);

    // 5. Seed Coupons
    const coupons = await Coupon.insertMany([
      {
        id: 'c1',
        code: 'GONA20',
        discountPercentage: 20,
        maxDiscount: 1000,
        minSpend: 2000,
        validUntil: '2026-12-31',
        isActive: true
      },
      {
        id: 'c2',
        code: 'WELCOME10',
        discountPercentage: 10,
        maxDiscount: 500,
        minSpend: 500,
        validUntil: '2026-12-31',
        isActive: true
      }
    ]);
    console.log(`✅ Seeded ${coupons.length} Discount Coupons`);

    console.log('\n🎉 ALL GONA HOTEL DATA HAS BEEN POPULATED SUCCESSFULLY INTO MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB Atlas database:', error);
    process.exit(1);
  }
};

seedDatabase();
