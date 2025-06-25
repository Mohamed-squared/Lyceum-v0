import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    const itemId = params.id;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Basic UUID validation - consider a more robust library if needed
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(itemId)) {
      return NextResponse.json({ error: 'Invalid Item ID format' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('id', itemId)
      // .eq('is_active', true) // Only fetch if active - decided to allow fetching inactive items by direct ID for potential admin/preview purposes. The main list API filters by active.
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error code for "Not found" (e.g. item ID doesn't exist)
        return NextResponse.json({ error: 'Marketplace item not found' }, { status: 404 });
      }
      console.error('Error fetching marketplace item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        // This case should ideally be caught by error.code PGRST116, but as a fallback:
        return NextResponse.json({ error: 'Marketplace item not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Marketplace item [id] GET handler error:', err);
    return NextResponse.json({ error: err.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
