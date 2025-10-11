# Server (Express + Gemini + MongoDB)

## Run locally
1. Install deps
```powershell
cd server; npm install
```
2. Configure env
```powershell
Copy-Item .env.example .env
# Edit .env to add GEMINI_API_KEY and MONGODB_URI
```
3. Start dev server
```powershell
npm run dev
```

Endpoints:
- POST /api/simulate
- POST /api/evaluate
