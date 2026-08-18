import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('MongoDB Connection Warning: MONGO_URI environment variable is not configured.');
      return;
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.warn('MongoDB Connection Error:', error);
  }
};
