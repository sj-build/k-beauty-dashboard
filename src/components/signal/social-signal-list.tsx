import Link from 'next/link'
import { Trophy, Gem } from 'lucide-react'
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

const COMMERCE_PLATFORM_LABELS: ReadonlyArray<{
  readonly key: keyof NonNullable<SocialSignalItem['commerce']>
  readonly label: string
}> = [
  { key: 'oliveyoung_best_rank', label: 'OY' },
  { key: 'amazon_us_best_rank', label: 'AMZ US' },
  { key: 'amazon_ae_best_rank', label: 'AMZ AE' },
  { key: 'tiktokshop_best_rank', label: 'TTS' },
]

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

function CommercePosition({ commerce }: { readonly commerce?: SocialSignalItem['commerce'] }) {
  if (!commerce) return null

  const ranks = COMMERCE_PLATFORM_LABELS
    .filter(({ key }) => commerce[key] != null)
    .map(({ key, label }) => ({ label, rank: commerce[key] as number }))

  if (ranks.length === 0) return null

  const wow = commerce.wow_rank_change
  const wowText = wow != null && wow !== 0
    ? wow > 0 ? `WoW ▲${wow}` : `WoW ▼${Math.abs(wow)}`
    : null

  return (
    <div className="ss-commerce">
      <div className="ss-commerce-ranks">
        {ranks.map(({ label, rank }) => (
          <span key={label} className="ss-commerce-chip">
            {label} <strong>#{rank}</strong>
          </span>
        ))}
        {wowText && (
          <span className={`ss-commerce-chip ${(commerce.wow_rank_change ?? 0) > 0 ? 'ss-wow-up' : 'ss-wow-down'}`}>
            {wowText}
          </span>
        )}
        {commerce.is_new_entrant && (
          <span className="ss-commerce-chip ss-new-entrant">NEW</span>
        )}
      </div>
    </div>
  )
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

function SignalCard({ item, idx }: { readonly item: SocialSignalItem; readonly idx: number }) {
  const isKb = isKbeautyBrand(item.entity_name)
  const momentum = MOMENTUM_CONFIG[item.momentum_level ?? 'quiet']
  const breakdown = item.platform_breakdown ?? []
  const summary = item.diagnostic_summary ?? ''

  return (
    <div className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
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
              style={{ fontSize: '0.6rem', color: 'var(--text-quaternary)', textDecoration: 'none' }}
            >
              {item.company_name}
            </Link>
          </div>
        )}

        <CommercePosition commerce={item.commerce} />

        {breakdown.length > 0 && (
          <div className="ss-breakdown">
            {breakdown.map((d) => (
              <PlatformBreakdownRow key={d.platform} diagnostic={d} />
            ))}
          </div>
        )}

        {summary && <div className="ss-diagnostic">{summary}</div>}
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
}

function SectionHeader({
  icon,
  title,
  count,
}: {
  readonly icon: React.ReactNode
  readonly title: string
  readonly count: number
}) {
  return (
    <div className="ss-section-header">
      <span className="ss-section-icon">{icon}</span>
      <span className="ss-section-title">{title}</span>
      <span className="ss-section-count">{count}</span>
    </div>
  )
}

export async function SocialSignalList({ category }: { readonly category?: string }) {
  const items: SocialSignalItem[] = await getSocialSignals(category)

  if (!items.length) {
    return <div className="empty-box">No social signals detected yet</div>
  }

  const leaders = items.filter((i) => !i.is_hidden_gem)
  const gems = items.filter((i) => i.is_hidden_gem)

  return (
    <div className="ss-grouped">
      {leaders.length > 0 && (
        <section>
          <SectionHeader icon={<Trophy size={16} />} title="Established Leaders" count={leaders.length} />
          <div className="space-y-3">
            {leaders.map((item, idx) => (
              <SignalCard key={item.id} item={item} idx={idx} />
            ))}
          </div>
        </section>
      )}

      {gems.length > 0 && (
        <section>
          <SectionHeader icon={<Gem size={16} />} title="Hidden Gems" count={gems.length} />
          <div className="space-y-3">
            {gems.map((item, idx) => (
              <SignalCard key={item.id} item={item} idx={leaders.length + idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
