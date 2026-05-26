# AI Assessment Creator

Production-ready monorepo for an AI-powered assessment generation platform.

## Structure

- `client/` - Next.js 14 App Router frontend
- `server/` - Express + TypeScript API, queues, workers, sockets
- `docker-compose.yml` - MongoDB and Redis

## Setup

1. Copy environment files from `client/.env.example` and `server/.env.example`.
2. Start infrastructure:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Run both apps:

```bash
npm run dev
```

## Scripts

- `npm run dev` - starts client and server
- `npm run build` - builds both workspaces
- `npm run lint` - lints both workspaces
- `npm run typecheck` - type checks both workspaces

## Notes

- The backend exposes REST APIs, BullMQ workers, Redis-backed queues, and Socket.io events.
- The frontend uses Zustand for app state, real-time generation updates, and premium responsive UI inspired by the supplied screens.