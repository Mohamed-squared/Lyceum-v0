// File: lib/api.ts
import { supabaseClient, supabaseAdmin } from './supabase/client';
import { Provider } from '@supabase/supabase-js';

// --- UTILITY ---
// A helper function to handle fetch requests and JSON parsing
async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorInfo = await res.json().catch(() => ({ message: res.statusText }));
    const error = new Error(errorInfo.message || 'An error occurred during the fetch operation.');
    // You could attach the status code to the error object if needed
    // (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

// --- EXISTING AUTH from original file ---
// Auth functions using client for frontend calls, server code can call edge functions or server supabaseAdmin.

export async function signUp(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({ provider });
  if (error) throw error;
  return data;
}

// This function was in the original file. The prompt asks for `sendPasswordResetEmail` via API.
export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

// This function was in the original file. The prompt asks for `resetPassword` via API with a token.
export async function updateUserPassword(accessToken: string, newPassword: string) {
  // Assuming accessToken is handled by Supabase client session internally for updateUser
  const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
}


// --- NEW AUTH Wrappers (as per prompt) ---
export async function signIn(credentials: any) {
  // This wraps the existing signInWithPassword for consistency with the prompt's list.
  // Assuming credentials object has email and password fields.
  if (!credentials || !credentials.email || !credentials.password) {
    throw new Error("Email and password are required for signIn.");
  }
  return signInWithPassword(credentials.email, credentials.password);
  // If it were an API route: return fetcher('/api/auth/signin', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function sendPasswordResetEmail(email: string) {
  return fetcher('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
    return fetcher('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
}

// --- ONBOARDING & PROFILE ---
export async function completeOnboarding(onboardingData: any) {
    // As per prompt: "We will assume the frontend will use the Server Action directly.
    // If not, this function would wrap that call."
    // Adding a placeholder as it was listed as a missing import.
    console.warn("completeOnboarding should ideally be a direct Server Action call from the frontend.");
    // If an API route was absolutely necessary:
    // return fetcher('/api/onboarding/complete', { method: 'POST', body: JSON.stringify(onboardingData) });
    return Promise.resolve({ message: "Onboarding is expected to be handled by a Server Action." });
}

export async function changeEmail(data: { currentPassword: string, newEmail: string }) {
    return fetcher('/api/settings/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function changePassword(data: { currentPassword: string, newPassword: string }) {
    return fetcher('/api/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function deleteAccount(password: string) {
    return fetcher('/api/settings/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
}


// --- COURSES ---
export async function getAllCourses(filters: any) {
    const query = new URLSearchParams(filters).toString();
    return fetcher(`/api/courses?${query}`);
}

export async function getCourse(courseId: string) {
    return fetcher(`/api/courses/${courseId}`);
}

export async function getChapter(courseId: string, chapterId: string) {
    return fetcher(`/api/courses/${courseId}/chapters/${chapterId}`);
}

export async function createCourse(courseData: any) {
    // This should use a FormData object if it includes file uploads
    // The fetcher utility might need adjustment if it strictly expects JSON responses,
    // and the API route for createCourse might return something different on success with FormData.
    // For now, assuming the server handles FormData and returns JSON.
    const response = await fetch('/api/courses/create', {
        method: 'POST',
        body: courseData, // Pass FormData directly
    });
    if (!response.ok) {
        const errorInfo = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorInfo.message || 'An error occurred during course creation.');
        throw error;
    }
    return response.json();
}

export async function getGenerationProgress(courseId: string) {
    return fetcher(`/api/courses/${courseId}/generation-progress`);
}

// --- DASHBOARD ---
export async function getDashboardData() {
    return fetcher('/api/dashboard');
}


// --- COMMUNITY ---
export async function getChallenges() {
    return fetcher('/api/community/challenges');
}

export async function getStudyPartners() {
    return fetcher('/api/community/partners');
}

export async function createChallenge(challengeData: any) {
    return fetcher('/api/community/challenges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData),
    });
}

export async function searchUsers(query: string) {
    return fetcher(`/api/community/users/search?q=${query}`);
}

export async function sendPartnerRequest(toUserId: string) {
    return fetcher('/api/community/partners/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_user_id: toUserId }),
    });
}

export async function acceptPartnerRequest(requestId: string) {
    return fetcher(`/api/community/partners/request/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
    });
}

export async function declinePartnerRequest(requestId: string) {
    return fetcher(`/api/community/partners/request/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
    });
}
