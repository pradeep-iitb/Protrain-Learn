# Setup & Run Guide (Windows)

This guide covers end-to-end setup for the AI Collections Agent Trainer.

## Prerequisites
- Node.js 18+ and npm installed (https://nodejs.org)
- MongoDB Atlas free tier account and connection string
- Google AI Studio API key (Gemini 1.5 Flash)

## 1) Install Dependencies
```powershell
# Backend
cd server; npm install; cd ..

# Frontend
cd client; npm install; cd ..
```

## 2) Configure Environment
```powershell
# Backend env
Copy-Item server/.env.example server/.env
# Edit server/.env and set GEMINI_API_KEY and MONGODB_URI
```
Required (server/.env):
```
GEMINI_API_KEY=your-google-ai-studio-key
MONGODB_URI=your-mongodb-atlas-uri
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```
Optional (client/.env):
```
VITE_API_BASE=http://localhost:5000
```

## 3) Run in Dev
```powershell
# Terminal 1
cd server; npm run dev

# Terminal 2
cd client; npm run dev
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## 4) Features to Try
- Choose a borrower persona
- Click Start and talk into the mic (Chrome/Edge recommended)
- Click Stop & Send to hear the borrower response (TTS)
- Click Evaluate to generate feedback (empathy/tone/compliance)

## 5) Deploy (Free Tier)
- Frontend → Vercel or Netlify
- Backend → Render free web service
- Database → MongoDB Atlas free tier

Set the same ENV vars in each platform’s dashboard.

## Troubleshooting
- CORS blocked → Ensure CLIENT_ORIGIN matches frontend URL
- Gemini 401 → Check API key and quotas
- Mongo connection fails → Whitelist IP in Atlas or allow from anywhere (dev)
