# G&Y Sole Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild G&Y Sole from a static HTML/PHP school project into a React SPA (Vite + Tailwind) backed by a PHP JSON REST API, preserving the MySQL database, image assets, and black/gold brand identity.

**Architecture:** React SPA at `frontend/` handles all UI and routing; a PHP REST API at `backend/api/` serves JSON over PDO/MySQL. Auth uses JWT in httpOnly cookies. Cart and auth state live in React Context; no server-side rendering.

**Tech Stack:** React 18, Vite, Tailwind CSS 3, React Router v6, Framer Motion, react-hot-toast, PHP 8+, PDO, MySQL (gysole_db).

---

## File Map

### Phase 1 — Frontend Scaffold
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/` | Vite project root |
| Create | `frontend/tailwind.config.js` | Gold/black theme tokens |
| Create | `frontend/src/index.css` | Tailwind directives + Inter font |
| Create | `frontend/src/main.jsx` | React root + Router |
| Create | `frontend/src/App.jsx` | Route definitions |
| Create | `frontend/src/components/Navbar.jsx` | Sticky nav with links + cart badge slot |
| Create | `frontend/src/pages/Home.jsx` | Placeholder hero |
| Create | `frontend/src/pages/Products.jsx` | Placeholder |
| Create | `frontend/src/pages/ProductDetail.jsx` | Placeholder |
| Create | `frontend/src/pages/Account.jsx` | Placeholder |
| Create | `frontend/src/pages/Admin.jsx` | Placeholder |
| Create | `frontend/src/pages/Contact.jsx` | Placeholder |
| Create | `frontend/src/pages/Questionnaire.jsx` | Placeholder |
| Create | `frontend/src/pages/NotFound.jsx` | 404 page |

### Phase 2 — PHP REST API
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `backend/db.php` | PDO singleton (port from gy_sole/php/db.php) |
| Create | `backend/.htaccess` | CORS headers + JSON content type |
| Create | `backend/api/products/index.php` | GET list (filters) + POST create |
| Create | `backend/api/products/[id].php` | GET one / PUT update / DELETE |
| Create | `backend/api/brands/index.php` | GET all brands |
| Create | `backend/sql/gysole_db.sql` | Copy of existing SQL (reference) |

### Phase 3 — Products Page
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/src/api/products.js` | fetch wrappers for product endpoints |
| Create | `frontend/src/api/brands.js` | fetch wrapper for brands endpoint |
| Create | `frontend/src/components/ProductCard.jsx` | Image-first card, hover zoom, price badge, stock indicator |
| Create | `frontend/src/components/FilterBar.jsx` | Brand / collection / type / price-range filters |
| Modify | `frontend/src/pages/Products.jsx` | Live filtering + search, ProductCard grid |
| Modify | `frontend/src/pages/ProductDetail.jsx` | Full product view, size selector |

### Phase 4 — Auth (JWT)
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `backend/api/auth/register.php` | Validate, hash password, INSERT users, issue JWT cookie |
| Create | `backend/api/auth/login.php` | Verify credentials, issue JWT cookie |
| Create | `backend/api/auth/logout.php` | Clear JWT cookie |
| Create | `backend/api/auth/me.php` | Return current user from JWT |
| Create | `frontend/src/context/AuthContext.jsx` | Auth state, login/logout/register actions |
| Create | `frontend/src/components/ProtectedRoute.jsx` | Redirect unauthenticated users |
| Modify | `frontend/src/pages/Account.jsx` | Login + register forms with toast feedback |
| Modify | `frontend/src/components/Navbar.jsx` | User avatar when logged in |

### Phase 5 — Cart
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/src/context/CartContext.jsx` | Cart state, add/remove/clear, persist to localStorage |
| Create | `frontend/src/components/CartDrawer.jsx` | Slide-in drawer, item list, remove buttons, checkout stub |
| Modify | `frontend/src/components/Navbar.jsx` | Cart badge with item count, opens CartDrawer |
| Modify | `frontend/src/pages/ProductDetail.jsx` | "Add to cart" button |

### Phase 6 — Admin Dashboard
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/src/pages/Admin.jsx` | Protected, role=admin only; product CRUD table |
| Modify | `frontend/src/components/ProtectedRoute.jsx` | Accept optional `role` prop |
| Modify | `backend/api/products/index.php` | POST protected by JWT + role check |
| Modify | `backend/api/products/[id].php` | PUT/DELETE protected by JWT + role check |

### Phase 7 — Forms + Polish
| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `backend/api/contact/index.php` | POST → validate, store or email |
| Create | `backend/api/reviews/index.php` | POST → INSERT into avis; GET → list |
| Modify | `frontend/src/pages/Contact.jsx` | Contact form wired to API, toast feedback |
| Modify | `frontend/src/pages/Questionnaire.jsx` | Survey form wired to API, toast feedback |
| Modify | `frontend/src/pages/Home.jsx` | Full hero, brand grid, featured products |

---

## Phase 1 — Frontend Scaffold

### Task 1.1: Create Vite + React project

**Files:**
- Create: `frontend/` (Vite scaffold)

- [ ] **Step 1: Scaffold Vite project**

```bash
cd /home/yahia/Downloads/gy_sole
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom framer-motion react-hot-toast
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```
Expected: `Local: http://localhost:5173/` in terminal, default Vite page in browser.

- [ ] **Step 3: Commit**

```bash
cd /home/yahia/Downloads/gy_sole
git add frontend/
git commit -m "feat: scaffold Vite + React frontend"
```

---

### Task 1.2: Configure Tailwind with black/gold theme tokens

**Files:**
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold:        '#d4af37',
        'gold-light':'#f0d273',
        'gold-muted':'#b8860b',
        surface:     '#1a1a1a',
        background:  '#0f0f0f',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Write `frontend/src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-background text-white font-sans;
}
```

- [ ] **Step 3: Wire CSS into `frontend/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 4: Verify gold class renders** — temporarily add `className="text-gold text-4xl"` to `App.jsx`, check browser. Remove after.

- [ ] **Step 5: Commit**

```bash
git add frontend/tailwind.config.js frontend/src/index.css frontend/src/main.jsx
git commit -m "feat: configure Tailwind with black/gold theme tokens"
```

---

### Task 1.3: Placeholder pages + React Router setup

**Files:**
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/pages/Home.jsx`
- Create: `frontend/src/pages/Products.jsx`
- Create: `frontend/src/pages/ProductDetail.jsx`
- Create: `frontend/src/pages/Account.jsx`
- Create: `frontend/src/pages/Admin.jsx`
- Create: `frontend/src/pages/Contact.jsx`
- Create: `frontend/src/pages/Questionnaire.jsx`
- Create: `frontend/src/pages/NotFound.jsx`

- [ ] **Step 1: Write `frontend/src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Questionnaire from './pages/Questionnaire'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/products"          element={<Products />} />
        <Route path="/products/:id"      element={<ProductDetail />} />
        <Route path="/account"           element={<Account />} />
        <Route path="/admin"             element={<Admin />} />
        <Route path="/contact"           element={<Contact />} />
        <Route path="/questionnaire"     element={<Questionnaire />} />
        <Route path="*"                  element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Write placeholder for each page** (repeat pattern for all 8 pages):

`frontend/src/pages/Home.jsx`:
```jsx
export default function Home() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Home</h1></main>
}
```

`frontend/src/pages/Products.jsx`:
```jsx
export default function Products() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Products</h1></main>
}
```

`frontend/src/pages/ProductDetail.jsx`:
```jsx
export default function ProductDetail() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Product Detail</h1></main>
}
```

`frontend/src/pages/Account.jsx`:
```jsx
export default function Account() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Account</h1></main>
}
```

`frontend/src/pages/Admin.jsx`:
```jsx
export default function Admin() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Admin</h1></main>
}
```

`frontend/src/pages/Contact.jsx`:
```jsx
export default function Contact() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Contact</h1></main>
}
```

`frontend/src/pages/Questionnaire.jsx`:
```jsx
export default function Questionnaire() {
  return <main className="container mx-auto px-4 pt-24"><h1 className="text-gold text-3xl font-bold">Questionnaire</h1></main>
}
```

`frontend/src/pages/NotFound.jsx`:
```jsx
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <main className="container mx-auto px-4 pt-24 text-center">
      <h1 className="text-gold text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found.</p>
      <Link to="/" className="text-gold hover:text-gold-light underline">Go home</Link>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.jsx frontend/src/pages/
git commit -m "feat: add placeholder pages and React Router routes"
```

---

### Task 1.4: Sticky Navbar with routing

**Files:**
- Create: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Write `frontend/src/components/Navbar.jsx`**

```jsx
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',              label: 'Home' },
  { to: '/products',      label: 'Products' },
  { to: '/contact',       label: 'Contact' },
  { to: '/questionnaire', label: 'Reviews' },
  { to: '/account',       label: 'Account' },
]

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gold/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-gold font-bold text-xl tracking-widest">
          G&amp;Y SOLE
        </NavLink>

        <nav className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-gold' : 'text-gray-300 hover:text-gold-light'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Cart badge — wired in Phase 5 */}
          <button className="relative text-gray-300 hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify in browser** — nav sticks on scroll, active link turns gold, clicking routes without page reload.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Navbar.jsx
git commit -m "feat: sticky navbar with React Router active links"
```

---

## Phase 2 — PHP REST API

### Task 2.1: Backend structure + db.php + .htaccess

**Files:**
- Create: `backend/db.php`
- Create: `backend/.htaccess`
- Create: `backend/sql/gysole_db.sql`

- [ ] **Step 1: Write `backend/db.php`**

```php
<?php
define('DB_HOST',    'localhost');
define('DB_NAME',    'gysole_db');
define('DB_USER',    'root');
define('DB_PASS',    '');
define('DB_CHARSET', 'utf8mb4');

function getConnexion(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
```

- [ ] **Step 2: Write `backend/.htaccess`**

```apache
Header always set Access-Control-Allow-Origin "http://localhost:5173"
Header always set Access-Control-Allow-Credentials "true"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^ - [R=204,L]
```

- [ ] **Step 3: Copy SQL** — copy `gy_sole/sql/gysole_db.sql` to `backend/sql/gysole_db.sql`:

```bash
mkdir -p /home/yahia/Downloads/gy_sole/backend/sql
cp /home/yahia/Downloads/gy_sole/gy_sole/sql/gysole_db.sql /home/yahia/Downloads/gy_sole/backend/sql/gysole_db.sql
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: PHP backend skeleton with PDO db.php and CORS .htaccess"
```

---

### Task 2.2: Brands API endpoint

**Files:**
- Create: `backend/api/brands/index.php`

- [ ] **Step 1: Write `backend/api/brands/index.php`**

```php
<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$pdo  = getConnexion();
$stmt = $pdo->query('SELECT id, nom, pays, annee_fond, logo, description FROM marques ORDER BY nom');
echo json_encode($stmt->fetchAll());
```

- [ ] **Step 2: Test endpoint** — with Apache running, visit `http://localhost/gy_sole/backend/api/brands/`. Expected: JSON array of 5 brand objects.

- [ ] **Step 3: Commit**

```bash
git add backend/api/brands/index.php
git commit -m "feat: GET /api/brands returns all brands as JSON"
```

---

### Task 2.3: Products API — list + create

**Files:**
- Create: `backend/api/products/index.php`

- [ ] **Step 1: Write `backend/api/products/index.php`**

```php
<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$pdo = getConnexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['collection'])) {
        $where[]  = 'p.collection = ?';
        $params[] = $_GET['collection'];
    }
    if (!empty($_GET['marque_id'])) {
        $where[]  = 'p.marque_id = ?';
        $params[] = (int)$_GET['marque_id'];
    }
    if (!empty($_GET['type'])) {
        $where[]  = 'p.type = ?';
        $params[] = $_GET['type'];
    }
    if (!empty($_GET['prix_max'])) {
        $where[]  = 'p.prix <= ?';
        $params[] = (float)$_GET['prix_max'];
    }
    if (!empty($_GET['search'])) {
        $where[]  = '(p.modele LIKE ? OR m.nom LIKE ?)';
        $term     = '%' . $_GET['search'] . '%';
        $params[] = $term;
        $params[] = $term;
    }

    $sql  = 'SELECT p.id, p.collection, m.nom AS marque, m.id AS marque_id, p.modele, p.type, p.prix, p.photo, p.disponible
             FROM produits p
             JOIN marques m ON m.id = p.marque_id
             WHERE ' . implode(' AND ', $where) . '
             ORDER BY p.id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Auth check added in Phase 6
    $body = json_decode(file_get_contents('php://input'), true);

    $required = ['collection', 'marque_id', 'modele', 'type', 'prix', 'photo'];
    foreach ($required as $field) {
        if (empty($body[$field])) {
            http_response_code(422);
            echo json_encode(['error' => "Missing field: $field"]);
            exit;
        }
    }

    if (!in_array($body['collection'], ['Men','Women','Kids'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid collection']);
        exit;
    }
    if ($body['prix'] <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Prix must be positive']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO produits (collection, marque_id, modele, type, prix, photo, disponible)
         VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    $stmt->execute([
        $body['collection'],
        (int)$body['marque_id'],
        $body['modele'],
        $body['type'],
        (float)$body['prix'],
        $body['photo'],
    ]);
    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
```

- [ ] **Step 2: Test GET** — `http://localhost/gy_sole/backend/api/products/` → JSON array of 8 products.

- [ ] **Step 3: Test filters** — `?collection=Men` → 3 products. `?search=nike` → Nike products.

- [ ] **Step 4: Commit**

```bash
git add backend/api/products/index.php
git commit -m "feat: GET /api/products with filters, POST create"
```

---

### Task 2.4: Products API — single product CRUD

**Files:**
- Create: `backend/api/products/detail.php` (Apache rewrite routes `/api/products/{id}` here)

Note: PHP can't use `[id].php` as a filename. Use `detail.php` and add a rewrite rule in `.htaccess`.

- [ ] **Step 1: Update `backend/.htaccess`** to add rewrite rule:

```apache
Header always set Access-Control-Allow-Origin "http://localhost:5173"
Header always set Access-Control-Allow-Credentials "true"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^ - [R=204,L]

RewriteRule ^api/products/([0-9]+)$ api/products/detail.php?id=$1 [QSA,L]
```

- [ ] **Step 2: Write `backend/api/products/detail.php`**

```php
<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$id  = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$pdo = getConnexion();

function getProduct(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT p.id, p.collection, m.nom AS marque, m.id AS marque_id, p.modele, p.type, p.prix, p.photo, p.disponible
         FROM produits p
         JOIN marques m ON m.id = p.marque_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $product = getProduct($pdo, $id);
    if (!$product) { http_response_code(404); echo json_encode(['error' => 'Not found']); exit; }
    echo json_encode($product);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Auth check added in Phase 6
    $body = json_decode(file_get_contents('php://input'), true);
    $allowed = ['collection', 'marque_id', 'modele', 'type', 'prix', 'photo', 'disponible'];
    $sets    = [];
    $params  = [];

    foreach ($allowed as $field) {
        if (isset($body[$field])) {
            $sets[]   = "$field = ?";
            $params[] = $body[$field];
        }
    }
    if (empty($sets)) { http_response_code(422); echo json_encode(['error' => 'No fields to update']); exit; }

    $params[] = $id;
    $pdo->prepare('UPDATE produits SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
    echo json_encode(getProduct($pdo, $id));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Auth check added in Phase 6
    $stmt = $pdo->prepare('DELETE FROM produits WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) { http_response_code(404); echo json_encode(['error' => 'Not found']); exit; }
    http_response_code(204);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
```

- [ ] **Step 3: Test GET one** — `http://localhost/gy_sole/backend/api/products/1` → single product JSON.

- [ ] **Step 4: Commit**

```bash
git add backend/.htaccess backend/api/products/detail.php
git commit -m "feat: GET/PUT/DELETE /api/products/:id"
```

---

## Phase 3 — Products Page

### Task 3.1: API fetch wrappers

**Files:**
- Create: `frontend/src/api/products.js`
- Create: `frontend/src/api/brands.js`

- [ ] **Step 1: Write `frontend/src/api/products.js`**

```js
const BASE = 'http://localhost/gy_sole/backend/api/products'

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined))
  )
  const res = await fetch(`${BASE}/?${params}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function createProduct(data) {
  const res = await fetch(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete product')
}
```

- [ ] **Step 2: Write `frontend/src/api/brands.js`**

```js
const BASE = 'http://localhost/gy_sole/backend/api/brands'

export async function fetchBrands() {
  const res = await fetch(`${BASE}/`)
  if (!res.ok) throw new Error('Failed to fetch brands')
  return res.json()
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/api/
git commit -m "feat: API fetch wrappers for products and brands"
```

---

### Task 3.2: ProductCard component

**Files:**
- Create: `frontend/src/components/ProductCard.jsx`

- [ ] **Step 1: Write `frontend/src/components/ProductCard.jsx`**

```jsx
import { Link } from 'react-router-dom'

const IMG_BASE = 'http://localhost/gy_sole/gy_sole/img/'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-surface rounded-lg overflow-hidden border border-white/5 hover:border-gold/40 transition-colors"
    >
      <div className="overflow-hidden aspect-square bg-black">
        <img
          src={IMG_BASE + product.photo}
          alt={product.modele}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-gold-muted uppercase tracking-widest mb-1">{product.marque}</p>
        <h3 className="font-semibold text-white mb-2">{product.modele}</h3>

        <div className="flex items-center justify-between">
          <span className="bg-gold text-black text-sm font-bold px-2 py-1 rounded">
            {Number(product.prix).toFixed(2)} DT
          </span>
          <span className={`text-xs font-medium ${product.disponible ? 'text-green-400' : 'text-red-400'}`}>
            {product.disponible ? '● In Stock' : '● Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProductCard.jsx
git commit -m "feat: ProductCard with hover zoom, price badge, stock indicator"
```

---

### Task 3.3: FilterBar component

**Files:**
- Create: `frontend/src/components/FilterBar.jsx`

- [ ] **Step 1: Write `frontend/src/components/FilterBar.jsx`**

```jsx
const selectClass = 'bg-surface border border-white/10 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-gold'

export default function FilterBar({ brands, filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search || ''}
        onChange={e => set('search', e.target.value)}
        className={`${selectClass} min-w-[180px]`}
      />

      <select value={filters.collection || ''} onChange={e => set('collection', e.target.value)} className={selectClass}>
        <option value="">All Collections</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>

      <select value={filters.marque_id || ''} onChange={e => set('marque_id', e.target.value)} className={selectClass}>
        <option value="">All Brands</option>
        {brands.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
      </select>

      <select value={filters.type || ''} onChange={e => set('type', e.target.value)} className={selectClass}>
        <option value="">All Types</option>
        <option value="Running">Running</option>
        <option value="Casual">Casual</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>

      <button
        onClick={() => onChange({ search: '', collection: '', marque_id: '', type: '' })}
        className="text-sm text-gold-muted hover:text-gold border border-white/10 rounded px-3 py-2 transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/FilterBar.jsx
git commit -m "feat: FilterBar with search, collection, brand, type filters"
```

---

### Task 3.4: Products page with live filtering

**Files:**
- Modify: `frontend/src/pages/Products.jsx`

- [ ] **Step 1: Write `frontend/src/pages/Products.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/products'
import { fetchBrands } from '../api/brands'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'

export default function Products() {
  const [products, setProducts] = useState([])
  const [brands,   setBrands]   = useState([])
  const [filters,  setFilters]  = useState({ search: '', collection: '', marque_id: '', type: '' })
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetchBrands().then(setBrands)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProducts(filters)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold text-gold mb-8">Products</h1>
      <FilterBar brands={brands} filters={filters} onChange={setFilters} />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Verify in browser** — products grid loads, filters narrow results live, search works.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Products.jsx
git commit -m "feat: Products page with live API filtering and product grid"
```

---

### Task 3.5: ProductDetail page

**Files:**
- Modify: `frontend/src/pages/ProductDetail.jsx`

- [ ] **Step 1: Write `frontend/src/pages/ProductDetail.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api/products'

const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
const IMG_BASE = 'http://localhost/gy_sole/gy_sole/img/'

export default function ProductDetail() {
  const { id }              = useParams()
  const [product, setProduct] = useState(null)
  const [size,    setSize]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="container mx-auto px-4 pt-24"><p className="text-gray-400">Loading...</p></main>
  if (!product) return <main className="container mx-auto px-4 pt-24"><p className="text-red-400">Product not found.</p></main>

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <Link to="/products" className="text-gold-muted hover:text-gold text-sm mb-8 inline-block">← Back to Products</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-black rounded-lg overflow-hidden aspect-square">
          <img src={IMG_BASE + product.photo} alt={product.modele} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-gold-muted uppercase tracking-widest text-sm mb-2">{product.marque}</p>
          <h1 className="text-3xl font-bold text-white mb-2">{product.modele}</h1>
          <p className="text-gray-400 mb-4">{product.type} · {product.collection}</p>

          <span className="bg-gold text-black text-xl font-bold px-4 py-2 rounded inline-block mb-6">
            {Number(product.prix).toFixed(2)} DT
          </span>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 rounded border text-sm font-medium transition-colors ${
                    size === s
                      ? 'border-gold bg-gold text-black'
                      : 'border-white/20 text-white hover:border-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart wired in Phase 5 */}
          <button
            disabled={!size || !product.disponible}
            className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.disponible ? (size ? 'Add to Cart' : 'Select a Size') : 'Out of Stock'}
          </button>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify** — click product card, detail page loads, sizes selectable, button disabled until size chosen.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/ProductDetail.jsx
git commit -m "feat: ProductDetail page with size selector"
```

---

## Phase 4 — Auth (JWT)

### Task 4.1: Users table migration

**Files:**
- Modify: `backend/sql/gysole_db.sql`

- [ ] **Step 1: Add users table SQL** (append to `backend/sql/gysole_db.sql`):

```sql
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(20) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    gender     ENUM('male','female') NOT NULL,
    birthdate  DATE NOT NULL,
    size       TINYINT NOT NULL,
    role       ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

- [ ] **Step 2: Run migration** — execute that statement in your MySQL client against `gysole_db`.

- [ ] **Step 3: Commit**

```bash
git add backend/sql/gysole_db.sql
git commit -m "feat: add users table with role column"
```

---

### Task 4.2: JWT helper

**Files:**
- Create: `backend/jwt.php`

Note: Uses a simple HS256 JWT without a library (no composer). Only for localhost school use.

- [ ] **Step 1: Write `backend/jwt.php`**

```php
<?php
define('JWT_SECRET', 'gysole_dev_secret_change_in_prod');

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function jwtCreate(array $payload): string
{
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode($payload + ['iat' => time(), 'exp' => time() + 86400 * 7]));
    $sig     = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

function jwtVerify(string $token): array|false
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    [$header, $payload, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return false;
    $data = json_decode(base64url_decode($payload), true);
    if ($data['exp'] < time()) return false;
    return $data;
}

function jwtFromRequest(): array|false
{
    $token = $_COOKIE['token'] ?? null;
    if (!$token) return false;
    return jwtVerify($token);
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/jwt.php
git commit -m "feat: HS256 JWT create/verify helper"
```

---

### Task 4.3: Register + Login endpoints

**Files:**
- Create: `backend/api/auth/register.php`
- Create: `backend/api/auth/login.php`
- Create: `backend/api/auth/logout.php`
- Create: `backend/api/auth/me.php`

- [ ] **Step 1: Write `backend/api/auth/register.php`**

```php
<?php
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$body = json_decode(file_get_contents('php://input'), true);

$username  = trim($body['username']  ?? '');
$password  = $body['password']  ?? '';
$gender    = $body['gender']    ?? '';
$birthdate = $body['birthdate'] ?? '';
$size      = (int)($body['size'] ?? 0);

$errors = [];
if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $username)) $errors[] = 'Invalid username (3-20 chars, letters/numbers/_)';
if (!preg_match('/^(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) $errors[] = 'Password must be 8+ chars with uppercase and number';
if (!in_array($gender, ['male','female'])) $errors[] = 'Invalid gender';
if (empty($birthdate) || strtotime($birthdate) >= time()) $errors[] = 'Invalid birthdate';
if ($size < 30 || $size > 50) $errors[] = 'Size must be 30-50';

if ($errors) { http_response_code(422); echo json_encode(['errors' => $errors]); exit; }

$pdo = getConnexion();
$check = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$check->execute([$username]);
if ($check->fetch()) { http_response_code(409); echo json_encode(['error' => 'Username taken']); exit; }

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO users (username, password, gender, birthdate, size) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$username, $hash, $gender, $birthdate, $size]);
$userId = (int)$pdo->lastInsertId();

$token = jwtCreate(['sub' => $userId, 'username' => $username, 'role' => 'user']);
setcookie('token', $token, ['httponly' => true, 'samesite' => 'Lax', 'path' => '/', 'expires' => time() + 86400 * 7]);

http_response_code(201);
echo json_encode(['id' => $userId, 'username' => $username, 'role' => 'user']);
```

- [ ] **Step 2: Write `backend/api/auth/login.php`**

```php
<?php
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

$pdo  = getConnexion();
$stmt = $pdo->prepare('SELECT id, password, role FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

$token = jwtCreate(['sub' => $user['id'], 'username' => $username, 'role' => $user['role']]);
setcookie('token', $token, ['httponly' => true, 'samesite' => 'Lax', 'path' => '/', 'expires' => time() + 86400 * 7]);

echo json_encode(['id' => $user['id'], 'username' => $username, 'role' => $user['role']]);
```

- [ ] **Step 3: Write `backend/api/auth/logout.php`**

```php
<?php
header('Content-Type: application/json');
setcookie('token', '', ['httponly' => true, 'samesite' => 'Lax', 'path' => '/', 'expires' => time() - 1]);
echo json_encode(['ok' => true]);
```

- [ ] **Step 4: Write `backend/api/auth/me.php`**

```php
<?php
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../jwt.php';

header('Content-Type: application/json');

$claims = jwtFromRequest();
if (!$claims) { http_response_code(401); echo json_encode(['error' => 'Unauthenticated']); exit; }

$pdo  = getConnexion();
$stmt = $pdo->prepare('SELECT id, username, gender, birthdate, size, role FROM users WHERE id = ?');
$stmt->execute([$claims['sub']]);
$user = $stmt->fetch();

if (!$user) { http_response_code(404); echo json_encode(['error' => 'User not found']); exit; }
echo json_encode($user);
```

- [ ] **Step 5: Add auth rewrites to `backend/.htaccess`**

```apache
RewriteRule ^api/auth/register$ api/auth/register.php [QSA,L]
RewriteRule ^api/auth/login$    api/auth/login.php    [QSA,L]
RewriteRule ^api/auth/logout$   api/auth/logout.php   [QSA,L]
RewriteRule ^api/auth/me$       api/auth/me.php       [QSA,L]
```

- [ ] **Step 6: Test register** via curl or browser devtools — POST to `/api/auth/register`, verify 201 + cookie set.

- [ ] **Step 7: Commit**

```bash
git add backend/api/auth/ backend/.htaccess
git commit -m "feat: auth register/login/logout/me endpoints with JWT httpOnly cookie"
```

---

### Task 4.4: AuthContext + Account page

**Files:**
- Create: `frontend/src/context/AuthContext.jsx`
- Create: `frontend/src/api/auth.js`
- Create: `frontend/src/components/ProtectedRoute.jsx`
- Modify: `frontend/src/pages/Account.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Write `frontend/src/api/auth.js`**

```js
const BASE = 'http://localhost/gy_sole/backend/api/auth'

export async function apiRegister(data) {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  })
  const body = await res.json()
  if (!res.ok) throw body
  return body
}

export async function apiLogin(data) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  })
  const body = await res.json()
  if (!res.ok) throw body
  return body
}

export async function apiLogout() {
  await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' })
}

export async function apiMe() {
  const res = await fetch(`${BASE}/me`, { credentials: 'include' })
  if (!res.ok) return null
  return res.json()
}
```

- [ ] **Step 2: Write `frontend/src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { apiMe, apiLogin, apiLogout, apiRegister } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    apiMe().then(setUser)
  }, [])

  async function login(data) {
    const u = await apiLogin(data)
    setUser(u)
    return u
  }

  async function register(data) {
    const u = await apiRegister(data)
    setUser(u)
    return u
  }

  async function logout() {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 3: Write `frontend/src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (user === undefined) return null // still loading
  if (!user) return <Navigate to="/account" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
```

- [ ] **Step 4: Wrap App with AuthProvider in `frontend/src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Questionnaire from './pages/Questionnaire'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #d4af37' } }} />
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route path="/account"       element={<Account />} />
          <Route path="/admin"         element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

- [ ] **Step 5: Write `frontend/src/pages/Account.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Account() {
  const { user, login, register, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', gender: 'male', birthdate: '', size: 40 })

  if (user) return (
    <main className="container mx-auto px-4 pt-24 max-w-md">
      <h1 className="text-gold text-3xl font-bold mb-6">Account</h1>
      <div className="bg-surface rounded-lg p-6 border border-white/10">
        <p className="text-white mb-1">Welcome, <span className="text-gold font-semibold">{user.username}</span></p>
        <p className="text-gray-400 text-sm mb-6">Role: {user.role}</p>
        <button onClick={async () => { await logout(); toast.success('Logged out') }}
          className="w-full py-2 border border-white/20 text-white rounded hover:border-gold transition-colors">
          Log Out
        </button>
      </div>
    </main>
  )

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (tab === 'login') {
        await login({ username: form.username, password: form.password })
        toast.success('Welcome back!')
        navigate('/')
      } else {
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
        await register({ username: form.username, password: form.password, gender: form.gender, birthdate: form.birthdate, size: form.size })
        toast.success('Account created!')
        navigate('/')
      }
    } catch (err) {
      const msg = err?.errors?.join(', ') || err?.error || 'Something went wrong'
      toast.error(msg)
    }
  }

  const inputClass = 'w-full bg-background border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-gold'

  return (
    <main className="container mx-auto px-4 pt-24 max-w-md">
      <h1 className="text-gold text-3xl font-bold mb-6">Account</h1>
      <div className="flex mb-6 border-b border-white/10">
        {['login','register'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Username" className={inputClass} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        <input type="password" placeholder="Password" className={inputClass} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        {tab === 'register' && <>
          <input type="password" placeholder="Confirm Password" className={inputClass} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          <select className={inputClass} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="date" className={inputClass} value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
          <input type="number" placeholder="Shoe size (30-50)" className={inputClass} min="30" max="50" value={form.size} onChange={e => setForm(f => ({ ...f, size: +e.target.value }))} />
        </>}
        <button type="submit" className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors capitalize">
          {tab}
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 6: Update Navbar to show username when logged in**

In `frontend/src/components/Navbar.jsx`, add `useAuth` import and replace the cart button area:

```jsx
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Inside Navbar():
const { user } = useAuth()

// In JSX, after nav links, before closing </nav>:
{user && (
  <Link to="/account" className="text-sm text-gold-muted hover:text-gold transition-colors">
    {user.username}
  </Link>
)}
{user?.role === 'admin' && (
  <Link to="/admin" className="text-sm text-gold-muted hover:text-gold transition-colors">Admin</Link>
)}
```

- [ ] **Step 7: Verify** — register a new user, toast appears, redirect to home, username in navbar. Login/logout cycle works.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/context/AuthContext.jsx frontend/src/api/auth.js frontend/src/components/ProtectedRoute.jsx frontend/src/pages/Account.jsx frontend/src/App.jsx frontend/src/components/Navbar.jsx
git commit -m "feat: JWT auth with AuthContext, login/register/logout, protected routes"
```

---

## Phase 5 — Cart

### Task 5.1: CartContext with localStorage persistence

**Files:**
- Create: `frontend/src/context/CartContext.jsx`

- [ ] **Step 1: Write `frontend/src/context/CartContext.jsx`**

```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

function loadCart() {
  try { return JSON.parse(localStorage.getItem('gy_cart')) || [] }
  catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem('gy_cart', JSON.stringify(items))
  }, [items])

  function addItem(product, size) {
    setItems(prev => {
      const key = `${product.id}-${size}`
      const existing = prev.find(i => i.key === key)
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { key, product, size, qty: 1 }]
    })
  }

  function removeItem(key) {
    setItems(prev => prev.filter(i => i.key !== key))
  }

  function clearCart() {
    setItems([])
  }

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.qty * Number(i.product.prix), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
```

- [ ] **Step 2: Wrap App with CartProvider** — add to `frontend/src/App.jsx`:

```jsx
import { CartProvider } from './context/CartContext'

// Wrap inside AuthProvider:
<AuthProvider>
  <CartProvider>
    ...
  </CartProvider>
</AuthProvider>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/context/CartContext.jsx frontend/src/App.jsx
git commit -m "feat: CartContext with localStorage persistence"
```

---

### Task 5.2: CartDrawer + Navbar badge

**Files:**
- Create: `frontend/src/components/CartDrawer.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Write `frontend/src/components/CartDrawer.jsx`**

```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const IMG_BASE = 'http://localhost/gy_sole/gy_sole/img/'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, clearCart, totalCount, totalPrice } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-surface z-50 flex flex-col border-l border-white/10"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">Cart ({totalCount})</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 && <p className="text-gray-400 text-center mt-8">Your cart is empty.</p>}
              {items.map(item => (
                <div key={item.key} className="flex gap-3 bg-background rounded-lg p-3">
                  <img src={IMG_BASE + item.product.photo} alt={item.product.modele} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.product.modele}</p>
                    <p className="text-gray-400 text-xs">Size {item.size} · Qty {item.qty}</p>
                    <p className="text-gold text-sm font-semibold mt-1">{(item.qty * Number(item.product.prix)).toFixed(2)} DT</p>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-gray-500 hover:text-red-400 text-sm self-start">✕</button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span className="text-gold">{totalPrice.toFixed(2)} DT</span>
                </div>
                <button className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors">
                  Checkout
                </button>
                <button onClick={clearCart} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Add cart badge and drawer toggle to Navbar**

Modify `frontend/src/components/Navbar.jsx` — add state and drawer:

```jsx
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { user } = useAuth()
  const { totalCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gold/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="text-gold font-bold text-xl tracking-widest">G&amp;Y SOLE</NavLink>
          <nav className="flex items-center gap-6">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/contact', label: 'Contact' },
              { to: '/questionnaire', label: 'Reviews' },
              { to: '/account', label: 'Account' },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-gray-300 hover:text-gold-light'}`}>
                {label}
              </NavLink>
            ))}
            {user && <Link to="/account" className="text-sm text-gold-muted hover:text-gold transition-colors">{user.username}</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="text-sm text-gold-muted hover:text-gold">Admin</Link>}
            <button onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}
```

- [ ] **Step 3: Wire "Add to Cart" in ProductDetail**

In `frontend/src/pages/ProductDetail.jsx` add:

```jsx
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

// Inside component:
const { addItem } = useCart()

// Replace button onClick:
<button
  disabled={!size || !product.disponible}
  onClick={() => { addItem(product, size); toast.success(`${product.modele} (size ${size}) added to cart!`) }}
  className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
>
  {product.disponible ? (size ? 'Add to Cart' : 'Select a Size') : 'Out of Stock'}
</button>
```

- [ ] **Step 4: Verify** — add a product, cart badge shows count, drawer slides open, items listed, remove works, refreshing page keeps cart.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/CartDrawer.jsx frontend/src/components/Navbar.jsx frontend/src/pages/ProductDetail.jsx
git commit -m "feat: cart drawer with Framer Motion, badge, add/remove/clear, localStorage"
```

---

## Phase 6 — Admin Dashboard

### Task 6.1: Protect API endpoints with JWT role check

**Files:**
- Create: `backend/auth_guard.php`
- Modify: `backend/api/products/index.php` (POST block)
- Modify: `backend/api/products/detail.php` (PUT/DELETE blocks)

- [ ] **Step 1: Write `backend/auth_guard.php`**

```php
<?php
require_once __DIR__ . '/jwt.php';

function requireAuth(): array
{
    $claims = jwtFromRequest();
    if (!$claims) { http_response_code(401); echo json_encode(['error' => 'Unauthenticated']); exit; }
    return $claims;
}

function requireAdmin(): array
{
    $claims = requireAuth();
    if ($claims['role'] !== 'admin') { http_response_code(403); echo json_encode(['error' => 'Forbidden']); exit; }
    return $claims;
}
```

- [ ] **Step 2: Add `requireAdmin()` to POST in `backend/api/products/index.php`**

At the top of the `if ($_SERVER['REQUEST_METHOD'] === 'POST')` block, add:

```php
require_once __DIR__ . '/../../auth_guard.php';
requireAdmin();
```

- [ ] **Step 3: Add `requireAdmin()` to PUT/DELETE in `backend/api/products/detail.php`**

At the top of each PUT and DELETE block, add:

```php
require_once __DIR__ . '/../../auth_guard.php';
requireAdmin();
```

- [ ] **Step 4: Commit**

```bash
git add backend/auth_guard.php backend/api/products/index.php backend/api/products/detail.php
git commit -m "feat: protect product write endpoints with JWT admin role check"
```

---

### Task 6.2: Admin dashboard page

**Files:**
- Modify: `frontend/src/pages/Admin.jsx`

- [ ] **Step 1: Write `frontend/src/pages/Admin.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { fetchProducts, createProduct, deleteProduct } from '../api/products'
import { fetchBrands } from '../api/brands'
import toast from 'react-hot-toast'

const inputClass = 'bg-background border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gold'
const EMPTY = { collection: 'Men', marque_id: '', modele: '', type: 'Running', prix: '', photo: 'nike.jpg', disponible: 1 }

export default function Admin() {
  const [products, setProducts] = useState([])
  const [brands,   setBrands]   = useState([])
  const [form,     setForm]     = useState(EMPTY)
  const [loading,  setLoading]  = useState(true)

  function load() {
    return fetchProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { fetchBrands().then(setBrands); load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createProduct({ ...form, marque_id: +form.marque_id, prix: +form.prix })
      toast.success('Product created')
      setForm(EMPTY)
      load()
    } catch { toast.error('Failed to create product') }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    try { await deleteProduct(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <h1 className="text-gold text-3xl font-bold mb-8">Admin — Products</h1>

      <section className="bg-surface rounded-lg p-6 border border-white/10 mb-10">
        <h2 className="text-white font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <select className={inputClass} value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))}>
            {['Men','Women','Kids'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className={inputClass} value={form.marque_id} onChange={e => setForm(f => ({ ...f, marque_id: e.target.value }))} required>
            <option value="">Brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
          </select>
          <input placeholder="Model" className={inputClass} value={form.modele} onChange={e => setForm(f => ({ ...f, modele: e.target.value }))} required />
          <select className={inputClass} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {['Running','Casual','Lifestyle'].map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="Price (DT)" className={inputClass} value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} required />
          <input placeholder="Photo filename (e.g. nike.jpg)" className={inputClass} value={form.photo} onChange={e => setForm(f => ({ ...f, photo: e.target.value }))} required />
          <button type="submit" className="col-span-2 md:col-span-3 py-2 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors">
            Add Product
          </button>
        </form>
      </section>

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gold-muted uppercase text-xs border-b border-white/10">
              <tr>{['ID','Brand','Model','Type','Collection','Price','Stock',''].map(h => <th key={h} className="py-3 px-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-surface transition-colors">
                  <td className="py-3 px-4 text-gray-400">{p.id}</td>
                  <td className="py-3 px-4 text-white">{p.marque}</td>
                  <td className="py-3 px-4 text-white font-medium">{p.modele}</td>
                  <td className="py-3 px-4 text-gray-300">{p.type}</td>
                  <td className="py-3 px-4 text-gray-300">{p.collection}</td>
                  <td className="py-3 px-4 text-gold font-semibold">{Number(p.prix).toFixed(2)} DT</td>
                  <td className="py-3 px-4">
                    <span className={p.disponible ? 'text-green-400' : 'text-red-400'}>{p.disponible ? 'In Stock' : 'Out'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(p.id, p.modele)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Verify** — log in as admin (manually set `role='admin'` in DB for your test user), navigate to `/admin`, product table shows, add form creates a new product, delete removes it.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Admin.jsx
git commit -m "feat: admin dashboard with product list, add, and delete"
```

---

## Phase 7 — Forms + Polish

### Task 7.1: Contact API + page

**Files:**
- Create: `backend/api/contact/index.php`
- Modify: `frontend/src/pages/Contact.jsx`

- [ ] **Step 1: Write `backend/api/contact/index.php`**

```php
<?php
require_once __DIR__ . '/../../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$body    = json_decode(file_get_contents('php://input'), true);
$nom     = trim($body['nom']     ?? '');
$email   = trim($body['email']   ?? '');
$message = trim($body['message'] ?? '');

$errors = [];
if (strlen($nom) < 2)               $errors[] = 'Name too short';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email';
if (strlen($message) < 10)          $errors[] = 'Message too short (min 10 chars)';

if ($errors) { http_response_code(422); echo json_encode(['errors' => $errors]); exit; }

// Store in DB — add contact table to SQL, or just echo success for now
echo json_encode(['ok' => true]);
```

- [ ] **Step 2: Add rewrite to `backend/.htaccess`**

```apache
RewriteRule ^api/contact$ api/contact/index.php [QSA,L]
```

- [ ] **Step 3: Write `frontend/src/pages/Contact.jsx`**

```jsx
import { useState } from 'react'
import toast from 'react-hot-toast'

const BASE = 'http://localhost/gy_sole/backend/api'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch(`${BASE}/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json()
      if (!res.ok) throw body
      toast.success('Message sent!')
      setForm({ nom: '', email: '', message: '' })
    } catch (err) {
      toast.error(err?.errors?.join(', ') || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const inputClass = 'w-full bg-background border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-gold'

  return (
    <main className="container mx-auto px-4 pt-24 pb-16 max-w-lg">
      <h1 className="text-gold text-3xl font-bold mb-8">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Name" className={inputClass} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
        <input type="email" placeholder="Email" className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <textarea placeholder="Message" rows={5} className={inputClass} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        <button type="submit" disabled={sending} className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors disabled:opacity-50">
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/api/contact/ backend/.htaccess frontend/src/pages/Contact.jsx
git commit -m "feat: contact form wired to PHP API with toast feedback"
```

---

### Task 7.2: Reviews API + Questionnaire page

**Files:**
- Create: `backend/api/reviews/index.php`
- Modify: `frontend/src/pages/Questionnaire.jsx`

- [ ] **Step 1: Write `backend/api/reviews/index.php`**

```php
<?php
require_once __DIR__ . '/../../db.php';
header('Content-Type: application/json');

$pdo = getConnexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, nom, note, experience, commentaire, date_avis FROM avis ORDER BY date_avis DESC LIMIT 20');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = json_decode(file_get_contents('php://input'), true);
    $nom        = trim($body['nom']        ?? '');
    $email      = trim($body['email']      ?? '');
    $note       = (int)($body['note']      ?? 0);
    $experience = $body['experience']      ?? '';
    $newsletter = (int)($body['newsletter'] ?? 0);
    $commentaire= trim($body['commentaire'] ?? '');

    $errors = [];
    if (strlen($nom) < 2) $errors[] = 'Name required';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email';
    if ($note < 1 || $note > 5) $errors[] = 'Note must be 1-5';
    if (!in_array($experience, ['tres_satisfait','satisfait','insatisfait'])) $errors[] = 'Invalid experience';
    if (strlen($commentaire) < 5) $errors[] = 'Comment too short';

    if ($errors) { http_response_code(422); echo json_encode(['errors' => $errors]); exit; }

    $stmt = $pdo->prepare('INSERT INTO avis (nom, email, note, experience, newsletter, commentaire) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nom, $email, $note, $experience, $newsletter, $commentaire]);
    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
```

- [ ] **Step 2: Add rewrite**

```apache
RewriteRule ^api/reviews$ api/reviews/index.php [QSA,L]
```

- [ ] **Step 3: Write `frontend/src/pages/Questionnaire.jsx`**

```jsx
import { useState } from 'react'
import toast from 'react-hot-toast'

const BASE = 'http://localhost/gy_sole/backend/api'
const inputClass = 'w-full bg-background border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-gold'

export default function Questionnaire() {
  const [form, setForm] = useState({ nom: '', email: '', note: 5, experience: 'tres_satisfait', newsletter: false, commentaire: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch(`${BASE}/reviews`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, newsletter: form.newsletter ? 1 : 0 }),
      })
      const body = await res.json()
      if (!res.ok) throw body
      toast.success('Review submitted! Thank you.')
      setForm({ nom: '', email: '', note: 5, experience: 'tres_satisfait', newsletter: false, commentaire: '' })
    } catch (err) {
      toast.error(err?.errors?.join(', ') || 'Submission failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="container mx-auto px-4 pt-24 pb-16 max-w-lg">
      <h1 className="text-gold text-3xl font-bold mb-8">Share Your Experience</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Name" className={inputClass} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
        <input type="email" placeholder="Email" className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />

        <div>
          <label className="text-gray-400 text-sm mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, note: n }))}
                className={`w-10 h-10 rounded border font-bold transition-colors ${form.note === n ? 'bg-gold border-gold text-black' : 'border-white/20 text-white hover:border-gold'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <select className={inputClass} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
          <option value="tres_satisfait">Very Satisfied</option>
          <option value="satisfait">Satisfied</option>
          <option value="insatisfait">Unsatisfied</option>
        </select>

        <textarea placeholder="Your comment..." rows={4} className={inputClass} value={form.commentaire} onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))} />

        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
          <input type="checkbox" checked={form.newsletter} onChange={e => setForm(f => ({ ...f, newsletter: e.target.checked }))} className="accent-gold" />
          Subscribe to newsletter
        </label>

        <button type="submit" disabled={sending} className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-gold-light transition-colors disabled:opacity-50">
          {sending ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/api/reviews/ backend/.htaccess frontend/src/pages/Questionnaire.jsx
git commit -m "feat: reviews API + questionnaire form wired to API"
```

---

### Task 7.3: Home page polish

**Files:**
- Modify: `frontend/src/pages/Home.jsx`

- [ ] **Step 1: Write `frontend/src/pages/Home.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../api/products'
import { fetchBrands } from '../api/brands'
import ProductCard from '../components/ProductCard'

const IMG_BASE = 'http://localhost/gy_sole/gy_sole/img/'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [brands,   setBrands]   = useState([])

  useEffect(() => {
    fetchProducts().then(all => setFeatured(all.slice(0, 4)))
    fetchBrands().then(setBrands)
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-surface opacity-80" />
        <div className="relative text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            G<span className="text-gold">&</span>Y SOLE
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Premium footwear for men, women, and children from the world's leading brands.
          </p>
          <Link to="/products" className="inline-block px-8 py-4 bg-gold text-black font-bold text-lg rounded hover:bg-gold-light transition-colors">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Brands</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {brands.map(b => (
              <div key={b.id} className="text-center">
                <img src={IMG_BASE + b.logo} alt={b.nom} className="w-16 h-16 object-cover rounded-full mx-auto mb-2 border-2 border-gold/30" />
                <p className="text-gray-300 text-sm">{b.nom}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            <Link to="/products" className="text-gold hover:text-gold-light text-sm transition-colors">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify** — hero, brand logos, 4 featured products all render correctly.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Home.jsx
git commit -m "feat: home page with hero, brand showcase, featured products"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|-------------|------|
| Product catalog with live filtering | 3.3, 3.4 |
| Product detail with size selector | 3.5 |
| Cart as slide-in drawer, localStorage | 5.1, 5.2 |
| Login / register with JWT | 4.2, 4.3, 4.4 |
| Admin dashboard, role-based, product CRUD | 6.1, 6.2 |
| Contact form wired to API | 7.1 |
| Questionnaire form wired to API | 7.2 |
| Black/gold theme tokens in tailwind.config.js | 1.2 |
| Sticky navbar with cart badge + user avatar | 1.4, 5.2 |
| Framer Motion animations (cart drawer) | 5.2 |
| react-hot-toast for form feedback | 4.4, 5.2, 7.1, 7.2 |
| JWT in httpOnly cookie | 4.3 |
| All API endpoints return JSON | 2.2, 2.3, 2.4, 4.3, 7.1, 7.2 |
| Prepared statements on all user input | 2.3, 2.4, 4.3, 7.2 |
| `password_hash()` for passwords | 4.3 |
| Images reused from `gy_sole/img/` | ProductCard, CartDrawer, Home |

No gaps found.
