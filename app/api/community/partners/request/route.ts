// File: app/api/community/partners/request/route.ts (Server Action)
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const fromUserId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!fromUserId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { to_user_id } = json;
    if (!to_user_id) return NextResponse.json({ error: 'Missing to_user_id' }, { status: 400 });
    if (fromUserId === to_user_id) return NextResponse.json({ error: 'Cannot send friend request to yourself' }, { status: 400 });


    // Check if request already exists (either way)
    const { data: existing, error: existsErr } = await supabaseAdmin
      .from('friend_requests')
      .select('*')
      .or(`and(from_user_id.eq.${fromUserId},to_user_id.eq.${to_user_id}),and(from_user_id.eq.${to_user_id},to_user_id.eq.${fromUserId})`) // MODIFIED: Check both directions
      .maybeSingle(); // MODIFIED: Use maybeSingle to handle no existing request

    if (existsErr && existsErr.code !== 'PGRST116') { // PGRST116 is "Query returned no rows"
        return NextResponse.json({ error: existsErr.message }, { status: 500 });
    }
    if (existing) return NextResponse.json({ error: 'Friend request already exists or is pending.' }, { status: 409 });


    // Insert new friend request
    const { error } = await supabaseAdmin.from('friend_requests').insert({ from_user_id: fromUserId, to_user_id, status: 'pending' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
