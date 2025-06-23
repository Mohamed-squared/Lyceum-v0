// File: lib/adminAuth.ts
import { supabaseAdmin } from './supabase/server';
import type { NextResponseInit } from 'next/server'; // Not directly used but good for context
import { NextResponse } from 'next/server'; // Not directly used but good for context

export async function verifyAdmin(userId: string): Promise<void> {
  if (!userId) {
    const err = new Error('User ID required for admin verification');
    (err as any).status = 401; // Unauthorized
    throw err;
  }
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error fetching profile for admin verification:", error);
    const err = new Error('Failed to verify admin status');
    (err as any).status = 500; // Internal Server Error
    throw err;
  }
  if (!profile || !['admin', 'primary-admin'].includes(profile.role)) {
    const err = new Error('Forbidden');
    (err as any).status = 403; // Forbidden
    throw err;
  }
}
