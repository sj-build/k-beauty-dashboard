import Link from 'next/link'
import type { TopRankerItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getTopRankers } from '@/lib/queries'

interface TopRankersListProps {
  readonly category: string
}

export async function TopRankersList({ category }: TopRankersListProps) {
  const items: TopRankerItem[] = await getTopRankers(category)

  if (!items.length) {
    return <div className="empty-box">No top rankers found for this category</div>
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        return (
          <div key={item.brand_id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="signal-rank">{item.best_rank}</div>
            <div className="signal-info">
              <div className="signal-brand">
                {isKb && <span className="kb-tag">🇰🇷 K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.brand_name)}`} className="brand-link">
                  {item.brand_name}
                </Link>
              </div>
              <div className="signal-explain">{item.explanation}</div>
            </div>
            <div className="signal-meta">
              {item.weeks_in_top}W Top10
            </div>
          </div>
        )
      })}
    </div>
  )
}
