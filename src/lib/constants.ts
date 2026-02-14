import type { PlatformConfig, RegionConfig } from './types'

export const PLATFORMS: Readonly<Record<string, PlatformConfig>> = {
  oliveyoung: { name: 'OliveYoung', region: 'KR', iconCls: 'oy', icon: 'OY' },
  amazon_us: { name: 'Amazon US', region: 'US', iconCls: 'amz', icon: 'AZ' },
  amazon_ae: { name: 'Amazon AE', region: 'AE', iconCls: 'amz', icon: 'AZ' },
  amazon_sa: { name: 'Amazon SA', region: 'SA', iconCls: 'amz', icon: 'AZ' },
  sephora_us: { name: 'Sephora', region: 'US', iconCls: 'seph', icon: 'SP' },
  sephora_me: { name: 'Sephora', region: 'AE', iconCls: 'seph', icon: 'SP' },
  noon_ae: { name: 'Noon', region: 'AE', iconCls: 'noon', icon: 'NN' },
  ulta: { name: 'Ulta', region: 'US', iconCls: 'ulta', icon: 'UL' },
  target: { name: 'Target', region: 'US', iconCls: 'tgt', icon: 'TG' },
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
  oliveyoung: '/logos/oliveyoung.svg',
  amazon_us: '/logos/amazon.svg',
  amazon_ae: '/logos/amazon.svg',
  amazon_sa: '/logos/amazon.svg',
  sephora_us: '/logos/sephora.svg',
  sephora_me: '/logos/sephora.svg',
  noon_ae: '/logos/noon.svg',
  ulta: '/logos/ulta.svg',
  target: '/logos/target.svg',
  lifepharmacy: '/logos/lifepharmacy.svg',
  watsons_ae: '/logos/watsons.svg',
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
    extraPlatforms: ['sephora_us', 'ulta', 'target'],
  },
  AE: {
    name: 'UAE',
    nameKr: 'UAE',
    defaultPlatform: 'amazon_ae',
    extraPlatforms: ['sephora_me', 'noon_ae', 'watsons_ae', 'lifepharmacy'],
  },
}

export const CATEGORY_LABELS = ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Beauty Device'] as const

export const CATEGORY_KEYS: Readonly<Record<string, string>> = {
  Skincare: 'skincare',
  Haircare: 'haircare',
  Makeup: 'makeup',
  Fragrance: 'fragrance',
  'Beauty Device': 'beauty_device',
}

export const MENU_ITEMS = [
  { key: 'ranking', label: 'Current Ranking', labelKr: '현재 랭킹' },
  { key: 'top-rankers', label: 'Top Rankers', labelKr: '부동의 탑랭커' },
  { key: 'risers', label: 'Fast Movers', labelKr: '급상승' },
  { key: 'new-entrants', label: 'New Entrants', labelKr: '신규 진입자' },
  { key: 'crossborder', label: 'Cross-border Winners', labelKr: '글로벌 위너' },
  { key: 'social-signal', label: 'Social Signal', labelKr: '소셜 시그널' },
  { key: 'rising-stars', label: 'Rising Stars', labelKr: '라이징 스타' },
  { key: 'hidden-gems', label: 'Hidden Gems', labelKr: '숨은 보석' },
] as const

export const COMING_SOON_ITEMS = [
  { label: 'Subcategory', labelKr: '서브카테고리' },
] as const

export const CATEGORY_ALIASES: Readonly<Record<string, readonly string[]>> = {
  haircare: ['hair', 'haircare'],
  hair: ['hair', 'haircare'],
  skincare: ['skincare', 'beauty', 'personal_care', 'derma', 'k_beauty', 'bestsellers'],
  beauty: ['skincare', 'beauty', 'personal_care', 'derma', 'k_beauty', 'bestsellers'],
  makeup: ['makeup'],
  fragrance: ['fragrance'],
  beauty_device: ['skincare_device', 'beauty_home_device'],
  skincare_device: ['skincare_device', 'beauty_home_device'],
  beauty_home_device: ['skincare_device', 'beauty_home_device'],
}
