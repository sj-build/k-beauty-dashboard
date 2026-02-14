import { Suspense } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { NavPills } from '@/components/layout/nav-pills'
import { CategoryPills } from '@/components/layout/category-pills'
import { RegionColumn } from '@/components/dashboard/region-column'
import { CrossborderList } from '@/components/signal/crossborder-list'
import { SocialSignalList } from '@/components/signal/social-signal-list'
import { HiddenGemsList } from '@/components/signal/hidden-gems-list'
import { RisingStarsList } from '@/components/signal/rising-stars-list'
import { CATEGORY_KEYS } from '@/lib/constants'

const VALID_CATEGORY_KEYS = new Set(Object.values(CATEGORY_KEYS))

interface PageProps {
  readonly searchParams: Promise<{ tab?: string; cat?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tab = params.tab ?? 'ranking'
  const catParam = params.cat ?? 'skincare'
  const category = VALID_CATEGORY_KEYS.has(catParam)
    ? catParam
    : CATEGORY_KEYS[catParam.charAt(0).toUpperCase() + catParam.slice(1)] ?? catParam

  return (
    <main className="max-w-7xl mx-auto px-4 pb-12">
      {/* Hero + Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="hero-header">
          <div className="hero-title">
            K-Beauty <span className="accent">Trend Radar</span>
          </div>
        </div>
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>
      </div>

      {/* Navigation */}
      <Suspense fallback={null}>
        <NavPills />
      </Suspense>

      {/* Category selector */}
      <Suspense fallback={null}>
        <CategoryPills />
      </Suspense>

      {/* Tab content */}
      {tab === 'ranking' && <RankingTab category={category} />}
      {tab === 'top-rankers' && <TopRankersTab category={category} />}
      {tab === 'risers' && <RisersTab category={category} />}
      {tab === 'new-entrants' && <NewEntrantsTab category={category} />}
      {tab === 'crossborder' && <CrossborderTab category={category} />}
      {tab === 'social-signal' && <SocialSignalTab category={category} />}
      {tab === 'rising-stars' && <RisingStarsTab category={category} />}
      {tab === 'hidden-gems' && <HiddenGemsTab category={category} />}
    </main>
  )
}

function RankingTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Current Ranking</div>
      <div className="section-sub">Product rankings by category, country, and platform</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['KR', 'US', 'AE'] as const).map((region) => (
          <RegionColumn
            key={region}
            regionCode={region}
            category={category}
            locale="en"
          />
        ))}
      </div>
    </>
  )
}

function TopRankersTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Top Rankers</div>
      <div className="section-sub">Brands consistently in top rankings across snapshots</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['KR', 'US', 'AE'] as const).map((region) => (
          <RegionColumn
            key={region}
            regionCode={region}
            category={category}
            locale="en"
            mode="top-rankers"
          />
        ))}
      </div>
    </>
  )
}

function RisersTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Fast Movers</div>
      <div className="section-sub">Biggest week-over-week rank improvements</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['KR', 'US', 'AE'] as const).map((region) => (
          <RegionColumn
            key={region}
            regionCode={region}
            category={category}
            locale="en"
            mode="climbers"
          />
        ))}
      </div>
    </>
  )
}

function NewEntrantsTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">New Entrants</div>
      <div className="section-sub">First-time entries in the latest week</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['KR', 'US', 'AE'] as const).map((region) => (
          <RegionColumn
            key={region}
            regionCode={region}
            category={category}
            locale="en"
            mode="new-entrants"
          />
        ))}
      </div>
    </>
  )
}

function CrossborderTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Cross-border Winners</div>
      <div className="section-sub">Brands present in 2+ regions simultaneously</div>
      <CrossborderList category={category} />
    </>
  )
}

function SocialSignalTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Social Signal</div>
      <div className="section-sub">AI-predicted brand trends from TikTok, YouTube, and Instagram signals</div>
      <SocialSignalList category={category} />
    </>
  )
}

function RisingStarsTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Rising Stars</div>
      <div className="section-sub">Organic growth brands — high social signals with low ad spend</div>
      <RisingStarsList category={category} />
    </>
  )
}

function HiddenGemsTab({ category }: { readonly category: string }) {
  return (
    <>
      <div className="section-hd">Hidden Gems</div>
      <div className="section-sub">Emerging indie brands with organic growth — excludes large conglomerate brands</div>
      <HiddenGemsList category={category} />
    </>
  )
}
