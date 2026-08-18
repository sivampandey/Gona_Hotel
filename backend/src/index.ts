import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/apiRoutes';

dotenv.config();

// Requirement #29: Strict JWT_SECRET Verification on Backend Startup
if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing in deployment environment.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  'https://gona-hotel.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(o => o !== '*')
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Gona Hotel Luxury Backend API v1.0'
  });
});

// Register Main API Routes
app.use('/api', apiRoutes);

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Gona Hotel Backend API listening on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
});
