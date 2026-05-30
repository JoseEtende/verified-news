import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorised', { status: 401 })
  }

  const db = createServiceClient()

  const { data: monitors } = await db
    .from('monitors')
    .select('*, claims(id, input_content, track_context)')
    .eq('is_active', true)
    .lte('next_check_at', new Date().toISOString())
    .limit(10)

  if (!monitors || monitors.length === 0) {
    return NextResponse.json({ triggered: 0 })
  }

  const sidecarUrl = process.env.PYTHON_SIDECAR_URL
  let triggered = 0

  for (const monitor of monitors) {
    const claim = monitor.claims as any
    if (!claim) continue

    const { data: newClaim } = await db
      .from('claims')
      .insert({
        input_content: claim.input_content,
        input_type: 'text',
        track_context: claim.track_context,
        status: 'pending',
        agent_progress: 'Monitor re-check initiated...',
      })
      .select('id')
      .single()

    if (newClaim && sidecarUrl) {
      fetch(`${sidecarUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sidecar-secret': process.env.PYTHON_SIDECAR_SECRET ?? '',
        },
        body: JSON.stringify({
          claim_id: newClaim.id,
          claim_text: claim.input_content,
          track_context: claim.track_context,
        }),
      }).catch(console.error)
      triggered++
    }

    const freq = monitor.check_frequency
    const next = new Date()
    if (freq === 'hourly') next.setHours(next.getHours() + 1)
    else if (freq === 'daily') next.setDate(next.getDate() + 1)
    else next.setDate(next.getDate() + 7)

    await db.from('monitors').update({
      last_checked_at: new Date().toISOString(),
      next_check_at: next.toISOString(),
    }).eq('id', monitor.id)
  }

  return NextResponse.json({ triggered })
}
