# DelhiDarbar — Restaurant Ordering

Premium dark/gold digital menu + kitchen dashboard.

## Project structure

```
restaurantorder/
├── frontend/     # Next.js app (UI + `/api/*` route handlers)
├── backend/      # Prisma schema, seed, and server libraries
├── package.json  # Root scripts — `npm run dev` starts the app
└── .env          # Shared environment config
```

Production is a **single Vercel project** (`dehlidarbardigitalmenu`) with one public URL — https://dehlidarbardigitalmenu.vercel.app. The API is served from the same Next.js deployment at `/api/*`.

## Quick start

```bash
npm install
cp .env.example .env   # if you don't already have .env at the repo root
npm run db:push
npm run db:seed
npm run dev
```

This starts the full app at http://localhost:3000 (customer menu, admin UI, and API).

## Demo

| Role | URL / credentials |
|------|-------------------|
| Customer menu (Table 12) | http://localhost:3000/r/DelhiDarbar/t/12 |
| Staff login | http://localhost:3000/admin/login |
| Admin | `admin@delhidarbar.com` / `password123` |

## Brand

- Restaurant: **DelhiDarbar** (slug `DelhiDarbar`)
- Theme: black background, gold accents, Playfair + DM Sans
- Currency: Rs.
