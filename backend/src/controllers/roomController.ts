import { Request, Response } from 'express';
import Room from '../models/Room';
import { initialSeedData } from '../seed/seedData';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, maxGuests, search } = req.query;

    let rooms = await Room.find({});
    if (!rooms || rooms.length === 0) {
      rooms = initialSeedData.rooms as any[];
    }

    let filtered = rooms.map(r => r.toObject ? r.toObject() : r);

    if (category && category !== 'all') {
      filtered = filtered.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
    }

    if (minPrice) {
      filtered = filtered.filter(r => r.pricePerNight >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(r => r.pricePerNight <= Number(maxPrice));
    }

    if (maxGuests) {
      filtered = filtered.filter(r => r.maxGuests >= Number(maxGuests));
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.amenities.some((a: string) => a.toLowerCase().includes(q))
      );
    }

    return res.json(filtered);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getRoomBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    let room = await Room.findOne({ $or: [{ slug: identifier }, { id: identifier }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }] });
    
    if (!room) {
      const fallback = initialSeedData.rooms.find(r => r.slug === identifier || r.id === identifier);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.json(room);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newRoom = await Room.create({
      slug,
      rating: 4.9,
      reviewCount: 1,
      blockedDates: [],
      isAvailable: true,
      ...req.body
    });
    return res.status(201).json(newRoom);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findOneAndUpdate(
      { $or: [{ id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    return res.json(room);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const blockRoomDates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dates } = req.body; // array of 'YYYY-MM-DD'
    const room = await Room.findOne({ $or: [{ id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.blockedDates = Array.from(new Set([...room.blockedDates, ...(dates || [])]));
    await room.save();
    return res.json({ message: 'Dates blocked successfully', room });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
