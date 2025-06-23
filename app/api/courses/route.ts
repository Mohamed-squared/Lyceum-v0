// File: app/api/courses/route.ts - list all public courses with pagination & filters
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

interface QueryParams {
  limit?: string;
  offset?: string;
  search?: string;
  category?: string;
  sort?: string; // e.g. 'newest', 'popular'
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { limit = '20', offset = '0', search, category, sort } = Object.fromEntries(url.searchParams.entries()) as QueryParams;

    let query = supabaseAdmin.from('courses').select('*').eq('privacy', 'public');

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (category) {
      // Assuming 'category' is a column in your 'courses' table
      query = query.eq('category', category);
    }

    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        // Assuming 'enrollment_count' is a column or you have a way to sort by popularity
        query = query.order('enrollment_count', { ascending: false });
        break;
      default:
        query = query.order('title');
    }

    const { data, error } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ courses: data || [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
