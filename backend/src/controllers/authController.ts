import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import { initialSeedData } from '../seed/seedData';

// In-memory data store for fallback/demo mode when MongoDB is not connected
export let memoryUsers = [...initialSeedData.users];

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check memoryUsers
    const existingMemoryUser = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingMemoryUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Check MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const existingDbUser = await User.findOne({ email: normalizedEmail });
      if (existingDbUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now();
    const avatar = req.body.avatar || '';

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      role: 'user' as const,
      avatar,
      wishlist: { rooms: [], food: [] }
    };

    memoryUsers.push(newUser);

    // Also persist to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await User.create({
          name: newUser.name,
          email: newUser.email,
          password: passwordHash,
          phone: newUser.phone,
          role: newUser.role,
          avatar: newUser.avatar,
          wishlist: newUser.wishlist
        });
      } catch (dbErr) {
        console.warn('Could not save user to MongoDB, kept in memoryUsers:', dbErr);
      }
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'gona_hotel_super_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
        wishlist: newUser.wishlist
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check memory users first
    let user = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    // If not in memory and DB is active, check DB
    if (!user && mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({ email: normalizedEmail });
      if (dbUser) {
        user = {
          id: (dbUser._id as any).toString(),
          name: dbUser.name,
          email: dbUser.email,
          passwordHash: dbUser.password || '',
          phone: dbUser.phone || '',
          role: dbUser.role as any,
          avatar: dbUser.avatar || '',
          wishlist: dbUser.wishlist || { rooms: [], food: [] }
        };
        memoryUsers.push(user);
      }
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'gona_hotel_super_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        wishlist: user.wishlist
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = memoryUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      wishlist: user.wishlist
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const toggleWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, type } = req.body; // type: 'rooms' | 'food'
    const user = memoryUsers.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const key = type === 'food' ? 'food' : 'rooms';
    const list: string[] = (user.wishlist as any)[key] || [];
    const exists = list.includes(itemId);

    if (exists) {
      (user.wishlist as any)[key] = list.filter((id: string) => id !== itemId);
    } else {
      (user.wishlist as any)[key] = [...list, itemId];
    }

    return res.json({
      message: exists ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
