/**
 * Supabase query functions - ported from ui/db_queries.py
 *
 * All functions run server-side via Server Components.
 * Tables: commerce_rankings, weekly_brand_metrics, brands, company_profiles
 */
import { getSupabaseAdmin } from './supabase'
import { CATEGORY_ALIASES } from './constants'
import type {
  RankingItem,
  ConsistentRanker,
  TopRankerItem,
  ClimberItem,
  NewEntrantItem,
  CrossBorderItem,
  BrandDrilldown,
  SearchResult,
  CompanyDetail,
  CompanyBrand,
  SocialSignalItem,
  HiddenGemItem,
} from './types'

// ── Category resolution ──

function resolveCategory(canonical: string): string {
  const map: Record<string, string> = {
    skincare: 'skincare',
    haircare: 'hair',
    makeup: 'makeup',
    fragrance: 'fragrance',
    skincare_device: 'skincare_device',
    beauty_home_device: 'beauty_home_device',
    beauty_device: 'skincare_device',
  }
  return map[canonical] ?? canonical
}

function getCategoryAliases(mainCategory: string): string[] {
  return [...(CATEGORY_ALIASES[mainCategory] ?? [mainCategory])]
}

// ── Available weeks ──

export async function getAvailableWeeks(): Promise<string[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('weekly_brand_metrics')
      .select('week_start')
      .order('week_start', { ascending: false })

    if (error) throw error
    if (!data) return []

    const unique = [...new Set(data.map((r) => r.week_start as string))]
    return unique
  } catch (e) {
    console.error('Failed to get available weeks:', e)
    return []
  }
}

// ── Platform Category Ranking ──

export async function getPlatformRanking(
  platform: string,
  region: string,
  mainCategory: string,
  limit: number = 30,
): Promise<RankingItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const aliases = getCategoryAliases(mainCategory)

    // Build OR filter for category aliases
    const categoryFilters = aliases
      .map((a) => `category.eq.${a},category.like.${a}:%`)
      .join(',')

    // Get latest snapshot date FOR THIS CATEGORY
    const { data: dateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .eq('platform', platform)
      .eq('region', region)
      .or(categoryFilters)
      .order('snapshot_date', { ascending: false })
      .limit(1)

    if (!dateData?.length) return []
    const latestDate = dateData[0].snapshot_date

    // Get current rows
    let query = supabase
      .from('commerce_rankings')
      .select('*')
      .eq('platform', platform)
      .eq('region', region)
      .eq('snapshot_date', latestDate)
      .order('rank_position', { ascending: true })
    query = query.or(categoryFilters)

    const { data: currentRows, error } = await query
    if (error) throw error
    if (!currentRows?.length) return []

    // Get previous snapshot for wow_change (same category filter)
    const { data: prevDateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .eq('platform', platform)
      .eq('region', region)
      .or(categoryFilters)
      .lt('snapshot_date', latestDate)
      .order('snapshot_date', { ascending: false })
      .limit(1)

    const prevBrandRank: Record<string, number> = {}
    if (prevDateData?.length) {
      const prevDate = prevDateData[0].snapshot_date
      let prevQuery = supabase
        .from('commerce_rankings')
        .select('brand_text, title, rank_position')
        .eq('platform', platform)
        .eq('region', region)
        .eq('snapshot_date', prevDate)
      prevQuery = prevQuery.or(categoryFilters)

      const { data: prevRows } = await prevQuery
      if (prevRows) {
        for (const pr of prevRows) {
          const brand = extractBrand(pr.brand_text, pr.title)
          const existing = prevBrandRank[brand]
          if (existing === undefined || pr.rank_position < existing) {
            prevBrandRank[brand] = pr.rank_position
          }
        }
      }
    }

    // Deduplicate by brand (best rank per brand)
    const brandBest: Record<string, {
      brand: string
      title: string
      subcategory: string
      rank_position: number
      price: number | null
      currency: string
      rating: number | null
      review_count: number | null
    }> = {}

    for (const row of currentRows) {
      const brandName = extractBrand(row.brand_text, row.title)
      const existing = brandBest[brandName]
      if (!existing || row.rank_position < existing.rank_position) {
        brandBest[brandName] = {
          brand: brandName,
          title: row.title ?? '',
          subcategory: row.category ?? '',
          rank_position: row.rank_position,
          price: row.price != null ? Number(row.price) : null,
          currency: row.currency ?? 'USD',
          rating: row.rating != null ? Number(row.rating) : null,
          review_count: row.review_count,
        }
      }
    }

    const sorted = Object.values(brandBest).sort(
      (a, b) => a.rank_position - b.rank_position,
    )

    return sorted.slice(0, limit).map((entry, idx) => {
      const prevRank = prevBrandRank[entry.brand]
      const isNew = prevRank === undefined
      const wowChange = prevRank !== undefined ? prevRank - entry.rank_position : 0

      return {
        rank: idx + 1,
        brand: entry.brand,
        title: entry.title,
        subcategory: entry.subcategory,
        price: entry.price ?? undefined,
        currency: entry.currency,
        rating: entry.rating ?? undefined,
        review_count: entry.review_count ?? undefined,
        wow_change: wowChange,
        is_new: isNew,
      }
    })
  } catch (e) {
    console.error('Failed to get platform ranking:', e)
    return []
  }
}

// ── Consistent Rankers (Top Rankers tab) ──

export async function getConsistentRankers(
  platform: string,
  region: string,
  mainCategory: string,
  topN: number = 20,
  minAppearances: number = 2,
  limit: number = 15,
): Promise<ConsistentRanker[]> {
  try {
    const supabase = getSupabaseAdmin()
    const aliases = getCategoryAliases(mainCategory)
    const categoryFilters = aliases
      .map((a) => `category.eq.${a},category.like.${a}:%`)
      .join(',')

    // Get all snapshot dates
    const { data: dateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .eq('platform', platform)
      .eq('region', region)
      .or(categoryFilters)
      .order('snapshot_date', { ascending: false })

    if (!dateData?.length) return []
    const allDates = [...new Set(dateData.map((d) => d.snapshot_date as string))]
    const effectiveMin = Math.min(minAppearances, allDates.length)

    // Get all rows in top_n across all snapshots
    let query = supabase
      .from('commerce_rankings')
      .select('*')
      .eq('platform', platform)
      .eq('region', region)
      .lte('rank_position', topN)
      .in('snapshot_date', allDates)
    query = query.or(categoryFilters)

    const { data: rows, error } = await query
    if (error) throw error
    if (!rows?.length) return []

    // Aggregate by brand
    const brandStats: Record<string, {
      brand: string
      appearances: Set<string>
      bestRank: number
      title: string
      price: number | null
      currency: string
      latestDate: string
      latestRank: number
    }> = {}

    for (const row of rows) {
      const brand = extractBrand(row.brand_text, row.title)
      if (!brandStats[brand]) {
        brandStats[brand] = {
          brand,
          appearances: new Set(),
          bestRank: row.rank_position,
          title: row.title ?? '',
          price: row.price != null ? Number(row.price) : null,
          currency: row.currency ?? 'USD',
          latestDate: row.snapshot_date,
          latestRank: row.rank_position,
        }
      }
      const stats = brandStats[brand]
      stats.appearances.add(row.snapshot_date)
      if (row.rank_position < stats.bestRank) {
        stats.bestRank = row.rank_position
      }
      if (row.snapshot_date > stats.latestDate) {
        stats.latestDate = row.snapshot_date
        stats.latestRank = row.rank_position
        stats.title = row.title ?? ''
        stats.price = row.price != null ? Number(row.price) : null
        stats.currency = row.currency ?? 'USD'
      }
    }

    const consistent = Object.values(brandStats)
      .filter((s) => s.appearances.size >= effectiveMin)
      .sort((a, b) => a.bestRank - b.bestRank || b.appearances.size - a.appearances.size)
      .slice(0, limit)

    return consistent.map((entry, idx) => ({
      rank: idx + 1,
      brand: entry.brand,
      title: entry.title,
      price: entry.price ?? undefined,
      currency: entry.currency,
      wow_change: 0,
      is_new: false,
      appearances: entry.appearances.size,
      total_snapshots: allDates.length,
      best_rank: entry.bestRank,
    }))
  } catch (e) {
    console.error('Failed to get consistent rankers:', e)
    return []
  }
}

// ── Top Rankers (WeeklyBrandMetric based) ──

export async function getTopRankers(
  category?: string,
  weeks: number = 4,
  limit: number = 15,
): Promise<TopRankerItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    // Get latest N weeks
    const availableWeeks = await getAvailableWeeks()
    const weekDates = availableWeeks.slice(0, weeks)
    if (!weekDates.length) return []

    // Get all metrics in top-10 for these weeks
    const { data: metricRows, error } = await supabase
      .from('weekly_brand_metrics')
      .select('brand_id, week_start, global_best_rank, markets_present')
      .in('week_start', weekDates)
      .lte('global_best_rank', 10)
      .not('global_best_rank', 'is', null)

    if (error) throw error
    if (!metricRows?.length) return []

    // Count appearances per brand
    const brandCount: Record<string, { weeks: Set<string>; bestRank: number; markets: Record<string, string[]> }> = {}
    for (const row of metricRows) {
      if (!brandCount[row.brand_id]) {
        brandCount[row.brand_id] = { weeks: new Set(), bestRank: row.global_best_rank, markets: {} }
      }
      const bc = brandCount[row.brand_id]
      bc.weeks.add(row.week_start)
      if (row.global_best_rank < bc.bestRank) bc.bestRank = row.global_best_rank
      if (row.markets_present) {
        try {
          bc.markets = typeof row.markets_present === 'string'
            ? JSON.parse(row.markets_present)
            : row.markets_present
        } catch { /* ignore */ }
      }
    }

    // Filter brands in top-10 for ALL weeks
    const brandIds = Object.entries(brandCount)
      .filter(([, v]) => v.weeks.size >= weekDates.length)
      .map(([id]) => id)

    if (!brandIds.length) return []

    // Fetch brand info
    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, name_kr, category')
      .in('id', brandIds)

    if (!brands?.length) return []

    const results: TopRankerItem[] = []
    for (const brand of brands) {
      if (category) {
        const dbCat = resolveCategory(category)
        if (brand.category && brand.category !== dbCat) continue
      }

      const bc = brandCount[brand.id]
      if (!bc) continue

      const platforms: string[] = []
      for (const regionPlatforms of Object.values(bc.markets)) {
        if (Array.isArray(regionPlatforms)) {
          platforms.push(...regionPlatforms)
        }
      }

      results.push({
        brand_id: brand.id,
        brand_name: brand.name,
        brand_name_kr: brand.name_kr,
        weeks_in_top: bc.weeks.size,
        best_rank: bc.bestRank,
        platforms,
        explanation: `${bc.weeks.size}주 연속 Top10 유지`,
      })
    }

    return results.sort((a, b) => a.best_rank - b.best_rank).slice(0, limit)
  } catch (e) {
    console.error('Failed to get top rankers:', e)
    return []
  }
}

// ── Climbers (Risers tab) ──

export async function getClimbers(
  category?: string,
  limit: number = 15,
): Promise<ClimberItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const weeks = await getAvailableWeeks()
    if (!weeks.length) return []
    const latestWeek = weeks[0]

    let query = supabase
      .from('weekly_brand_metrics')
      .select('brand_id, wow_rank_change, consecutive_weeks_rising, four_week_improvement, brands!inner(name, name_kr, category)')
      .eq('week_start', latestWeek)
      .or('wow_rank_change.gt.0,consecutive_weeks_rising.gt.1')
      .order('wow_rank_change', { ascending: false })
      .limit(limit)

    if (category) {
      const dbCat = resolveCategory(category)
      query = query.eq('brands.category', dbCat)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data?.length) return []

    return data.map((row) => {
      const brand = row.brands as unknown as { name: string; name_kr: string | null }
      const streak = row.consecutive_weeks_rising ?? 0
      const wow = row.wow_rank_change ?? 0

      return {
        brand_id: row.brand_id,
        brand_name: brand.name,
        brand_name_kr: brand.name_kr ?? undefined,
        wow_change: wow,
        streak,
        four_week_improvement: row.four_week_improvement,
        explanation: streak > 1 ? `${streak}주 연속 상승` : `WoW +${wow}`,
      }
    })
  } catch (e) {
    console.error('Failed to get climbers:', e)
    return []
  }
}

// ── New Entrants ──

export async function getNewEntrants(
  category?: string,
  limit: number = 15,
): Promise<NewEntrantItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const weeks = await getAvailableWeeks()
    if (!weeks.length) return []
    const latestWeek = weeks[0]

    let query = supabase
      .from('weekly_brand_metrics')
      .select('brand_id, global_best_rank, markets_present, brands!inner(name, name_kr, category)')
      .eq('week_start', latestWeek)
      .eq('is_new_entrant', true)
      .order('global_best_rank', { ascending: true })
      .limit(limit)

    if (category) {
      const dbCat = resolveCategory(category)
      query = query.eq('brands.category', dbCat)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data?.length) return []

    return data.map((row) => {
      const brand = row.brands as unknown as { name: string; name_kr: string | null }
      let markets: Record<string, string[]> = {}
      if (row.markets_present) {
        try {
          markets = typeof row.markets_present === 'string'
            ? JSON.parse(row.markets_present)
            : row.markets_present
        } catch { /* ignore */ }
      }

      const platforms: string[] = []
      const platformLabels: string[] = []
      for (const [regionCode, regionPlatforms] of Object.entries(markets)) {
        if (Array.isArray(regionPlatforms)) {
          platforms.push(...regionPlatforms)
          for (const p of regionPlatforms) {
            platformLabels.push(`${regionCode} ${p}`)
          }
        }
      }

      const label = platformLabels.slice(0, 3).join(', ')
      return {
        brand_id: row.brand_id,
        brand_name: brand.name,
        brand_name_kr: brand.name_kr ?? undefined,
        entry_rank: row.global_best_rank,
        platforms,
        explanation: label ? `이번 주 첫 진입 (${label})` : '이번 주 첫 진입',
      }
    })
  } catch (e) {
    console.error('Failed to get new entrants:', e)
    return []
  }
}

// ── Platform Climbers (per-platform, for Fast Movers tab) ──

export async function getPlatformClimbers(
  platform: string,
  region: string,
  mainCategory: string,
  limit: number = 15,
): Promise<RankingItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const aliases = getCategoryAliases(mainCategory)
    const categoryFilters = aliases
      .map((a) => `category.eq.${a},category.like.${a}:%`)
      .join(',')

    // Get latest 2 snapshot dates
    const { data: dateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .eq('platform', platform)
      .eq('region', region)
      .or(categoryFilters)
      .order('snapshot_date', { ascending: false })

    if (!dateData?.length) return []
    const allDates = [...new Set(dateData.map((d) => d.snapshot_date as string))]
    if (allDates.length < 2) return []

    const [latestDate, prevDate] = allDates

    // Get current and previous rankings
    const fetchRows = async (date: string) => {
      let query = supabase
        .from('commerce_rankings')
        .select('*')
        .eq('platform', platform)
        .eq('region', region)
        .eq('snapshot_date', date)
        .or(categoryFilters)

      const { data } = await query
      return data ?? []
    }

    const [currentRows, prevRows] = await Promise.all([
      fetchRows(latestDate),
      fetchRows(prevDate),
    ])

    // Build prev brand→rank map
    const prevBrandRank: Record<string, number> = {}
    for (const pr of prevRows) {
      const brand = extractBrand(pr.brand_text, pr.title)
      const existing = prevBrandRank[brand]
      if (existing === undefined || pr.rank_position < existing) {
        prevBrandRank[brand] = pr.rank_position
      }
    }

    // Build current brand best rank
    const brandBest: Record<string, {
      brand: string
      title: string
      subcategory: string
      rank_position: number
      price: number | null
      currency: string
    }> = {}

    for (const row of currentRows) {
      const brand = extractBrand(row.brand_text, row.title)
      const existing = brandBest[brand]
      if (!existing || row.rank_position < existing.rank_position) {
        brandBest[brand] = {
          brand,
          title: row.title ?? '',
          subcategory: row.category ?? '',
          rank_position: row.rank_position,
          price: row.price != null ? Number(row.price) : null,
          currency: row.currency ?? 'USD',
        }
      }
    }

    // Calculate climbers (positive wow_change = improved)
    const climbers: RankingItem[] = []
    for (const entry of Object.values(brandBest)) {
      const prevRank = prevBrandRank[entry.brand]
      if (prevRank === undefined) continue
      const wowChange = prevRank - entry.rank_position
      if (wowChange <= 0) continue

      climbers.push({
        rank: entry.rank_position,
        brand: entry.brand,
        title: entry.title,
        subcategory: entry.subcategory,
        price: entry.price ?? undefined,
        currency: entry.currency,
        wow_change: wowChange,
        is_new: false,
      })
    }

    return climbers
      .sort((a, b) => b.wow_change - a.wow_change)
      .slice(0, limit)
  } catch (e) {
    console.error('Failed to get platform climbers:', e)
    return []
  }
}

// ── Platform New Entrants (per-platform, for New Entrants tab) ──

export async function getPlatformNewEntrants(
  platform: string,
  region: string,
  mainCategory: string,
  limit: number = 15,
): Promise<RankingItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const aliases = getCategoryAliases(mainCategory)
    const categoryFilters = aliases
      .map((a) => `category.eq.${a},category.like.${a}:%`)
      .join(',')

    // Get latest 2 snapshot dates
    const { data: dateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .eq('platform', platform)
      .eq('region', region)
      .or(categoryFilters)
      .order('snapshot_date', { ascending: false })

    if (!dateData?.length) return []
    const allDates = [...new Set(dateData.map((d) => d.snapshot_date as string))]
    if (allDates.length < 2) return []

    const [latestDate, prevDate] = allDates

    // Get current and previous rankings
    const fetchRows = async (date: string) => {
      let query = supabase
        .from('commerce_rankings')
        .select('*')
        .eq('platform', platform)
        .eq('region', region)
        .eq('snapshot_date', date)
        .or(categoryFilters)

      const { data } = await query
      return data ?? []
    }

    const [currentRows, prevRows] = await Promise.all([
      fetchRows(latestDate),
      fetchRows(prevDate),
    ])

    // Build set of previous brands
    const prevBrands = new Set<string>()
    for (const pr of prevRows) {
      prevBrands.add(extractBrand(pr.brand_text, pr.title))
    }

    // Find brands in current but not in previous
    const brandBest: Record<string, {
      brand: string
      title: string
      subcategory: string
      rank_position: number
      price: number | null
      currency: string
    }> = {}

    for (const row of currentRows) {
      const brand = extractBrand(row.brand_text, row.title)
      if (prevBrands.has(brand)) continue

      const existing = brandBest[brand]
      if (!existing || row.rank_position < existing.rank_position) {
        brandBest[brand] = {
          brand,
          title: row.title ?? '',
          subcategory: row.category ?? '',
          rank_position: row.rank_position,
          price: row.price != null ? Number(row.price) : null,
          currency: row.currency ?? 'USD',
        }
      }
    }

    return Object.values(brandBest)
      .sort((a, b) => a.rank_position - b.rank_position)
      .slice(0, limit)
      .map((entry) => ({
        rank: entry.rank_position,
        brand: entry.brand,
        title: entry.title,
        subcategory: entry.subcategory,
        price: entry.price ?? undefined,
        currency: entry.currency,
        wow_change: 0,
        is_new: true,
      }))
  } catch (e) {
    console.error('Failed to get platform new entrants:', e)
    return []
  }
}

// ── Cross-border Winners ──

export async function getCrossborder(
  category?: string,
  limit: number = 15,
): Promise<CrossBorderItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const weeks = await getAvailableWeeks()
    if (!weeks.length) return []
    const latestWeek = weeks[0]

    let query = supabase
      .from('weekly_brand_metrics')
      .select('brand_id, cross_border_score, markets_present, brands!inner(name, name_kr, category)')
      .eq('week_start', latestWeek)
      .not('markets_present', 'is', null)

    if (category) {
      const dbCat = resolveCategory(category)
      query = query.eq('brands.category', dbCat)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data?.length) return []

    const results: CrossBorderItem[] = []
    for (const row of data) {
      const brand = row.brands as unknown as { name: string; name_kr: string | null }
      let markets: Record<string, string[]> = {}
      try {
        markets = typeof row.markets_present === 'string'
          ? JSON.parse(row.markets_present)
          : (row.markets_present ?? {})
      } catch {
        continue
      }

      const regions = Object.keys(markets).filter((k) => {
        const v = markets[k]
        return Array.isArray(v) && v.length > 0
      })
      if (regions.length < 2) continue

      const explanation = regions.length === 2
        ? `${regions[0]} → ${regions[1]} 진입`
        : `${regions.join('+')} 동시 강세`

      results.push({
        brand_id: row.brand_id,
        brand_name: brand.name,
        brand_name_kr: brand.name_kr ?? undefined,
        regions,
        platforms_per_region: markets,
        cross_border_score: row.cross_border_score ?? 0,
        explanation,
      })
    }

    return results
      .sort((a, b) => b.cross_border_score - a.cross_border_score)
      .slice(0, limit)
  } catch (e) {
    console.error('Failed to get crossborder:', e)
    return []
  }
}

// ── Brand Drilldown ──

export async function getBrandDrilldown(
  brandId: string,
  weeks: number = 8,
): Promise<BrandDrilldown | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data: brand } = await supabase
      .from('brands')
      .select('id, name, name_kr')
      .eq('id', brandId)
      .single()

    if (!brand) return null

    const { data: metrics } = await supabase
      .from('weekly_brand_metrics')
      .select('*')
      .eq('brand_id', brandId)
      .order('week_start', { ascending: false })
      .limit(weeks)

    if (!metrics?.length) return null

    const history = [...metrics].reverse().map((m) => ({
      week_start: m.week_start,
      global_best_rank: m.global_best_rank,
      leader_score: m.leader_score ?? 0,
      growth_score: m.growth_score ?? 0,
      oliveyoung: m.oliveyoung_best_rank,
      amazon_us: m.amazon_us_best_rank,
      amazon_ae: m.amazon_ae_best_rank,
    }))

    const latest = metrics[0]
    let marketsPresent: Record<string, string[]> = {}
    if (latest.markets_present) {
      try {
        marketsPresent = typeof latest.markets_present === 'string'
          ? JSON.parse(latest.markets_present)
          : latest.markets_present
      } catch { /* ignore */ }
    }

    return {
      brand_id: brandId,
      brand_name: brand.name,
      brand_name_kr: brand.name_kr,
      history,
      latest_explanation: latest.explanation ?? '',
      latest_leader_score: latest.leader_score ?? 0,
      latest_growth_score: latest.growth_score ?? 0,
      latest_new_leader_score: latest.new_leader_score ?? 0,
      latest_cross_border_score: latest.cross_border_score ?? 0,
      markets_present: marketsPresent,
    }
  } catch (e) {
    console.error('Failed to get brand drilldown:', e)
    return null
  }
}

// ── Search ──

export async function searchBrands(
  query: string,
  limit: number = 10,
): Promise<SearchResult[]> {
  if (!query?.trim()) return []

  try {
    const supabase = getSupabaseAdmin()
    const term = `%${query.trim()}%`

    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, name_kr')
      .or(`name.ilike.${term},name_kr.ilike.${term}`)
      .limit(limit)

    const results: SearchResult[] = (brands ?? []).map((b) => ({
      id: b.id,
      name: b.name,
      name_kr: b.name_kr,
      type: 'brand' as const,
    }))

    const remaining = limit - results.length
    if (remaining > 0) {
      const { data: companies } = await supabase
        .from('company_profiles')
        .select('company_id, legal_name')
        .ilike('legal_name', term)
        .limit(remaining)

      if (companies) {
        for (const c of companies) {
          results.push({
            id: c.company_id,
            name: c.legal_name,
            type: 'company' as const,
          })
        }
      }
    }

    return results
  } catch (e) {
    console.error('Failed to search:', e)
    return []
  }
}

// ── Company Detail ──

export async function getCompanyDetail(
  companyId: string,
): Promise<CompanyDetail | null> {
  try {
    const supabase = getSupabaseAdmin()

    // Fetch company profile
    const { data: profile, error: profileErr } = await supabase
      .from('company_profiles')
      .select('company_id, legal_name, website_url, hq_location, founded_year, ticker, public_company, employee_count_range, executives')
      .eq('company_id', companyId)
      .single()

    if (profileErr || !profile) return null

    // Fetch owned brands (via brand_profiles or brands table with company mapping)
    const brands: CompanyBrand[] = []

    // Try brand_profiles table first
    const { data: brandProfiles } = await supabase
      .from('brand_profiles')
      .select('brand_id, brands!inner(name, name_kr, category)')
      .eq('owner_company_id', companyId)

    if (brandProfiles?.length) {
      for (const bp of brandProfiles) {
        const brand = bp.brands as unknown as { name: string; name_kr?: string; category?: string }
        brands.push({
          brand_id: bp.brand_id,
          brand_name: brand.name,
          brand_name_kr: brand.name_kr,
          category: brand.category,
        })
      }
    }

    // Fetch latest financial snapshot
    const { data: financials } = await supabase
      .from('company_financial_snapshots')
      .select('snapshot_date, source, revenue, operating_profit, net_income, operating_margin, yoy_revenue_growth')
      .eq('company_id', companyId)
      .order('snapshot_date', { ascending: false })
      .limit(4)

    // Fetch latest market snapshot
    let market = null
    if (profile.ticker) {
      const { data: marketData } = await supabase
        .from('company_market_snapshots')
        .select('snapshot_datetime, ticker, current_price, market_cap, day_change_pct, volume, high_52w, low_52w, currency')
        .eq('company_id', companyId)
        .order('snapshot_datetime', { ascending: false })
        .limit(1)

      if (marketData?.length) {
        market = marketData[0]
      }
    }

    return {
      profile: {
        company_id: profile.company_id,
        legal_name: profile.legal_name,
        website_url: profile.website_url,
        hq_location: profile.hq_location,
        founded_year: profile.founded_year,
        ticker: profile.ticker,
        public_company: profile.public_company ?? false,
        employee_count_range: profile.employee_count_range,
        executives: profile.executives,
      },
      brands,
      financials: financials ?? [],
      market,
    }
  } catch (e) {
    console.error('Failed to get company detail:', e)
    return null
  }
}

// ── Brand Key Products ──

export interface BrandProduct {
  readonly platform: string
  readonly region: string
  readonly title: string
  readonly rank: number
  readonly price?: number
  readonly currency: string
  readonly category: string
  readonly rating?: number
  readonly review_count?: number
}

export async function getBrandProducts(
  brandName: string,
  limit: number = 10,
): Promise<BrandProduct[]> {
  try {
    const supabase = getSupabaseAdmin()

    // Get latest snapshot date FOR THIS BRAND
    const { data: dateData } = await supabase
      .from('commerce_rankings')
      .select('snapshot_date')
      .ilike('brand_text', brandName)
      .order('snapshot_date', { ascending: false })
      .limit(1)

    if (!dateData?.length) return []
    const latestDate = dateData[0].snapshot_date

    const { data: rows, error } = await supabase
      .from('commerce_rankings')
      .select('platform, region, title, rank_position, price, currency, category, rating, review_count')
      .eq('snapshot_date', latestDate)
      .ilike('brand_text', brandName)
      .order('rank_position', { ascending: true })
      .limit(limit)

    if (error) throw error
    if (!rows?.length) return []

    return rows.map((r) => ({
      platform: r.platform,
      region: r.region,
      title: r.title ?? '',
      rank: r.rank_position,
      price: r.price != null ? Number(r.price) : undefined,
      currency: r.currency ?? 'USD',
      category: r.category ?? '',
      rating: r.rating != null ? Number(r.rating) : undefined,
      review_count: r.review_count ?? undefined,
    }))
  } catch (e) {
    console.error('Failed to get brand products:', e)
    return []
  }
}

// ── Social Signals ──

export async function getSocialSignals(
  category?: string,
  limit: number = 20,
): Promise<SocialSignalItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('social_hypotheses')
      .select('*')
      .order('confidence', { ascending: false })
      .limit(100) // fetch more, filter by category below

    if (error) throw error
    if (!data?.length) return []

    // If category filter, look up brand categories
    let categoryFilter: Set<string> | null = null
    if (category) {
      const cats = getCategoryAliases(category)
      const entityNames = data.map((r) => r.entity_name)
      const { data: brands } = await supabase
        .from('brands')
        .select('name, category')
        .in('name', entityNames)

      if (brands?.length) {
        const matchingBrands = new Set(
          brands
            .filter((b) => cats.includes(b.category))
            .map((b) => b.name.toLowerCase())
        )
        categoryFilter = matchingBrands
      }
    }

    const filtered = data
      .filter((row) => {
        if (!categoryFilter) return true
        return categoryFilter.has(row.entity_name.toLowerCase())
      })
      .slice(0, limit)

    return filtered.map((row) => {
      let signals = row.signals ?? []
      if (typeof signals === 'string') {
        try { signals = JSON.parse(signals) } catch { signals = [] }
      }

      return {
        id: row.id,
        entity_name: row.entity_name,
        entity_type: row.entity_type ?? 'brand',
        prediction: row.prediction,
        confidence: row.confidence,
        signals,
        status: row.status ?? 'pending',
        actual_outcome: row.actual_outcome ?? undefined,
        notes: row.notes ?? undefined,
        validate_by: row.validate_by ?? undefined,
        created_at: row.created_at,
      }
    })
  } catch (e) {
    console.error('Failed to get social signals:', e)
    return []
  }
}

// ── Hidden Gems ──

/** Large conglomerates whose brands are marketing-heavy (exclude from hidden gems) */
const TIER1_COMPANIES = new Set([
  '아모레퍼시픽', 'LG생활건강', '클리오', '에이피알',
  '해브앤비', '카버코리아', '난다', // acquired by global luxury
  '로시땅그룹', // Erborian → L'Occitane
])

export async function getHiddenGems(
  category?: string,
  limit: number = 30,
): Promise<HiddenGemItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { getCompanyName } = await import('./brands')

    // Get latest week
    const weeks = await getAvailableWeeks()
    if (!weeks.length) return []
    const latestWeek = weeks[0]

    // Fetch metrics with brand join
    let query = supabase
      .from('weekly_brand_metrics')
      .select(`
        brand_id, leader_score, growth_score, new_leader_score, cross_border_score,
        oliveyoung_best_rank, amazon_us_best_rank, amazon_ae_best_rank,
        sephora_us_best_rank, ulta_best_rank, noon_ae_best_rank,
        global_best_rank, is_new_entrant, markets_present,
        brands!inner(name, name_kr, category)
      `)
      .eq('week_start', latestWeek)
      .or('new_leader_score.gt.0,growth_score.gt.0,cross_border_score.gt.0')

    if (category) {
      const dbCat = resolveCategory(category)
      query = query.eq('brands.category', dbCat)
    }

    const { data, error } = await query
    if (error) throw error
    if (!data?.length) return []

    // Filter out Tier-1 conglomerate brands and sort by growth signal
    const gems = data
      .map((row) => {
        const brand = row.brands as unknown as { name: string; name_kr: string | null; category: string }
        const companyName = getCompanyName(brand.name) ?? undefined
        const isTier1 = companyName ? TIER1_COMPANIES.has(companyName) : false
        return { ...row, brandName: brand.name, brandNameKr: brand.name_kr, brandCategory: brand.category, companyName, isTier1 }
      })
      .filter((row) => !row.isTier1)
      .sort((a, b) => {
        const scoreA = (a.new_leader_score ?? 0) * 2 + (a.growth_score ?? 0) * 1.5 + (a.cross_border_score ?? 0)
        const scoreB = (b.new_leader_score ?? 0) * 2 + (b.growth_score ?? 0) * 1.5 + (b.cross_border_score ?? 0)
        return scoreB - scoreA
      })
      .slice(0, limit)

    return gems.map((row): HiddenGemItem => {
      const platforms: string[] = []
      if (row.oliveyoung_best_rank) platforms.push('OliveYoung')
      if (row.amazon_us_best_rank) platforms.push('Amazon US')
      if (row.amazon_ae_best_rank) platforms.push('Amazon AE')
      if (row.sephora_us_best_rank) platforms.push('Sephora')
      if (row.ulta_best_rank) platforms.push('Ulta')
      if (row.noon_ae_best_rank) platforms.push('Noon')

      const bestRank = Math.min(
        ...[
          row.oliveyoung_best_rank,
          row.amazon_us_best_rank,
          row.amazon_ae_best_rank,
          row.sephora_us_best_rank,
          row.ulta_best_rank,
          row.noon_ae_best_rank,
        ].filter((r): r is number => r != null && r > 0)
      )

      const parts: string[] = []
      if ((row.new_leader_score ?? 0) > 0) parts.push('New entrant with breakthrough momentum')
      if ((row.growth_score ?? 0) > 0) parts.push(`Growth score ${row.growth_score}`)
      if ((row.cross_border_score ?? 0) > 0) parts.push(`Present in ${platforms.length} platforms`)
      const explanation = parts.join(' · ') || 'Emerging brand signal detected'

      return {
        brand_id: row.brand_id,
        brand_name: row.brandName,
        brand_name_kr: row.brandNameKr ?? undefined,
        company_name: row.companyName,
        category: row.brandCategory ?? undefined,
        new_leader_score: row.new_leader_score ?? 0,
        growth_score: row.growth_score ?? 0,
        cross_border_score: row.cross_border_score ?? 0,
        leader_score: row.leader_score ?? 0,
        platforms,
        best_rank: bestRank === Infinity ? undefined : bestRank,
        explanation,
      }
    })
  } catch (e) {
    console.error('Failed to get hidden gems:', e)
    return []
  }
}

// ── Helper ──

function extractBrand(brandText: string | null, title: string | null): string {
  if (brandText?.trim()) return brandText.trim()
  if (!title) return 'Unknown'
  const words = title.trim().split(/\s+/)
  // Single-word titles or short words like "The", "Dr", "La" need the next word too
  if (words.length >= 2 && words[0].length <= 3) {
    return `${words[0]} ${words[1]}`
  }
  return words[0] || 'Unknown'
}
