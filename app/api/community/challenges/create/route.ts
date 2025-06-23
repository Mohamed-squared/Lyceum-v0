// File: app/api/community/challenges/create/route.ts (Server Action)
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const fromUserId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!fromUserId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { to_user_id, course_id, challenge_data } = json; // challenge_data might include type, questions, etc.
    if (!to_user_id || !course_id) return NextResponse.json({ error: 'Missing required fields (to_user_id, course_id)' }, { status: 400 });
    if (fromUserId === to_user_id) return NextResponse.json({ error: 'Cannot challenge yourself' }, { status: 400});

    const { error } = await supabaseAdmin.from('challenges').insert({ // Assuming 'challenges' table
      from_user_id: fromUserId,
      to_user_id,
      course_id,
      challenge_data, // This should be JSONB in your DB
      status: 'pending', // Default status
      created_at: new Date(),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
