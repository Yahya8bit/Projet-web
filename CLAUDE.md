# CLAUDE.md — G&Y Sole

Project context for Claude Code. Read this before making changes.

## What this is

G&Y Sole is a sneaker e-commerce site, originally a school project (HTML/CSS/vanilla JS frontend + PHP/MySQL backend). We are modernizing it into a React single-page app backed by a PHP REST API. The MySQL database and the brand identity stay; the frontend is rebuilt from scratch.

Authors of the original: Yahia and Ghafer. Runs on localhost only — no production deployment, but write clean code as if it could be deployed.

## Tech stack

- **Frontend:** React 19 + Vite 8, Tailwind CSS v4, React Router v6, Framer Motion, react-hot-toast, Puppeteer (screenshots)
- **Backend:** PHP 8+ with PDO, JSON REST API
- **Database:** MySQL, database name `gysole_db` (schema + seed in `backend/sql/gysole_db.sql`)
- **State:** React Context only — `AuthContext` and `CartContext`. No Redux.
- **Auth:** JWT in httpOnly cookie (HS256, 7-day expiry)

## Project structure

```
gy_sole/
├── CLAUDE.md
├── DESIGN.md                  Art direction — read before any UI work
├── serve.mjs                  Static file server: node serve.mjs → http://localhost:3000
├── screenshot.mjs             Puppeteer screenshots: node screenshot.mjs <url> [label]
├── img/                       Original image assets (source of truth)
├── frontend/                  React app (Vite)
│   ├── public/img/            Images copied here for Vite dev server (all lowercase filenames)
│   ├── src/
│   │   ├── components/        Navbar.jsx, (ProductCard, CartDrawer, ProtectedRoute — Phase 3+)
│   │   ├── pages/             Home, Products, ProductDetail, Account, Admin, Contact, Questionnaire, NotFound
│   │   ├── context/           AuthContext.jsx, CartContext.jsx (Phase 4+)
│   │   └── api/               fetch wrappers — one file per resource (Phase 3+)
│   ├── index.css              Tailwind v4 @import + @theme tokens + Inter/Fraunces fonts
│   └── vite.config.js
└── backend/
    ├── db.php                 PDO singleton — getConnexion()
    ├── jwt.php                jwtCreate() / jwtVerify() / jwtFromRequest()
    ├── auth_guard.php         requireAuth() / requireAdmin()
    ├── .htaccess              CORS headers + URL rewriting
    ├── sql/gysole_db.sql      Schema with users table appended
    └── api/
        ├── brands/index.php        GET all brands
        ├── products/index.php      GET (filterable) + POST (admin)
        ├── products/detail.php     GET/PUT/DELETE by id (admin write)
        ├── auth/register.php
        ├── auth/login.php
        ├── auth/logout.php
        ├── auth/me.php
        ├── contact/index.php
        └── reviews/index.php
```

## Dev commands

```bash
# Frontend dev server (http://localhost:5173)
cd frontend && npm run dev

# Screenshot the running app
node screenshot.mjs http://localhost:5173
node screenshot.mjs http://localhost:5173 homepage

# Static file server for root (http://localhost:3000)
node serve.mjs
```

Screenshots save to `./temporary screenshots/screenshot-N[-label].png`, auto-incremented.

## Screenshot workflow

After every UI change:
1. Confirm dev server is running (`http://localhost:5173`)
2. `node screenshot.mjs http://localhost:5173 [label]`
3. Read the PNG with the Read tool and inspect it
4. Fix anything off, screenshot again
5. Minimum 2 rounds before declaring a view done

Chrome executable: `/home/yahia/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome`
Puppeteer module: `./frontend/node_modules/puppeteer`

## Database schema (do not redesign)

- **marques** — `id, nom, pays, annee_fond, logo, description`. 5 brands seeded. Logo filenames are all lowercase.
- **produits** — `id, collection (Men/Women/Kids), marque_id FK, modele, type, prix DECIMAL, photo, disponible`. 8 products seeded. Prices in DT (Tunisian Dinar).
- **avis** — `id, nom, email, note (1-5), experience (enum), newsletter, commentaire, date_avis`. Customer reviews.
- **users** — `id, username, password (bcrypt), gender, birthdate, size, role (user|admin), created_at`.

## Image assets

Source: `img/` (project root). Copied to `frontend/public/img/` with all-lowercase filenames:
`adidas.jpg`, `converse.jpg`, `newbalance.jpg`, `nike.jpg`, `noir.jpg`, `puma.jpg`

In React: `src="/img/filename.jpg"` (served from `public/img/`).
In PHP API: photo field stores the filename only (e.g. `nike.jpg`), frontend constructs the full URL.

## API conventions

- All endpoints return JSON. `Content-Type: application/json` always set.
- Prepared statements on every query that takes input — no string interpolation into SQL.
- POST/PUT/DELETE on products requires admin JWT cookie.
- CORS allows `http://localhost:5173` with credentials.
- Base URL: `http://localhost/gy_sole/backend/api/`

## Design system

**Read DESIGN.md before building any UI.** It exists to prevent generic AI luxury template output. Key rules:

- **Show product, not descriptions.** Lead with actual shoe images, not text about shoes.
- **No tracked-out uppercase** except the wordmark. Nav, buttons, labels: normal case, normal tracking.
- **No dead-center stacked hero.** Asymmetric editorial layouts.
- **No fake heritage** (`EST. 2026`, `·` separators). No ghost-outline primary buttons.
- Gold is an **accent** — logo, primary buttons, key prices. Not a coat of paint.
- Type: **Fraunces** (display/headlines) + **Inter** (UI/body). Size+weight create hierarchy, not letter-spacing.
- Primary CTA: solid gold `#d4af37`, dark text `#0f0f0f`.

Palette: canvas `#0f0f0f` · surface `#1a1a1a` · header `#000000` · gold `#d4af37` · gold-hover `#f0d273` · gold-muted `#b8860b` · text `#ffffff` · muted `#a0a0a0` · headline `#f5f0e6`

**Honesty test every view:** swap the logo — does it look like any other AI luxury site? If yes, not done.

## React conventions

- Function components + hooks only. One component per file. PascalCase filenames.
- All API calls go through `src/api/` wrappers — never `fetch` directly inside components.
- Styling: inline styles or `<style>` blocks with class names (Tailwind v4 `@theme` tokens available but CSS vars work fine too).

## Features in scope

1. Product catalog — live filtering (brand, collection, type, price) + search
2. Product detail — size selector, add to cart
3. Cart — slide-in drawer, localStorage persistence
4. Auth — login/register with JWT httpOnly cookie
5. Admin — role-protected product CRUD dashboard
6. Contact + questionnaire forms wired to API

## What NOT to do

- Don't redesign DB schema or rename tables/columns.
- No payment processing — checkout ends at order confirmation.
- No Redux, Next.js, Node backend.
- Don't drop the black/gold theme.
- Don't commit secrets — DB credentials in `db.php` (root/no password for localhost).

## Design context

- **PRODUCT.md** (root) — strategic: register, users, brand personality, anti-references, design principles. Read before design decisions.
- **DESIGN.md** (root) — visual art direction. Read before any UI work.
- Register: **brand** (storefront-led). Goal: **portfolio showpiece** — craft is the deliverable.
- Accessibility target: **WCAG AAA** (7:1 body text). The dark palette's muted greys (`#555`/`#666`/`#777`) fall below this and need bumping toward the ink end; gold and white headlines pass.
- Impeccable skill is set up: `/impeccable audit`, `critique`, `live` (live config at `.impeccable/live/config.json`).
