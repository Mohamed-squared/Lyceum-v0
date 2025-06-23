// File: supabase/functions/transcribe-video/index.ts
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY')!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const { resource_id, video_id, course_id } = await req.json();

    if (!resource_id || !video_id || !course_id) return new Response('Missing parameters', { status: 400 });

    // Submit transcription to AssemblyAI, assume AssemblyAI accepts YouTube urls directly (in prod, probably need to download the audio)
    const webhookUrl = Deno.env.get('ASSEMBLYAI_WEBHOOK_URL')!;
    const res = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: `https://www.youtube.com/watch?v=${video_id}`,
        webhook_url: webhookUrl,
        webhook_auth_header: 'some-secret-token',
        auto_chapters: true,
        auto_highlights: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AssemblyAI transcription submission failed: ${text}`);
    }

    const transcriptData = await res.json();

    const transcriptId = transcriptData.id;
    if (!transcriptId) throw new Error('No transcript id returned from AssemblyAI');

    // **CRITICAL FIX: Save transcript ID immediately to course_resources table for webhook correlation**
    const { error: updateError } = await supabase
      .from('course_resources')
      .update({ assemblyai_transcript_id: transcriptId })
      .eq('id', resource_id);

    if (updateError) {
      console.error('Error updating course_resources with assemblyai_transcript_id:', updateError);
      return new Response('Failed to update resource with transcript ID', { status: 500 });
    }

    return new Response(JSON.stringify({ transcriptId }), { status: 202 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});
