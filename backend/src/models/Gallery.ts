import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  category: 'rooms' | 'restaurant' | 'food' | 'farm' | 'events' | 'videos';
  imageUrl: string;
  videoUrl?: string;
  caption?: string;
}

const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['rooms', 'restaurant', 'food', 'farm', 'events', 'videos'], 
    required: true 
  },
  imageUrl: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  caption: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IGalleryItem>('GalleryItem', GallerySchema);
