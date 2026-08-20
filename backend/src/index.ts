import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/apiRoutes';

dotenv.config();

// JWT_SECRET Verification on Backend Startup
if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing in deployment environment.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Production-Safe CORS Allowed Origins Configuration
const defaultAllowedOrigins = [
  'https://gona-hotel.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

const envOrigins = [
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
].map(o => o.trim()).filter(o => o !== '*' && o.length > 0);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin server requests
    if (!origin) return callback(null, true);

    // Check allowlist & trusted domains
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    // Strict rejection for unauthorized origins in production
    return callback(new Error(`CORS Policy: Origin '${origin}' is not allowed by Gona Hotel API security rules.`));
  },
  credentials: true
}));

// Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

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

// Global Production Error Handling Middleware (Hides stack traces in production)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]:', err.message || err);
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
  
  res.status(statusCode).json({
    message: isProd ? 'An unexpected server error occurred.' : (err.message || 'Internal Server Error'),
    ...(isProd ? {} : { stack: err.stack })
  });
});

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Gona Hotel Backend API listening on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
});
