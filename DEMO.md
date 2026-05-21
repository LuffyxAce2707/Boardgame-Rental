# Demo quick start

## 1. Environment

```bash
cd backend
npm run check-env
```

Required in `backend/.env`: `MONGO_URI`, `JWT_SECRET`.

## 2. Seed demo data

```bash
cd backend
npm run seed-demo
```

Accounts:

- **admin@demo.com** / `demo1234` (admin)
- **customer@demo.com** / `demo1234` (customer)

Seeds 4 sample boardgames if the database is empty.

## 3. Run app

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Wait for `MongoDB Connected` in the backend console.

## 4. Demo script (~10 min)

1. Login as **admin@demo.com** → `/admin` (stats, add game, rentals table)
2. Logout → login as **customer@demo.com**
3. **Home** → open a game → **Rent Now**
4. **Rentals** (navbar) → `/rentals/history` → **Return Game**
5. Login as admin again → confirm rental appears in dashboard

## Promote any user to admin

```bash
npm run promote-admin -- your@email.com
```

## Verify API flow (optional)

With backend running:

```bash
cd backend
npm run rehearse-demo
```
