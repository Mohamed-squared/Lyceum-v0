// File: app/api/my-courses/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Join enrollments and courses
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select(`course_id, courses (title, privacy, status, id)`)
      .eq('user_id', userId)
      // .eq('courses.privacy', 'public'); // Removed this line to show all enrolled courses, not just public ones

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ courses: data?.map((e: any) => e.courses) || [] }); // MODIFIED: Added type any for e
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
