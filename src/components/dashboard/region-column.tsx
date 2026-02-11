import { REGIONS, REGION_FLAGS } from '@/lib/constants'
import { PlatformToggle } from './platform-toggle'

interface RegionColumnProps {
  readonly regionCode: string
  readonly category: string
  readonly locale: string
}

export function RegionColumn({ regionCode, category, locale }: RegionColumnProps) {
  const rcfg = REGIONS[regionCode]
  if (!rcfg) return null

  const name = locale === 'ko' ? rcfg.nameKr : rcfg.name
  const flag = REGION_FLAGS[regionCode] ?? regionCode

  return (
    <div>
      <div className={`region-hd ${regionCode.toLowerCase()}`}>
        <span className="rflag-emoji">{flag}</span>
        <span>{name}</span>
      </div>

      {/* Default platform - expanded */}
      <PlatformToggle
        platformKey={rcfg.defaultPlatform}
        region={regionCode}
        category={category}
        expanded={true}
      />

      {/* Extra platforms - collapsed */}
      {rcfg.extraPlatforms.map((platKey) => (
        <PlatformToggle
          key={platKey}
          platformKey={platKey}
          region={regionCode}
          category={category}
          expanded={false}
        />
      ))}
    </div>
  )
}
