// File: app/api/admin/courses/route.ts - list courses with optional status filter
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

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = Number(url.searchParams.get('limit')) || 20;
    const offset = Number(url.searchParams.get('offset')) || 0;
    const search = url.searchParams.get('search'); // MODIFIED: Added search
    const sortBy = url.searchParams.get('sort_by') || 'created_at'; // MODIFIED: Added sort_by
    const sortOrder = url.searchParams.get('sort_order') === 'asc' ? true : false; // MODIFIED: Added sort_order


    let query = supabaseAdmin.from('courses').select('*, profiles(display_name)'); // MODIFIED: Join with profiles to get creator display_name

    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`); // MODIFIED: Add search for title

    const { data, error, count } = await query.order(sortBy, { ascending: sortOrder }).range(offset, offset + limit - 1); // MODIFIED: Add order and count

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ courses: data || [], count: count ?? 0 }); // MODIFIED: Return count
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
