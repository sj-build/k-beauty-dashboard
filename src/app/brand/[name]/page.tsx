import Link from 'next/link'
import { getBrandDrilldown, searchBrands } from '@/lib/queries'
import { isKbeautyBrand, getCompanyName } from '@/lib/brands'

interface BrandPageProps {
  readonly params: Promise<{ name: string }>
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { name } = await params
  const brandName = decodeURIComponent(name)

  // Look up brand_id from name
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
  const drilldown = await getBrandDrilldown(brandResult.id, 8)

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
  const regions = Object.keys(drilldown.markets_present)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="brand-link text-sm mb-6 inline-block">&larr; Back to Dashboard</Link>

      {/* Brand header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {isKb && <span className="kb-tag">🇰🇷 K-Beauty</span>}
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {drilldown.brand_name}
          </h1>
          {drilldown.brand_name_kr && (
            <span className="text-text-tertiary text-lg">{drilldown.brand_name_kr}</span>
          )}
        </div>
        {company && <span className="co-tag">{company}</span>}
        {regions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {regions.map((r) => (
              <span key={r} className="xb-region-badge">{r}</span>
            ))}
          </div>
        )}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ScoreCard label="Leader" score={drilldown.latest_leader_score} color="var(--accent-violet)" />
        <ScoreCard label="Growth" score={drilldown.latest_growth_score} color="var(--accent-emerald)" />
        <ScoreCard label="New Leader" score={drilldown.latest_new_leader_score} color="var(--accent-amber)" />
        <ScoreCard label="Cross-border" score={drilldown.latest_cross_border_score} color="var(--accent-sky)" />
      </div>

      {/* Explanation */}
      {drilldown.latest_explanation && (
        <div className="mb-8 p-4 border border-border-subtle rounded-[var(--radius-md)] bg-bg-primary">
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Analysis</div>
          <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{drilldown.latest_explanation}</div>
        </div>
      )}

      {/* Weekly history table */}
      <div className="section-hd">Weekly History</div>
      <div className="section-sub">Platform ranking trends over the past {drilldown.history.length} weeks</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr className="border-b border-border-default">
              <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Week</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Best Rank</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Leader</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Growth</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>OY</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>AMZ US</th>
              <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>AMZ AE</th>
            </tr>
          </thead>
          <tbody>
            {drilldown.history.map((h) => (
              <tr key={h.week_start} className="border-b border-border-subtle">
                <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>{h.week_start}</td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--text-primary)' }}>
                  {h.global_best_rank ?? '-'}
                </td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--accent-violet)' }}>
                  {h.leader_score || '-'}
                </td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--accent-emerald)' }}>
                  {h.growth_score || '-'}
                </td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--text-tertiary)' }}>
                  {h.oliveyoung ?? '-'}
                </td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--text-tertiary)' }}>
                  {h.amazon_us ?? '-'}
                </td>
                <td className="text-right py-2 px-3" style={{ color: 'var(--text-tertiary)' }}>
                  {h.amazon_ae ?? '-'}
                </td>
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
    <div className="flex items-center gap-3 p-3 border border-border-subtle rounded-[var(--radius-md)] bg-bg-primary">
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
      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}
