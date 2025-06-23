// File: app/api/community/leaderboard/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles') // Assuming 'profiles' table has 'credits'
      .select('id, display_name, avatar_url, credits')
      .order('credits', { ascending: false })
      .limit(20);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ leaderboard: data || [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
