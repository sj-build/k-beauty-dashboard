import Link from 'next/link'
import type { HiddenGemItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getHiddenGems } from '@/lib/queries'

function scoreBar(value: number, max: number, color: string) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: '60px',
        height: '4px',
        borderRadius: '2px',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: '2px',
          background: color,
        }} />
      </div>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
        {value}
      </span>
    </div>
  )
}

export async function HiddenGemsList({ category }: { readonly category?: string }) {
  const items: HiddenGemItem[] = await getHiddenGems(category)

  if (!items.length) {
    return <div className="empty-box">No hidden gems found for this category yet. More data needed.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        const composite = item.new_leader_score * 2 + item.growth_score * 1.5 + item.cross_border_score

        return (
          <div key={item.brand_id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="signal-rank" style={{
              background: composite >= 60
                ? 'rgba(5, 150, 105, 0.08)'
                : composite >= 30
                  ? 'rgba(217, 119, 6, 0.08)'
                  : 'rgba(99, 102, 241, 0.08)',
              color: composite >= 60
                ? 'var(--accent-emerald)'
                : composite >= 30
                  ? 'var(--accent-amber)'
                  : 'var(--accent-indigo)',
              fontSize: '0.65rem',
              fontWeight: 700,
            }}>
              #{idx + 1}
            </div>
            <div className="signal-info" style={{ flex: 1 }}>
              <div className="signal-brand">
                {isKb && <span className="kb-tag">K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.brand_name)}`} className="brand-link">
                  {item.brand_name}
                </Link>
                {item.company_name && (
                  <Link
                    href={`/company/${encodeURIComponent(item.company_name)}`}
                    style={{
                      fontSize: '0.6rem',
                      color: 'var(--text-quaternary)',
                      textDecoration: 'none',
                      marginLeft: '4px',
                    }}
                  >
                    {item.company_name}
                  </Link>
                )}
              </div>
              <div className="signal-explain">{item.explanation}</div>

              {/* Score bars */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                {item.new_leader_score > 0 && (
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-quaternary)', fontWeight: 600, marginBottom: '2px' }}>
                      NEW ENTRY
                    </div>
                    {scoreBar(item.new_leader_score, 100, '#059669')}
                  </div>
                )}
                {item.growth_score > 0 && (
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-quaternary)', fontWeight: 600, marginBottom: '2px' }}>
                      GROWTH
                    </div>
                    {scoreBar(item.growth_score, 100, '#d97706')}
                  </div>
                )}
                {item.cross_border_score > 0 && (
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-quaternary)', fontWeight: 600, marginBottom: '2px' }}>
                      CROSS-BORDER
                    </div>
                    {scoreBar(item.cross_border_score, 100, '#6366f1')}
                  </div>
                )}
              </div>

              {/* Platform badges */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {item.platforms.map((p) => (
                  <span key={p} className="ss-platform-badge">{p}</span>
                ))}
                {item.best_rank && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-indigo)',
                  }}>
                    Best #{item.best_rank}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
