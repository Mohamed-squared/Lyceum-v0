// File: app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    // Fetch enrolled courses
    const { data: enrolledCoursesData, error: enrolledCoursesErr } = await supabaseAdmin
      .from('enrollments')
      .select(`course_id, courses (id, title, status, privacy, thumbnail, instructor, progress)`) // Fetch more details
      .eq('user_id', userId);

    if (enrolledCoursesErr) return NextResponse.json({ error: enrolledCoursesErr.message, type: 'enrolledCourses' }, { status: 500 });
    const enrolledCourses = enrolledCoursesData?.map((e: any) => e.courses) || [];

    // Fetch courses created by the user
    const { data: createdCoursesData, error: createdCoursesErr } = await supabaseAdmin
      .from('courses')
      .select('id, title, status, privacy, thumbnail') // Add other relevant fields like instructor, progress if needed by cards
      .eq('creator_id', userId);

    if (createdCoursesErr) return NextResponse.json({ error: createdCoursesErr.message, type: 'createdCourses' }, { status: 500 });
    const createdCourses = createdCoursesData || [];

    // Fetch user profile (already includes role, credits, display_name, avatar_url)
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('credits, badges, display_name, avatar_url, role')
      .eq('id', userId)
      .single();

    if (profileErr) return NextResponse.json({ error: profileErr.message, type: 'profile' }, { status: 500 });

    const user = profile ? {
      ...profile, // spread existing profile data (includes credits, badges, avatar_url, role)
      name: profile.display_name // map display_name to name
    } : null;

    // Placeholder data for challenges and activities
    // For activities, we might use the partners data if it's relevant, or fetch separately
    const { data: partnersData, error: partnersErr } = await supabaseAdmin.rpc('get_study_partners', { user_id_input: userId });
    if (partnersErr) console.error("Error fetching partners, returning empty for activities/partners:", partnersErr.message); // Log error but don't fail request

    const activities = partnersData || []; // Using partners data for activities for now, or could be separate fetch
    const partners = partnersData || [];   // Also populate partners from the same RPC call
    const challenges = []; // Placeholder

    return NextResponse.json({
      enrolledCourses: enrolledCourses,
      createdCourses: createdCourses,
      challenges: challenges,
      activities: activities,
      partners: partners,
      user: user,
      // stats: {} // If stats are needed as a separate object by frontend
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
