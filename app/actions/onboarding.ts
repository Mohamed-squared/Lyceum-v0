// File: app/actions/onboarding.ts (Server Action for onboarding)
"use server";

import { supabaseAdmin, createClient } from '@/lib/supabase/server'; // Import createClient
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema for basic onboarding fields
const OnboardingFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(100),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  // interests, academicProfile, and socialLinks are expected as JSON strings
  interests: z.string().optional().transform((val, ctx) => {
    try {
      return val ? JSON.parse(val) : [];
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON for interests" });
      return z.NEVER;
    }
  }),
  academicProfile: z.string().optional().transform((val, ctx) => {
    try {
      return val ? JSON.parse(val) : {};
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON for academic profile" });
      return z.NEVER;
    }
  }),
  socialLinks: z.string().optional().transform((val, ctx) => {
    try {
      return val ? JSON.parse(val) : {};
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON for social links" });
      return z.NEVER;
    }
  }),
});

export interface OnboardingActionResult {
  message: string;
  errors?: { [key: string]: string[] } | null;
  success: boolean;
  redirectUrl?: string;
}

export async function onboardingAction(
  prevState: OnboardingActionResult | undefined,
  formData: FormData
): Promise<OnboardingActionResult> {
  // 1. Get User ID from session using the session-aware client
  const supabase = createClient();
  if (!supabase) {
    console.error("Failed to create Supabase client for session.");
    return {
      message: "Server error: Could not connect to authentication service.",
      success: false,
      errors: { auth: ["Server error: Could not connect to authentication service."] },
    };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication Error:", authError?.message || "User not found.");
    return {
      message: "User not authenticated. Please log in.",
      success: false,
      errors: { auth: ["User not authenticated."] },
    };
  }
  const userId = user.id;

  // 2. Extract and Validate Data
  const rawFormData = {
    displayName: formData.get('displayName') as string,
    bio: formData.get('bio') as string | undefined,
    interests: formData.get('interests') as string | undefined, // Expecting JSON string
    academicProfile: formData.get('academicProfile') as string | undefined, // Expecting JSON string
    socialLinks: formData.get('socialLinks') as string | undefined, // Expecting JSON string
  };

  const validatedFields = OnboardingFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { displayName, bio, interests, academicProfile, socialLinks } = validatedFields.data;

  // 3. Handle File Uploads (Avatar & Banner)
  const avatarFile = formData.get('avatarFile') as File | null;
  const bannerFile = formData.get('bannerFile') as File | null;
  let avatarUrl: string | undefined = undefined;
  let bannerUrl: string | undefined = undefined;

  // Upload Avatar
  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > 5 * 1024 * 1024) { // Max 5MB
      return { message: "Avatar image is too large (max 5MB).", success: false, errors: { avatarFile: ["Avatar too large (max 5MB)"] } };
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(avatarFile.type)) {
      return { message: "Invalid avatar file type.", success: false, errors: { avatarFile: ["Invalid file type for avatar."] } };
    }
    const avatarPath = `user-assets/${userId}/avatar-${Date.now()}-${avatarFile.name}`;
    const { error: avatarUploadError } = await supabaseAdmin.storage
      .from('user-assets')
      .upload(avatarPath, avatarFile, { cacheControl: '3600', upsert: true, contentType: avatarFile.type });

    if (avatarUploadError) {
      console.error("Avatar Upload Error:", avatarUploadError);
      return { message: `Avatar upload failed: ${avatarUploadError.message}`, success: false, errors: { avatarFile: [`Upload failed: ${avatarUploadError.message}`] } };
    }
    const { data: publicAvatarUrlData } = supabaseAdmin.storage.from('user-assets').getPublicUrl(avatarPath);
    avatarUrl = publicAvatarUrlData.publicUrl;
  }

  // Upload Banner
  if (bannerFile && bannerFile.size > 0) {
    if (bannerFile.size > 10 * 1024 * 1024) { // Max 10MB for banner
      return { message: "Banner image is too large (max 10MB).", success: false, errors: { bannerFile: ["Banner too large (max 10MB)"] } };
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(bannerFile.type)) {
      return { message: "Invalid banner file type.", success: false, errors: { bannerFile: ["Invalid file type for banner."] } };
    }
    const bannerPath = `user-assets/${userId}/banner-${Date.now()}-${bannerFile.name}`;
    const { error: bannerUploadError } = await supabaseAdmin.storage
      .from('user-assets')
      .upload(bannerPath, bannerFile, { cacheControl: '3600', upsert: true, contentType: bannerFile.type });

    if (bannerUploadError) {
      console.error("Banner Upload Error:", bannerUploadError);
      return { message: `Banner upload failed: ${bannerUploadError.message}`, success: false, errors: { bannerFile: [`Upload failed: ${bannerUploadError.message}`] } };
    }
    const { data: publicBannerUrlData } = supabaseAdmin.storage.from('user-assets').getPublicUrl(bannerPath);
    bannerUrl = publicBannerUrlData.publicUrl;
  }

  // 4. Prepare data for Supabase 'profiles' table update
  const profileUpdateData: {
    display_name: string;
    bio?: string;
    avatar_url?: string;
    banner_url?: string;
    onboarded: boolean;
    interests?: any[]; // Assuming interests is an array
    academic_profile?: any; // JSON
    social_links?: any; // JSON
    updated_at: string;
  } = {
    display_name: displayName,
    onboarded: true,
    updated_at: new Date().toISOString(),
  };

  if (bio) profileUpdateData.bio = bio;
  if (avatarUrl) profileUpdateData.avatar_url = avatarUrl;
  if (bannerUrl) profileUpdateData.banner_url = bannerUrl;
  if (interests && interests.length > 0) profileUpdateData.interests = interests;
  if (academicProfile && Object.keys(academicProfile).length > 0) profileUpdateData.academic_profile = academicProfile;
  if (socialLinks && Object.keys(socialLinks).length > 0) profileUpdateData.social_links = socialLinks;

  // Remove undefined fields to avoid overwriting with null if not provided
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
    return {
      message: `Profile update failed: ${updateError.message}`,
      success: false,
      errors: { database: [`Update failed: ${updateError.message}`] },
    };
  }

  // 6. Revalidate paths
  revalidatePath('/dashboard');
  revalidatePath(`/profile/${user.user_metadata?.username || userId}`);


  // 7. Return success
  return {
    message: "Onboarding completed successfully! Redirecting to dashboard...",
    success: true,
    redirectUrl: '/dashboard',
    errors: null,
  };
}
