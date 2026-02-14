'use client'

export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#fafafa',
        color: '#1a1a1a',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '8px 20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid #e2e2e2',
              borderRadius: '6px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
