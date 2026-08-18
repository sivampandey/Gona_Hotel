import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ success: false, message: 'Name, email/phone number, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPhone = (phone || '').trim();
    const isEmailFormat = inputEmail.includes('@');
    
    // Extract phone digits if phone is passed
    const phoneDigits = (inputPhone || (isEmailFormat ? '' : inputEmail)).replace(/\D/g, '');
    const cleanPhone = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : inputPhone;

    let finalEmail = isEmailFormat ? inputEmail : '';
    if (!finalEmail && cleanPhone) {
      finalEmail = `${cleanPhone}@gonahotel.com`;
    }

    // Check duplicate by email
    if (finalEmail) {
      const existingEmailUser = await User.findOne({ email: finalEmail });
      if (existingEmailUser) {
        return res.status(400).json({ success: false, message: 'An account with this email or phone number already exists' });
      }
    }

    // Check duplicate by phone number
    if (cleanPhone && cleanPhone.length >= 10) {
      const existingPhoneUser = await User.findOne({ phone: new RegExp(cleanPhone) });
      if (existingPhoneUser) {
        return res.status(400).json({ success: false, message: 'An account with this phone number already exists' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = req.body.avatar || '';

    const newUser = await User.create({
      name: name.trim(),
      email: finalEmail,
      password: passwordHash,
      phone: cleanPhone || inputPhone,
      role: 'user',
      avatar,
      wishlist: { rooms: [], food: [] }
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing' });
    }
    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id.toString(),
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
    const { email, password, phone, identifier } = req.body;
    const loginInput = (identifier || email || phone || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({ success: false, message: 'Email or phone number and password are required' });
    }

    const digits = loginInput.replace(/\D/g, '');

    // Search user by email OR phone number in MongoDB
    const searchConditions: any[] = [
      { email: loginInput.toLowerCase() },
      { phone: loginInput }
    ];

    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      searchConditions.push({ phone: new RegExp(last10) });
      searchConditions.push({ email: `${last10}@gonahotel.com` });
    }

    const user = await User.findOne({ $or: searchConditions });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email/phone number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email/phone number or password' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing' });
    }
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
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
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user._id.toString(),
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
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { itemId, type } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const key = type === 'food' ? 'food' : 'rooms';
    const list: string[] = (user.wishlist as any)[key] || [];
    const exists = list.includes(itemId);

    if (exists) {
      (user.wishlist as any)[key] = list.filter((id: string) => id !== itemId);
    } else {
      (user.wishlist as any)[key] = [...list, itemId];
    }

    await user.save();

    return res.json({
      message: exists ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
