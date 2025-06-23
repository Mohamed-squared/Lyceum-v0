// File: supabase/functions/initiate-course-generation/index.ts

import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';
import type { MultipartFormData } from 'some-multipart-parser'; // You'll need to parse multipart form data for file uploads
import fetch from 'node-fetch';
import { enqueueJob } from '@/lib/jobQueue'; // MODIFIED: Import enqueueJob

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // parse multipart form data for courseTitle, userId, textbookFile, youtubePlaylistUrl
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response('Expected multipart/form-data', { status: 400 });
    }

    // Parse multipart form (in Deno environment, you need a multipart parser, simplified here)
    // For brevity, assuming we have parsed the payload into variables:

    // TODO: Implement robust multipart parsing here.
    const formData = await req.formData();
    const courseTitle = formData.get('courseTitle') as string;
    const userId = formData.get('userId') as string;
    const youtubePlaylistUrl = (formData.get('youtubePlaylistUrl') as string) || null;
    const textbookFile = formData.get('textbookFile') as File | null;

    if (!courseTitle || !userId) {
      return new Response('Missing parameters', { status: 400 });
    }

    // Create new course record with status 'generating'
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: courseTitle,
        creator_id: userId,
        status: 'generating',
        privacy: 'public',
      })
      .select()
      .single();

    if (courseError || !course) {
      return new Response(`Failed to create course: ${courseError?.message}`, { status: 500 });
    }

    // Upload textbook file to storage if provided
    if (textbookFile && textbookFile.size > 0) {
      const arrayBuffer = await textbookFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const storagePath = `courses/${course.id}/central_resources/textbook.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('courses')
        .upload(storagePath, buffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        return new Response(`Failed to upload textbook: ${uploadError.message}`, { status: 500 });
      }
      // MODIFIED: Enqueue job instead of calling function directly
      await enqueueJob('process-textbook', { course_id: course.id });
    }

    // MODIFIED: Trigger process-youtube-playlist Edge Function async if URL provided
    if (youtubePlaylistUrl) {
      // MODIFIED: Enqueue job instead of calling function directly
      await enqueueJob('process-youtube-playlist', { course_id: course.id, playlist_url: youtubePlaylistUrl });
    }

    return new Response(JSON.stringify({ course_id: course.id, status: 'generating' }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});
