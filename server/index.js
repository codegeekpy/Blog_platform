import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Database connection
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing in .env file.');
    return;
  }
  if (uri.includes('<db_password>')) {
    console.warn('⚠️ Warning: MONGO_URI contains "<db_password>". Please replace it with your actual MongoDB Atlas password in server/.env.');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (uri.includes('<db_password>')) {
      console.error('👉 Replace <db_password> in server/.env with your database user password to connect.');
    } else {
      // Retry connection every 10 seconds for real network/DB drops
      setTimeout(connectDB, 10000);
    }
  }
};

connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blog Platform API is running',
    databaseConnected: mongoose.connection.readyState === 1,
  });
});

// Guard API routes if database is not connected
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    const isPlaceholder = process.env.MONGO_URI?.includes('<db_password>');
    return res.status(503).json({
      success: false,
      message: isPlaceholder
        ? 'Database not connected: Replace <db_password> in server/.env with your MongoDB Atlas password.'
        : 'Database is connecting or unavailable. Please check MongoDB status.',
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
