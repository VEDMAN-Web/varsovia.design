# Varsovia Design — Backend API

Express + MongoDB REST API for the Varsovia Design marketing site. Default port: **5000**.

## Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)
- npm

## Environment

Copy `.env.example` to `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/varsovia
PORT=5000
CLIENT_URL=http://localhost:3000
ADMIN_KEY=<generate-with-node-crypto>
```

Generate a strong admin key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Production:** set `CLIENT_URL` to your live frontend origin(s), comma-separated.

## Development

```bash
npm install
npm run dev
```

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

On first boot with an empty database, the API auto-seeds content.

## Database seeding

| Command | When to use |
|---------|-------------|
| Auto-seed on boot | Empty database — runs automatically |
| `npm run seed` | Reset everything — wipes collections and re-seeds |

## Production

```bash
npm start
```

Use PM2, systemd, Railway, or Render for process management.

## Features

- Public API for homepage, products, projects, blog, team, FAQ, and contact
- Admin authentication via `x-admin-key` header
- Rate limiting and request validation
- MongoDB models with seed data

## Deployment checklist

- [ ] `CLIENT_URL` includes production frontend origin
- [ ] `ADMIN_KEY` rotated from example value
- [ ] MongoDB Atlas network access configured
- [ ] HTTPS enabled
- [ ] `.env` not committed