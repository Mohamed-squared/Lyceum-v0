// File: supabase/functions/generate-chapter-content/index.ts

import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl6 = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey6 = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase6 = createClient(supabaseUrl6, supabaseKey6);

const geminiKeys6 = (Deno.env.get('GOOGLE_GEMINI_API_KEYS') || '').split(',');
let geminiKeyIndex6 = 0;
function getNextGeminiKey6() {
  const key = geminiKeys6[geminiKeyIndex6];
  geminiKeyIndex6 = (geminiKeyIndex6 + 1) % geminiKeys6.length;
  return key;
}

async function callGemini6(apiKey: string, prompt: string): Promise<any> {
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
      // Additional Gemini params here
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
    const { chapter_id, chapter_text_content, course_id } = await req.json();
    if (!chapter_id || !chapter_text_content || !course_id) return new Response('Missing parameters', { status: 400 });

    // Compose complex prompt
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

    const apiKey = getNextGeminiKey6();
    const geminiResponse = await callGemini6(apiKey, prompt);

    let responseText = '';
    try {
      responseText = geminiResponse?.choices?.[0]?.message?.content || geminiResponse?.text || '';
    } catch {
      responseText = geminiResponse?.text || '';
    }

    // Parse JSON response
    let chapterAssets: any;
    try {
      chapterAssets = JSON.parse(responseText);
    } catch (ex) {
      console.error('Failed to parse generated chapter content JSON:', ex);
      return new Response('Failed to parse Gemini response JSON', { status: 500 });
    }

    // Prepare assets for upload: create .md or .tex files as per type and upload to storage
    const uploadPromises: Promise<any>[] = [];
    const basePath = `courses/${course_id}/generated_resources/${chapter_id}`;

    if (chapterAssets.mcq_bank) {
      const content = JSON.stringify(chapterAssets.mcq_bank, null, 2);
      const path = `${basePath}/mcq_bank.md`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'mcq_bank'));
    }
    if (chapterAssets.problem_bank) {
      const content = JSON.stringify(chapterAssets.problem_bank, null, 2);
      const path = `${basePath}/problem_bank.md`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'problem_bank'));
    }
    if (chapterAssets.powerpoint_outline) {
      const content = chapterAssets.powerpoint_outline.map((slide: any) => `# ${slide.title}\n${slide.bullets.map((b: string) => `- ${b}`).join('\n')}`).join('\n\n');
      const path = `${basePath}/powerpoint_outline.md`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'powerpoint_outline'));
    }
    if (chapterAssets.latex_notes) {
      const content = chapterAssets.latex_notes;
      const path = `${basePath}/latex_notes.tex`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'latex_notes'));
    }
    if (chapterAssets.latex_formula_sheet) {
      const content = chapterAssets.latex_formula_sheet;
      const path = `${basePath}/latex_formula_sheet.tex`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'latex_formula_sheet'));
    }
    if (chapterAssets.latex_summary) {
      const content = chapterAssets.latex_summary;
      const path = `${basePath}/latex_summary.tex`;
      uploadPromises.push(uploadTextFile(path, content, course_id, chapter_id, 'latex_summary'));
    }

    await Promise.all(uploadPromises);

    // Mark chapter content generated if needed - or just respond success
    return new Response('Chapter content generated and uploaded', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : 'Unknown error', { status: 500 });
  }

  async function uploadTextFile(path: string, content: string, course_id: string, chapter_id: string, resourceType: string) {
    // Upload content to Supabase Storage, then create course_resources record
    const buffer = new TextEncoder().encode(content);
    const { error: uploadError } = await supabase6.storage.from('courses').upload(path, buffer, {
      contentType: path.endsWith('.tex') ? 'application/x-tex' : 'text/markdown',
      upsert: true,
    });
    if (uploadError) {
      console.error(`Failed to upload ${resourceType} for chapter ${chapter_id}:`, uploadError);
      throw uploadError;
    }
    // Insert course_resources record
    const { error: insertError } = await supabase6.from('course_resources').insert({
      chapter_id,
      type: resourceType,
      storage_path: path,
      external_url: null,
    });
    if (insertError) {
      console.error(`Failed to create course_resources record for ${resourceType} chapter ${chapter_id}:`, insertError);
      throw insertError;
    }
  }
});
