// File: app/api/courses/[courseId]/notes/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request, context: { params: { courseId: string } }) {
  try {
    const { courseId } = context.params;
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('course_notes') // Assuming you have a 'course_notes' table
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .order('updated_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ notes: data || [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: { courseId: string } }) {
  try {
    const { courseId } = context.params;
    const json = await req.json();
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { id, content } = json; // id is for updating an existing note
    if (!content) return NextResponse.json({ error: 'Missing note content' }, { status: 400 });

    if (id) {
      // Update existing note
      const { error } = await supabaseAdmin.from('course_notes').update({ content, updated_at: new Date() }).eq('id', id).eq('user_id', userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, id });
    } else {
      // Create new note
      const { data, error } = await supabaseAdmin.from('course_notes').insert({ user_id: userId, course_id: courseId, content }).select('id').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, id: data.id });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { courseId: string } }) { // Added context
  try {
    // const { courseId } = context.params; // courseId not used in delete logic based on provided code
    const json = await req.json();
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { id } = json; // id of the note to delete
    if (!id) return NextResponse.json({ error: 'Missing note id' }, { status: 400 });

    const { error } = await supabaseAdmin.from('course_notes').delete().eq('id', id).eq('user_id', userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
