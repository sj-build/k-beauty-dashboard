import Link from 'next/link'
import type { CrossBorderItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getCrossborder } from '@/lib/queries'
import { REGION_FLAGS } from '@/lib/constants'

interface CrossborderListProps {
  readonly category: string
}

export async function CrossborderList({ category }: CrossborderListProps) {
  const items: CrossBorderItem[] = await getCrossborder(category)

  if (!items.length) {
    return <div className="empty-box">No cross-border brands found</div>
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        return (
          <div key={item.brand_id} className={`xb-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="xb-brand">
              {isKb && <span className="kb-tag">🇰🇷 K-Beauty</span>}
              <Link href={`/brand/${encodeURIComponent(item.brand_name)}`} className="brand-link">
                {item.brand_name}
              </Link>
              {item.brand_name_kr && (
                <span className="text-text-tertiary text-xs">{item.brand_name_kr}</span>
              )}
            </div>
            <div className="xb-regions">
              {item.regions.map((region) => (
                <span key={region} className="xb-region-badge">{REGION_FLAGS[region] ?? ''} {region}</span>
              ))}
            </div>
            <div className="xb-explain">{item.explanation}</div>
          </div>
        )
      })}
    </div>
  )
}
