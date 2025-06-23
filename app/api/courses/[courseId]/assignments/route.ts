// File: app/api/courses/[courseId]/assignments/route.ts - fetch assignments & user status
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request, context: { params: { courseId: string } }) {
  try {
    const { courseId } = context.params;
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Fetch assignments for course
    const { data: assignments, error } = await supabaseAdmin
      .from('assignments') // Assuming 'assignments' table
      .select('*')
      .eq('course_id', courseId)
      .order('due_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!assignments) return NextResponse.json({ assignments: [] }); // MODIFIED: Handle null assignments

    // Fetch user's completion status for these assignments from 'exam_history'
    const { data: userSubmissions, error: subErr } = await supabaseAdmin
      .from('exam_history') // Assuming submissions are in 'exam_history'
      .select('assignment_id, score, created_at as completed_at') // MODIFIED: alias created_at
      .eq('user_id', userId)
      .in(
        'assignment_id', // Assuming 'exam_history' has 'assignment_id'
        assignments.map((a: any) => a.id) // MODIFIED: Added type any for a
      );

    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

    // Map assignment status for user
    const statusMap = new Map<string, { score: number | null; completed_at: string }>(); // MODIFIED: score can be null
    for (const s of userSubmissions || []) {
      if (s.assignment_id) statusMap.set(s.assignment_id, { score: s.score, completed_at: s.completed_at });
    }

    // Attach status
    const assignmentsWithStatus = (assignments || []).map((a: any) => ({ // MODIFIED: Added type any for a
      ...a,
      user_status: statusMap.get(a.id) || null,
    }));

    return NextResponse.json({ assignments: assignmentsWithStatus });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
