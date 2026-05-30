import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

// Server component client (honours user session)
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Service role client (Edge Function calls, bypasses RLS)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
