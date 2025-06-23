// File: app/api/admin/courses/update-status/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    try {
      await verifyAdmin(userId);
    } catch (adminError) { // MODIFIED: Catch specific error
      return NextResponse.json({ error: (adminError as Error).message === 'Forbidden' ? 'Forbidden' : 'Admin verification failed' }, { status: (adminError as any).status || 403 });
    }

    const json = await req.json();
    const { courseId, status } = json;
    // Basic validation for status - extend as needed
    const validStatuses = ['draft', 'generating', 'published', 'archived', 'private']; // Example statuses
    if (!courseId || !status || !validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Missing courseId or status, or status is invalid' }, { status: 400 });
    }


    const { error } = await supabaseAdmin.from('courses').update({ status }).eq('id', courseId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
