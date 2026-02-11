import { PLATFORMS } from '@/lib/constants'
import type { RankingItem } from '@/lib/types'
import { getPlatformRanking } from '@/lib/queries'
import { RankRow } from './rank-row'

interface PlatformToggleProps {
  readonly platformKey: string
  readonly region: string
  readonly category: string
  readonly expanded?: boolean
  readonly limit?: number
}

export async function PlatformToggle({
  platformKey,
  region,
  category,
  expanded = false,
  limit = 15,
}: PlatformToggleProps) {
  const pd = PLATFORMS[platformKey]
  if (!pd) return null

  const items: RankingItem[] = await getPlatformRanking(platformKey, region, category, limit)

  return (
    <details className="plat-toggle" open={expanded || undefined}>
      <summary className="plat-toggle-hd">
        <div className={`plat-icon ${pd.iconCls}`}>{pd.icon}</div>
        <span className="plat-section-name">{pd.name}</span>
        <span className="plat-section-count">{items.length} products</span>
      </summary>
      <div className="plat-toggle-body">
        {items.length === 0 ? (
          <div className="empty-box">No data for this category</div>
        ) : (
          items.map((item) => (
            <RankRow key={`${item.rank}-${item.brand}`} item={item} />
          ))
        )}
      </div>
    </details>
  )
}
