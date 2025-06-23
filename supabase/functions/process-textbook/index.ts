// File: supabase/functions/process-textbook/index.ts

import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse'; // You need to bundle pdf-parse or similar for Deno or run function in Node env
import fetch from 'node-fetch';
import { enqueueJob } from '@/lib/jobQueue'; // MODIFIED: Import enqueueJob
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'; // MODIFIED: Import pdfjsLib

// Utility for rotating Gemini keys
const geminiKeys = (Deno.env.get('GOOGLE_GEMINI_API_KEYS') || '').split(',');
let geminiKeyIndex = 0;
function getNextGeminiKey() {
  const key = geminiKeys[geminiKeyIndex];
  geminiKeyIndex = (geminiKeyIndex + 1) % geminiKeys.length;
  return key;
}

// Gemini API helper abstraction (for example using Google generative-ai npm or raw fetch)

async function callGeminiAPI(apiKey: string, prompt: string): Promise<any> {
  // Placeholder for calling Gemini generative AI - replace with proper client usage
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
      // Other Gemini API params here
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}`);
  }
  const data = await res.json();
  return data;
}

const supabase5 = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const { course_id } = await req.json();
    if (!course_id) return new Response('Missing course_id', { status: 400 });

    // Download textbook PDF from storage
    const pdfPath = `courses/${course_id}/central_resources/textbook.pdf`;
    const { data: pdfFile, error: downloadErr } = await supabase5.storage.from('courses').download(pdfPath);
    if (downloadErr || !pdfFile) {
      return new Response(`Failed to download textbook.pdf: ${downloadErr?.message}`, { status: 500 });
    }

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

    const apiKey = getNextGeminiKey();
    const geminiResponse = await callGeminiAPI(apiKey, prompt);
    let tocJsonRaw = geminiResponse?.choices?.[0]?.message?.content || geminiResponse?.text || '';
    let tocJson;
    try {
      tocJson = JSON.parse(tocJsonRaw);
    } catch {
      throw new Error('Failed to parse ToC JSON');
    }

    // Insert chapters into DB
    for (const chapter of tocJson) {
      const { chapter_number, title, page_number } = chapter; // MODIFIED: get page_number
      await supabase5.from('course_chapters').upsert({ course_id, chapter_number, title, page_number }); // MODIFIED: upsert page_number
    }

    // Fetch inserted chapters ordered by chapter_number
    const { data: chapters, error: chaptersError } = await supabase5 // MODIFIED: added error handling
      .from('course_chapters')
      .select('id, chapter_number, title, page_number')
      .eq('course_id', course_id)
      .order('chapter_number', { ascending: true });

    if (chaptersError || !chapters) { // MODIFIED: Added error check
        return new Response(`Failed fetching chapters: ${chaptersError?.message}`, { status: 500 });
    }

    // Sort chapters by chapter_number to get ranges for page numbers
    chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number); // MODIFIED: Added type any

    // For each chapter get page range: from chapter.page_number to next chapter.page_number - 1 or last page
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const startPage = chapter.page_number - 1; // zero-based index
      const endPage = i + 1 < chapters.length ? chapters[i + 1].page_number - 2 : pageCount - 1; // inclusive

      const chapterText = pageTexts.slice(startPage, endPage + 1).join('\n');

      // Enqueue generate-chapter-content job
      await enqueueJob('generate-chapter-content', { // MODIFIED: Use enqueueJob
        chapter_id: chapter.id,
        chapter_text_content: chapterText,
        course_id,
      });
    }
    return new Response('process-textbook started', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }
});
