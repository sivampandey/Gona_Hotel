import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendPasswordResetEmail } from '../utils/emailService';

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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const genericSuccessMsg = 'If an account exists with this email, a password reset link has been sent.';

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Do NOT reveal account existence (Prevents account enumeration)
      return res.status(200).json({
        success: true,
        message: genericSuccessMsg
      });
    }

    // Generate cryptographically secure random reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    // Token expires in 30 minutes
    const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpiresAt = resetTokenExpiresAt;
    user.resetTokenUsedAt = undefined;
    await user.save();

    // Dispatch email
    const emailSent = await sendPasswordResetEmail(user.email, rawResetToken);
    if (!emailSent) {
      console.warn(`[SECURITY WARN] Password reset requested for ${user.email}, but email dispatch was disabled or failed.`);
    }

    return res.status(200).json({
      success: true,
      message: genericSuccessMsg
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing password reset token'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const receivedTokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const user = await User.findOne({
      resetTokenHash: receivedTokenHash
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.'
      });
    }

    // Check expiration
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link has expired. Please request a new one.'
      });
    }

    // Check single-use
    if (user.resetTokenUsedAt) {
      return res.status(400).json({
        success: false,
        message: 'This password reset token has already been used.'
      });
    }

    // Hash new password using bcrypt
    const newPasswordHash = await bcrypt.hash(password, 10);

    user.password = newPasswordHash;
    user.resetTokenUsedAt = new Date();
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. Please sign in with your new password.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.'
    });
  }
};

