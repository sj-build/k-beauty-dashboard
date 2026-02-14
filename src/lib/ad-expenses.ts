/**
 * Ad expense data from DART annual reports (2024 사업보고서).
 * Static data - updated annually, no Supabase migration needed.
 *
 * Both ratio (%) AND absolute amount (억원) matter:
 * - 아모레퍼시픽: 14.2% looks moderate, but 5,518억원 = massive spend
 * - 아이패밀리에스씨: 4.3% AND only 88억원 = genuinely organic
 */
import { getCompanyName } from './brands'

interface CompanyAdData {
  readonly adRatio: number       // 광고선전비/매출액 (%)
  readonly adSpend: number       // 광고선전비 (억원)
  readonly revenue: number       // 매출액 (억원)
}

/** DART 2024 사업보고서 기준. 비상장사 6개는 사업보고서 미공시 → 데이터 없음 */
const COMPANY_AD_DATA: Readonly<Record<string, CompanyAdData>> = {
  '에이피알':       { adRatio: 19.6, adSpend: 1419, revenue: 7228 },
  '마녀공장':       { adRatio: 18.4, adSpend: 236,  revenue: 1279 },
  '클리오':        { adRatio: 16.1, adSpend: 565,  revenue: 3514 },
  '아모레퍼시픽':    { adRatio: 14.2, adSpend: 5518, revenue: 38851 },
  '네오팜':        { adRatio: 8.6,  adSpend: 103,  revenue: 1190 },
  'LG생활건강':     { adRatio: 7.3,  adSpend: 5000, revenue: 68119 },
  'CSA 코스믹':     { adRatio: 7.0,  adSpend: 26,   revenue: 364 },
  '에이블씨엔씨':    { adRatio: 6.4,  adSpend: 168,  revenue: 2640 },
  '브이티':        { adRatio: 5.3,  adSpend: 227,  revenue: 4317 },
  '토니모리':       { adRatio: 4.8,  adSpend: 84,   revenue: 1770 },
  '아이패밀리에스씨':  { adRatio: 4.3,  adSpend: 88,   revenue: 2049 },
  '한국콜마':       { adRatio: 2.0,  adSpend: 495,  revenue: 24521 },
  '코스맥스':       { adRatio: 0.2,  adSpend: 42,   revenue: 21661 },
}

/** Get full ad data for a company. Returns null if unknown. */
export function getCompanyAdData(companyName: string): CompanyAdData | null {
  return COMPANY_AD_DATA[companyName] ?? null
}

/** Get ad expense ratio for a brand name (looks up company first). */
export function getAdRatio(brandName: string): number | null {
  const company = getCompanyName(brandName)
  if (!company) return null
  return COMPANY_AD_DATA[company]?.adRatio ?? null
}

/** Get ad expense ratio directly from company name. */
export function getAdRatioByCompany(companyName: string): number | null {
  return COMPANY_AD_DATA[companyName]?.adRatio ?? null
}

/** Get absolute ad spend in 억원 for a company. */
export function getAdSpend(companyName: string): number | null {
  return COMPANY_AD_DATA[companyName]?.adSpend ?? null
}

/** Get revenue in 억원 for a company. */
export function getRevenue(companyName: string): number | null {
  return COMPANY_AD_DATA[companyName]?.revenue ?? null
}

/**
 * Organic multiplier: 0~1. Higher = more organic.
 *
 * Two dimensions:
 * 1. Ad ratio penalty: high % = less organic
 * 2. Absolute spend penalty: even low-% companies spending 500억+ are not "organic"
 *
 * Absolute spend tiers (억원):
 * - < 100억: no penalty (small company)
 * - 100~500억: moderate penalty (-0.1 to -0.2)
 * - 500~1000억: significant penalty (-0.2 to -0.3)
 * - > 1000억: large penalty (-0.3)
 *
 * Unknown company → 0.5 (neutral)
 */
export function getOrganicMultiplier(companyName: string): number {
  const data = COMPANY_AD_DATA[companyName]
  if (!data) return 0.5

  // Ratio-based score: 0% → 1.0, 20% → 0.0
  const ratioScore = Math.max(0, Math.min(1, 1 - data.adRatio / 20))

  // Absolute spend penalty (억원)
  let absolutePenalty = 0
  if (data.adSpend >= 1000) absolutePenalty = 0.3
  else if (data.adSpend >= 500) absolutePenalty = 0.2
  else if (data.adSpend >= 100) absolutePenalty = 0.1

  return Math.max(0, Math.min(1, ratioScore - absolutePenalty))
}

/** Classify ad spending level using both ratio and absolute amount */
export function getAdLevel(companyName: string): 'high' | 'mid' | 'low' | 'unknown' {
  const data = COMPANY_AD_DATA[companyName]
  if (!data) return 'unknown'

  // High: either high ratio (>12%) OR massive absolute spend (>1000억)
  if (data.adRatio > 12 || data.adSpend >= 1000) return 'high'
  // Low: low ratio (<5%) AND small absolute spend (<200억)
  if (data.adRatio < 5 && data.adSpend < 200) return 'low'
  return 'mid'
}

/** Format ad spend for display: "88억" or "5,518억" */
export function formatAdSpend(companyName: string): string | null {
  const spend = COMPANY_AD_DATA[companyName]?.adSpend
  if (spend == null) return null
  return `${spend.toLocaleString()}억`
}
