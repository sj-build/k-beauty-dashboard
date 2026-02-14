export interface RankingItem {
  readonly rank: number
  readonly brand: string
  readonly title: string
  readonly subcategory?: string
  readonly price?: number
  readonly currency: string
  readonly rating?: number
  readonly review_count?: number
  readonly wow_change: number
  readonly is_new: boolean
}

export interface ConsistentRanker extends RankingItem {
  readonly appearances: number
  readonly total_snapshots: number
  readonly best_rank: number
}

export interface MetricItem {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly brand_category: string
  readonly rank: number
  readonly global_best_rank?: number
  readonly leader_score: number
  readonly growth_score: number
  readonly new_leader_score: number
  readonly cross_border_score: number
  readonly wow_rank_change?: number
  readonly four_week_improvement?: number
  readonly consecutive_weeks_rising: number
  readonly is_new_entrant?: boolean
  readonly explanation: string
  readonly markets_present: Record<string, string[]>
  readonly oliveyoung_best_rank?: number
  readonly amazon_us_best_rank?: number
  readonly amazon_ae_best_rank?: number
}

export interface TopRankerItem {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly weeks_in_top: number
  readonly best_rank: number
  readonly platforms: string[]
  readonly explanation: string
}

export interface ClimberItem {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly wow_change: number
  readonly streak: number
  readonly four_week_improvement?: number
  readonly explanation: string
}

export interface NewEntrantItem {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly entry_rank?: number
  readonly platforms: string[]
  readonly explanation: string
}

export interface CrossBorderItem {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly regions: string[]
  readonly platforms_per_region: Record<string, string[]>
  readonly cross_border_score: number
  readonly explanation: string
}

export interface BrandDrilldown {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly history: ReadonlyArray<{
    readonly week_start: string
    readonly global_best_rank?: number
    readonly leader_score: number
    readonly growth_score: number
    readonly oliveyoung?: number
    readonly amazon_us?: number
    readonly amazon_ae?: number
  }>
  readonly latest_explanation: string
  readonly latest_leader_score: number
  readonly latest_growth_score: number
  readonly latest_new_leader_score: number
  readonly latest_cross_border_score: number
  readonly markets_present: Record<string, string[]>
}

export interface SearchResult {
  readonly id: string
  readonly name: string
  readonly name_kr?: string
  readonly type: 'brand' | 'company'
}

export interface CompanyProfile {
  readonly company_id: string
  readonly legal_name: string
  readonly website_url?: string
  readonly hq_location?: string
  readonly founded_year?: number
  readonly ticker?: string
  readonly public_company: boolean
  readonly employee_count_range?: string
  readonly executives?: Record<string, string>
}

export interface CompanyFinancial {
  readonly snapshot_date: string
  readonly source: string
  readonly revenue?: number
  readonly operating_profit?: number
  readonly net_income?: number
  readonly operating_margin?: number
  readonly yoy_revenue_growth?: number
}

export interface CompanyMarket {
  readonly snapshot_datetime: string
  readonly ticker: string
  readonly current_price?: number
  readonly market_cap?: number
  readonly day_change_pct?: number
  readonly volume?: number
  readonly high_52w?: number
  readonly low_52w?: number
  readonly currency?: string
}

export interface CompanyBrand {
  readonly brand_id: string
  readonly brand_name: string
  readonly brand_name_kr?: string
  readonly category?: string
  readonly latest_rank?: number
}

export interface CompanyDetail {
  readonly profile: CompanyProfile
  readonly brands: readonly CompanyBrand[]
  readonly financials: readonly CompanyFinancial[]
  readonly market: CompanyMarket | null
}

export interface SocialSignalItem {
  readonly id: string
  readonly entity_name: string
  readonly entity_type: string
  readonly prediction: string
  readonly confidence: number
  readonly signals: readonly SocialSignalDetail[]
  readonly status: string
  readonly actual_outcome?: string
  readonly notes?: string
  readonly validate_by?: string
  readonly created_at: string
}

export interface SocialSignalDetail {
  readonly entity_name: string
  readonly platform: string
  readonly signal_type: string
  readonly signal_strength: number
  readonly change_rate: number
  readonly detected_at: string
}

export interface PlatformConfig {
  readonly name: string
  readonly region: string
  readonly iconCls: string
  readonly icon: string
}

export interface RegionConfig {
  readonly name: string
  readonly nameKr: string
  readonly defaultPlatform: string
  readonly extraPlatforms: readonly string[]
}
