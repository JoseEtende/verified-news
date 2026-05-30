import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const claimId = searchParams.get('claimId')

  if (!claimId) return NextResponse.json({ error: 'claimId required' }, { status: 400 })

  const db = createServiceClient()
  const { data } = await db
    .from('verifications')
    .select('*, claims(input_content, track_context), sources(*)')
    .eq('claim_id', claimId)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    claim: data.claims,
    verification: data,
    sources: data.sources,
    generatedAt: new Date().toISOString(),
  })
}
