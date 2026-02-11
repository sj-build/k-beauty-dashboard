import Link from 'next/link'
import type { ClimberItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getClimbers } from '@/lib/queries'

interface ClimbersListProps {
  readonly category: string
}

export async function ClimbersList({ category }: ClimbersListProps) {
  const items: ClimberItem[] = await getClimbers(category)

  if (!items.length) {
    return <div className="empty-box">No risers found for this category</div>
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        return (
          <div key={item.brand_id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="signal-rank" style={{
              background: 'rgba(5, 150, 105, 0.08)',
              color: 'var(--accent-emerald)',
            }}>
              ▲{item.wow_change}
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
            {item.streak > 1 && (
              <div className="signal-meta">
                {item.streak}W streak
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
