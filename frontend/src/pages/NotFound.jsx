import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 24px',
    }}>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#d4af37', marginBottom: 24 }}>
        404
      </p>
      <h1 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(48px, 10vw, 120px)',
        fontWeight: 700,
        color: '#2a2520',
        lineHeight: 1,
        marginBottom: 32,
      }}>
        Lost.
      </h1>
      <Link
        to="/"
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 11,
          letterSpacing: '0.25em',
          color: '#d4af37',
          textDecoration: 'none',
          textTransform: 'uppercase',
          borderBottom: '1px solid #6b5a1a',
          paddingBottom: 4,
        }}
      >
        Return Home
      </Link>
    </main>
  )
}
