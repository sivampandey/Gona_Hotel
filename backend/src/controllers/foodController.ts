import { Request, Response } from 'express';
import { initialSeedData } from '../seed/seedData';

export let memoryMenuItems = [...initialSeedData.menuItems];

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { category, isVeg, search } = req.query;
    let filtered = [...memoryMenuItems];

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
    const newItem = {
      id: 'item_' + Date.now(),
      rating: 4.8,
      popular: false,
      isAvailable: true,
      ...req.body
    };
    memoryMenuItems.push(newItem);
    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = memoryMenuItems.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Menu item not found' });

    memoryMenuItems[index] = { ...memoryMenuItems[index], ...req.body };
    return res.json(memoryMenuItems[index]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryMenuItems = memoryMenuItems.filter(i => i.id !== id);
    return res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
