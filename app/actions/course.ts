"use server";

import { supabaseAdmin } from '@/lib/supabase/server'; // Assuming server-side Supabase client
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema for course creation data validation
const CourseCreationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(150),
  language: z.string().min(2, "Language is required."),
  privacy: z.enum(["public", "private"]),
  automationMethod: z.enum(["ai", "manual"]),
  access: z.enum(["password", "invite"]).optional(),
  pricing: z.enum(["free", "paid"]).optional(),
  firstPageNumber: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val >= 0 && val <= 10000), "Invalid page number"),
  lectures: z.string().url("Invalid YouTube playlist URL.").optional().or(z.literal('')),
  // userId will be fetched from session
  // textbookFile is handled separately
});

interface CreateCourseActionResult {
  message: string;
  errors?: { [key: string]: string[] } | null;
  success: boolean;
  courseId?: string;
  redirectUrl?: string;
}

export async function createCourseAction(
  prevState: CreateCourseActionResult | undefined,
  formData: FormData
): Promise<CreateCourseActionResult> {

  const { data: { user } } = await supabaseAdmin.auth.getUser();
  if (!user) {
    return { message: "User not authenticated.", success: false, errors: { auth: ["Authentication required."] } };
  }
  const userId = user.id;

  const rawFormData = {
    title: formData.get('title') as string,
    language: formData.get('language') as string,
    privacy: formData.get('privacy') as "public" | "private",
    automationMethod: formData.get('automationMethod') as "ai" | "manual",
    access: formData.get('access') as "password" | "invite" | undefined,
    pricing: formData.get('pricing') as "free" | "paid" | undefined,
    firstPageNumber: formData.get('firstPageNumber') as string | undefined,
    lectures: formData.get('lectures') as string | undefined,
  };

  const validatedFields = CourseCreationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { title, language, privacy, automationMethod, access, pricing, firstPageNumber, lectures } = validatedFields.data;

  // Handle Textbook File Upload
  const textbookFile = formData.get('textbookFile') as File | null;
  let textbookUrl: string | null = null;
  let textbookStoragePath: string | null = null;

  if (textbookFile && textbookFile.size > 0) {
    if (textbookFile.size > 50 * 1024 * 1024) { // Max 50MB
        return { message: "Textbook PDF is too large (max 50MB).", success: false, errors: { textbookFile: ["File too large."] } };
    }
    if (textbookFile.type !== 'application/pdf') {
        return { message: "Invalid textbook file type (PDF only).", success: false, errors: { textbookFile: ["Invalid file type."] } };
    }

    const filePath = `user-assets/${userId}/courses/${Date.now()}-${textbookFile.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('course-materials') // Ensure this bucket exists
      .upload(filePath, textbookFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: textbookFile.type,
      });

    if (uploadError) {
      console.error("Textbook Upload Error:", uploadError);
      return { message: `Textbook upload failed: ${uploadError.message}`, success: false, errors: { textbookFile: ["Upload failed."] } };
    }
    const { data: publicUrlData } = supabaseAdmin.storage.from('course-materials').getPublicUrl(filePath);
    textbookUrl = publicUrlData.publicUrl;
    textbookStoragePath = filePath;
  }

  // Prepare data for inserting into 'courses' table
  // This needs to match your actual database schema for courses
  const courseInsertData = {
    user_id: userId, // creator_id or similar
    title,
    language,
    privacy_setting: privacy, // map to DB column
    automation_method: automationMethod, // map to DB column
    access_control: access, // map to DB column
    pricing_tier: pricing, // map to DB column
    textbook_url: textbookUrl,
    textbook_storage_path: textbookStoragePath,
    textbook_first_page_offset: firstPageNumber,
    lecture_playlist_url: lectures,
    status: 'draft', // Or 'pending_generation' if AI method
    // Add other relevant fields: description, subject, level, thumbnail_url (can be set later)
    // created_at and updated_at will be set by DB automatically
  };

  const { data: newCourse, error: insertError } = await supabaseAdmin
    .from('courses') // Your courses table name
    .insert(courseInsertData)
    .select('id') // Select the ID of the newly created course
    .single(); // Expect a single row back

  if (insertError || !newCourse) {
    console.error("Course Insert Error:", insertError);
    // Potentially delete uploaded file if DB insert fails
    if (textbookStoragePath) {
        await supabaseAdmin.storage.from('course-materials').remove([textbookStoragePath]);
    }
    return { message: `Failed to create course: ${insertError?.message || "Unknown error"}`, success: false, errors: { database: ["DB insert failed."] } };
  }

  const courseId = newCourse.id;

  // Revalidate paths if needed, e.g., a user's list of created courses
  revalidatePath('/my-courses'); // Or wherever user's created courses are listed
  revalidatePath('/admin/courses'); // If admins see all courses

  return {
    message: "Course created successfully! Redirecting to generation dashboard...",
    success: true,
    courseId: courseId,
    redirectUrl: `/courses/${courseId}/generation`, // Or to course management page
    errors: null,
  };
}
