// File: app/api/admin/users/route.ts  - list users with pagination & search
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
    const search = url.searchParams.get('search') || undefined;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let query = supabaseAdmin.from('profiles').select('id, display_name, username, email, role, created_at');

    if (search) {
      // Using textSearch for potentially better performance on larger datasets if you have FTS enabled.
      // Otherwise, ilike is fine. For simplicity, sticking to ilike.
      query = query.or(`display_name.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1).order('created_at', { ascending: false }); // MODIFIED: Added order and count

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ users: data || [], count: count ?? 0 }); // MODIFIED: return count
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
