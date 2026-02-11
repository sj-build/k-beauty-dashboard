import Link from 'next/link'
import type { RankingItem } from '@/lib/types'
import { isKbeautyBrand, getCompanyName, rankBadgeClass, formatPrice, formatChange } from '@/lib/brands'

interface RankRowProps {
  readonly item: RankingItem
}

export function RankRow({ item }: RankRowProps) {
  const badgeCls = rankBadgeClass(item.rank)
  const isKb = isKbeautyBrand(item.brand)
  const company = getCompanyName(item.brand)
  const price = formatPrice(item.price, item.currency)
  const change = formatChange(item.wow_change, item.is_new)
  const delay = Math.min(item.rank, 10)

  const subPart = item.subcategory?.includes(':')
    ? item.subcategory.split(':')[1]
    : null

  const titleShort = item.title?.length > 65
    ? `${item.title.slice(0, 65)}...`
    : item.title

  return (
    <div className={`rank-row delay-${delay}`}>
      <div className={`rr-rank ${badgeCls}`}>{item.rank}</div>
      <div className="rr-info">
        <div className="rr-brand">
          <Link href={`/brand/${encodeURIComponent(item.brand)}`} className="brand-link">
            {isKb && <span className="kb-tag">🇰🇷 K-Beauty</span>}
            {item.brand}
            {subPart && <span className="subcat-label">{subPart}</span>}
            {company && <span className="co-tag">{company}</span>}
          </Link>
        </div>
        {titleShort && <div className="rr-title">{titleShort}</div>}
      </div>
      <div className="rr-price">{price}</div>
      <div className="rr-change">
        <span className={`ch-badge ${change.className}`}>{change.text}</span>
      </div>
    </div>
  )
}
