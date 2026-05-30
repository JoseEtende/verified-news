import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: wire to Supabase + Edge Function in TASK 6
  return NextResponse.json({ triggered: true }, { status: 200 });
}