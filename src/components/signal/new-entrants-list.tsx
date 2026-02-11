import Link from 'next/link'
import type { NewEntrantItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getNewEntrants } from '@/lib/queries'

interface NewEntrantsListProps {
  readonly category: string
}

export async function NewEntrantsList({ category }: NewEntrantsListProps) {
  const items: NewEntrantItem[] = await getNewEntrants(category)

  if (!items.length) {
    return <div className="empty-box">No new entrants this week</div>
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        return (
          <div key={item.brand_id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="signal-rank" style={{
              background: 'rgba(217, 119, 6, 0.10)',
              color: 'var(--accent-amber)',
              fontSize: '0.6rem',
              fontWeight: 700,
            }}>
              NEW
            </div>
            <div className="signal-info">
              <div className="signal-brand">
                {isKb && <span className="kb-tag">🇰🇷 K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.brand_name)}`} className="brand-link">
                  {item.brand_name}
                </Link>
              </div>
              <div className="signal-explain">{item.explanation}</div>
            </div>
            {item.entry_rank && (
              <div className="signal-meta">
                #{item.entry_rank}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
