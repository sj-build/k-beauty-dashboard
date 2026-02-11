import type { PlatformConfig, RegionConfig } from './types'

export const PLATFORMS: Readonly<Record<string, PlatformConfig>> = {
  oliveyoung: { name: 'OliveYoung', region: 'KR', iconCls: 'oy', icon: 'OY' },
  amazon_us: { name: 'Amazon US', region: 'US', iconCls: 'amz', icon: 'AZ' },
  amazon_ae: { name: 'Amazon AE', region: 'AE', iconCls: 'amz', icon: 'AZ' },
  amazon_sa: { name: 'Amazon SA', region: 'SA', iconCls: 'amz', icon: 'AZ' },
  noon_ae: { name: 'Noon', region: 'AE', iconCls: 'noon', icon: 'NN' },
  ulta: { name: 'Ulta', region: 'US', iconCls: 'ulta', icon: 'UL' },
  tiktokshop_us: { name: 'TikTok Shop', region: 'US', iconCls: 'tts', icon: 'TT' },
  lifepharmacy: { name: 'LifePharmacy', region: 'AE', iconCls: 'lp', icon: 'LP' },
  watsons_ae: { name: 'Watsons AE', region: 'AE', iconCls: 'wat', icon: 'WA' },
}

export const REGION_FLAGS: Readonly<Record<string, string>> = {
  KR: '\u{1F1F0}\u{1F1F7}',
  US: '\u{1F1FA}\u{1F1F8}',
  AE: '\u{1F1E6}\u{1F1EA}',
  SA: '\u{1F1F8}\u{1F1E6}',
}

export const PLATFORM_LOGOS: Readonly<Record<string, string>> = {
  oliveyoung: '\u{1F33F}',
  amazon_us: '\u{1F4E6}',
  amazon_ae: '\u{1F4E6}',
  amazon_sa: '\u{1F4E6}',
  noon_ae: '\u{2600}\u{FE0F}',
  ulta: '\u{1F48E}',
  tiktokshop_us: '\u{1F3B5}',
  lifepharmacy: '\u{1F48A}',
  watsons_ae: '\u{1F49A}',
}

export const REGIONS: Readonly<Record<string, RegionConfig>> = {
  KR: {
    name: 'Korea',
    nameKr: '한국',
    defaultPlatform: 'oliveyoung',
    extraPlatforms: [],
  },
  US: {
    name: 'United States',
    nameKr: '미국',
    defaultPlatform: 'amazon_us',
    extraPlatforms: ['ulta', 'tiktokshop_us'],
  },
  AE: {
    name: 'UAE',
    nameKr: 'UAE',
    defaultPlatform: 'amazon_ae',
    extraPlatforms: ['noon_ae', 'watsons_ae', 'lifepharmacy'],
  },
}

export const CATEGORY_LABELS = ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Skincare Device', 'Beauty Home Device'] as const

export const CATEGORY_KEYS: Readonly<Record<string, string>> = {
  Skincare: 'skincare',
  Haircare: 'haircare',
  Makeup: 'makeup',
  Fragrance: 'fragrance',
  'Skincare Device': 'skincare_device',
  'Beauty Home Device': 'beauty_home_device',
}

export const MENU_ITEMS = [
  { key: 'ranking', label: 'Current Ranking', labelKr: '현재 랭킹' },
  { key: 'top-rankers', label: 'Top Rankers', labelKr: '부동의 탑랭커' },
  { key: 'risers', label: 'Fast Movers', labelKr: '급상승' },
  { key: 'new-entrants', label: 'New Entrants', labelKr: '뉴페이스' },
  { key: 'crossborder', label: 'Cross-border Winners', labelKr: '글로벌 위너' },
] as const

export const COMING_SOON_ITEMS = [
  { label: 'Subcategory', labelKr: '서브카테고리' },
  { label: 'Social Signal', labelKr: '소셜 시그널' },
] as const

export const CATEGORY_ALIASES: Readonly<Record<string, readonly string[]>> = {
  haircare: ['hair', 'haircare'],
  hair: ['hair', 'haircare'],
  skincare: ['skincare', 'beauty', 'personal_care', 'derma', 'k_beauty', 'bestsellers'],
  beauty: ['skincare', 'beauty', 'personal_care', 'derma', 'k_beauty', 'bestsellers'],
  makeup: ['makeup'],
  fragrance: ['fragrance'],
  skincare_device: ['skincare_device'],
  beauty_home_device: ['beauty_home_device'],
}
