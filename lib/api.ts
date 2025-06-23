// File: lib/api.ts
import { supabaseClient, supabaseAdmin } from './supabase/client';
import { Provider } from '@supabase/supabase-js';

// Auth functions using client for frontend calls, server code can call edge functions or server supabaseAdmin.

export async function signUp(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({ provider });
  if (error) throw error;
  return data;
}

export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

export async function updateUserPassword(accessToken: string, newPassword: string) {
  const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
}
