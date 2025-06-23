// File: supabase/functions/job-worker/index.ts

import { serve } from 'std/server';
import { fetchAndLockPendingJobs, markJobDone, markJobFailed } from '@/lib/jobQueue';
import { createClient } from '@supabase/supabase-js';
import { enqueueJob } from '@/lib/jobQueue'; // Added import
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'; // Added import

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);


// Utility for rotating Gemini keys (copied from process-textbook)
const geminiKeys = (Deno.env.get('GOOGLE_GEMINI_API_KEYS') || '').split(',');
let geminiKeyIndex = 0;
function getNextGeminiKey() {
  const key = geminiKeys[geminiKeyIndex];
  geminiKeyIndex = (geminiKeyIndex + 1) % geminiKeys.length;
  return key;
}

// Gemini API helper abstraction (copied from process-textbook)
async function callGeminiAPI(apiKey: string, prompt: string): Promise<any> {
  const res = await fetch('https://generativeai.googleapis.com/v1beta2/models/gemini1_5:generateText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: {
        text: prompt,
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}`);
  }
  const data = await res.json();
  return data;
}


serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const jobs = await fetchAndLockPendingJobs(10);
    if (jobs.length === 0) return new Response('No jobs to process', { status: 200 });

    for (const job of jobs) {
      try {
        await processJob(job);
        await markJobDone(job.id);
      } catch (e) {
        console.error('Job processing error:', e, 'Job:', job);
        await markJobFailed(job.id);
      }
    }

    return new Response(`Processed ${jobs.length} jobs`, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});

/**
 * Dispatch to the correct handler based on function_name
 */
async function processJob(job: { id: string; function_name: string; payload: any }) {
  switch (job.function_name) {
    case 'process-textbook':
      return await processTextbook(job.payload);
    case 'process-youtube-playlist':
      return await processYoutubePlaylist(job.payload);
    case 'transcribe-video':
      return await transcribeVideo(job.payload);
    case 'generate-chapter-content':
      return await generateChapterContent(job.payload);
    case 'generate-ai-exam-feedback':
      return await generateAiExamFeedback(job.payload);
    default:
      throw new Error(`Unknown job function_name: ${job.function_name}`);
  }
}

async function processTextbook(payload: { course_id: string }) {
  const { course_id } = payload;
  // Download PDF from storage
  const { data: pdfFile, error: downloadErr } = await supabase.storage.from('courses').download(`courses/${course_id}/central_resources/textbook.pdf`);
  if (downloadErr || !pdfFile) throw downloadErr || new Error('PDF not found');

  const arrayBuffer = await pdfFile.arrayBuffer();

  // Use pdfjsLib in Node environment to parse the PDF
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const pageCount = pdf.numPages;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((item: any) => item.str);
    pageTexts.push(strings.join(' '));
  }

  // Call Gemini to parse the Table of Contents from first ~20 pages concatenated text (or first N pages)
  const tocTextSample = pageTexts.slice(0, 20).join('\n');

  const prompt = `
You are an expert document parsing AI, extract the textbook Table of Contents in JSON format.
Return an array of chapters as objects with fields: chapter_number (int), title (string), page_number (int).
Only reply with the JSON array.
Here is the text sample from the beginning of the textbook:
${tocTextSample}`;

  const apiKey = getNextGeminiKey(); // Make sure getNextGeminiKey is defined in this scope
  const geminiResponse = await callGeminiAPI(apiKey, prompt); // Make sure callGeminiAPI is defined
  let tocJsonRaw = geminiResponse?.choices?.[0]?.message?.content || geminiResponse?.text || '';
  let tocJson;
  try {
    tocJson = JSON.parse(tocJsonRaw);
  } catch {
    throw new Error('Failed to parse ToC JSON');
  }

  // Insert chapters into DB
  for (const chapter of tocJson) {
    const { chapter_number, title, page_number } = chapter; // Ensure page_number is part of your ToC object
    await supabase.from('course_chapters').upsert({ course_id, chapter_number, title, page_number });
  }

  // Fetch inserted chapters ordered by chapter_number
  const { data: chapters, error: chaptersError } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, page_number') // Ensure page_number is selected
    .eq('course_id', course_id)
    .order('chapter_number', { ascending: true });

  if (chaptersError || !chapters) {
    throw chaptersError || new Error('Failed to fetch chapters after insert');
  }

  // Sort chapters by chapter_number to get ranges for page numbers
  chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);


  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const startPage = chapter.page_number - 1;
    const endPage = i + 1 < chapters.length ? chapters[i + 1].page_number - 2 : pageCount - 1;

    const chapterText = pageTexts.slice(startPage, endPage + 1).join('\n');

    await enqueueJob('generate-chapter-content', { // Ensure enqueueJob is defined and imported
      chapter_id: chapter.id,
      chapter_text_content: chapterText,
      course_id,
    });
  }
}

async function processYoutubePlaylist(payload: { course_id: string; playlist_url: string }) {
  const { course_id, playlist_url } = payload;
  const youtubeApiKey = Deno.env.get('YOUTUBE_DATA_API_KEY') || '';

  const url = new URL(playlist_url);
  const playlistId = url.searchParams.get('list');
  if (!playlistId) throw new Error('Invalid playlist URL');

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

  for (const videoId of items) {
    const externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const { data: resource, error: resourceError } = await supabase
      .from('course_resources')
      .insert({ chapter_id: null, type: 'lecture', storage_path: null, external_url: externalUrl })
      .select().single();
    if (resourceError || !resource) {
      console.error('Failed to create course_resource for video:', videoId, resourceError);
      continue;
    }
    await enqueueJob('transcribe-video', { resource_id: resource.id, video_id: videoId, course_id });
  }
}

async function transcribeVideo(payload: { resource_id: string; video_id: string; course_id: string }) {
  const { resource_id, video_id } = payload;
  const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY')!;
  const webhookUrl = Deno.env.get('ASSEMBLYAI_WEBHOOK_URL')!;

  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: { authorization: ASSEMBLYAI_API_KEY, 'content-type': 'application/json' },
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

  const { error: updateError } = await supabase
    .from('course_resources')
    .update({ assemblyai_transcript_id: transcriptId })
    .eq('id', resource_id);
  if (updateError) {
    throw new Error('Failed to update resource with transcript ID: ' + updateError.message);
  }
}

async function generateChapterContent(payload: { chapter_id: string; chapter_text_content: string; course_id: string }) {
  const { chapter_id, chapter_text_content, course_id } = payload;
  const apiKey = getNextGeminiKey(); // Ensure getNextGeminiKey is defined

  const prompt = `
You are an expert educator creating course materials based on the following textbook chapter text:
"""${chapter_text_content}"""
Generate the following assets in a single, well-structured JSON response with keys:
- mcq_bank: array of objects {question, options[], correct_option_index}
- problem_bank: array of problems (text)
- powerpoint_outline: array of slide titles and bullet points
- latex_notes: LaTeX formatted notes string
- latex_formula_sheet: LaTeX formatted formula sheet string
- latex_summary: LaTeX formatted chapter summary string
Provide detailed instructions for the format of each as specified in the V2.0 guide.
`;
  const geminiResponse = await callGeminiAPI(apiKey, prompt); // Ensure callGeminiAPI is defined
  let responseText = geminiResponse?.choices?.[0]?.message?.content || geminiResponse?.text || '';
  let chapterAssets: any;
  try {
    chapterAssets = JSON.parse(responseText);
  } catch (ex) {
    throw new Error('Failed to parse generated chapter content JSON: ' + (ex as Error).message);
  }

  const uploadPromises: Promise<any>[] = [];
  const basePath = `courses/${course_id}/generated_resources/${chapter_id}`;

  const uploadAsset = async (assetKey: string, fileName: string, contentType: string, formatFn?: (content: any) => string) => {
    if (chapterAssets[assetKey]) {
      const content = formatFn ? formatFn(chapterAssets[assetKey]) : (typeof chapterAssets[assetKey] === 'string' ? chapterAssets[assetKey] : JSON.stringify(chapterAssets[assetKey], null, 2));
      const path = `${basePath}/${fileName}`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, assetKey, contentType));
    }
  };

  await uploadAsset('mcq_bank', 'mcq_bank.md', 'text/markdown');
  await uploadAsset('problem_bank', 'problem_bank.md', 'text/markdown');
  await uploadAsset('powerpoint_outline', 'powerpoint_outline.md', 'text/markdown', (outline) => outline.map((slide: any) => `# ${slide.title}\n${slide.bullets.map((b: string) => `- ${b}`).join('\n')}`).join('\n\n'));
  await uploadAsset('latex_notes', 'latex_notes.tex', 'application/x-tex');
  await uploadAsset('latex_formula_sheet', 'latex_formula_sheet.tex', 'application/x-tex');
  await uploadAsset('latex_summary', 'latex_summary.tex', 'application/x-tex');

  await Promise.all(uploadPromises);
}

async function uploadTextFile(path: string, content: string, course_id: string, chapter_id: string, resourceType: string, contentType: string) {
  const buffer = new TextEncoder().encode(content);
  const { error: uploadError } = await supabase.storage.from('courses').upload(path, buffer, { contentType, upsert: true });
  if (uploadError) throw new Error(`Failed to upload ${resourceType} for chapter ${chapter_id}: ${uploadError.message}`);

  const { error: insertError } = await supabase.from('course_resources').insert({ chapter_id, type: resourceType, storage_path: path, external_url: null });
  if (insertError) throw new Error(`Failed to create course_resources record for ${resourceType} chapter ${chapter_id}: ${insertError.message}`);
}


async function generateAiExamFeedback(payload: { exam_id: string; user_id: string; course_id: string; exam_data: any }) {
  const { exam_id, exam_data } = payload;
  const apiKey = getNextGeminiKey(); // Ensure getNextGeminiKey is defined for feedback

  const prompt = `Analyze this student's exam performance. Provide overall feedback on their strengths and weaknesses, and give detailed feedback for each problem they answered.\n\n${JSON.stringify(exam_data,null,2)}`;

  const aiFeedback = await callGeminiAPI(apiKey, prompt); // Ensure callGeminiAPI is defined
  let feedbackText = aiFeedback?.choices?.[0]?.message?.content || aiFeedback?.text || '';


  const { error } = await supabase.from('exam_history').update({ feedback_ai: feedbackText }).eq('id', exam_id);
  if (error) {
    throw new Error('Failed to update exam_history with AI feedback: ' + error.message);
  }
}
