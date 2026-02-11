export type Locale = 'en' | 'ko'

export interface Translations {
  readonly nav: {
    readonly ranking: string
    readonly topRankers: string
    readonly risers: string
    readonly newEntrants: string
    readonly crossborder: string
  }
  readonly header: {
    readonly title: string
    readonly platforms: string
    readonly records: string
  }
  readonly ranking: {
    readonly sectionTitle: string
    readonly sectionSub: string
    readonly noData: string
    readonly products: string
  }
  readonly topRankers: {
    readonly sectionTitle: string
    readonly sectionSub: string
    readonly weeksInTop: string
    readonly bestRank: string
  }
  readonly risers: {
    readonly sectionTitle: string
    readonly sectionSub: string
    readonly streak: string
  }
  readonly newEntrants: {
    readonly sectionTitle: string
    readonly sectionSub: string
    readonly firstEntry: string
  }
  readonly crossborder: {
    readonly sectionTitle: string
    readonly sectionSub: string
    readonly regions: string
  }
  readonly brand: {
    readonly backToDashboard: string
    readonly history: string
    readonly explanation: string
    readonly scores: string
    readonly leader: string
    readonly growth: string
    readonly newLeader: string
    readonly crossBorder: string
  }
  readonly common: {
    readonly search: string
    readonly comingSoon: string
    readonly kbeauty: string
  }
  readonly locale: {
    readonly toggle: string
  }
}
