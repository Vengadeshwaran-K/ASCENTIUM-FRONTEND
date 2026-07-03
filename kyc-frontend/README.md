# KYC Frontend

React + Vite frontend for the role-based KYC workflow.

## API setup (fixes 404 in local dev)

This app calls backend routes like `/api/auth/login`, `/api/kyc/my`, etc.

Use one of these options:

1. **Recommended (Vite proxy)**  
   Keep `VITE_API_BASE_URL` empty and run backend on `http://localhost:8080`.  
   Vite proxies `/api/*` to backend.

2. **Direct backend URL**  
   Set `VITE_API_BASE_URL` to backend root URL (for example `http://localhost:8080`).  
   Do **not** append `/api` unless your backend is actually hosted under it.

## Environment variables

Copy `.env.example` to `.env` and adjust if needed.

## Run

```bash
npm install
npm run dev
```
