# Telegram Mining Mini App

A Telegram mini app for mining and earning rewards with a complete admin panel.

## Project Structure

```
📦 of-telegram
├── 📂 app/                      # Next.js app directory
│   ├── 📂 admin/               # Admin panel pages
│   │   ├── layout.js           # Admin layout with navigation
│   │   ├── page.js            # Admin dashboard
│   │   ├── 📂 mining/         # Mining configuration
│   │   ├── 📂 referrals/      # Referral settings
│   │   ├── 📂 settings/       # Admin settings
│   │   ├── 📂 tasks/          # Tasks management
│   │   └── 📂 users/          # User management
│   │
│   ├── 📂 components/         # Shared components
│   │   ├── Preloader.js       # Initial loading screen
│   │   └── 📂 layout/         
│   │       └── BottomNav.js   # Bottom navigation bar
│   │
│   ├── 📂 intro/             # Introduction screen
│   ├── 📂 leaderboard/       # Leaderboard page
│   ├── 📂 referrals/         # User referrals page
│   ├── 📂 tasks/             # User tasks page
│   ├── 📂 upgrades/          # Upgrades page
│   │
│   ├── layout.js             # Root layout
│   └── page.js               # Root page (Preloader)
│
├── 📂 backend/               # Express.js backend
│   ├── 📂 prisma/           # Prisma ORM
│   │   ├── schema.prisma    # Database schema
│   │   └── 📂 migrations/   # Database migrations
│   │
│   ├── .env                 # Backend environment variables
│   └── server.js            # Express server setup
│
├── 📂 public/               # Static files
├── package.json             # Project dependencies
└── README.md               # Project documentation
```

## Features

### User Features
- Mining system with upgradeable storage and speed
- Daily tasks for earning rewards
- Referral system with rewards
- Leaderboard showing top users
- Upgrade system for storage and mining speed

### Admin Features
- Dashboard with key metrics
- User management
- Mining configuration
- Task management
- Referral settings
- System settings

## Tech Stack

- Frontend: Next.js 14, TailwindCSS, React Icons
- Backend: Express.js, Prisma ORM
- Database: MySQL
- Development: Concurrent server running

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

This will concurrently run:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001