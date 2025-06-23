// File: app/api/history/exams/review/[examId]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const geminiKeysFeedback = (process.env.GOOGLE_GEMINI_API_KEYS || '').split(',');
let geminiFeedbackKeyIndex = 0;
function getNextGeminiKeyFeedback() {
  const key = geminiKeysFeedback[geminiFeedbackKeyIndex];
  geminiFeedbackKeyIndex = (geminiFeedbackKeyIndex + 1) % geminiKeysFeedback.length;
  return key;
}

async function callGeminiFeedback(apiKey: string, examData: any): Promise<string> {
  const prompt = `Analyze this student's exam performance. Provide overall feedback on their strengths and weaknesses, and give detailed feedback for each problem they answered.\n\n${JSON.stringify(
    examData,
    null,
    2
  )}`;

  const res = await fetch('https://generativeai.googleapis.com/v1beta2/models/gemini1_5:generateText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: {
        text: prompt,
      },
      // Additional Gemini params here
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || data?.text || '';
}

export async function GET(req: Request, context: { params: { examId: string } }) {
  try {
    const examId = context.params.examId;
    if (!examId) return NextResponse.json({ error: 'Missing examId' }, { status: 400 });

    // Fetch exam record
    let { data: examRecord, error: fetchError } = await supabaseAdmin.from('exam_history').select().eq('id', examId).single();

    if (fetchError || !examRecord) return NextResponse.json({ error: fetchError?.message || 'Exam not found' }, { status: 404 });

    // If feedback_ai is null, generate AI feedback, update record to avoid re-processing
    // This is now handled by the job worker, so we just return the current state.
    // If feedback is still being generated, the frontend can poll or show a message.

    return NextResponse.json({ exam: examRecord });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
