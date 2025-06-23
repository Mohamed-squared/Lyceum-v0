// File: app/api/courses/[courseId]/enroll/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { enqueueJob } from '@/lib/jobQueue'; // Added import

export async function POST(req: Request, context: { params: { courseId: string } }) {
  try {
    const courseId = context.params.courseId;
    const json = await req.json();
    const { user_id, mode, pace } = json;

    if (!user_id || !mode) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 }); // Added check for courseId


    const { error } = await supabaseAdmin.from('enrollments').insert({
      user_id,
      course_id: courseId,
      mode,
      pace: pace || {},
      progress: {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
