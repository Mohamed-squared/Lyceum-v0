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

    // Fetch user profile
    const { data: profileData, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('display_name, role, credits, avatar_url, badges') // Ensure all needed fields are here
      .eq('id', userId)
      .single();

    if (profileErr) {
      console.error("Error fetching profile:", profileErr.message);
      return NextResponse.json({ error: profileErr.message, type: 'profile' }, { status: 500 });
    }

    const user = profileData ? {
      name: profileData.display_name,
      role: profileData.role,
      credits: profileData.credits,
      avatar_url: profileData.avatar_url,
      badges: profileData.badges || [] // Ensure badges is an array
    } : null;

    // Define placeholders for data that might not be ready or might fail
    const activities = [];
    const challenges = [];
    const partners = []; // Removing the RPC call for now
    const stats = {};    // Default empty object for stats

    return NextResponse.json({
      enrolledCourses: enrolledCourses,
      createdCourses: createdCourses,
      challenges: challenges,
      activities: activities,
      partners: partners,
      user: user,
      stats: stats
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
