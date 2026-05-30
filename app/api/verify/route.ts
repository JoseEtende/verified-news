import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: wire to Supabase + Edge Function in TASK 6
  return NextResponse.json({ claimId: "stub-123" }, { status: 202 });
}