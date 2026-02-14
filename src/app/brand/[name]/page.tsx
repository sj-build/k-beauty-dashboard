import type { Metadata } from 'next'
import Link from 'next/link'
import { getBrandDrilldown, searchBrands, getBrandProducts } from '@/lib/queries'
import type { BrandProduct } from '@/lib/queries'
import { isKbeautyBrand, getCompanyName, formatPrice } from '@/lib/brands'
import { getCompanyAdData, getAdLevel } from '@/lib/ad-expenses'
import { PLATFORMS, REGION_FLAGS } from '@/lib/constants'

interface BrandPageProps {
  readonly params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { name } = await params
  const brandName = decodeURIComponent(name)
  return {
    title: `${brandName} | K-Beauty Trend Radar`,
    description: `Cross-platform ranking intelligence for ${brandName} across OliveYoung, Amazon, Sephora, Ulta, and TikTok Shop.`,
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { name } = await params
  const brandName = decodeURIComponent(name)

  const results = await searchBrands(brandName, 1)
  if (!results.length) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="brand-link text-sm mb-4 inline-block">&larr; Back to Dashboard</Link>
        <div className="empty-box">Brand &ldquo;{brandName}&rdquo; not found</div>
      </main>
    )
  }

  const brandResult = results[0]
  const [drilldown, products] = await Promise.all([
    getBrandDrilldown(brandResult.id, 8),
    getBrandProducts(brandName, 15),
  ])

  if (!drilldown) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="brand-link text-sm mb-4 inline-block">&larr; Back to Dashboard</Link>
        <div className="empty-box">No data found for &ldquo;{brandName}&rdquo;</div>
      </main>
    )
  }

  const isKb = isKbeautyBrand(drilldown.brand_name)
  const company = getCompanyName(drilldown.brand_name)
  const adData = company ? getCompanyAdData(company) : null
  const adLevel = company ? getAdLevel(company) : 'unknown'
  const regions = Object.keys(drilldown.markets_present)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="brand-link text-sm mb-6 inline-block">&larr; Back to Dashboard</Link>

      {/* Brand header */}
      <div className="brand-hero">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="brand-hero-name">{drilldown.brand_name}</h1>
          {isKb && <span className="kb-tag">K</span>}
        </div>
        {drilldown.brand_name_kr && (
          <div className="brand-hero-kr">{drilldown.brand_name_kr}</div>
        )}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {company && (
            <Link href={`/company/${encodeURIComponent(company)}`} className="co-tag" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              {company}
            </Link>
          )}
          {regions.map((r) => (
            <span key={r} className="xb-region-badge">{REGION_FLAGS[r] ?? ''} {r}</span>
          ))}
          {adData && (
            <span style={{
              fontSize: '0.58rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: adLevel === 'low' ? 'rgba(5, 150, 105, 0.1)' : adLevel === 'high' ? 'rgba(225, 29, 72, 0.08)' : 'rgba(217, 119, 6, 0.1)',
              color: adLevel === 'low' ? '#059669' : adLevel === 'high' ? '#e11d48' : '#d97706',
            }}>
              Ad {adData.adRatio}% &middot; {adData.adSpend.toLocaleString()}억
            </span>
          )}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ScoreCard label="Leader" score={drilldown.latest_leader_score} color="var(--accent-violet)" />
        <ScoreCard label="Growth" score={drilldown.latest_growth_score} color="var(--accent-emerald)" />
        <ScoreCard label="New Leader" score={drilldown.latest_new_leader_score} color="var(--accent-amber)" />
        <ScoreCard label="Cross-border" score={drilldown.latest_cross_border_score} color="var(--accent-sky)" />
      </div>

      {/* Analysis */}
      {drilldown.latest_explanation && (
        <div className="brand-analysis">
          <div className="brand-analysis-label">Analysis</div>
          <div className="brand-analysis-text">{drilldown.latest_explanation}</div>
        </div>
      )}

      {/* Key Products */}
      {products.length > 0 && (
        <div className="mb-8">
          <div className="section-hd">Key Products</div>
          <div className="section-sub">Current rankings across platforms</div>
          <div className="space-y-2">
            {products.map((p, idx) => (
              <ProductRow key={`${p.platform}-${p.rank}-${idx}`} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Weekly history table */}
      <div className="section-hd">Weekly History</div>
      <div className="section-sub">Platform ranking trends over the past {drilldown.history.length} weeks</div>
      <div className="brand-table-wrap">
        <table className="brand-table">
          <thead>
            <tr>
              <th className="text-left">Week</th>
              <th className="text-right">Best</th>
              <th className="text-right">Leader</th>
              <th className="text-right">Growth</th>
              <th className="text-right">OY</th>
              <th className="text-right">AZ-US</th>
              <th className="text-right">AZ-AE</th>
              <th className="text-right">Sephora</th>
              <th className="text-right">Ulta</th>
              <th className="text-right">TTS</th>
              <th className="text-right">Noon</th>
            </tr>
          </thead>
          <tbody>
            {drilldown.history.map((h) => (
              <tr key={h.week_start}>
                <td>{h.week_start}</td>
                <td className="text-right">{h.global_best_rank ?? '-'}</td>
                <td className="text-right" style={{ color: 'var(--accent-violet)' }}>
                  {h.leader_score || '-'}
                </td>
                <td className="text-right" style={{ color: 'var(--accent-emerald)' }}>
                  {h.growth_score || '-'}
                </td>
                <td className="text-right txt-dim">{h.oliveyoung ?? '-'}</td>
                <td className="text-right txt-dim">{h.amazon_us ?? '-'}</td>
                <td className="text-right txt-dim">{h.amazon_ae ?? '-'}</td>
                <td className="text-right txt-dim">{h.sephora_us ?? '-'}</td>
                <td className="text-right txt-dim">{h.ulta ?? '-'}</td>
                <td className="text-right txt-dim">{h.tiktokshop ?? '-'}</td>
                <td className="text-right txt-dim">{h.noon_ae ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function ScoreCard({
  label,
  score,
  color,
}: {
  readonly label: string
  readonly score: number
  readonly color: string
}) {
  const deg = Math.min((score / 100) * 360, 360)

  return (
    <div className="score-card">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(${color} ${deg}deg, var(--border-subtle) ${deg}deg)`,
        }}
      >
        <div className="ring-inner">
          <div className="ring-val">{Math.round(score)}</div>
        </div>
      </div>
      <div className="score-label">{label}</div>
    </div>
  )
}

function ProductRow({ product }: { readonly product: BrandProduct }) {
  const platformName = PLATFORMS[product.platform]?.name ?? product.platform
  const flag = REGION_FLAGS[product.region] ?? ''
  const price = formatPrice(product.price, product.currency)

  return (
    <div className="product-row">
      <div className="product-rank">#{product.rank}</div>
      <div className="product-info">
        <div className="product-title">{product.title || 'Untitled'}</div>
        <div className="product-meta">
          <span className="product-plat">{flag} {platformName}</span>
          {product.category && <span className="product-cat">{product.category}</span>}
          {product.rating != null && <span className="product-rating">{product.rating}</span>}
        </div>
      </div>
      {price && <div className="product-price">{price}</div>}
    </div>
  )
}
