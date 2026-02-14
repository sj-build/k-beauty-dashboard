import type { Metadata } from 'next'
import Link from 'next/link'
import { getCompanyByName, getCompanyBrandMetrics } from '@/lib/queries'
import type { CompanyBrandMetric } from '@/lib/queries'
import type { CompanyDetail, CompanyBrand, CompanyFinancial, CompanyMarket } from '@/lib/types'
import { getCompanyAdData, getAdLevel, getOrganicMultiplier } from '@/lib/ad-expenses'
import { formatPrice } from '@/lib/brands'

interface CompanyPageProps {
  readonly params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { name } = await params
  const companyName = decodeURIComponent(name)
  return {
    title: `${companyName} | K-Beauty Trend Radar`,
    description: `Company profile, owned brands, ad expense data, and market performance for ${companyName}.`,
  }
}

function adLevelColor(level: string): string {
  if (level === 'low') return '#059669'
  if (level === 'mid') return '#d97706'
  if (level === 'high') return '#e11d48'
  return 'var(--text-quaternary)'
}

function adLevelBg(level: string): string {
  if (level === 'low') return 'rgba(5, 150, 105, 0.1)'
  if (level === 'mid') return 'rgba(217, 119, 6, 0.1)'
  if (level === 'high') return 'rgba(225, 29, 72, 0.08)'
  return 'var(--bg-secondary)'
}

function adLevelLabel(level: string): string {
  if (level === 'low') return 'Low'
  if (level === 'mid') return 'Mid'
  if (level === 'high') return 'High'
  return 'N/A'
}

function formatBillion(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}조`
  return `${value.toLocaleString()}억`
}

function formatMargin(value: number | undefined | null): string {
  if (value == null) return '-'
  return `${value.toFixed(1)}%`
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { name } = await params
  const companyName = decodeURIComponent(name)

  const [companyDetail, brandMetrics] = await Promise.all([
    getCompanyByName(companyName),
    getCompanyBrandMetrics(companyName),
  ])

  if (!companyDetail) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="brand-link text-sm mb-4 inline-block">&larr; Back to Dashboard</Link>
        <div className="empty-box">Company &ldquo;{companyName}&rdquo; not found</div>
      </main>
    )
  }

  const { profile, brands, financials, market } = companyDetail
  const adData = getCompanyAdData(companyName)
  const adLevel = getAdLevel(companyName)
  const organicMultiplier = getOrganicMultiplier(companyName)

  // Aggregate brand scores
  const avgScores = computeAvgScores(brandMetrics)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="brand-link text-sm mb-6 inline-block">&larr; Back to Dashboard</Link>

      {/* Company header */}
      <CompanyHeader profile={profile} />

      {/* Ad Expense Card */}
      {adData && (
        <AdExpenseCard
          adRatio={adData.adRatio}
          adSpend={adData.adSpend}
          revenue={adData.revenue}
          adLevel={adLevel}
          organicMultiplier={organicMultiplier}
        />
      )}

      {/* Financial data */}
      {financials.length > 0 && hasDbFinancials(financials) && (
        <FinancialsSection financials={financials} />
      )}

      {/* Market data */}
      {market && (
        <MarketSection market={market} />
      )}

      {/* Owned Brands */}
      {brands.length > 0 && (
        <OwnedBrandsSection brands={brands} brandMetrics={brandMetrics} />
      )}

      {/* Brand Performance Summary */}
      {brandMetrics.length > 0 && (
        <BrandPerformanceSummary avgScores={avgScores} brandCount={brandMetrics.length} />
      )}
    </main>
  )
}

// ── Sub-components ──

function CompanyHeader({ profile }: { readonly profile: CompanyDetail['profile'] }) {
  return (
    <div className="brand-hero">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="brand-hero-name">{profile.legal_name}</h1>
        <span style={{
          fontSize: '0.58rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: profile.public_company ? 'rgba(2, 132, 199, 0.1)' : 'var(--bg-secondary)',
          color: profile.public_company ? 'var(--accent-sky)' : 'var(--text-quaternary)',
          border: `1px solid ${profile.public_company ? 'rgba(2, 132, 199, 0.2)' : 'var(--border-subtle)'}`,
        }}>
          {profile.public_company ? 'Public' : 'Private'}
        </span>
        {profile.ticker && (
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-violet)',
          }}>
            {profile.ticker}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        {profile.founded_year && (
          <InfoChip label="Founded" value={String(profile.founded_year)} />
        )}
        {profile.hq_location && (
          <InfoChip label="HQ" value={profile.hq_location} />
        )}
        {profile.employee_count_range && (
          <InfoChip label="Employees" value={profile.employee_count_range} />
        )}
        {profile.website_url && (
          <a
            href={profile.website_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.72rem',
              color: 'var(--accent-violet)',
              textDecoration: 'none',
            }}
          >
            {profile.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        )}
      </div>
    </div>
  )
}

function InfoChip({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{
        fontSize: '0.6rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-quaternary)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.72rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
      }}>
        {value}
      </span>
    </div>
  )
}

function AdExpenseCard({
  adRatio,
  adSpend,
  revenue,
  adLevel,
  organicMultiplier,
}: {
  readonly adRatio: number
  readonly adSpend: number
  readonly revenue: number
  readonly adLevel: 'high' | 'mid' | 'low' | 'unknown'
  readonly organicMultiplier: number
}) {
  return (
    <div style={{
      padding: '16px 20px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-primary)',
      marginBottom: '20px',
    }}>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--accent-amber)',
        marginBottom: '12px',
      }}>
        Ad Expense (DART 2024)
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Ad Ratio */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: adLevelColor(adLevel),
          }}>
            {adRatio}%
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-quaternary)', fontWeight: 500 }}>
            Ad Ratio
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

        {/* Ad Spend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
          }}>
            {formatBillion(adSpend)}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-quaternary)', fontWeight: 500 }}>
            Ad Spend
          </div>
        </div>

        {/* Revenue */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
          }}>
            {formatBillion(revenue)}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-quaternary)', fontWeight: 500 }}>
            Revenue
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

        {/* Organic Multiplier */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: organicMultiplier >= 0.6 ? 'var(--accent-emerald)' : organicMultiplier >= 0.3 ? 'var(--accent-amber)' : 'var(--accent-rose)',
          }}>
            {organicMultiplier.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-quaternary)', fontWeight: 500 }}>
            Organic
          </div>
        </div>

        {/* Ad Level badge */}
        <span style={{
          fontSize: '0.62rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          background: adLevelBg(adLevel),
          color: adLevelColor(adLevel),
          letterSpacing: '0.02em',
        }}>
          {adLevelLabel(adLevel)} Ad Spend
        </span>
      </div>
    </div>
  )
}

function FinancialsSection({ financials }: { readonly financials: readonly CompanyFinancial[] }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="section-hd">Financials</div>
      <div className="section-sub">Latest financial snapshots from DB</div>
      <div className="brand-table-wrap">
        <table className="brand-table">
          <thead>
            <tr>
              <th className="text-left">Period</th>
              <th className="text-right">Revenue</th>
              <th className="text-right">Op. Profit</th>
              <th className="text-right">Net Income</th>
              <th className="text-right">Op. Margin</th>
              <th className="text-right">YoY Growth</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((f) => (
              <tr key={f.snapshot_date}>
                <td>{f.snapshot_date}</td>
                <td className="text-right">
                  {f.revenue != null ? formatPrice(f.revenue, 'KRW') : '-'}
                </td>
                <td className="text-right">
                  {f.operating_profit != null ? formatPrice(f.operating_profit, 'KRW') : '-'}
                </td>
                <td className="text-right">
                  {f.net_income != null ? formatPrice(f.net_income, 'KRW') : '-'}
                </td>
                <td className="text-right">{formatMargin(f.operating_margin)}</td>
                <td className="text-right" style={{
                  color: f.yoy_revenue_growth != null
                    ? (f.yoy_revenue_growth > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)')
                    : undefined,
                }}>
                  {f.yoy_revenue_growth != null ? `${f.yoy_revenue_growth > 0 ? '+' : ''}${f.yoy_revenue_growth.toFixed(1)}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MarketSection({ market }: { readonly market: CompanyMarket }) {
  const currency = market.currency ?? 'KRW'
  const changeColor = (market.day_change_pct ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'

  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="section-hd">Market Data</div>
      <div className="section-sub">{market.ticker} &middot; {market.snapshot_datetime?.split('T')[0] ?? ''}</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
      }}>
        <MarketMetric
          label="Current Price"
          value={market.current_price != null ? formatPrice(market.current_price, currency) : '-'}
        />
        <MarketMetric
          label="Market Cap"
          value={market.market_cap != null ? formatPrice(market.market_cap, currency) : '-'}
        />
        <MarketMetric
          label="Day Change"
          value={market.day_change_pct != null ? `${market.day_change_pct > 0 ? '+' : ''}${market.day_change_pct.toFixed(2)}%` : '-'}
          valueColor={changeColor}
        />
        <MarketMetric
          label="52W Range"
          value={market.low_52w != null && market.high_52w != null
            ? `${formatPrice(market.low_52w, currency)} — ${formatPrice(market.high_52w, currency)}`
            : '-'}
        />
      </div>
    </div>
  )
}

function MarketMetric({
  label,
  value,
  valueColor,
}: {
  readonly label: string
  readonly value: string
  readonly valueColor?: string
}) {
  return (
    <div style={{
      padding: '12px 14px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        fontSize: '0.6rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-quaternary)',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: valueColor ?? 'var(--text-primary)',
      }}>
        {value}
      </div>
    </div>
  )
}

function OwnedBrandsSection({
  brands,
  brandMetrics,
}: {
  readonly brands: readonly CompanyBrand[]
  readonly brandMetrics: readonly CompanyBrandMetric[]
}) {
  // Build metrics lookup
  const metricsMap = new Map<string, CompanyBrandMetric>()
  for (const m of brandMetrics) {
    metricsMap.set(m.brand_id, m)
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="section-hd">Owned Brands</div>
      <div className="section-sub">{brands.length} brand{brands.length !== 1 ? 's' : ''} tracked</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '10px',
      }}>
        {brands.map((brand) => {
          const metrics = metricsMap.get(brand.brand_id)
          return (
            <BrandCard
              key={brand.brand_id}
              brand={brand}
              metrics={metrics}
            />
          )
        })}
      </div>
    </div>
  )
}

function BrandCard({
  brand,
  metrics,
}: {
  readonly brand: CompanyBrand
  readonly metrics?: CompanyBrandMetric
}) {
  return (
    <Link
      href={`/brand/${encodeURIComponent(brand.brand_name)}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        padding: '14px 16px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-primary)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            {brand.brand_name}
          </span>
          {brand.category && (
            <span className="subcat-label">{brand.category}</span>
          )}
        </div>

        {brand.brand_name_kr && (
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
            {brand.brand_name_kr}
          </div>
        )}

        {metrics && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {metrics.global_best_rank != null && (
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent-violet)',
              }}>
                #{metrics.global_best_rank}
              </span>
            )}
            {metrics.leader_score > 0 && (
              <MiniScore label="L" value={metrics.leader_score} color="var(--accent-violet)" />
            )}
            {metrics.growth_score > 0 && (
              <MiniScore label="G" value={metrics.growth_score} color="var(--accent-emerald)" />
            )}
            {metrics.cross_border_score > 0 && (
              <MiniScore label="XB" value={metrics.cross_border_score} color="var(--accent-sky)" />
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function MiniScore({
  label,
  value,
  color,
}: {
  readonly label: string
  readonly value: number
  readonly color: string
}) {
  return (
    <span style={{
      fontSize: '0.56rem',
      fontWeight: 600,
      padding: '1px 5px',
      borderRadius: '3px',
      background: `color-mix(in srgb, ${color} 10%, transparent)`,
      color,
    }}>
      {label} {Math.round(value)}
    </span>
  )
}

function BrandPerformanceSummary({
  avgScores,
  brandCount,
}: {
  readonly avgScores: {
    readonly leader: number
    readonly growth: number
    readonly newLeader: number
    readonly crossBorder: number
  }
  readonly brandCount: number
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="section-hd">Brand Performance Summary</div>
      <div className="section-sub">Average scores across {brandCount} tracked brand{brandCount !== 1 ? 's' : ''}</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard label="Leader" score={avgScores.leader} color="var(--accent-violet)" />
        <ScoreCard label="Growth" score={avgScores.growth} color="var(--accent-emerald)" />
        <ScoreCard label="New Leader" score={avgScores.newLeader} color="var(--accent-amber)" />
        <ScoreCard label="Cross-border" score={avgScores.crossBorder} color="var(--accent-sky)" />
      </div>
    </div>
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

// ── Helpers ──

function computeAvgScores(metrics: readonly CompanyBrandMetric[]): {
  readonly leader: number
  readonly growth: number
  readonly newLeader: number
  readonly crossBorder: number
} {
  if (!metrics.length) {
    return { leader: 0, growth: 0, newLeader: 0, crossBorder: 0 }
  }
  const sum = metrics.reduce(
    (acc, m) => ({
      leader: acc.leader + m.leader_score,
      growth: acc.growth + m.growth_score,
      newLeader: acc.newLeader + m.new_leader_score,
      crossBorder: acc.crossBorder + m.cross_border_score,
    }),
    { leader: 0, growth: 0, newLeader: 0, crossBorder: 0 },
  )
  const count = metrics.length
  return {
    leader: sum.leader / count,
    growth: sum.growth / count,
    newLeader: sum.newLeader / count,
    crossBorder: sum.crossBorder / count,
  }
}

function hasDbFinancials(financials: readonly CompanyFinancial[]): boolean {
  return financials.some((f) =>
    f.operating_profit != null || f.net_income != null || f.operating_margin != null
  )
}
