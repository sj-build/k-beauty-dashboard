'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Something went wrong
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>
        Failed to load this page. Please try again.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '6px 16px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '6px 16px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)',
            color: 'var(--text-tertiary)',
            textDecoration: 'none',
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
