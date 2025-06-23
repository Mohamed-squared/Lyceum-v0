// File: app/api/community/partners/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Get confirmed partners (bi-directional) using an RPC or complex query
    // This assumes an RPC 'get_study_partners' exists that takes 'user_id_input'
    const { data: partnersData, error: partnersError } = await supabaseAdmin.rpc('get_study_partners', { user_id_input: userId });
    if (partnersError) return NextResponse.json({ error: partnersError.message }, { status: 500 });

    // Get pending requests sent and received from 'friend_requests' table
    const { data: pendingSent, error: sentError } = await supabaseAdmin
      .from('friend_requests')
      .select('id, to_user_id, created_at, profiles!friend_requests_to_user_id_fkey(display_name, avatar_url)') // MODIFIED: Join with profiles
      .eq('from_user_id', userId)
      .eq('status', 'pending');

    const { data: pendingReceived, error: recvError } = await supabaseAdmin
      .from('friend_requests')
      .select('id, from_user_id, created_at, profiles!friend_requests_from_user_id_fkey(display_name, avatar_url)') // MODIFIED: Join with profiles
      .eq('to_user_id', userId)
      .eq('status', 'pending');

    if (sentError || recvError)
      return NextResponse.json({ error: sentError?.message || recvError?.message }, { status: 500 });

    return NextResponse.json({
      partners: partnersData || [],
      pendingSent: pendingSent || [],
      pendingReceived: pendingReceived || [],
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
