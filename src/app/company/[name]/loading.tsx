export default function CompanyLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div style={{ width: '120px', height: '14px', borderRadius: '4px', background: 'var(--bg-secondary)', marginBottom: '24px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '180px', height: '28px', borderRadius: '6px', background: 'var(--bg-secondary)' }} />
        <div style={{ width: '50px', height: '20px', borderRadius: '12px', background: 'var(--bg-secondary)' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: '80px', height: '14px', borderRadius: '4px', background: 'var(--bg-secondary)' }} />
        ))}
      </div>
      <div style={{ width: '100%', height: '80px', borderRadius: '8px', background: 'var(--bg-secondary)', opacity: 0.5, marginBottom: '20px' }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '10px',
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: '100%', height: '80px', borderRadius: '8px', background: 'var(--bg-secondary)', opacity: 0.4 }} />
        ))}
      </div>
    </main>
  )
}
