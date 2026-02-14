import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Page not found
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          padding: '6px 16px',
          fontSize: '0.75rem',
          fontWeight: 600,
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textDecoration: 'none',
        }}
      >
        Back to Dashboard
      </Link>
    </main>
  )
}
