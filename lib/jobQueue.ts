// File: lib/jobQueue.ts
import { supabaseAdmin } from './supabase/server';

export type JobStatus = 'pending' | 'running' | 'failed' | 'done';

export interface JobRow {
  id: string;
  function_name: string;
  payload: any;
  status: JobStatus;
  attempts: number;
  created_at: string;
  updated_at: string;
}

/**
 * Enqueue a new job into the jobs table.
 */
export async function enqueueJob(functionName: string, payload: any): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from<JobRow>('jobs') // Specify JobRow for type safety
    .insert({ function_name: functionName, payload, status: 'pending', attempts: 0 })
    .select('id')
    .single();

  if (error) {
    console.error('Error enqueuing job:', error);
    throw error;
  }
  if (!data) { // Added check for data
    throw new Error('Failed to enqueue job, no ID returned');
  }
  return data.id;
}

/**
 * Fetch pending jobs limited by count, update them to 'running'.
 * This should ideally be a single atomic operation (e.g., using a Postgres function or transaction).
 * Simplified version for now.
 */
export async function fetchAndLockPendingJobs(limit = 10): Promise<JobRow[]> {
  // Fetch pending jobs ordered by created_at
  const { data: jobs, error } = await supabaseAdmin
    .from<JobRow>('jobs') // Specify JobRow
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching pending jobs:', error);
    throw error;
  }

  if (!jobs || jobs.length === 0) return [];

  // Update fetched jobs to 'running' to lock them
  const jobIds = jobs.map((j) => j.id);
  const { error: updateError } = await supabaseAdmin
    .from('jobs')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .in('id', jobIds);

  if (updateError) {
    console.error('Error locking jobs:', updateError);
    // Optionally, revert status or handle partial failure
    throw updateError;
  }

  // Return locked jobs (now with updated status in DB, but local `jobs` variable still has 'pending')
  // It's better to re-fetch or ensure the update reflects in the returned data if needed downstream.
  // For this pattern, we assume the caller handles this or the job runner re-fetches details.
  return jobs.map(job => ({ ...job, status: 'running' })); // Reflect status change locally
}

/**
 * Mark job done.
 */
export async function markJobDone(jobId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('jobs')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('id', jobId);

  if (error) {
    console.error(`Error marking job ${jobId} as done:`, error);
    throw error;
  }
}

/**
 * Mark job failed; increment attempts. Retry up to 5 times.
 */
export async function markJobFailed(jobId: string): Promise<void> {
  const { data: job, error: fetchError } = await supabaseAdmin
    .from<JobRow>('jobs') // Specify JobRow
    .select('attempts')
    .eq('id', jobId)
    .single();

  if (fetchError || !job) {
    console.error(`Error fetching job ${jobId} for failure marking:`, fetchError);
    throw fetchError || new Error('Failed to find job for fail mark');
  }

  const attempts = job.attempts + 1;
  const statusToSet: JobStatus = attempts >= 5 ? 'failed' : 'pending'; // Retry max 5 attempts

  const { error: updateError } = await supabaseAdmin
    .from('jobs')
    .update({ status: statusToSet, attempts, updated_at: new Date().toISOString() })
    .eq('id', jobId);

  if (updateError) {
    console.error(`Error marking job ${jobId} as failed (attempt ${attempts}):`, updateError);
    throw updateError;
  }
}
