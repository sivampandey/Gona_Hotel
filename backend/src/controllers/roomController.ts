import { Request, Response } from 'express';
import { initialSeedData } from '../seed/seedData';

export let memoryRooms: any[] = [...initialSeedData.rooms];

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, maxGuests, search } = req.query;
    let filtered = [...memoryRooms];

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
    const room = memoryRooms.find(r => r.slug === identifier || r.id === identifier);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.json(room);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const newRoom = {
      id: 'room_' + Date.now(),
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 4.9,
      reviewCount: 1,
      blockedDates: [],
      isAvailable: true,
      ...req.body
    };
    memoryRooms.push(newRoom);
    return res.status(201).json(newRoom);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = memoryRooms.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ message: 'Room not found' });

    memoryRooms[index] = { ...memoryRooms[index], ...req.body };
    return res.json(memoryRooms[index]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const blockRoomDates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dates } = req.body; // array of 'YYYY-MM-DD'
    const room = memoryRooms.find(r => r.id === id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.blockedDates = Array.from(new Set([...room.blockedDates, ...(dates || [])]));
    return res.json({ message: 'Dates blocked successfully', room });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
