// File: app/actions/onboarding.ts (Server Action for onboarding)
import { supabaseAdmin } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { ReadableStream } from 'node:stream/web';

interface OnboardingFormData {
  userId: string;
  displayName: string;
  bio: string;
  academicProfile: any; // JSON
  socialLinks: any; // JSON
  avatarFile: File | null;
  bannerFile: File | null;
}

export async function onboardingAction(formData: OnboardingFormData) {
  const { userId, displayName, bio, academicProfile, socialLinks, avatarFile, bannerFile } = formData;

  // Bucket `user-assets` must exist before
  // Upload avatar and banner if provided
  let avatarUrl: string | null = null;
  let bannerUrl: string | null = null;

  if (avatarFile) {
    const avatarPath = `user-assets/${userId}/avatar-${Date.now()}-${avatarFile.name}`;
    const { error: avatarError } = await supabaseAdmin.storage.from('user-assets').upload(avatarPath, avatarFile, {
      cacheControl: '3600',
      upsert: true,
      contentType: avatarFile.type,
    });
    if (avatarError) throw avatarError;

    const { data: avatarPublicUrlData } = supabaseAdmin.storage.from('user-assets').getPublicUrl(avatarPath);
    avatarUrl = avatarPublicUrlData.publicUrl;
  }

  if (bannerFile) {
    const bannerPath = `user-assets/${userId}/banner-${Date.now()}-${bannerFile.name}`;
    const { error: bannerError } = await supabaseAdmin.storage.from('user-assets').upload(bannerPath, bannerFile, {
      cacheControl: '3600',
      upsert: true,
      contentType: bannerFile.type,
    });
    if (bannerError) throw bannerError;

    const { data: bannerPublicUrlData } = supabaseAdmin.storage.from('user-assets').getPublicUrl(bannerPath);
    bannerUrl = bannerPublicUrlData.publicUrl;
  }

  // Update profile record
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      onboarded: true,
      academic_profile: academicProfile,
      social_links: socialLinks,
    })
    .eq('id', userId);

  if (updateError) throw updateError;

  // Return redirect URL to dashboard
  return { redirectUrl: '/dashboard' };
}
