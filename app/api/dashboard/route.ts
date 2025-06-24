// File: app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Fetch my courses (enrolled)
    const { data: myCourses, error: coursesErr } = await supabaseAdmin
      .from('enrollments')
      .select(`course_id, courses (id, title, status, privacy)`) // Ensure 'courses' is the correct join alias/table name
      .eq('user_id', userId);

    if (coursesErr) return NextResponse.json({ error: coursesErr.message, type: 'myCourses' }, { status: 500 });

    // Fetch partner activity (recent challenges, partner logs, etc.)
    // This assumes an RPC 'get_study_partners' as in community/partners route
    const { data: partners, error: partnersErr } = await supabaseAdmin.rpc('get_study_partners', { user_id_input: userId });

    if (partnersErr) return NextResponse.json({ error: partnersErr.message, type: 'partners' }, { status: 500 });

    // Fetch user stats (credits, badges, etc.)
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('credits, badges, display_name, avatar_url, role') // Added role
      .eq('id', userId)
      .single();

    if (profileErr) return NextResponse.json({ error: profileErr.message, type: 'profile' }, { status: 500 });

    return NextResponse.json({
      myCourses: myCourses?.map((e: any) => e.courses) || [],
      partners: partners || [],
      user: profile ? { ...profile, name: profile.display_name } : null, // Changed key and mapped display_name
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
