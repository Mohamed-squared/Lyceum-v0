// File: app/api/profile/update/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const userId = json.userId || (await supabaseAdmin.auth.getUser()).data.user?.id; // MODIFIED: Get userId from auth if not provided

    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 }); // MODIFIED: Check userId

    // Update fields provided
    const allowedFields = ['display_name', 'bio', 'academic_profile', 'social_links', 'avatar_url', 'banner_url'];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (field in json) updateData[field] = json[field];
    }

    const { error } = await supabaseAdmin.from('profiles').update(updateData).eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
