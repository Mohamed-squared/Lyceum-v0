"use server";

import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define a schema for profile data validation (optional but recommended)
const ProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters." }).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).max(100).optional().or(z.literal('')),
  twitter: z.string().max(50).optional(), // Basic validation, could add regex for @username
  linkedin: z.string().max(100).optional(), // Basic validation
  github: z.string().max(50).optional(), // Basic validation
  // avatarFile: is handled separately
});

interface UpdateProfileActionResult {
  message: string;
  errors?: { [key: string]: string[] } | null;
  success: boolean;
}

export async function updateUserProfileAction(
  // First argument for useFormState, can be previous state
  prevState: UpdateProfileActionResult | undefined,
  formData: FormData
): Promise<UpdateProfileActionResult> {

  // 1. Get User ID from session (most secure way)
  // This requires Supabase client configured for server-side auth
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  if (!user) {
    return { message: "User not authenticated.", success: false, errors: { auth: ["User not authenticated."] } };
  }
  const userId = user.id;

  // 2. Extract and Validate Data
  const rawFormData = {
    name: formData.get('name') as string,
    bio: formData.get('bio') as string | undefined,
    location: formData.get('location') as string | undefined,
    website: formData.get('website') as string | undefined,
    twitter: formData.get('twitter') as string | undefined,
    linkedin: formData.get('linkedin') as string | undefined,
    github: formData.get('github') as string | undefined,
  };

  const validatedFields = ProfileFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, bio, location, website, twitter, linkedin, github } = validatedFields.data;

  // 3. Handle Avatar Upload (if provided)
  const avatarFile = formData.get('avatarFile') as File | null;
  let avatarUrl: string | undefined = undefined;

  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > 5 * 1024 * 1024) { // Max 5MB
        return { message: "Avatar image is too large (max 5MB).", success: false, errors: { avatarFile: ["Avatar too large (max 5MB)"] } };
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(avatarFile.type)) {
        return { message: "Invalid avatar file type.", success: false, errors: { avatarFile: ["Invalid file type for avatar."] } };
    }

    const avatarPath = `user-assets/${userId}/avatar-${Date.now()}-${avatarFile.name}`;
    const { error: avatarError } = await supabaseAdmin.storage
      .from('user-assets') // Ensure this bucket exists and has appropriate policies
      .upload(avatarPath, avatarFile, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists, useful for profile pics
        contentType: avatarFile.type,
      });

    if (avatarError) {
      console.error("Avatar Upload Error:", avatarError);
      return { message: `Avatar upload failed: ${avatarError.message}`, success: false, errors: { avatarFile: [`Upload failed: ${avatarError.message}`] } };
    }
    const { data: publicUrlData } = supabaseAdmin.storage.from('user-assets').getPublicUrl(avatarPath);
    avatarUrl = publicUrlData.publicUrl;
  }

  // 4. Prepare data for Supabase update
  const profileUpdateData: {
    full_name: string; // Assuming your 'profiles' table has 'full_name'
    bio?: string;
    location?: string;
    website_url?: string; // Assuming column names in DB
    twitter_url?: string;
    linkedin_url?: string;
    github_url?: string;
    avatar_url?: string;
    updated_at: string;
  } = {
    full_name: name, // Map 'name' from form to 'full_name' in DB
    updated_at: new Date().toISOString(),
  };

  if (bio) profileUpdateData.bio = bio;
  if (location) profileUpdateData.location = location;
  if (website) profileUpdateData.website_url = website;
  // Construct full URLs if only usernames are provided, or adjust based on expected input
  if (twitter) profileUpdateData.twitter_url = twitter.startsWith('@') ? `https://twitter.com/${twitter.substring(1)}` : twitter;
  if (linkedin) profileUpdateData.linkedin_url = linkedin; // Assuming full URL or path
  if (github) profileUpdateData.github_url = github.startsWith('github.com/') ? github : `https://github.com/${github}`;
  if (avatarUrl) profileUpdateData.avatar_url = avatarUrl;

  // Remove undefined fields to avoid overwriting with null in Supabase if not provided
  Object.keys(profileUpdateData).forEach(key => {
    if (profileUpdateData[key as keyof typeof profileUpdateData] === undefined) {
      delete profileUpdateData[key as keyof typeof profileUpdateData];
    }
  });


  // 5. Update 'profiles' table in Supabase
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(profileUpdateData)
    .eq('id', userId);

  if (updateError) {
    console.error("Profile Update Error:", updateError);
    return { message: `Profile update failed: ${updateError.message}`, success: false, errors: { database: [`Update failed: ${updateError.message}`] } };
  }

  // 6. Revalidate relevant paths
  revalidatePath('/settings/profile'); // Revalidate the settings page
  revalidatePath(`/profile/${user.user_metadata?.username || userId}`); // Revalidate the public profile page

  return { message: "Profile updated successfully!", success: true, errors: null };
}
