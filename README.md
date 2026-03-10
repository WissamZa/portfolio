# CS Portfolio — Next.js 14 + Supabase

A full-featured, bilingual (Arabic/English) portfolio for Computer Science engineers.

## Features

- 🌐 **Bilingual** — Full Arabic (RTL) and English support with URL-based routing (`/en`, `/ar`)
- ⚡ **Performance** — ISR, server-side caching, client cache layer, Next.js Image optimization
- 🎨 **3D Design** — Matrix rain canvas, neon cyberpunk theme, Framer Motion animations
- 📄 **ATS Resume** — Generate ATS-optimized PDF resume in both languages
- 🔐 **Hidden Admin** — Puzzle-gated admin at `/x-admin-portal` (terminal challenge)
- 🛡️ **Secure** — Service role for all DB ops, RLS policies, httpOnly admin cookies
- 📊 **Full CRUD** — Projects, Skills, Experience, Education, Certifications, Messages
- 📦 **Fast Execution** — Powered by `bun` as the primary package manager.

## Application Map (Detailed Directory Structure)

```text
e:\code\cs-portfolio-nextjs\portfolio\
├── app/                  # Next.js App Router root directory
│   ├── [locale]/         # Dynamic locale routing (en, ar)
│   │   ├── handler/      # API or stack handlers tailored per locale
│   │   ├── resume/       # ATS-optimized resume generator page
│   │   └── x-admin-portal/ # Secure admin dashboard puzzle entry & pages
│   ├── api/              # API Routes (admin interactions, contact, external portfolio info)
│   ├── layout.tsx        # Global layout configuration
│   └── page.tsx          # Root page redirection
├── components/           # Reusable UI React components
│   ├── 3d/               # 3D interactive components (Matrix Canvas, etc.)
│   ├── admin/            # Admin dashboard structural pieces (Sidebar, Header, Maps, Forms)
│   ├── resume/           # Resume components (ATS generating templates)
│   ├── sections/         # Landing page sections (About, Hero, Projects, Skills)
│   └── ui/               # Primary UI elements (Navbar, Footer, Section Headers)
├── database/             # PostgreSQL/Supabase schema definitions & rules
├── hooks/                # Custom React hooks (e.g. 3D hooks, data hooks)
├── lib/                  # Shared utilities and configurations
│   ├── i18n.ts           # Internationalization setup and helpers
│   ├── locales/          # Extracted translation strings (en.ts, ar.ts)
│   ├── supabase/         # Supabase client initiators & server actions
│   ├── utils.ts          # Helper utilities (tailwind, styling, formatting)
│   └── database.types.ts # TypeScript definitions for DB tables
├── public/               # Static assets (images, fonts, global icons)
├── README.md             # Project documentation (you are here)
├── next.config.js        # Next.js settings & bundle behaviors
├── tailwind.config.js    # TailwindCSS custom design system logic
├── postcss.config.js     # PostCSS styling rules
└── package.json / bun.lock # Dependency definitions with Bun lockfile
```

## Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `database/schema.sql` in Supabase SQL Editor
3. Copy your credentials

### 3. Configure Environment
```bash
cp .env.example .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `ADMIN_SECRET_TOKEN` — your secret admin password (e.g. a long random string)
- `ADMIN_PUZZLE_KEY` — puzzle answer (default: "matrix")

### 4. Run Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/en` | English portfolio |
| `/ar` | Arabic portfolio |
| `/en/resume` | Resume with PDF download |
| `/ar/resume` | Arabic resume |
| `/x-admin-portal` | **Hidden** admin login (terminal puzzle) |
| `/x-admin-portal/dashboard` | Admin dashboard (after auth) |

## Admin Access

1. Visit `/x-admin-portal`
2. Solve the terminal puzzle:
   - Type `access`
   - Type `engineer`
   - Type `matrix` (or your `ADMIN_PUZZLE_KEY`)
3. Enter your `ADMIN_SECRET_TOKEN`

## Database Architecture

All data is fetched **server-side only** via service role key — the public never accesses Supabase directly. Row Level Security (RLS) is enabled with public read-only policies for portfolio data.

```
profiles → Personal info (bilingual)
projects → Portfolio projects (bilingual + tech stack)
skills   → Tech skills with proficiency
experience → Work history (bilingual)
education  → Academic background
certifications → Certs & credentials
contact_messages → Form submissions (admin-only read)
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + custom CSS
- **Animation**: Framer Motion
- **3D/Canvas**: Vanilla Canvas API
- **PDF**: jsPDF + html2canvas
- **Forms**: React Hook Form + Zod
- **i18n**: Custom locale routing
- **Package Manager**: Bun

## Caching Strategy

- **Server**: In-memory TTL cache (5 min) for all DB queries
- **CDN**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`
- **Client**: Module-level cache with 5-min TTL
- **ISR**: `revalidate = 300` on all data pages
- **Admin**: Cache invalidated on every write operation

## Deployment

Deploy to Vercel:
```bash
vercel deploy
```
Add all environment variables in Vercel dashboard.
