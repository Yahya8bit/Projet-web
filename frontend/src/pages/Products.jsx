import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const IMG = (name) => `/img/${name}`
const API = 'http://localhost/gy_sole/backend/api'

const BRANDS      = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse']
const COLLECTIONS = ['Men', 'Women', 'Kids']
const TYPES       = ['Running', 'Casual', 'Lifestyle']
const PRICE_STEPS = [100, 150, 200, 300]

const FALLBACK = [
  { id:1, marque:'Nike',        modele:'Air Max 90',      type:'Running',   prix:'149.99', photo:'nike.jpg',       disponible:1 },
  { id:2, marque:'Nike',        modele:'Air Force 1',     type:'Casual',    prix:'109.99', photo:'nike.jpg',       disponible:1 },
  { id:3, marque:'Adidas',      modele:'Ultraboost 22',   type:'Running',   prix:'189.99', photo:'adidas.jpg',     disponible:1 },
  { id:4, marque:'Puma',        modele:'Cali Dream',      type:'Lifestyle', prix:'89.99',  photo:'puma.jpg',       disponible:1 },
  { id:5, marque:'New Balance', modele:'New Balance 574', type:'Lifestyle', prix:'79.99',  photo:'newbalance.jpg', disponible:1 },
  { id:6, marque:'New Balance', modele:'New Balance 990', type:'Running',   prix:'174.99', photo:'newbalance.jpg', disponible:1 },
  { id:7, marque:'Converse',    modele:'Chuck Taylor Hi', type:'Casual',    prix:'69.99',  photo:'converse.jpg',   disponible:1 },
  { id:8, marque:'Nike',        modele:'Nike Revolution', type:'Running',   prix:'59.99',  photo:'nike.jpg',       disponible:1 },
]

function useClickOutside(ref, cb) {
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

const CTRL_H = 44

function FilterDropdown({ label, count, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const active = count > 0

  return (
    <div ref={ref} style={{ position: 'relative', height: CTRL_H }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`filter-pill${active ? ' filter-pill-active' : ''}`}
      >
        {label}{active ? ` (${count})` : ''}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          stroke={active ? '#0f0f0f' : '#d4af37'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={open ? 'M1 5l4-4 4 4' : 'M1 1l4 4 4-4'}/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: '#1a1a1a', border: '1px solid #333',
          borderTop: '2px solid #d4af37',
          minWidth: 190,
          boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function OptionPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      role="option"
      aria-selected={active}
      style={{
        display: 'flex', width: '100%', textAlign: 'left',
        minHeight: 44, padding: '0 14px',
        alignItems: 'center', justifyContent: 'space-between',
        background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
        border: 'none',
        color: active ? '#d4af37' : '#c0bdb5',
        fontFamily: "'Inter', sans-serif", fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
      {active && <span style={{ color: '#d4af37', fontSize: 11 }}>✓</span>}
    </button>
  )
}

export default function Products() {
  const [searchParams]                  = useSearchParams()
  const [allProducts, setAllProducts]   = useState(FALLBACK)
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState(searchParams.get('search') || '')
  const [brands, setBrands]             = useState(() => searchParams.get('brand') ? [searchParams.get('brand')] : [])
  const [collections, setCollections]   = useState(() => searchParams.get('collection') ? [searchParams.get('collection')] : [])
  const [types, setTypes]               = useState([])
  const [maxPrice, setMaxPrice]         = useState(null)
  const [sort, setSort]                 = useState('default')

  useEffect(() => {
    fetch(`${API}/products/`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setAllProducts(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function toggle(list, setList, val) {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  function clearAll() {
    setBrands([]); setCollections([]); setTypes([])
    setSearch(''); setMaxPrice(null); setSort('default')
  }

  const filtered = useMemo(() => {
    let out = allProducts.filter(p => {
      if (brands.length && !brands.includes(p.marque)) return false
      if (collections.length && !collections.includes(p.collection)) return false
      if (types.length && !types.includes(p.type)) return false
      if (maxPrice !== null && Number(p.prix) > maxPrice) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!p.modele.toLowerCase().includes(q) && !p.marque.toLowerCase().includes(q) && !p.type.toLowerCase().includes(q)) return false
      }
      return true
    })
    if (sort === 'asc')  out = [...out].sort((a, b) => Number(a.prix) - Number(b.prix))
    if (sort === 'desc') out = [...out].sort((a, b) => Number(b.prix) - Number(a.prix))
    return out
  }, [allProducts, brands, collections, types, maxPrice, search, sort])

  // Active filter chips for display
  const activeChips = [
    ...brands.map(b => ({ label: b,         clear: () => setBrands(p => p.filter(v => v !== b)) })),
    ...collections.map(c => ({ label: c,    clear: () => setCollections(p => p.filter(v => v !== c)) })),
    ...types.map(t => ({ label: t,          clear: () => setTypes(p => p.filter(v => v !== t)) })),
    ...(maxPrice !== null ? [{ label: `≤${maxPrice} DT`, clear: () => setMaxPrice(null) }] : []),
  ]

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', color: '#f5f0e6' }}>
      <style>{`
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) { .prod-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px)  { .prod-grid { grid-template-columns: repeat(2, 1fr); } }

        .prod-card {
          display: block; text-decoration: none; color: inherit;
          background: transparent;
          transition: background 0.15s;
          padding-bottom: 10px;
        }
        .prod-card:hover { background: #141414; }
        .prod-card-img-wrap { overflow: hidden; position: relative; }
        .prod-card-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .prod-card:hover .prod-card-img { transform: scale(1.04); }

        /* Filter pill — base */
        .filter-pill {
          height: 44px;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 18px;
          background: #1e1e1e;
          border: none;
          color: #e8e4dc;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .filter-pill:hover { background: #2a2a2a; color: #fff; }
        .filter-pill-active {
          background: #d4af37 !important;
          color: #0f0f0f !important;
          font-weight: 700;
        }
        .filter-pill-active:hover { background: #e8c44a !important; }

        /* Search */
        .search-input {
          height: 44px;
          box-sizing: border-box;
          background: #1e1e1e;
          border: none;
          color: #f5f0e6;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          padding: 0 16px 0 38px;
          outline: none;
          width: 220px;
          transition: background 0.15s;
        }
        .search-input:hover { background: #2a2a2a; }
        .search-input:focus { background: #2a2a2a; outline: 2px solid #d4af37; outline-offset: 2px; }
        .search-input::placeholder { color: #aaa; }

        /* Sort */
        .sort-select {
          height: 44px;
          box-sizing: border-box;
          background: #1e1e1e;
          border: none;
          color: #e8e4dc;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          padding: 0 16px;
          outline: none;
          cursor: pointer;
          transition: background 0.15s;
        }
        .sort-select:hover { background: #2a2a2a; }
        .sort-select:focus { background: #2a2a2a; outline: 2px solid #d4af37; outline-offset: 2px; }

        .active-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500;
        }
        .active-chip-x {
          background: none; border: none; color: #d4af37;
          cursor: pointer; font-size: 14px; line-height: 1;
          padding: 0; display: flex; align-items: center;
        }
        .active-chip-x:hover { color: #f0d273; }

        @media (prefers-reduced-motion: reduce) { .prod-card-img { transition: none; } }
      `}</style>

      <div style={{ padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px) 0' }}>
        {/* Title + count */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900, color: '#f5f0e6', lineHeight: 1, margin: 0,
          }}>All shoes</h1>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#aaa' }}>
            {loading ? 'Loading…' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          flexWrap: 'wrap',
          background: '#161616',
          padding: '10px 12px',
          marginBottom: 12,
          borderBottom: '2px solid #d4af37',
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search" />
          </div>

          {/* Brand dropdown */}
          <FilterDropdown label="Brand" count={brands.length}>
            {BRANDS.map(b => (
              <OptionPill key={b} active={brands.includes(b)} onClick={() => toggle(brands, setBrands, b)}>{b}</OptionPill>
            ))}
          </FilterDropdown>

          {/* Collection dropdown */}
          <FilterDropdown label="Collection" count={collections.length}>
            {COLLECTIONS.map(c => (
              <OptionPill key={c} active={collections.includes(c)} onClick={() => toggle(collections, setCollections, c)}>{c}</OptionPill>
            ))}
          </FilterDropdown>

          {/* Type dropdown */}
          <FilterDropdown label="Type" count={types.length}>
            {TYPES.map(t => (
              <OptionPill key={t} active={types.includes(t)} onClick={() => toggle(types, setTypes, t)}>{t}</OptionPill>
            ))}
          </FilterDropdown>

          {/* Price dropdown */}
          <FilterDropdown label="Price" count={maxPrice !== null ? 1 : 0}>
            {PRICE_STEPS.map(p => (
              <OptionPill key={p} active={maxPrice === p} onClick={() => setMaxPrice(prev => prev === p ? null : p)}>
                Under {p} DT
              </OptionPill>
            ))}
          </FilterDropdown>

          {/* Sort — pushed right */}
          <div style={{ marginLeft: 'auto' }}>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
              <option value="default">Sort: Default</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
            {activeChips.map(({ label, clear }) => (
              <span key={label} className="active-chip">
                {label}
                <button className="active-chip-x" onClick={clear} aria-label={`Remove ${label}`}>×</button>
              </span>
            ))}
            <button onClick={clearAll} style={{
              background: 'none', border: 'none', color: '#aaa',
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              cursor: 'pointer', padding: '4px 0', textDecoration: 'underline',
            }}>Clear all</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div style={{ padding: '24px clamp(24px, 5vw, 64px) 80px' }}>
        {!loading && filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 28, fontWeight: 700, color: '#f5f0e6', marginBottom: 12,
            }}>No products match your filters</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#aaa', marginBottom: 24 }}>
              Try adjusting or clearing the filters above.
            </p>
            <button onClick={clearAll} style={{
              background: '#d4af37', border: 'none', padding: '10px 28px',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
              color: '#0f0f0f', cursor: 'pointer',
            }}>Clear all filters</button>
          </div>
        ) : (
          <div className="prod-grid">
            {filtered.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="prod-card">
                <div className="prod-card-img-wrap">
                  <img className="prod-card-img" src={IMG(p.photo)} alt={p.modele} />
                  {!p.disponible && (
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      background: '#1a1a1a', color: '#aaa',
                      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
                      padding: '3px 8px',
                    }}>Out of stock</span>
                  )}
                </div>
                <div style={{ padding: '10px 10px 0' }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#aaa', marginBottom: 4 }}>
                    {p.marque} · {p.type}
                  </p>
                  <p style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 14, fontWeight: 700, color: '#f5f0e6', marginBottom: 5, lineHeight: 1.2,
                  }}>{p.modele}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#d4af37' }}>
                    {Number(p.prix).toFixed(2)} DT
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
