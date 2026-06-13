import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/products',      label: 'Collection' },
  { to: '/contact',       label: 'Contact' },
  { to: '/questionnaire', label: 'Reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchVal, setSearchVal]     = useState('')
  const searchRef                     = useRef(null)
  const navigate                      = useNavigate()

  // cart count placeholder — Phase 5 wires CartContext
  const cartCount = 0
  const NAV_H = 72

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchVal('') } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  return (
    <>
      <style>{`
        .nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: none;
          text-decoration: none;
          color: #ffffff;
          transition: color 0.2s ease;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #d4af37;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #d4af37; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #d4af37; }
        .nav-link.active::after { width: 100%; }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #ffffff;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          position: relative;
        }
        .icon-btn:hover { color: #d4af37; }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #d4af37;
          color: #0f0f0f;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }

        .search-overlay {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 72px;
          background: #000;
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 16px;
          border-bottom: 1px solid rgba(212,175,55,0.35);
          animation: searchSlideIn 0.2s ease;
        }
        @keyframes searchSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #f5f0e6;
          caret-color: #d4af37;
        }
        .search-input::placeholder { color: #555; }
        .search-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 4px;
          font-size: 20px;
          line-height: 1;
          transition: color 0.2s;
        }
        .search-close:hover { color: #d4af37; }

        .hamburger-line {
          display: block;
          width: 20px;
          height: 1px;
          background: #c0b99e;
          transition: all 0.25s ease;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link::after, .nav-link, .icon-btn, .hamburger-line,
          .search-overlay { transition: none; animation: none; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: NAV_H,
      }}>
        {/* Search overlay */}
        {searchOpen && (
          <form className="search-overlay" onSubmit={handleSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              className="search-input"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search shoes, brands…"
              aria-label="Search"
            />
            <button type="button" className="search-close" onClick={() => { setSearchOpen(false); setSearchVal('') }} aria-label="Close search">×</button>
          </form>
        )}

        {/* Main bar */}
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: scrolled ? 'rgba(8,8,8,0.97)' : 'rgba(0,0,0,0.55)',
          borderBottom: scrolled
            ? '1px solid rgba(212,175,55,0.22)'
            : '1px solid rgba(212,175,55,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

            {/* Wordmark */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 28,
                fontWeight: 900,
                color: '#d4af37',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                G&amp;Y Sole
              </span>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="desktop-nav">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              ))}

              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

              {/* Icon cluster */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Search */}
                <button
                  className="icon-btn"
                  aria-label="Search"
                  onClick={() => { setSearchOpen(v => !v); setSearchVal('') }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>

                {/* Account */}
                <NavLink
                  to="/account"
                  className={({ isActive }) => `icon-btn${isActive ? '' : ''}`}
                  style={({ isActive }) => ({ color: isActive ? '#d4af37' : undefined, textDecoration: 'none' })}
                  aria-label="Account"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </NavLink>

                {/* Cart */}
                <button className="icon-btn" aria-label="Open cart">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
                  )}
                </button>
              </div>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px', display: 'none',
                flexDirection: 'column', gap: 5, alignItems: 'flex-end',
              }}
              className="hamburger-btn"
            >
              <span className="hamburger-line" style={{
                transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                background: menuOpen ? '#d4af37' : '#c0b99e',
              }} />
              <span className="hamburger-line" style={{ width: 14, opacity: menuOpen ? 0 : 1 }} />
              <span className="hamburger-line" style={{
                transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                background: menuOpen ? '#d4af37' : '#c0b99e',
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: NAV_H, left: 0, right: 0, zIndex: 99,
          background: 'rgba(8,8,8,0.98)',
          borderBottom: '1px solid rgba(212,175,55,0.12)',
          backdropFilter: 'blur(16px)',
          padding: '16px 32px 32px',
        }}>
          {[...NAV_LINKS, { to: '/account', label: 'Account' }].map(({ to, label }, i, arr) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={{
                display: 'block', padding: '14px 0', fontSize: 14,
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <div style={{ height: NAV_H }} />
    </>
  )
}
