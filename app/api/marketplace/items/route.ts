import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // Optional: Implement filtering by category if needed, like the mock version
    // const { searchParams } = new URL(request.url);
    // const category = searchParams.get("category");
    // let query = supabase.from('marketplace_items').select('*').eq('is_active', true);
    // if (category && category !== "all") {
    //   query = query.eq('category', category);
    // }
    // const { data, error } = await query.order('created_at', { ascending: false });

    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('is_active', true) // Only fetch active items
      .order('name', { ascending: true }); // Order by name

    if (error) {
      console.error('Error fetching marketplace items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Marketplace items GET handler error:', err);
    return NextResponse.json({ error: err.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
