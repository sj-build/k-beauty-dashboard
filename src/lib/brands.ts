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
  // ── Amorepacific Group ──
  sulwhasoo: '아모레퍼시픽', laneige: '아모레퍼시픽', innisfree: '아모레퍼시픽',
  etude: '아모레퍼시픽', mamonde: '아모레퍼시픽', iope: '아모레퍼시픽',
  hera: '아모레퍼시픽', primera: '아모레퍼시픽', illiyoon: '아모레퍼시픽',
  aestura: '아모레퍼시픽', amorepacific: '아모레퍼시픽',
  espoir: '아모레퍼시픽', hanyul: '아모레퍼시픽', aritaum: '아모레퍼시픽',

  // ── LG H&H Group ──
  'the face shop': 'LG생활건강', belif: 'LG생활건강', cnp: 'LG생활건강',
  'cnp laboratory': 'LG생활건강', 'su:m37': 'LG생활건강',
  'o hui': 'LG생활건강', 'the history of whoo': 'LG생활건강', vdl: 'LG생활건강',

  // ── Clio Group ──
  clio: '클리오', peripera: '클리오', goodal: '클리오',

  // ── APR Corporation ──
  medicube: '에이피알', aprilskin: '에이피알',

  // ── Goodai Global (굿다이글로벌) ──
  'beauty of joseon': '굿다이글로벌', tirtir: '굿다이글로벌',
  skin1004: '굿다이글로벌', laka: '굿다이글로벌', iunik: '굿다이글로벌',

  // ── Able C&C (에이블씨엔씨) ──
  missha: '에이블씨엔씨', "a'pieu": '에이블씨엔씨', apieu: '에이블씨엔씨',

  // ── CJ Olive Young Group ──
  'olive young': 'CJ올리브영', 'bring green': 'CJ올리브영',
  wakemake: 'CJ올리브영', roundaround: 'CJ올리브영', 'round a round': 'CJ올리브영',

  // ── BENOW (비나우) ──
  numbuzin: '비나우',

  // ── Wishcompany (위시컴퍼니) ──
  klairs: '위시컴퍼니', 'dear klairs': '위시컴퍼니',
  'by wishtrend': '위시컴퍼니', wishtrend: '위시컴퍼니',

  // ── Other multi-brand groups ──
  'rom&nd': '아이패밀리에스씨', romand: '아이패밀리에스씨',
  '3ce': '난다', // L'Oréal acquired
  'dr.jart': '해브앤비', 'dr jart': '해브앤비', // Estée Lauder acquired
  'a.h.c': '카버코리아', ahc: '카버코리아', // Unilever acquired

  // ── Indie brands (법인명) ──
  cosrx: '코스알엑스',
  anua: '더파운더즈',
  torriden: '토리든',
  isntree: '이즈앤트리',
  'round lab': '서린컴퍼니',
  'some by mi': '페렌벨',
  neogen: '아우딘퓨쳐스',
  benton: '벤튼',
  mizon: 'PFD',
  acwell: '비앤에이치코스메틱',
  manyo: '마녀공장', 'ma:nyo': '마녀공장',
  purito: '하이네이처',
  heimish: '원앤드',
  'haruharu wonder': 'DFS컴퍼니',
  'thank you farmer': '땡큐파머',
  biodance: '뷰티셀렉션',
  "d'alba": '달바글로벌', dalba: '달바글로벌',
  celimax: '앱솔브랩',
  abib: '포컴퍼니',
  vt: '브이티', 'vt cosmetics': '브이티',
  mixsoon: '파켓',
  'dr.althea': '닥터알떼아', 'dr althea': '닥터알떼아',
  elizavecca: '미즈트레이드',
  mediheal: '엘앤피코스메틱',
  'holika holika': '엔코스', holika: '엔코스',
  skinfood: '아이피어스',
  'too cool for school': '투쿨포스쿨',
  tonymoly: '토니모리', 'tony moly': '토니모리',
  'banila co': '에프앤코',
  "age 20's": '애경산업', age20s: '애경산업',
  'the saem': '더샘', saem: '더샘',
  'nature republic': '네이처리퍼블릭',
  "it's skin": '잇츠한불', 'its skin': '잇츠한불',
  'papa recipe': '코스토리',
  'pyunkang yul': '편강율',
  snp: '에스디생명공학',
  dewytree: '듀이트리',
  dasique: '바이에콤',
  milktouch: '올리브인터내셔널',
  'jung saem mool': '정샘물뷰티', jungsaemmool: '정샘물뷰티',
  lagom: '스킨메드인터내셔널',
  lador: '제이피프로페셔널', "la'dor": '제이피프로페셔널',
  sidmool: '시드물',
  'cell fusion c': 'CMS랩',
  'dr.g': '고운세상코스메틱스', 'dr g': '고운세상코스메틱스',
  'the plant base': '플랜트베이스',
  jayjun: '제이준코스메틱',
  'j.one': '제이원코스메틱', jone: '제이원코스메틱',
  miguhara: '겟뷰티',
  'medi-peel': '스킨아이디어', medipeel: '스킨아이디어',
  'real barrier': '네오팜',
  scinic: '싸이닉',
  tocobo: '픽톤',
  esfolio: '에스폴리오',
  'so natural': '쏘내추럴',
  'mary&may': '에이드코리아컴퍼니', 'mary and may': '에이드코리아컴퍼니',
  'axis-y': '아시아마스터트레이드', axisy: '아시아마스터트레이드',
  'skin&lab': '랩앤컴퍼니', skinlab: '랩앤컴퍼니',
  rovectin: '알엘에이피',
  nacific: '어빌코리아',
  wellage: '휴젤',
  farmstay: '명인코스메틱스',
  brtc: '아미코스메틱',
  enough: '케이엠컴퍼니',
  beplain: '모먼츠컴퍼니',
  ariul: '뷰티팩토리',
  'about me': '삼양사',
  eqqualberry: '부스터스',
  'dr.melaxin': '브랜드501',
  erborian: '로시땅그룹',
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
