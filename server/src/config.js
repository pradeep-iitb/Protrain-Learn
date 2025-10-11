/**
 * Server Configuration
 * Centralized configuration for backend settings
 * Change these when deploying to production
 */

import dotenv from 'dotenv';
dotenv.config();

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// API Keys
export const API_KEYS = {
  GEMINI: process.env.GEMINI_API_KEY,
};

// Database Configuration
export const DATABASE_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
};

// CORS Configuration
// Development: http://localhost:5173
// Production: https://your-frontend.vercel.app
export const CORS_CONFIG = {
  ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  CREDENTIALS: true,
};

// API Configuration
export const API_CONFIG = {
  BASE_PATH: '/api',
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
};

// Gemini AI Configuration
export const GEMINI_CONFIG = {
  MODEL: 'gemini-2.0-flash-exp',
  GENERATION_CONFIG: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  },
};

// Export all configs
export default {
  SERVER_CONFIG,
  API_KEYS,
  DATABASE_CONFIG,
  CORS_CONFIG,
  API_CONFIG,
  GEMINI_CONFIG,
};
