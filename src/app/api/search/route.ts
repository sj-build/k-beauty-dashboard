import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchBrands } from '@/lib/queries'

export const maxDuration = 55

const searchSchema = z.object({
  q: z.string().min(1).max(100),
})

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const parsed = searchSchema.safeParse({ q: searchParams.get('q') })

  if (!parsed.success) {
    return NextResponse.json([], { status: 400 })
  }

  const results = await searchBrands(parsed.data.q, 10)
  return NextResponse.json(results)
}
