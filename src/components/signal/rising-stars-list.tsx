import Link from 'next/link'
import type { RisingStarItem } from '@/lib/types'
import { isKbeautyBrand } from '@/lib/brands'
import { getRisingStars } from '@/lib/queries'

const PLATFORM_SHORT: Readonly<Record<string, string>> = {
  OliveYoung: 'OY',
  'Amazon US': 'AZ-US',
  'Amazon AE': 'AZ-AE',
  Sephora: 'SP',
  Ulta: 'UL',
  Noon: 'NN',
}

const SOCIAL_PLATFORM_SHORT: Readonly<Record<string, string>> = {
  tiktok: 'TT',
  youtube: 'YT',
  instagram: 'IG',
}

function scoreColor(score: number): string {
  if (score >= 60) return 'var(--accent-emerald)'
  if (score >= 40) return 'var(--accent-amber)'
  return 'var(--text-tertiary)'
}

function scoreBg(score: number): string {
  if (score >= 60) return 'rgba(5, 150, 105, 0.08)'
  if (score >= 40) return 'rgba(217, 119, 6, 0.08)'
  return 'rgba(99, 102, 241, 0.08)'
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

function progressBar(value: number, max: number, color: string) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: '60px',
        height: '4px',
        borderRadius: '2px',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: '2px',
          background: color,
        }} />
      </div>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
        {Math.round(value)}
      </span>
    </div>
  )
}

export async function RisingStarsList({ category }: { readonly category?: string }) {
  const items: RisingStarItem[] = await getRisingStars(category)

  if (!items.length) {
    return <div className="empty-box">No rising stars detected yet for this category.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isKb = isKbeautyBrand(item.brand_name)
        const socialPct = (item.social_confidence ?? 0) * 100
        const commercePct = Math.min(
          ((item.growth_score + item.cross_border_score) / 200) * 100,
          100,
        )

        return (
          <div key={item.brand_id} className={`signal-card animate-in delay-${Math.min(idx + 1, 10)}`}>
            {/* Rank index */}
            <div style={{
              fontSize: '0.58rem',
              fontWeight: 600,
              color: 'var(--text-quaternary)',
              minWidth: '18px',
              textAlign: 'right',
              paddingTop: '2px',
            }}>
              {idx + 1}
            </div>

            {/* Score badge */}
            <div className="signal-rank" style={{
              background: scoreBg(item.organic_score),
              color: scoreColor(item.organic_score),
              fontSize: '0.68rem',
              fontWeight: 700,
              minWidth: '36px',
              textAlign: 'center',
            }}>
              {item.organic_score}
            </div>

            <div className="signal-info" style={{ flex: 1 }}>
              {/* Brand name row */}
              <div className="signal-brand">
                {isKb && <span className="kb-tag">K-Beauty</span>}
                <Link href={`/brand/${encodeURIComponent(item.brand_name)}`} className="brand-link">
                  {item.brand_name}
                </Link>
                {item.brand_name_kr && (
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                    {item.brand_name_kr}
                  </span>
                )}
                {item.ad_level === 'low' && (
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(5, 150, 105, 0.1)',
                    color: '#059669',
                    letterSpacing: '0.02em',
                  }}>
                    Organic
                  </span>
                )}
              </div>

              {/* Company + ad ratio */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                {item.company_name && (
                  <Link
                    href={`/company/${encodeURIComponent(item.company_name)}`}
                    style={{
                      fontSize: '0.62rem',
                      color: 'var(--text-quaternary)',
                      textDecoration: 'none',
                    }}
                  >
                    {item.company_name}
                  </Link>
                )}
                {item.ad_ratio != null && (
                  <span style={{
                    fontSize: '0.56rem',
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    background: adLevelBg(item.ad_level),
                    color: adLevelColor(item.ad_level),
                  }}>
                    Ad {item.ad_ratio}%{item.ad_spend != null ? ` · ${item.ad_spend.toLocaleString()}억` : ''}
                  </span>
                )}
                {item.ad_level === 'unknown' && (
                  <span style={{
                    fontSize: '0.56rem',
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-quaternary)',
                  }}>
                    Ad N/A
                  </span>
                )}
              </div>

              {/* Score bars */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-quaternary)', fontWeight: 600, marginBottom: '2px' }}>
                    SOCIAL
                  </div>
                  {progressBar(socialPct, 100, '#7c3aed')}
                </div>
                <div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-quaternary)', fontWeight: 600, marginBottom: '2px' }}>
                    COMMERCE
                  </div>
                  {progressBar(commercePct, 100, '#d97706')}
                </div>
              </div>

              {/* Social notes */}
              {item.social_notes && (
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {item.social_notes}
                </div>
              )}

              {/* Platform badges */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {/* Social platforms */}
                {item.social_platforms.map((p) => (
                  <span key={`s-${p}`} className="ss-platform-badge">
                    {SOCIAL_PLATFORM_SHORT[p] ?? p}
                  </span>
                ))}
                {/* Commerce platforms */}
                {item.platforms.map((p) => (
                  <span key={`c-${p}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    background: 'rgba(217, 119, 6, 0.08)',
                    color: 'var(--accent-amber)',
                    letterSpacing: '0.03em',
                  }}>
                    {PLATFORM_SHORT[p] ?? p}
                  </span>
                ))}
                {item.best_rank && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-indigo, #6366f1)',
                  }}>
                    Best #{item.best_rank}
                  </span>
                )}
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-quaternary)',
                  marginTop: '4px',
                  fontStyle: 'italic',
                }}>
                  {item.explanation}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
