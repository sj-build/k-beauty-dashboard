import Image from 'next/image'
import { PLATFORMS, PLATFORM_LOGOS } from '@/lib/constants'
import type { RankingItem, ConsistentRanker } from '@/lib/types'
import {
  getPlatformRanking,
  getConsistentRankers,
  getPlatformClimbers,
  getPlatformNewEntrants,
} from '@/lib/queries'
import { RankRow } from './rank-row'

type FetchMode = 'ranking' | 'top-rankers' | 'climbers' | 'new-entrants'

interface PlatformToggleProps {
  readonly platformKey: string
  readonly region: string
  readonly category: string
  readonly expanded?: boolean
  readonly limit?: number
  readonly mode?: FetchMode
}

async function fetchItems(
  mode: FetchMode,
  platformKey: string,
  region: string,
  category: string,
  limit: number,
): Promise<RankingItem[]> {
  switch (mode) {
    case 'top-rankers': {
      const rankers: ConsistentRanker[] = await getConsistentRankers(platformKey, region, category, 20, 2, limit)
      return rankers.map((r) => ({
        rank: r.rank,
        brand: r.brand,
        title: r.title,
        subcategory: r.subcategory,
        price: r.price,
        currency: r.currency,
        wow_change: 0,
        is_new: false,
      }))
    }
    case 'climbers':
      return getPlatformClimbers(platformKey, region, category, limit)
    case 'new-entrants':
      return getPlatformNewEntrants(platformKey, region, category, limit)
    default:
      return getPlatformRanking(platformKey, region, category, limit)
  }
}

function emptyMessage(mode: FetchMode): string {
  switch (mode) {
    case 'top-rankers': return 'No consistent top rankers'
    case 'climbers': return 'No risers this week'
    case 'new-entrants': return 'No new entrants this week'
    default: return 'No data for this category'
  }
}

export async function PlatformToggle({
  platformKey,
  region,
  category,
  expanded = false,
  limit = 15,
  mode = 'ranking',
}: PlatformToggleProps) {
  const pd = PLATFORMS[platformKey]
  if (!pd) return null

  const items = await fetchItems(mode, platformKey, region, category, limit)
  const logoPath = PLATFORM_LOGOS[platformKey]

  return (
    <details className="plat-toggle" open={expanded || undefined}>
      <summary className="plat-toggle-hd">
        <div className={`plat-icon ${pd.iconCls}`}>
          {logoPath ? (
            <Image src={logoPath} alt={pd.name} width={28} height={28} />
          ) : (
            pd.icon
          )}
        </div>
        <span className="plat-section-name">{pd.name}</span>
        <span className="plat-section-count">{items.length} products</span>
      </summary>
      <div className="plat-toggle-body">
        {items.length === 0 ? (
          <div className="empty-box">{emptyMessage(mode)}</div>
        ) : (
          items.map((item) => (
            <RankRow key={`${item.rank}-${item.brand}`} item={item} region={region} />
          ))
        )}
      </div>
    </details>
  )
}
