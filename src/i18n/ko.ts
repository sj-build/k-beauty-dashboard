import type { Translations } from './types'

export const ko: Translations = {
  nav: {
    ranking: '현재 랭킹',
    topRankers: '부동의 탑랭커',
    risers: '급상승',
    newEntrants: '신규 진입자',
    crossborder: '글로벌 위너',
  },
  header: {
    title: 'K-Beauty Commerce Radar',
    platforms: '개 플랫폼',
    records: '개 기록',
  },
  ranking: {
    sectionTitle: '현재 랭킹',
    sectionSub: '카테고리, 국가, 플랫폼별 제품 랭킹',
    noData: '해당 카테고리 데이터 없음',
    products: '개 제품',
  },
  topRankers: {
    sectionTitle: '부동의 탑랭커',
    sectionSub: '여러 스냅샷에서 꾸준히 상위권을 유지하는 브랜드',
    weeksInTop: '주 연속 Top 10',
    bestRank: '최고 순위',
  },
  risers: {
    sectionTitle: '급상승',
    sectionSub: '주간 순위 상승폭이 가장 큰 브랜드',
    streak: '주 연속 상승',
  },
  newEntrants: {
    sectionTitle: '신규 진입자',
    sectionSub: '이번 주 처음 진입한 브랜드',
    firstEntry: '이번 주 첫 진입',
  },
  crossborder: {
    sectionTitle: '글로벌 위너',
    sectionSub: '2개 이상 지역에 동시 진입한 브랜드',
    regions: '개 지역',
  },
  brand: {
    backToDashboard: '대시보드로 돌아가기',
    history: '주간 히스토리',
    explanation: '분석',
    scores: '점수',
    leader: '리더',
    growth: '성장',
    newLeader: '뉴리더',
    crossBorder: '크로스보더',
  },
  common: {
    search: '브랜드 검색...',
    comingSoon: 'Coming Soon',
    kbeauty: 'K-Beauty',
  },
  locale: {
    toggle: 'EN',
  },
} as const
