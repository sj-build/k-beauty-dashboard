import Link from 'next/link'
import type { RankingItem } from '@/lib/types'
import { isKbeautyBrand, getCompanyName, formatPrice, formatChange } from '@/lib/brands'

interface RankRowProps {
  readonly item: RankingItem
  readonly region?: string
  readonly category?: string
}

function truncateTitle(title: string | undefined, maxLen: number = 45): string {
  if (!title) return ''
  // Strip common prefixes like "[특가]", "[리뷰이벤트]", etc.
  const cleaned = title.replace(/^\[.*?\]\s*/g, '').trim()
  if (cleaned.length <= maxLen) return cleaned
  return `${cleaned.slice(0, maxLen)}...`
}

const HAIRCARE_CATEGORIES = new Set(['hair', 'haircare'])

export function RankRow({ item, region = 'KR', category }: RankRowProps) {
  const isKb = isKbeautyBrand(item.brand)
  const isOverseas = region !== 'KR'
  const isHaircare = category ? HAIRCARE_CATEGORIES.has(category) : false
  const company = getCompanyName(item.brand)
  const price = formatPrice(item.price, item.currency)
  const change = formatChange(item.wow_change, item.is_new)
  const delay = Math.min(item.rank, 10)

  const subPart = item.subcategory?.includes(':')
    ? item.subcategory.split(':')[1]
    : null

  const titleShort = truncateTitle(item.title)

  // Highlight K-beauty rows in overseas markets + haircare on all markets
  const showKbHighlight = isKb && (isOverseas || isHaircare)
  const rowCls = [
    'rank-row',
    `delay-${delay}`,
    showKbHighlight ? 'kb-row' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={rowCls}>
      <div className="rr-rank-num">{item.rank}</div>
      <div className="rr-info">
        <div className="rr-brand">
          <Link href={`/brand/${encodeURIComponent(item.brand)}`} className="brand-link">
            {item.brand}
          </Link>
          {showKbHighlight && <span className="kb-tag">K</span>}
          {subPart && <span className="subcat-label">{subPart}</span>}
        </div>
        {company && (
          <Link
            href={`/company/${encodeURIComponent(company)}`}
            className="rr-company"
            style={{ textDecoration: 'none' }}
          >
            {company}
          </Link>
        )}
        {titleShort && <div className="rr-title">{titleShort}</div>}
      </div>
      <div className="rr-right">
        <div className="rr-change">
          <span className={`ch-badge ${change.className}`}>{change.text}</span>
        </div>
        {price && <div className="rr-price">{price}</div>}
      </div>
    </div>
  )
}
