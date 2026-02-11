'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CATEGORY_LABELS, CATEGORY_KEYS } from '@/lib/constants'

export function CategoryPills() {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') ?? 'ranking'
  const currentCat = searchParams.get('cat') ?? 'skincare'

  return (
    <div className="cat-pills">
      {CATEGORY_LABELS.map((label) => {
        const key = CATEGORY_KEYS[label] ?? label.toLowerCase()
        return (
          <Link
            key={key}
            href={`/?tab=${currentTab}&cat=${key}`}
            className={`cat-pill ${currentCat === key ? 'active' : ''}`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
