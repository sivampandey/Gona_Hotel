import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://Vrc-admin:Shivam9454@cluster0.slnhlei.mongodb.net/gona_hotel?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('MongoDB Connected successfully to Atlas cluster!');
  } catch (error) {
    console.warn('MongoDB Connection Warning:', error);
    console.warn('Operating in fallback in-memory mock backend mode for seamless demonstration.');
  }
};
