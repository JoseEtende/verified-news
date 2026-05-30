'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGitHub = () =>
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    })

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signInWithGitHub, signOut }
}
