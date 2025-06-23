// File: app/api/courses/[courseId]/route.ts - Get course detail + chapters + resources
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: Request, context: { params: { courseId: string } }) {
  try {
    const { courseId } = context.params;

    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    // Get course details
    const courseQuery = supabaseAdmin.from('courses').select('*').eq('id', courseId).single();

    // Get chapters for the course
    const chaptersQuery = supabaseAdmin
      .from('course_chapters')
      .select('id, chapter_number, title') // Assuming these are the fields you want
      .eq('course_id', courseId)
      .order('chapter_number');

    // Get resources for the course
    // This might need to be more specific if resources are linked to chapters vs directly to course
    const resourcesQuery = supabaseAdmin
      .from('course_resources')
      .select('*') // Select all fields or specify as needed
      .eq('course_id', courseId); // Assuming resources have a direct course_id link

    const [courseRes, chaptersRes, resourcesRes] = await Promise.all([courseQuery, chaptersQuery, resourcesQuery]);

    if (courseRes.error) return NextResponse.json({ error: courseRes.error.message, type: 'course' }, { status: 500 });
    if (chaptersRes.error) return NextResponse.json({ error: chaptersRes.error.message, type: 'chapters' }, { status: 500 });
    if (resourcesRes.error) return NextResponse.json({ error: resourcesRes.error.message, type: 'resources' }, { status: 500 });

    return NextResponse.json({
      course: courseRes.data,
      chapters: chaptersRes.data || [],
      resources: resourcesRes.data || [],
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
