// File: supabase/functions/assemblyai-webhook-handler/index.ts

import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl4 = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey4 = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase4 = createClient(supabaseUrl4, supabaseKey4);

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    // Optional auth for webhook here via req.headers

    const payload = await req.json();

    // Sample AssemblyAI webhook payload includes id, status, text, etc.
    if (payload.status !== 'completed') return new Response('Not completed', { status: 200 });

    const transcriptId = payload.id;
    // Retrieve transcript text and video_id, resource_id info
    // We need to correlate transcriptId with our course_resources resource_id

    // This requires you to store somewhere mapping AssemblyAI transcriptId -> resource_id and course_id
    // Assume you saved it in course_resources table in a new column assemblyai_transcript_id

    // Query course_resources by transcript_id
    const { data: resources, error: resourceError } = await supabase4
      .from('course_resources')
      .select('id, course_id')
      .eq('assemblyai_transcript_id', transcriptId)
      .limit(1)
      .single();

    if (resourceError || !resources) {
      console.error('Resource not found for assemblyai transcript id:', transcriptId);
      return new Response('Resource not found', { status: 404 });
    }

    // Upload transcription text as txt file to storage
    const transcriptText = payload.text || '';

    const storagePath = `courses/${resources.course_id}/generated_resources/${resources.id}_transcript.txt`;
    const buffer = new TextEncoder().encode(transcriptText);

    const { error: uploadError } = await supabase4.storage
      .from('courses')
      .upload(storagePath, buffer, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadError) {
      console.error('Failed uploading transcript txt:', uploadError);
      return new Response('Upload error', { status: 500 });
    }

    // Update course_resources record with storage path
    const { error: updateError } = await supabase4
      .from('course_resources')
      .update({ storage_path: storagePath })
      .eq('id', resources.id);

    if (updateError) {
      console.error('Failed updating course_resources storage_path:', updateError);
      return new Response('Update error', { status: 500 });
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});
