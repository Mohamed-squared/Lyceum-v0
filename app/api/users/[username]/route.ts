// File: app/api/users/[username]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: Request, context: { params: { username: string } }) {
  try {
    const { username } = context.params;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, bio, academic_profile, badges, social_links, avatar_url, banner_url')
      .eq('username', username)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 }); // Assuming 404 if not found

    return NextResponse.json({ profile: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
