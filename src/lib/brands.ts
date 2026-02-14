/**
 * K-Beauty brand set and helper utilities.
 * Ported from ui/brand_utils.py
 */

export const KBEAUTY_BRANDS: ReadonlySet<string> = new Set([
  // Amorepacific Group (EN + KR)
  'sulwhasoo', '설화수', 'laneige', '라네즈', 'innisfree', '이니스프리',
  'etude', '에뛰드', 'mamonde', '마몽드', 'iope', '아이오페',
  'hera', '헤라', 'primera', '프리메라', 'illiyoon', '일리윤',
  'aestura', '에스트라', 'amorepacific', '아모레퍼시픽',
  // LG H&H Group (EN + KR)
  'the face shop', '더페이스샵', 'belif', '빌리프', 'cnp', '씨앤피',
  'su:m37', '숨37', 'o hui', '오휘',
  'the history of whoo', '후',
  // Major K-Beauty (indie / DTC)
  'cosrx', '코스알엑스', 'anua', '아누아', 'torriden', '토리든',
  'beauty of joseon', '조선미녀', 'isntree', '이즈앤트리',
  'medicube', '메디큐브', 'numbuzin', '넘버즈인',
  'skin1004', 'round lab', '라운드랩', 'missha', '미샤',
  'some by mi', '썸바이미', 'klairs', '클레어스', 'purito', '퓨리토',
  'heimish', '해미쉬', 'goodal', '구달',
  'neogen', '네오젠', 'benton', '벤톤', 'mizon', '미존',
  'acwell', '아크웰', 'manyo', '마녀공장', 'ma:nyo',
  'haruharu wonder', '하루하루원더', 'thank you farmer', '땡큐파머',
  // Clio group (EN + KR)
  'clio', '클리오', 'peripera', '페리페라',
  // Popular K-Beauty (EN + KR)
  'biodance', '바이오던스', 'tirtir', '티르티르', "d'alba", '달바', 'dalba',
  'celimax', '셀리맥스', 'abib', '아비브',
  'vt', 'vt cosmetics', '브이티', '3ce', '쓰리씨이', 'vdl',
  'rom&nd', '롬앤', 'romand',
  'aprilskin', '에이프릴스킨', 'ariul', '아리얼', 'mixsoon', '믹순',
  'dr.althea', 'dr althea', '닥터알떼아',
  'elizavecca', 'dr.melaxin', 'mediheal', '메디힐',
  'dr.jart', 'dr jart', '닥터자르트',
  'holika holika', '홀리카홀리카', 'skinfood', '스킨푸드',
  'too cool for school', '투쿨포스쿨', 'tonymoly', '토니모리',
  'banila co', '바닐라코', 'laka', '라카', 'wakemake', '웨이크메이크',
  'espoir', '에스쁘아', "age 20's", 'age20s', '에이지투웬티스',
  'dear klairs', 'by wishtrend', 'wishtrend', '위시트렌드', 'beplain', '비플레인',
  'seoulceuticals', 'the saem', '더샘', 'saem',
  'dermaction', 'dermaction plus',
  'nature republic', '네이처리퍼블릭', "a'pieu", '어퓨', 'apieu',
  'its skin', "it's skin", '잇츠스킨',
  'papa recipe', '파파레시피', 'pyunkang yul', '편강율', 'snp',
  'dewytree', '듀이트리', 'holika', 'hanyul', '한율', 'eqqualberry',
  'seranova', 'sacheu', 'goddvenus',
  // OliveYoung locals (EN + KR)
  'milktouch', '밀크터치', 'dasique', '데이지크',
  'jung saem mool', '정샘물', 'jungsaemmool',
  'olive young', 'bring green', '브링그린',
  'roundaround', 'round a round', '라운드어라운드',
  'about me', 'lagom', '라곰', 'lador', "la'dor", '라도르', 'sidmool', '시드물',
  'cosmedics', 'cell fusion c', '셀퓨전씨', 'cnp laboratory',
  'dr.g', 'dr g', '닥터지', 'the plant base', '더플랜트베이스',
  'jayjun', '제이준', 'j.one', 'jone',
  'miguhara', '미구하라', 'medi-peel', 'medipeel', '메디필',
  'real barrier', '리얼배리어',
  'scinic', '싸이닉', 'tocobo', '토코보', 'esfolio', '에스폴리오',
  'so natural', '쏘내추럴',
  'mary&may', 'mary and may', '메리앤메이', 'axis-y', 'axisy',
  'skin&lab', 'skinlab', 'iunik', '아이유닉', 'rovectin', '로벡틴',
  'nacific', '나시픽', 'a.h.c', 'ahc', '에이에이치씨',
  'wellage', '웰라쥬', 'farmstay', '팜스테이', 'brtc', 'enough',
  'tony moly', 'aritaum', '아리따움',
  // Haircare K-Beauty
  'ryo', '려', 'mise en scene', '미장센', 'daeng gi meo ri', '댕기머리',
  'cp-1', 'amos', '아모스', 'moremo', '모레모', 'aromatica', '아로마티카',
  'labonheur', '라보에이치', 'kundalini', '쿤달',
])

const BRAND_TO_COMPANY: Readonly<Record<string, string>> = {
  // ── Amorepacific Group (EN + KR) ──
  sulwhasoo: '아모레퍼시픽', '설화수': '아모레퍼시픽',
  laneige: '아모레퍼시픽', '라네즈': '아모레퍼시픽',
  innisfree: '아모레퍼시픽', '이니스프리': '아모레퍼시픽',
  etude: '아모레퍼시픽', '에뛰드': '아모레퍼시픽',
  mamonde: '아모레퍼시픽', '마몽드': '아모레퍼시픽',
  iope: '아모레퍼시픽', '아이오페': '아모레퍼시픽',
  hera: '아모레퍼시픽', '헤라': '아모레퍼시픽',
  primera: '아모레퍼시픽', '프리메라': '아모레퍼시픽',
  illiyoon: '아모레퍼시픽', '일리윤': '아모레퍼시픽',
  aestura: '아모레퍼시픽', '에스트라': '아모레퍼시픽',
  amorepacific: '아모레퍼시픽', '아모레퍼시픽': '아모레퍼시픽',
  espoir: '아모레퍼시픽', '에스쁘아': '아모레퍼시픽',
  hanyul: '아모레퍼시픽', '한율': '아모레퍼시픽',
  aritaum: '아모레퍼시픽', '아리따움': '아모레퍼시픽',

  // ── LG H&H Group (EN + KR) ──
  'the face shop': 'LG생활건강', '더페이스샵': 'LG생활건강',
  belif: 'LG생활건강', '빌리프': 'LG생활건강',
  cnp: 'LG생활건강', '씨앤피': 'LG생활건강',
  'cnp laboratory': 'LG생활건강', 'su:m37': 'LG생활건강', '숨37': 'LG생활건강',
  'o hui': 'LG생활건강', '오휘': 'LG생활건강',
  'the history of whoo': 'LG생활건강', '후': 'LG생활건강',
  vdl: 'LG생활건강',

  // ── Clio Group (EN + KR) ──
  clio: '클리오', '클리오': '클리오',
  peripera: '클리오', '페리페라': '클리오',
  goodal: '클리오', '구달': '클리오',

  // ── APR Corporation (EN + KR) ──
  medicube: '에이피알', '메디큐브': '에이피알',
  aprilskin: '에이피알', '에이프릴스킨': '에이피알',

  // ── Goodai Global (EN + KR) ──
  'beauty of joseon': '굿다이글로벌', '조선미녀': '굿다이글로벌',
  tirtir: '굿다이글로벌', '티르티르': '굿다이글로벌',
  skin1004: '굿다이글로벌', laka: '굿다이글로벌', '라카': '굿다이글로벌',
  iunik: '굿다이글로벌', '아이유닉': '굿다이글로벌',

  // ── Able C&C (EN + KR) ──
  missha: '에이블씨엔씨', '미샤': '에이블씨엔씨',
  "a'pieu": '에이블씨엔씨', '어퓨': '에이블씨엔씨', apieu: '에이블씨엔씨',

  // ── CJ Olive Young Group ──
  'olive young': 'CJ올리브영', 'bring green': 'CJ올리브영', '브링그린': 'CJ올리브영',
  wakemake: 'CJ올리브영', '웨이크메이크': 'CJ올리브영',
  roundaround: 'CJ올리브영', 'round a round': 'CJ올리브영',

  // ── BENOW (비나우) ──
  numbuzin: '비나우', '넘버즈인': '비나우',

  // ── Wishcompany (위시컴퍼니) ──
  klairs: '위시컴퍼니', '클레어스': '위시컴퍼니', 'dear klairs': '위시컴퍼니',
  'by wishtrend': '위시컴퍼니', wishtrend: '위시컴퍼니', '위시트렌드': '위시컴퍼니',

  // ── Other multi-brand groups ──
  'rom&nd': '아이패밀리에스씨', '롬앤': '아이패밀리에스씨', romand: '아이패밀리에스씨',
  '3ce': '난다', '쓰리씨이': '난다',
  'dr.jart': '해브앤비', 'dr jart': '해브앤비', '닥터자르트': '해브앤비',
  'a.h.c': '카버코리아', ahc: '카버코리아', '에이에이치씨': '카버코리아',

  // ── Indie brands (EN + KR → 법인명) ──
  cosrx: '코스알엑스', '코스알엑스': '코스알엑스',
  anua: '더파운더즈', '아누아': '더파운더즈',
  torriden: '토리든', '토리든': '토리든',
  isntree: '이즈앤트리', '이즈앤트리': '이즈앤트리',
  'round lab': '서린컴퍼니', '라운드랩': '서린컴퍼니',
  'some by mi': '페렌벨', '썸바이미': '페렌벨',
  neogen: '아우딘퓨쳐스', '네오젠': '아우딘퓨쳐스',
  benton: '벤튼', '벤톤': '벤튼',
  mizon: 'PFD', '미존': 'PFD',
  acwell: '비앤에이치코스메틱', '아크웰': '비앤에이치코스메틱',
  manyo: '마녀공장', 'ma:nyo': '마녀공장', '마녀공장': '마녀공장',
  purito: '하이네이처', '퓨리토': '하이네이처',
  heimish: '원앤드', '해미쉬': '원앤드',
  'haruharu wonder': 'DFS컴퍼니', '하루하루원더': 'DFS컴퍼니',
  'thank you farmer': '땡큐파머',
  biodance: '뷰티셀렉션', '바이오던스': '뷰티셀렉션',
  "d'alba": '달바글로벌', '달바': '달바글로벌', dalba: '달바글로벌',
  celimax: '앱솔브랩', '셀리맥스': '앱솔브랩',
  abib: '포컴퍼니', '아비브': '포컴퍼니',
  vt: '브이티', 'vt cosmetics': '브이티', '브이티': '브이티',
  mixsoon: '파켓', '믹순': '파켓',
  'dr.althea': '닥터알떼아', 'dr althea': '닥터알떼아', '닥터알떼아': '닥터알떼아',
  elizavecca: '미즈트레이드',
  mediheal: '엘앤피코스메틱', '메디힐': '엘앤피코스메틱',
  'holika holika': '엔코스', '홀리카홀리카': '엔코스', holika: '엔코스',
  skinfood: '아이피어스', '스킨푸드': '아이피어스',
  'too cool for school': '투쿨포스쿨',
  tonymoly: '토니모리', 'tony moly': '토니모리', '토니모리': '토니모리',
  'banila co': '에프앤코', '바닐라코': '에프앤코',
  "age 20's": '애경산업', age20s: '애경산업',
  'the saem': '더샘', '더샘': '더샘', saem: '더샘',
  'nature republic': '네이처리퍼블릭', '네이처리퍼블릭': '네이처리퍼블릭',
  "it's skin": '잇츠한불', 'its skin': '잇츠한불', '잇츠스킨': '잇츠한불',
  'papa recipe': '코스토리', '파파레시피': '코스토리',
  'pyunkang yul': '편강율', '편강율': '편강율',
  snp: '에스디생명공학',
  dewytree: '듀이트리', '듀이트리': '듀이트리',
  dasique: '바이에콤', '데이지크': '바이에콤',
  milktouch: '올리브인터내셔널', '밀크터치': '올리브인터내셔널',
  'jung saem mool': '정샘물뷰티', jungsaemmool: '정샘물뷰티', '정샘물': '정샘물뷰티',
  lagom: '스킨메드인터내셔널', '라곰': '스킨메드인터내셔널',
  lador: '제이피프로페셔널', "la'dor": '제이피프로페셔널', '라도르': '제이피프로페셔널',
  sidmool: '시드물', '시드물': '시드물',
  'cell fusion c': 'CMS랩', '셀퓨전씨': 'CMS랩',
  'dr.g': '고운세상코스메틱스', 'dr g': '고운세상코스메틱스', '닥터지': '고운세상코스메틱스',
  'the plant base': '플랜트베이스',
  jayjun: '제이준코스메틱', '제이준': '제이준코스메틱',
  'j.one': '제이원코스메틱', jone: '제이원코스메틱',
  miguhara: '겟뷰티', '미구하라': '겟뷰티',
  'medi-peel': '스킨아이디어', medipeel: '스킨아이디어', '메디필': '스킨아이디어',
  'real barrier': '네오팜', '리얼배리어': '네오팜',
  scinic: '싸이닉', '싸이닉': '싸이닉',
  tocobo: '픽톤', '토코보': '픽톤',
  esfolio: '에스폴리오',
  'so natural': '쏘내추럴',
  'mary&may': '에이드코리아컴퍼니', 'mary and may': '에이드코리아컴퍼니', '메리앤메이': '에이드코리아컴퍼니',
  'axis-y': '아시아마스터트레이드', axisy: '아시아마스터트레이드',
  'skin&lab': '랩앤컴퍼니', skinlab: '랩앤컴퍼니',
  rovectin: '알엘에이피', '로벡틴': '알엘에이피',
  nacific: '어빌코리아', '나시픽': '어빌코리아',
  wellage: '휴젤', '웰라쥬': '휴젤',
  farmstay: '명인코스메틱스', '팜스테이': '명인코스메틱스',
  brtc: '아미코스메틱',
  enough: '케이엠컴퍼니',
  beplain: '모먼츠컴퍼니', '비플레인': '모먼츠컴퍼니',
  ariul: '뷰티팩토리', '아리얼': '뷰티팩토리',
  'about me': '삼양사',
  eqqualberry: '부스터스',
  'dr.melaxin': '브랜드501',
  erborian: '로시땅그룹',

  // ── Haircare K-Beauty ──
  ryo: '아모레퍼시픽', '려': '아모레퍼시픽',
  'mise en scene': '아모레퍼시픽', '미장센': '아모레퍼시픽',
  amos: '아모레퍼시픽', '아모스': '아모레퍼시픽',
  moremo: '모레모', '모레모': '모레모',
  aromatica: '아로마티카', '아로마티카': '아로마티카',
  'daeng gi meo ri': '댕기머리', '댕기머리': '댕기머리',
  kundalini: '쿤달', '쿤달': '쿤달',
}

export function isKbeautyBrand(brand: string): boolean {
  if (!brand) return false
  const lower = brand.toLowerCase().trim()
  if (KBEAUTY_BRANDS.has(lower)) return true
  // Check company mapping (covers both EN and KR brand names)
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
