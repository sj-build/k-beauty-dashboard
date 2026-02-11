/**
 * K-Beauty brand set and helper utilities.
 * Ported from ui/brand_utils.py
 */

export const KBEAUTY_BRANDS: ReadonlySet<string> = new Set([
  // Amorepacific Group
  'sulwhasoo', 'laneige', 'innisfree', 'etude', 'mamonde', 'iope',
  'hera', 'primera', 'illiyoon', 'aestura', 'amorepacific',
  // LG H&H Group
  'the face shop', 'belif', 'cnp', 'su:m37', 'o hui',
  'the history of whoo',
  // Major K-Beauty (indie / DTC)
  'cosrx', 'anua', 'torriden', 'beauty of joseon', 'isntree',
  'medicube', 'numbuzin', 'skin1004', 'round lab', 'missha',
  'some by mi', 'klairs', 'purito', 'heimish', 'goodal',
  'neogen', 'benton', 'mizon', 'acwell', 'manyo', 'ma:nyo',
  'haruharu wonder', 'thank you farmer',
  // Clio group
  'clio', 'peripera',
  // Popular K-Beauty
  'biodance', 'tirtir', "d'alba", 'dalba', 'celimax', 'abib',
  'vt', 'vt cosmetics', '3ce', 'vdl', 'rom&nd', 'romand',
  'aprilskin', 'ariul', 'mixsoon', 'dr.althea', 'dr althea',
  'elizavecca', 'dr.melaxin', 'mediheal', 'dr.jart', 'dr jart',
  'holika holika', 'skinfood', 'too cool for school', 'tonymoly',
  'banila co', 'laka', 'wakemake', 'espoir', "age 20's", 'age20s',
  'dear klairs', 'by wishtrend', 'wishtrend', 'beplain',
  'seoulceuticals', 'the saem', 'saem',
  'dermaction', 'dermaction plus',
  'nature republic', "a'pieu", 'apieu', 'its skin', "it's skin",
  'erborian', 'papa recipe', 'pyunkang yul', 'snp',
  'dewytree', 'holika', 'hanyul', 'eqqualberry',
  'seranova', 'sacheu', 'goddvenus',
  // OliveYoung locals
  'milktouch', 'dasique', 'jung saem mool', 'jungsaemmool',
  'olive young', 'bring green', 'roundaround', 'round a round',
  'about me', 'lagom', 'lador', "la'dor", 'sidmool',
  'cosmedics', 'cell fusion c', 'cnp laboratory',
  'dr.g', 'dr g', 'the plant base', 'jayjun', 'j.one', 'jone',
  'miguhara', 'medi-peel', 'medipeel', 'real barrier',
  'scinic', 'tocobo', 'esfolio', 'so natural',
  'mary&may', 'mary and may', 'axis-y', 'axisy',
  'skin&lab', 'skinlab', 'iunik', 'rovectin',
  'nacific', 'a.h.c', 'ahc',
  'wellage', 'farmstay', 'brtc', 'enough',
  'tony moly', 'aritaum',
])

const BRAND_TO_COMPANY: Readonly<Record<string, string>> = {
  sulwhasoo: '아모레퍼시픽', laneige: '아모레퍼시픽', innisfree: '아모레퍼시픽',
  etude: '아모레퍼시픽', mamonde: '아모레퍼시픽', iope: '아모레퍼시픽',
  hera: '아모레퍼시픽', primera: '아모레퍼시픽', illiyoon: '아모레퍼시픽',
  aestura: '아모레퍼시픽', amorepacific: '아모레퍼시픽',
  'the face shop': 'LG생활건강', belif: 'LG생활건강', cnp: 'LG생활건강',
  'su:m37': 'LG생활건강', 'o hui': 'LG생활건강', 'the history of whoo': 'LG생활건강',
  clio: '클리오', peripera: '클리오',
  cosrx: '코스맥스', medicube: '에이피알', biodance: '바이오던스',
  tirtir: '티르티르', numbuzin: '넘버즈인',
  'rom&nd': '아이패밀리에스씨', romand: '아이패밀리에스씨',
  '3ce': '스타일난다', vdl: 'LG생활건강',
}

export function isKbeautyBrand(brand: string): boolean {
  if (!brand) return false
  const lower = brand.toLowerCase().trim()
  if (KBEAUTY_BRANDS.has(lower)) return true
  // Korean characters in brand name
  if (/[\uac00-\ud7a3]/.test(brand)) return true
  // Check company mapping
  if (BRAND_TO_COMPANY[lower]) return true
  return false
}

export function getCompanyName(brand: string): string | null {
  if (!brand) return null
  return BRAND_TO_COMPANY[brand.toLowerCase().trim()] ?? null
}

export function rankBadgeClass(rank: number): string {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'default'
}

export function formatPrice(price: number | null | undefined, currency: string): string {
  if (price == null) return ''
  if (currency === 'KRW') return `₩${price.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`
  if (currency === 'USD') return `$${price.toFixed(2)}`
  if (currency === 'AED') return `AED ${price.toFixed(2)}`
  return `${price.toFixed(2)} ${currency}`
}

export function formatChange(change: number, isNew: boolean = false): {
  readonly text: string
  readonly className: string
} {
  if (isNew) return { text: 'NEW', className: 'new-entry' }
  if (change > 0) return { text: `▲${change}`, className: 'up' }
  if (change < 0) return { text: `▼${Math.abs(change)}`, className: 'down' }
  return { text: '—', className: 'flat' }
}
