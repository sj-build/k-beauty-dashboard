import Link from 'next/link'
import type { SocialSignalItem, SocialSignalDetail } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getSocialSignals } from '@/lib/queries'

const PREDICTION_LABELS: Readonly<Record<string, string>> = {
  will_rise_significantly: 'Strong Rise',
  will_rise: 'Rise',
  will_rise_slightly: 'Slight Rise',
}

const PREDICTION_LABELS_KR: Readonly<Record<string, string>> = {
  will_rise_significantly: '급상승 예측',
  will_rise: '상승 예측',
  will_rise_slightly: '소폭 상승 예측',
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

export async function SocialSignalList() {
  const items: SocialSignalItem[] = await getSocialSignals()

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
        const confidenceColor = item.confidence >= 0.8
          ? 'var(--accent-emerald)'
          : item.confidence >= 0.7
            ? 'var(--accent-amber)'
            : 'var(--text-tertiary)'

        return (
          <div key={item.id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            <div className="signal-rank" style={{
              background: item.confidence >= 0.8
                ? 'rgba(5, 150, 105, 0.08)'
                : 'rgba(217, 119, 6, 0.08)',
              color: confidenceColor,
              fontSize: '0.7rem',
              fontWeight: 700,
            }}>
              {formatConfidence(item.confidence)}
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
                  background: item.confidence >= 0.8
                    ? 'rgba(5, 150, 105, 0.1)'
                    : 'rgba(217, 119, 6, 0.1)',
                  color: confidenceColor,
                }}>
                  {predLabel}
                </span>
              </div>
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
