export default function BrandLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div style={{ width: '120px', height: '14px', borderRadius: '4px', background: 'var(--bg-secondary)', marginBottom: '24px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '200px', height: '28px', borderRadius: '6px', background: 'var(--bg-secondary)' }} />
        <div style={{ width: '40px', height: '20px', borderRadius: '12px', background: 'var(--bg-secondary)' }} />
      </div>
      <div style={{ width: '120px', height: '14px', borderRadius: '4px', background: 'var(--bg-secondary)', marginBottom: '24px' }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="score-card" style={{ opacity: 0.5 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)' }} />
            <div style={{ width: '60px', height: '12px', borderRadius: '4px', background: 'var(--bg-secondary)', marginTop: '8px' }} />
          </div>
        ))}
      </div>
      <div style={{ width: '100%', height: '200px', borderRadius: '8px', background: 'var(--bg-secondary)', opacity: 0.5 }} />
    </main>
  )
}
