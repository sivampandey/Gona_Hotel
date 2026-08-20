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
import { initialSeedData } from './seedData';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    if (!MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is required to run seed script.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully to MongoDB!');

    console.log('Clearing old database records...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Inserting seed data into MongoDB...');

    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeAdminPass123!';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const guestPasswordHash = await bcrypt.hash('GuestPass123!', 10);

    const users = await User.insertMany([
      {
        id: 'usr_admin',
        name: 'Mithlesh Singh',
        email: process.env.ADMIN_SEED_EMAIL || 'admin@gonahotel.com',
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
    console.log(`✅ Seeded ${users.length} Users`);

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
    const menuItems = await MenuItem.insertMany(initialSeedData.menuItems);
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

    console.log('\n🎉 ALL GONA HOTEL DATA HAS BEEN POPULATED SUCCESSFULLY INTO MONGODB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB database:', error);
    process.exit(1);
  }
};

seedDatabase();
