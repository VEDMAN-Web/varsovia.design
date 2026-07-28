# Varsovia Design — Frontend

Next.js 16 marketing site for Varsovia Design. Default port: **3000**.

## Prerequisites

- Node.js 20+
- npm
- Running backend API (see `backend` branch on this repo)

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set both variables at **build time**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm run start
```

## Media assets

Self-hosted images live in `public/`. To download placeholder assets:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/download-media.ps1
```

Replace files under `public/home/`, `public/team/`, etc. with brand photography when ready.

## Features

- Homepage with hero preloader, featured projects, catalogue, testimonials, and contact form
- Interior catalog, product detail, blog, team, showcase, and FAQ pages
- API integration with static fallbacks when the backend is unavailable
- SEO metadata, sitemap, robots.txt, and error pages
- Admin contact inbox at `/admin`

## Deployment checklist

- [ ] `npm run build` passes
- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] `NEXT_PUBLIC_SITE_URL` set to live domain
- [ ] `.env.local` not committed