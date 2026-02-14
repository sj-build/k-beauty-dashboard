/**
 * Ad expense ratio lookup (2024 DART annual reports).
 * Static data - updated annually, no Supabase migration needed.
 * Maps company name (Korean) -> ad expense / revenue ratio (%).
 */
import { getCompanyName } from './brands'

const COMPANY_AD_RATIOS: Readonly<Record<string, number>> = {
  '에이피알': 19.6,
  '마녀공장': 18.4,
  '클리오': 16.1,
  '아모레퍼시픽': 14.2,
  '네오팜': 8.6,
  'LG생활건강': 7.3,
  'CSA 코스믹': 7.0,
  '에이블씨엔씨': 6.4,
  '브이티': 5.3,
  '토니모리': 4.8,
  '아이패밀리에스씨': 4.3,
  '한국콜마': 2.0,
  '코스맥스': 0.2,
}

/** Get ad expense ratio for a brand name (looks up company first). Returns null if unknown. */
export function getAdRatio(brandName: string): number | null {
  const company = getCompanyName(brandName)
  if (!company) return null
  return COMPANY_AD_RATIOS[company] ?? null
}

/** Get ad expense ratio directly from company name. Returns null if unknown. */
export function getAdRatioByCompany(companyName: string): number | null {
  return COMPANY_AD_RATIOS[companyName] ?? null
}

/**
 * Organic multiplier: 0~1. Higher = more organic (low ad spend).
 * - 0% ad ratio -> 1.0 (fully organic)
 * - 20% ad ratio -> 0.0 (fully paid)
 * - Unknown -> 0.5 (neutral)
 */
export function getOrganicMultiplier(companyName: string): number {
  const ratio = COMPANY_AD_RATIOS[companyName]
  if (ratio == null) return 0.5
  return Math.max(0, Math.min(1, 1 - ratio / 20))
}

/** Classify ad spending level: high (>12%), mid (5-12%), low (<5%), unknown */
export function getAdLevel(companyName: string): 'high' | 'mid' | 'low' | 'unknown' {
  const ratio = COMPANY_AD_RATIOS[companyName]
  if (ratio == null) return 'unknown'
  if (ratio > 12) return 'high'
  if (ratio >= 5) return 'mid'
  return 'low'
}
