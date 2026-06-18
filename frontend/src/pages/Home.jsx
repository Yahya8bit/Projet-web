import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { fetchProducts } from '../api/products'

const IMG = (name) => `/img/${name}`

const BRANDS = [
  { name: 'Nike',        img: 'nike.jpg',        to: '/products?brand=Nike' },
  { name: 'Adidas',      img: 'adidas.jpg',      to: '/products?brand=Adidas' },
  { name: 'Puma',        img: 'puma.jpg',         to: '/products?brand=Puma' },
  { name: 'New Balance', img: 'newbalance.jpg',   to: '/products?brand=New+Balance' },
  { name: 'Converse',    img: 'converse.jpg',     to: '/products?brand=Converse' },
]

const COLLECTIONS = [
  { label: 'Men',   sub: "Running, casual, lifestyle", img: 'nike.jpg',       to: '/products?collection=Men' },
  { label: 'Women', sub: "Running, casual, lifestyle", img: 'adidas.jpg',     to: '/products?collection=Women' },
  { label: 'Kids',  sub: "Built for movement",         img: 'newbalance.jpg', to: '/products?collection=Kids' },
]

const FALLBACK_PRODUCTS = [
  { id:1, marque:'Nike',        modele:'Air Max 90',      type:'Running',   prix:'149.99', photo:'nike.jpg',       disponible:1 },
  { id:2, marque:'Nike',        modele:'Air Force 1',     type:'Casual',    prix:'109.99', photo:'nike.jpg',       disponible:1 },
  { id:3, marque:'Adidas',      modele:'Ultraboost 22',   type:'Running',   prix:'189.99', photo:'adidas.jpg',     disponible:1 },
  { id:4, marque:'Puma',        modele:'Cali Dream',      type:'Lifestyle', prix:'89.99',  photo:'puma.jpg',       disponible:1 },
  { id:5, marque:'New Balance', modele:'New Balance 574', type:'Lifestyle', prix:'79.99',  photo:'newbalance.jpg', disponible:1 },
  { id:6, marque:'New Balance', modele:'New Balance 990', type:'Running',   prix:'174.99', photo:'newbalance.jpg', disponible:1 },
  { id:7, marque:'Converse',    modele:'Chuck Taylor Hi', type:'Casual',    prix:'69.99',  photo:'converse.jpg',   disponible:1 },
  { id:8, marque:'Nike',        modele:'Nike Revolution', type:'Running',   prix:'59.99',  photo:'nike.jpg',       disponible:1 },
]

export default function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const rowRef = useRef(null)

  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.length) setProducts(data) })
      .catch(() => {})
  }, [])

  function scrollRow(dir) {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 520, behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#0f0f0f', color: '#f5f0e6' }}>
      <style>{`
        /* ── Hero split ── */
        .hero-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: calc(100vh - 64px);
          min-height: 520px;
        }
        .hero-panel {
          position: relative;
          overflow: hidden;
        }
        .hero-panel img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .hero-panel:hover img { transform: scale(1.03); }
        .hero-grad {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%);
        }
        .hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: clamp(28px, 4vw, 56px);
        }

        /* ── Product row ── */
        .product-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .product-row::-webkit-scrollbar { display: none; }
        .product-item {
          flex: 0 0 calc(22% - 20px);
          min-width: 240px;
          scroll-snap-align: start;
          text-decoration: none;
          display: block;
        }
        .product-item-img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .product-item:hover .product-item-img { transform: scale(1.04); }

        /* ── Collection tiles ── */
        .col-tiles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          height: clamp(320px, 42vw, 540px);
        }
        .col-tile {
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
        }
        .col-tile img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, filter 0.35s ease;
        }
        .col-tile:hover img { transform: scale(1.06); filter: brightness(0.85); }
        .col-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.04) 80%);
        }
        .col-tile-cta {
          display: inline-block;
          margin-top: 12px;
          padding: 9px 20px;
          background: #d4af37;
          color: #0f0f0f;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.18s;
        }
        .col-tile:hover .col-tile-cta { background: #f0d273; }

        /* ── Brand grid ── */
        .brand-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          padding: 0 clamp(24px, 5vw, 64px);
        }
        .brand-cell {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          display: block;
          text-decoration: none;
        }
        .brand-cell img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(40%) brightness(0.6);
          transition: transform 0.45s ease, filter 0.35s ease;
        }
        .brand-cell:hover img {
          transform: scale(1.07);
          filter: grayscale(0%) brightness(0.85);
        }
        .brand-cell-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 60%);
          transition: opacity 0.3s ease;
        }
        .brand-cell:hover .brand-cell-overlay { opacity: 0.7; }
        .brand-cell-name {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 18px 16px;
        }
        .brand-cell-label {
          display: inline-block;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(14px, 1.4vw, 20px);
          font-weight: 900;
          color: #d4af37;
          line-height: 1;
          border-bottom: 1.5px solid rgba(212,175,55,0.45);
          padding-bottom: 3px;
          transition: color 0.2s, border-color 0.2s;
        }
        .brand-cell:hover .brand-cell-label {
          color: #f0d273;
          border-color: rgba(240,210,115,0.7);
        }

        /* ── Scroll arrow ── */
        .scroll-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          color: #f5f0e6;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 18px;
          z-index: 2;
          transition: background 0.15s, border-color 0.15s;
        }
        .scroll-arrow:hover { background: #1a1a1a; border-color: #d4af37; color: #d4af37; }

        /* ── Fat footer ── */
        .fat-footer {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
          padding: clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px);
          border-top: 1px solid #1a1a1a;
          align-items: start;
        }

        @media (max-width: 900px) {
          .hero-split { grid-template-columns: 1fr; height: auto; }
          .hero-panel { height: 60vw; min-height: 280px; }
          .col-tiles { grid-template-columns: 1fr; height: auto; }
          .col-tile { height: 52vw; min-height: 220px; }
          .brand-grid { grid-template-columns: repeat(3, 1fr); }
          .fat-footer { grid-template-columns: 1fr 1fr; }
          .product-item { min-width: 56vw; flex: 0 0 56vw; }
        }
        @media (max-width: 600px) {
          .brand-grid { grid-template-columns: repeat(2, 1fr); }
          .fat-footer { grid-template-columns: 1fr; gap: 32px; }
          .product-item { min-width: 78vw; flex: 0 0 78vw; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-panel img, .col-tile img, .product-item-img, .brand-cell img,
          .col-tile-cta, .brand-cell, .scroll-arrow { transition: none; }
        }
      `}</style>

      {/* ══ SPLIT-SCREEN HERO ══════════════════════════════════════ */}
      <section className="hero-split">
        {/* Left panel */}
        <div className="hero-panel">
          <img src={IMG('puma.jpg')} alt="Puma sneaker" />
          <div className="hero-grad" />
          <div className="hero-content">
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(32px, 4vw, 64px)',
              fontWeight: 900, lineHeight: 1.0,
              color: '#f5f0e6', marginBottom: 12, textWrap: 'balance',
            }}>
              The shoes worth the shelf space.
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              color: 'rgba(255,255,255,0.65)', marginBottom: 24,
            }}>
              5 brands. 8 styles. Men, women and kids.
            </p>
            <Link to="/products" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              color: '#d4af37', textDecoration: 'none',
              borderBottom: '1px solid #d4af37', paddingBottom: 2,
            }}>
              Shop the collection →
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="hero-panel">
          <img src={IMG('nike.jpg')} alt="Nike sneaker" />
          <div className="hero-grad" />
          <div className="hero-content">
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11,
              color: '#d4af37', marginBottom: 10, textTransform: 'none',
            }}>
              New arrival
            </p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(26px, 3.5vw, 52px)',
              fontWeight: 900, lineHeight: 1.05,
              color: '#f5f0e6', marginBottom: 20, textWrap: 'balance',
            }}>
              Nike Air Max 90
            </h2>
            <Link to="/products?brand=Nike" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              color: '#d4af37', textDecoration: 'none',
              borderBottom: '1px solid #d4af37', paddingBottom: 2,
            }}>
              Shop Nike →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ POPULAR PRODUCTS — photo on canvas, no box ═════════════ */}
      <section style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: '0 clamp(24px, 5vw, 64px)', marginBottom: 40, gap: 12, flexWrap: 'wrap',
        }}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 700, color: '#f5f0e6',
          }}>Popular right now</h2>
          <Link to="/products" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#a0a0a0',
            textDecoration: 'none', borderBottom: '1px solid #2a2a2a', paddingBottom: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f5f0e6'; e.currentTarget.style.borderColor = '#555' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#a0a0a0'; e.currentTarget.style.borderColor = '#2a2a2a' }}
          >
            See all
          </Link>
        </div>

        <div style={{ position: 'relative' }}>
          <button className="scroll-arrow" style={{ left: 12 }} onClick={() => scrollRow(-1)} aria-label="Scroll left">‹</button>
          <div
            ref={rowRef}
            className="product-row"
            style={{ padding: '0 clamp(24px, 5vw, 64px)' }}
          >
            {products.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="product-item">
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img className="product-item-img" src={IMG(p.photo)} alt={p.modele} />
                  {!p.disponible && (
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      background: '#333', color: '#a0a0a0',
                      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
                      padding: '3px 8px',
                    }}>Out of stock</span>
                  )}
                </div>
                <div style={{ paddingTop: 16 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#777', marginBottom: 6, letterSpacing: '0.01em' }}>
                    {p.marque} · {p.type}
                  </p>
                  <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 700, color: '#f5f0e6', marginBottom: 8, lineHeight: 1.25 }}>
                    {p.modele}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#d4af37' }}>
                    {Number(p.prix).toFixed(2)} DT
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button className="scroll-arrow" style={{ right: 12 }} onClick={() => scrollRow(1)} aria-label="Scroll right">›</button>
        </div>
      </section>

      {/* ══ COLLECTION TILES ═══════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(24px, 5vw, 64px) clamp(48px, 6vw, 80px)' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 700, color: '#f5f0e6',
          }}>Shop by collection</h2>
        </div>
        <div className="col-tiles">
          {COLLECTIONS.map(c => (
            <Link key={c.label} to={c.to} className="col-tile">
              <img src={IMG(c.img)} alt={c.label} />
              <div className="col-tile-overlay" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(20px, 3vw, 36px)' }}>
                <p style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: 900,
                  color: '#fff', lineHeight: 1, marginBottom: 4,
                }}>
                  {c.label}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.78)', marginBottom: 16, letterSpacing: '0.01em' }}>
                  {c.sub}
                </p>
                <span className="col-tile-cta">Shop {c.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ BRAND GRID ═════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 clamp(48px, 6vw, 80px)' }}>
        <div style={{ padding: '0 clamp(24px, 5vw, 64px)', marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 700, color: '#f5f0e6',
          }}>Shop by brand</h2>
        </div>
        <div className="brand-grid">
          {BRANDS.map(b => (
            <Link key={b.name} to={b.to} className="brand-cell">
              <img src={IMG(b.img)} alt={b.name} />
              <div className="brand-cell-overlay" />
              <div className="brand-cell-name">
                <span className="brand-cell-label">{b.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ FAT FOOTER ═════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #d4af37' }}>
        <div className="fat-footer">
          {/* Brand col */}
          <div>
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 26, fontWeight: 900, color: '#d4af37', marginBottom: 14, marginTop: 0,
            }}>G&amp;Y Sole</p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#888',
              lineHeight: 1.75, maxWidth: '28ch', marginBottom: 28,
            }}>
              Premium sneakers for men, women and kids. Tunis, Tunisia.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.84 1.55V6.86a4.85 4.85 0 01-1.07-.17z' },
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ color: '#666', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.path}/></svg>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888', marginBottom: 10 }}>
              Get notified about new drops
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRight: 'none', padding: '7px 12px',
                  fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#f5f0e6',
                  outline: 'none', minWidth: 0,
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#d4af37'}
                onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              />
              <button type="submit" style={{
                background: '#d4af37', border: 'none', padding: '7px 14px',
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700,
                color: '#0f0f0f', cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0d273'}
                onMouseLeave={e => e.currentTarget.style.background = '#d4af37'}
              >Subscribe</button>
            </form>
          </div>

          {/* Shop col */}
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#f5f0e6', marginBottom: 8, marginTop: 0 }}>Shop</p>
            <div style={{ width: 32, height: 1.5, background: '#d4af37', marginBottom: 18 }} />
            {[['All products', '/products'], ['Men', '/products?collection=Men'], ['Women', '/products?collection=Women'], ['Kids', '/products?collection=Kids']].map(([l, t]) => (
              <Link key={l} to={t} style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#c0bdb5', textDecoration: 'none', marginBottom: 12 }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => e.currentTarget.style.color = '#c0bdb5'}
              >{l}</Link>
            ))}
          </div>

          {/* Brands col */}
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#f5f0e6', marginBottom: 8, marginTop: 0 }}>Brands</p>
            <div style={{ width: 32, height: 1.5, background: '#d4af37', marginBottom: 18 }} />
            {BRANDS.map(b => (
              <Link key={b.name} to={b.to} style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#c0bdb5', textDecoration: 'none', marginBottom: 12 }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => e.currentTarget.style.color = '#c0bdb5'}
              >{b.name}</Link>
            ))}
          </div>

          {/* Info col */}
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#f5f0e6', marginBottom: 8, marginTop: 0 }}>Info</p>
            <div style={{ width: 32, height: 1.5, background: '#d4af37', marginBottom: 18 }} />
            {[['Contact us', '/contact'], ['Leave a review', '/questionnaire'], ['My account', '/account']].map(([l, t]) => (
              <Link key={l} to={t} style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#c0bdb5', textDecoration: 'none', marginBottom: 12 }}
                onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={e => e.currentTarget.style.color = '#c0bdb5'}
              >{l}</Link>
            ))}
          </div>
        </div>

        <div style={{
          padding: '18px clamp(24px, 5vw, 64px)',
          borderTop: '1px solid #1e1e1e',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#666' }}>
            © 2026 G&amp;Y Sole. All rights reserved.
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#666' }}>
            Tunis, Tunisia
          </span>
        </div>
      </footer>
    </main>
  )
}
