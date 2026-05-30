'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Claim, Verification } from '@/lib/types'

export function useVerification(claimId: string | null) {
  const [claim, setClaim] = useState<Claim | null>(null)
  const [verification, setVerification] = useState<Verification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!claimId) { setLoading(false); return }

    async function fetchInitial() {
      const { data: claimData, error: claimErr } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single()

      if (claimErr) { setError(claimErr.message); setLoading(false); return }
      setClaim(claimData)
      setLoading(false)

      if (claimData.status === 'completed') {
        const { data: verData } = await supabase
          .from('verifications')
          .select('*, sources(*)')
          .eq('claim_id', claimId)
          .single()
        if (verData) setVerification(verData)
      }
    }

    fetchInitial()

    const channel = supabase
      .channel(`claim-${claimId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'claims', filter: `id=eq.${claimId}` },
        async (payload) => {
          setClaim(payload.new as Claim)
          if (payload.new.status === 'completed') {
            const { data: verData } = await supabase
              .from('verifications')
              .select('*, sources(*)')
              .eq('claim_id', claimId)
              .single()
            if (verData) setVerification(verData)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [claimId])

  return { claim, verification, loading, error }
}

export function useFeed(trackContext?: string, badge?: string) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      let query = supabase
        .from('claims')
        .select('*, verifications(badge, confidence_score, verdict_summary, primary_sources_count)')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20)

      if (trackContext) query = query.eq('track_context', trackContext)

      const { data } = await query
      if (data) setClaims(data)
      setLoading(false)
    }
    fetchFeed()
  }, [trackContext, badge])

  return { claims, loading }
}
