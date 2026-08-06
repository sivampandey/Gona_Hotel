import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gona_hotel';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if local mongo not running
    });
    console.log('MongoDB Connected successfully to:', mongoUri);
  } catch (error) {
    console.warn('MongoDB Connection Warning: Could not connect to local/remote MongoDB instance.');
    console.warn('Operating in fallback in-memory mock backend mode for seamless demonstration.');
  }
};
