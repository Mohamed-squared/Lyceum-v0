// File: app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    try {
      await verifyAdmin(userId);
    } catch (adminError) { // MODIFIED: Catch specific error
      return NextResponse.json({ error: (adminError as Error).message === 'Forbidden' ? 'Forbidden' : 'Admin verification failed' }, { status: (adminError as any).status || 403 });
    }

    // Aggregate stats, examples:
    const { count: usersCount, error: usersErr } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }); // MODIFIED: Use head for count
    const { count: coursesCount, error: coursesErr } = await supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }); // MODIFIED: Use head for count
    const { count: enrollmentsCount, error: enrollErr } = await supabaseAdmin.from('enrollments').select('id', { count: 'exact', head: true }); // MODIFIED: Use head for count

    if (usersErr || coursesErr || enrollErr) {
        // Log the specific errors for debugging
        console.error({ usersErr, coursesErr, enrollErr });
        return NextResponse.json({ error: 'Failed to fetch all stats' }, { status: 500 });
    }

    return NextResponse.json({
      usersCount: usersCount ?? 0, // MODIFIED: Handle null count
      coursesCount: coursesCount ?? 0, // MODIFIED: Handle null count
      enrollmentsCount: enrollmentsCount ?? 0, // MODIFIED: Handle null count
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
