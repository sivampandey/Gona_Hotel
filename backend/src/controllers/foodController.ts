import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import { initialSeedData } from '../seed/seedData';

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { category, isVeg, search } = req.query;

    let items = await MenuItem.find({});
    if (!items || items.length === 0) {
      items = initialSeedData.menuItems as any[];
    }

    let filtered = items.map(i => i.toObject ? i.toObject() : i);

    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === String(category).toLowerCase());
    }

    if (isVeg !== undefined && isVeg !== 'all') {
      const vegBool = isVeg === 'true';
      filtered = filtered.filter(item => item.isVeg === vegBool);
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    return res.json(filtered);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const itemId = 'item_' + Date.now();
    const newItem = await MenuItem.create({
      id: itemId,
      rating: 4.8,
      popular: false,
      isAvailable: true,
      ...req.body
    });
    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MenuItem.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    return res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
