import Link from 'next/link'
import type { SocialSignalItem, SocialSignalDetail } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getSocialSignals } from '@/lib/queries'

const PREDICTION_LABELS: Readonly<Record<string, string>> = {
  will_rise_significantly: 'Strong Rise',
  will_rise: 'Rise',
  will_rise_slightly: 'Slight Rise',
}

const PLATFORM_ICONS: Readonly<Record<string, string>> = {
  tiktok: 'TT',
  youtube: 'YT',
  instagram: 'IG',
}

const SIGNAL_TYPE_LABELS: Readonly<Record<string, string>> = {
  engagement_spike: 'Engagement',
  mention_velocity: 'Mentions',
  save_share_surge: 'Save/Share',
  influencer_pickup: 'Influencer',
}

function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

function getTopPlatforms(signals: readonly SocialSignalDetail[]): string[] {
  const platforms = new Set<string>()
  for (const s of signals) {
    if (s.platform) platforms.add(s.platform)
  }
  return [...platforms]
}

function getTopSignalTypes(signals: readonly SocialSignalDetail[]): string[] {
  const types = new Set<string>()
  for (const s of signals) {
    if (s.signal_type) types.add(s.signal_type)
  }
  return [...types]
}

function adLevelBadge(adLevel: string, adRatio?: number, adSpend?: number) {
  if (adLevel === 'low') {
    return (
      <span style={{
        fontSize: '0.58rem',
        fontWeight: 700,
        padding: '1px 6px',
        borderRadius: '4px',
        background: 'rgba(5, 150, 105, 0.1)',
        color: '#059669',
      }}>
        Organic{adRatio != null ? ` · Ad ${adRatio}%` : ''}
      </span>
    )
  }
  if (adLevel === 'high') {
    return (
      <span style={{
        fontSize: '0.58rem',
        fontWeight: 700,
        padding: '1px 6px',
        borderRadius: '4px',
        background: 'rgba(225, 29, 72, 0.08)',
        color: '#e11d48',
      }}>
        Paid · Ad {adRatio ?? '?'}%{adSpend != null ? ` · ${adSpend.toLocaleString()}B` : ''}
      </span>
    )
  }
  if (adRatio != null) {
    return (
      <span style={{
        fontSize: '0.56rem',
        fontWeight: 600,
        padding: '1px 5px',
        borderRadius: '3px',
        background: 'rgba(217, 119, 6, 0.08)',
        color: '#d97706',
      }}>
        Ad {adRatio}%
      </span>
    )
  }
  return null
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
        const platforms = getTopPlatforms(item.signals)
        const signalTypes = getTopSignalTypes(item.signals)
        const predLabel = PREDICTION_LABELS[item.prediction] ?? item.prediction
        const isDiscounted = item.adjusted_confidence < item.confidence
        const adjColor = item.adjusted_confidence >= 0.4
          ? 'var(--accent-emerald)'
          : item.adjusted_confidence >= 0.25
            ? 'var(--accent-amber)'
            : 'var(--text-tertiary)'

        return (
          <div key={item.id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            {/* Adjusted confidence as main metric */}
            <div className="signal-rank" style={{
              background: item.adjusted_confidence >= 0.4
                ? 'rgba(5, 150, 105, 0.08)'
                : 'rgba(217, 119, 6, 0.08)',
              color: adjColor,
              fontSize: '0.7rem',
              fontWeight: 700,
              minWidth: '42px',
              textAlign: 'center',
            }}>
              {formatConfidence(item.adjusted_confidence)}
              {isDiscounted && (
                <div style={{
                  fontSize: '0.5rem',
                  fontWeight: 500,
                  color: 'var(--text-quaternary)',
                  textDecoration: 'line-through',
                  marginTop: '1px',
                }}>
                  {formatConfidence(item.confidence)}
                </div>
              )}
            </div>
            <div className="signal-info">
              <div className="signal-brand">
                {isKb && <span className="kb-tag">K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.entity_name)}`} className="brand-link">
                  {item.entity_name}
                </Link>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: item.adjusted_confidence >= 0.4
                    ? 'rgba(5, 150, 105, 0.1)'
                    : 'rgba(217, 119, 6, 0.1)',
                  color: adjColor,
                }}>
                  {predLabel}
                </span>
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
              <div className="signal-explain">
                {item.notes ?? `${predLabel} predicted`}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                {platforms.map((p) => (
                  <span key={p} className="ss-platform-badge">
                    {PLATFORM_ICONS[p] ?? p}
                  </span>
                ))}
                {signalTypes.map((t) => (
                  <span key={t} className="ss-type-badge">
                    {SIGNAL_TYPE_LABELS[t] ?? t}
                  </span>
                ))}
              </div>
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
