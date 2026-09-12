# IVAO ATC Position Booking

Simplified ATC position booking system (IVAO web entry exercise).

- **Backend**: NestJS + Prisma + SQLite
- **Frontend**: React (CRA) + TypeScript

## Run with Docker

```bash
docker compose up --build
```

Open **http://localhost:3000**, the only port exposed. The backend runs internally on `3333` (not exposed), nginx proxies `/bookings*` to it. Data persists in a Docker volume; use `docker compose down -v` to reset it.

## Manual setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate deploy
npm run start:dev        # http://localhost:3333
```

```bash
cd frontend
npm install
npm start                 # http://localhost:3000
```

## API

No authentication. Identified requests carry an `x-vid` header (IVAO VID) and optionally `x-rating` (defaults to `AS1`).

- `GET /bookings` - future bookings, sorted by position (public)
- `GET /bookings?date=YYYY-MM-DD` - bookings for a day, past included (public)
- `GET /bookings/current?position=XXX` - who currently holds a position (public)
- `POST /bookings` - create (requires `x-vid`)
- `PATCH /bookings/:id` - edit, owner only (requires `x-vid`)
- `DELETE /bookings/:id` - delete, owner only (requires `x-vid`)

## Booking rules

- A booking is "future" once `fromTime > now`; only future bookings can be edited/deleted.
- Create/edit is rejected (`409`) if the same position or the same VID already has an overlapping booking.
- Max 3 future bookings per VID.

## Frontend pages

- `/` - Day schedule (calendar view, public)
- `/future` - Future bookings table (public)
- `/my-bookings` - Book/edit/delete your own bookings (needs your VID)

## Data model

Single `Booking` table: `vid`, `rating`, `position`, `fromTime`, `toTime`, `type`, timestamps. No `User` table, the VID is just an identifier stamped on each booking.

## Tests

```bash
cd backend
npm run lint
npm test
npm run test:e2e
```
