'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/i18n/provider'
import { MENU_ITEMS, COMING_SOON_ITEMS } from '@/lib/constants'

export function NavPills() {
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  const currentTab = searchParams.get('tab') ?? 'ranking'

  return (
    <div className="flex items-center gap-[6px] flex-wrap py-2">
      <div className="nav-pills">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/?tab=${item.key}`}
            className={`nav-pill ${currentTab === item.key ? 'active' : ''}`}
          >
            {locale === 'ko' ? item.labelKr : item.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-[6px]">
        {COMING_SOON_ITEMS.map((item) => (
          <span key={item.label} className="cs-pill">
            {locale === 'ko' ? item.labelKr : item.label}
            <span className="cs-tag">Coming Soon</span>
          </span>
        ))}
      </div>
    </div>
  )
}
