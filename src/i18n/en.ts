import type { Translations } from './types'

export const en: Translations = {
  nav: {
    ranking: 'Current Ranking',
    topRankers: 'Top Rankers',
    risers: 'Risers',
    newEntrants: 'New Entrants',
    crossborder: 'Cross-border Winners',
  },
  header: {
    title: 'K-Beauty Commerce Radar',
    platforms: 'platforms',
    records: 'records',
  },
  ranking: {
    sectionTitle: 'Current Ranking',
    sectionSub: 'Product rankings by category, country, and platform',
    noData: 'No data for this category',
    products: 'products',
  },
  topRankers: {
    sectionTitle: 'Top Rankers',
    sectionSub: 'Brands consistently in top rankings across snapshots',
    weeksInTop: 'weeks in Top 10',
    bestRank: 'Best rank',
  },
  risers: {
    sectionTitle: 'Risers',
    sectionSub: 'Biggest week-over-week rank improvements',
    streak: 'weeks rising',
  },
  newEntrants: {
    sectionTitle: 'New Entrants',
    sectionSub: 'First-time entries in the latest week',
    firstEntry: 'First entry this week',
  },
  crossborder: {
    sectionTitle: 'Cross-border Winners',
    sectionSub: 'Brands present in 2+ regions simultaneously',
    regions: 'regions',
  },
  brand: {
    backToDashboard: 'Back to Dashboard',
    history: 'Weekly History',
    explanation: 'Analysis',
    scores: 'Scores',
    leader: 'Leader',
    growth: 'Growth',
    newLeader: 'New Leader',
    crossBorder: 'Cross-border',
  },
  common: {
    search: 'Search brands...',
    comingSoon: 'Coming Soon',
    kbeauty: 'K-Beauty',
  },
  locale: {
    toggle: 'KR',
  },
} as const
