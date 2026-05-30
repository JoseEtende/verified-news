import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { inputContent, inputType, trackContext } = body

    if (!inputContent || !inputType) {
      return NextResponse.json({ error: 'inputContent and inputType are required' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .insert({
        user_id: session?.user?.id ?? null,
        input_content: inputContent,
        input_type: inputType,
        track_context: trackContext ?? 'consumer',
        status: 'pending',
        agent_progress: 'Queued — agents starting...',
      })
      .select('id')
      .single()

    if (claimError) {
      console.error('DB insert error:', claimError)
      return NextResponse.json({ error: claimError.message }, { status: 500 })
    }

    const sidecarUrl = process.env.PYTHON_SIDECAR_URL
    if (sidecarUrl) {
      fetch(`${sidecarUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sidecar-secret': process.env.PYTHON_SIDECAR_SECRET ?? '',
        },
        body: JSON.stringify({
          claim_id: claim.id,
          claim_text: inputContent,
          track_context: trackContext ?? 'consumer',
        }),
      }).catch((err) => console.error('Sidecar fire-and-forget error:', err))
    } else {
      console.warn('PYTHON_SIDECAR_URL not set — verification will not run')
    }

    return NextResponse.json({ claimId: claim.id }, { status: 202 })
  } catch (err) {
    console.error('POST /api/verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
