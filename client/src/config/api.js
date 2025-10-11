/**
 * API Configuration
 * Centralized configuration for API endpoints
 * Change these URLs when deploying to production
 */

// Backend API Base URL
// Development: http://localhost:5000
// Production: https://your-backend.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  SIMULATE: `${API_BASE_URL}/api/simulate`,
  EVALUATE: `${API_BASE_URL}/api/evaluate`,
  PROGRESS: `${API_BASE_URL}/api/progress`,
  GENERATE_FEEDBACK: `${API_BASE_URL}/api/generate-feedback`,
};

// Frontend Base URL (for redirects, etc.)
export const FRONTEND_URL = window.location.origin;

// Export for easy access
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  FRONTEND_URL,
};
