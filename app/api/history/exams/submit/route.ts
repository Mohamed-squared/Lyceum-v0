// File: app/api/history/exams/submit/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { enqueueJob } from '@/lib/jobQueue'; // Added import

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { user_id, course_id, exam_data } = json;

    if (!user_id || !course_id || !exam_data) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    const score = exam_data.score || null; // MODIFIED: get score from exam_data

    const { error, data: newExam } = await supabaseAdmin.from('exam_history').insert({ // MODIFIED: get newExam data
      user_id,
      course_id,
      exam_data,
      score, // MODIFIED: save score
      created_at: new Date(),
    }).select().single(); // MODIFIED: select single

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Enqueue AI feedback generation job asynchronously
    await enqueueJob('generate-ai-exam-feedback', { exam_id: newExam.id, exam_data: newExam.exam_data, user_id, course_id }); // MODIFIED: pass correct payload

    return NextResponse.json({ success: true, examId: newExam.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
