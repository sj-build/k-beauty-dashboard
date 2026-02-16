import Link from 'next/link'
import type { SocialSignalItem, PlatformDiagnostic } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getSocialSignals } from '@/lib/queries'

const PLATFORM_LABELS: Readonly<Record<string, string>> = {
  tiktok: 'TikTok',
  youtube: 'YouTube',
  instagram: 'Instagram',
}

const SIGNAL_TYPE_LABELS: Readonly<Record<string, string>> = {
  engagement_spike: 'Engagement',
  mention_velocity: 'Mentions',
  save_share_surge: 'Save/Share',
  influencer_pickup: 'Influencer',
}

const MOMENTUM_CONFIG: Readonly<Record<string, { label: string; color: string; bg: string }>> = {
  hot: { label: 'Hot', color: 'var(--accent-rose)', bg: 'var(--accent-rose-dim)' },
  warm: { label: 'Warm', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
  emerging: { label: 'Emerging', color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-dim)' },
  quiet: { label: 'Quiet', color: 'var(--text-quaternary)', bg: 'var(--bg-secondary)' },
}

function formatNumber(n: number | undefined): string {
  if (n == null || n === 0) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(Math.round(n))
}

function formatChange(pct: number | undefined): string | null {
  if (pct == null || pct === 0) return null
  const sign = pct > 0 ? '+' : ''
  return `${sign}${Math.round(pct)}%`
}

function adLevelBadge(adLevel: string, adRatio?: number, adSpend?: number) {
  if (adLevel === 'low') {
    return (
      <span className="ss-ad-badge ss-ad-organic">
        Organic{adRatio != null ? ` · Ad ${adRatio}%` : ''}
      </span>
    )
  }
  if (adLevel === 'high') {
    return (
      <span className="ss-ad-badge ss-ad-paid">
        Paid · Ad {adRatio ?? '?'}%{adSpend != null ? ` · ${adSpend.toLocaleString()}B` : ''}
      </span>
    )
  }
  if (adRatio != null) {
    return (
      <span className="ss-ad-badge ss-ad-mid">
        Ad {adRatio}%
      </span>
    )
  }
  return null
}

function PlatformBreakdownRow({
  diagnostic,
}: {
  readonly diagnostic: PlatformDiagnostic
}) {
  const platformLabel = PLATFORM_LABELS[diagnostic.platform] ?? diagnostic.platform
  const saveChange = formatChange(diagnostic.save_change_pct)
  const shareChange = formatChange(diagnostic.share_change_pct)
  const viewChange = formatChange(diagnostic.view_change_pct)
  const hasMetrics = diagnostic.total_views != null

  // Fallback: if no raw_metrics, show signal type badges
  if (!hasMetrics) {
    return (
      <div className="ss-platform-row">
        <span className="ss-platform-name">{platformLabel}:</span>
        <div className="ss-metric-group">
          {diagnostic.signal_types.map((t) => (
            <span key={t} className="ss-type-badge">
              {SIGNAL_TYPE_LABELS[t] ?? t}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="ss-platform-row">
      <span className="ss-platform-name">{platformLabel}:</span>
      <div className="ss-metric-group">
        {(diagnostic.total_saves ?? 0) > 0 && (
          <span className={saveChange ? 'ss-metric' : 'ss-metric-dim'}>
            Saves{saveChange ? ` ${saveChange}` : ` ${formatNumber(diagnostic.total_saves)}`}
          </span>
        )}
        {(diagnostic.total_shares ?? 0) > 0 && (
          <span className={shareChange ? 'ss-metric' : 'ss-metric-dim'}>
            Shares{shareChange ? ` ${shareChange}` : ` ${formatNumber(diagnostic.total_shares)}`}
          </span>
        )}
        {(diagnostic.total_views ?? 0) > 0 && (
          <span className="ss-metric-dim">
            Views {formatNumber(diagnostic.total_views)}{viewChange ? ` (${viewChange})` : ''}
          </span>
        )}
      </div>
    </div>
  )
}

export async function SocialSignalList({ category }: { readonly category?: string } = {}) {
  const items: SocialSignalItem[] = await getSocialSignals(category)

  if (!items.length) {
    return <div className="empty-box">No social signals detected yet</div>
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.entity_name)
        const momentum = MOMENTUM_CONFIG[item.momentum_level ?? 'quiet']
        const breakdown = item.platform_breakdown ?? []
        const summary = item.diagnostic_summary ?? ''

        return (
          <div key={item.id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            {/* Momentum indicator */}
            <div className="ss-momentum" style={{ background: momentum.bg, color: momentum.color }}>
              {momentum.label}
            </div>
            <div className="signal-info">
              <div className="signal-brand">
                {isKb && <span className="kb-tag">K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.entity_name)}`} className="brand-link">
                  {item.entity_name}
                </Link>
                {adLevelBadge(item.ad_level, item.ad_ratio, item.ad_spend)}
              </div>
              {item.company_name && (
                <div style={{ marginTop: '1px' }}>
                  <Link
                    href={`/company/${encodeURIComponent(item.company_name)}`}
                    style={{
                      fontSize: '0.6rem',
                      color: 'var(--text-quaternary)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.company_name}
                  </Link>
                </div>
              )}

              {/* Platform breakdown rows */}
              {breakdown.length > 0 && (
                <div className="ss-breakdown">
                  {breakdown.map((d) => (
                    <PlatformBreakdownRow key={d.platform} diagnostic={d} />
                  ))}
                </div>
              )}

              {/* Diagnostic summary */}
              {summary && (
                <div className="ss-diagnostic">{summary}</div>
              )}
            </div>
            <div className="signal-meta">
              {item.validate_by && (
                <div style={{ fontSize: '0.62rem', color: 'var(--text-quaternary)' }}>
                  Valid by {new Date(item.validate_by).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
