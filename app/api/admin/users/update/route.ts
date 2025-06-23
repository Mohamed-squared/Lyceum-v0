// File: app/api/admin/users/update/route.ts - update user profile/admin fields
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { getUserIdFromReq } from '@/lib/auth'; // MODIFIED: Import getUserIdFromReq

export async function POST(req: Request) {
  try {
    const performingUserId = await getUserIdFromReq(req); // MODIFIED: Use getUserIdFromReq for the admin making the request
    if (!performingUserId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    try {
      await verifyAdmin(performingUserId);
    } catch (adminError) { // MODIFIED: Catch specific error
        return NextResponse.json({ error: (adminError as Error).message === 'Forbidden' ? 'Forbidden' : 'Admin verification failed' }, { status: (adminError as any).status || 403 });
    }

    const json = await req.json();
    const { targetUserId, updates } = json; // MODIFIED: Renamed 'id' to 'targetUserId' for clarity
    if (!targetUserId || typeof updates !== 'object' || Object.keys(updates).length === 0) { // MODIFIED: Check if updates is empty
        return NextResponse.json({ error: 'Invalid input: targetUserId and updates object required' }, { status: 400 });
    }

    const allowedFields = ['display_name', 'role', 'bio', 'academic_profile', 'badges', 'avatar_url', 'banner_url', 'credits', 'onboarded']; // MODIFIED: Added more fields
    const updateData: any = {};
    for (const k of Object.keys(updates)) {
      if (allowedFields.includes(k)) {
        updateData[k] = updates[k];
      } else {
        console.warn(`Admin user update: Attempted to update disallowed field: ${k}`); // MODIFIED: Warn about disallowed fields
      }
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }


    const { error } = await supabaseAdmin.from('profiles').update(updateData).eq('id', targetUserId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
