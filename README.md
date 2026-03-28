# BG Remover

An AI-powered image background remover built with Next.js 14, powered by [Remove.bg](https://www.remove.bg/).

## Features

- 🔐 Google OAuth sign-in (NextAuth.js)
- 🖼️ Drag & drop image upload
- ⚡ Instant background removal via Remove.bg API
- 🎚️ Before/after comparison slider
- ⬇️ One-click transparent PNG download
- 🆓 5 free removals per user
- 📱 Fully responsive, mobile-first

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd bg-remover
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `REMOVE_BG_API_KEY` | [remove.bg/api](https://www.remove.bg/api) |
| `DATABASE_URL` | Keep as `file:./dev.db` for local dev |

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.pages.dev/api/auth/callback/google` (production)

### 4. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build settings:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Output directory:** `.next`
4. Add all environment variables in Pages settings
5. Change `DATABASE_URL` to a PostgreSQL URL (e.g., [Neon](https://neon.tech)) and update `prisma/schema.prisma` provider to `postgresql`

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** NextAuth.js + Google OAuth
- **Database:** Prisma + SQLite (dev) / PostgreSQL (prod)
- **AI:** Remove.bg API
- **Styling:** Tailwind CSS
- **Deployment:** Cloudflare Pages
