// File: supabase/functions/process-youtube-playlist/index.ts

import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl2 = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey2 = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const youtubeApiKey = Deno.env.get('YOUTUBE_DATA_API_KEY') || '';
const assemblyAiApiKey = Deno.env.get('ASSEMBLYAI_API_KEY') || '';

const supabase2 = createClient(supabaseUrl2, supabaseKey2);

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const { course_id, playlist_url } = await req.json();

    if (!course_id || !playlist_url) return new Response('Missing parameters', { status: 400 });

    // Extract playlistId from playlist_url
    const url = new URL(playlist_url);
    const playlistId = url.searchParams.get('list');
    if (!playlistId) return new Response('Invalid playlist URL', { status: 400 });

    // YouTube API - get playlist items (video IDs)
    const items: string[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const youtubeApiUrl = new URL('https://youtube.googleapis.com/youtube/v3/playlistItems');
      youtubeApiUrl.searchParams.set('key', youtubeApiKey);
      youtubeApiUrl.searchParams.set('part', 'contentDetails');
      youtubeApiUrl.searchParams.set('playlistId', playlistId);
      youtubeApiUrl.searchParams.set('maxResults', '50');
      if (nextPageToken) youtubeApiUrl.searchParams.set('pageToken', nextPageToken);

      const res = await fetch(youtubeApiUrl.toString());
      if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

      const data = await res.json();

      if (data.items) {
        for (const item of data.items) {
          if (item.contentDetails?.videoId) items.push(item.contentDetails.videoId);
        }
      }

      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    // Insert course_resources rows for each video and trigger transcribe-video function
    for (const videoId of items) {
      const externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const { data: resource, error: resourceError } = await supabase2
        .from('course_resources')
        .insert({
          chapter_id: null,
          type: 'lecture',
          storage_path: null,
          external_url: externalUrl,
        })
        .select()
        .single();

      if (resourceError || !resource) {
        console.error('Failed to create course_resource for video:', videoId, resourceError);
        continue;
      }

      // Call transcribe-video Edge Function async for each resource
      fetch(`${Deno.env.get('TRANSCRIBE_VIDEO_FN_URL') || 'http://localhost:54321/functions/v1/transcribe-video'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: resource.id, video_id: videoId, course_id }),
      }).catch((e) => console.error(`transcribe-video invoke failed for video ${videoId}:`, e));
    }

    return new Response(JSON.stringify({ inserted_resources: items.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});
