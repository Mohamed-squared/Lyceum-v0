import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
    }

    // 1. Check for authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'User not authenticated. Please log in to make a purchase.' }, { status: 401 });
    }

    const itemId = params.id;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required for purchase' }, { status: 400 });
    }

    // Basic UUID validation
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(itemId)) {
      return NextResponse.json({ error: 'Invalid Item ID format' }, { status: 400 });
    }

    // 2. Call the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('purchase_marketplace_item', {
      item_id_input: itemId,
    });

    if (rpcError) {
      console.error('RPC purchase_marketplace_item error:', rpcError);
      // The RPC function itself returns a JSON with success status and message
      // So, we might not always want to return a generic 500 here if the RPC handled it.
      // However, if rpcError itself exists, it's likely a DB level error with the call.
      return NextResponse.json({ error: `Purchase failed: ${rpcError.message}` }, { status: 500 });
    }

    // 3. Handle RPC response
    // The rpcData should be the JSONB object { success: boolean, message: string }
    if (rpcData && typeof rpcData === 'object' && 'success' in rpcData) {
      if (rpcData.success) {
        return NextResponse.json({ message: rpcData.message || 'Purchase successful!' }, { status: 200 });
      } else {
        // Use a 400 Bad Request or 402 Payment Required for business logic failures like "insufficient credits"
        // or 409 Conflict for "already owned"
        const message = rpcData.message || 'Purchase could not be completed.';
        let statusCode = 400;
        if (message.toLowerCase().includes('insufficient credits')) statusCode = 402;
        if (message.toLowerCase().includes('already own')) statusCode = 409;
        if (message.toLowerCase().includes('not found')) statusCode = 404;

        return NextResponse.json({ error: message }, { status: statusCode });
      }
    }

    // Fallback if RPC response is not as expected
    console.error('Unexpected RPC response:', rpcData);
    return NextResponse.json({ error: 'An unexpected error occurred during purchase processing.' }, { status: 500 });

  } catch (err: any) {
    console.error('Purchase API handler error:', err);
    return NextResponse.json({ error: err.message || 'An unexpected server error occurred' }, { status: 500 });
  }
}
