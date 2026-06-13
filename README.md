# G&Y Sole

Black-and-gold sneaker storefront. React SPA + PHP REST API. Originally a school project (HTML/CSS/PHP), rebuilt from scratch as a portfolio showpiece.

**By Yahia & Ghafer.**

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite 8, Tailwind CSS v4, React Router v6, Framer Motion |
| Backend | PHP 8+ REST API, PDO |
| Database | MySQL — `gysole_db` |
| Auth | JWT in httpOnly cookie (HS256, 7-day) |
| State | React Context — `AuthContext`, `CartContext` |

---

## Getting started

### Requirements

- PHP 8+ with Apache (XAMPP recommended)
- MySQL
- Node 18+

### Database

Import the schema + seed data:

```bash
mysql -u root < backend/sql/gysole_db.sql
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

Place the project under your Apache web root at `/gy_sole/` so the API is reachable at:

```
http://localhost/gy_sole/backend/api/
```

---

## Project structure

```
gy_sole/
├── frontend/          React app (Vite)
│   ├── src/
│   │   ├── pages/     Home, Products, ProductDetail, Account, Admin, Contact
│   │   ├── components/Navbar, CartDrawer, ProtectedRoute
│   │   ├── context/   AuthContext, CartContext
│   │   └── api/       fetch wrappers (one file per resource)
│   └── public/img/    Product + brand images (all lowercase filenames)
├── backend/
│   ├── api/           REST endpoints (products, auth, brands, reviews, contact)
│   ├── sql/           Schema + seed
│   ├── db.php         PDO singleton
│   ├── jwt.php        jwtCreate / jwtVerify
│   └── auth_guard.php requireAuth / requireAdmin
├── img/               Source images
├── DESIGN.md          Visual art direction
└── PRODUCT.md         Brand strategy + principles
```

---

## Features

- Product catalog with live filtering (brand, collection, type, price range, search)
- Product detail — size selector, add to cart
- Cart — slide-in drawer, localStorage persistence
- Auth — login/register, JWT httpOnly cookie
- Admin dashboard — role-protected product CRUD
- Contact form + questionnaire wired to API

---

## Screenshots

```bash
# Requires dev server running at http://localhost:5173
node screenshot.mjs http://localhost:5173
node screenshot.mjs http://localhost:5173/products products
```

Saves to `./temporary screenshots/`.

---

## Design notes

This build is opinionated. Read `DESIGN.md` before touching the UI. Key rules: no tracked uppercase, no dead-center hero, no fake heritage, gold is an accent not a coat of paint. Accessibility target is WCAG AAA.
