// In lib/api.ts
async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorInfo;
    try {
      errorInfo = await res.json();
    } catch (e) {
      // If res.json() fails, it means the error response wasn't valid JSON
      errorInfo = { message: res.statusText || 'An unknown error occurred during API request.' };
    }
    const error = new Error(errorInfo.message || 'API request failed.');
    // error.status = res.status; // Optionally attach status code
    throw error;
  }
  // Handle cases where response might be empty but still ok (e.g., 204 No Content)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return res.json();
  }
  return {}; // Or handle as appropriate for non-JSON responses
}

// User & Profile
export async function getUserProfile(username: string) {
  return fetcher(`/api/users/${username}`);
}

export async function updateUserProfile(userId: string, profileData: any) {
  return fetcher(`/api/profile/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData), // Assuming API expects only profileData, userId might be from session
  });
}

// Courses
export async function getAllCourses(filters?: any) {
  const queryParams = filters ? new URLSearchParams(filters).toString() : '';
  return fetcher(`/api/courses${queryParams ? `?${queryParams}` : ''}`);
}

export async function getMyCourses() {
  return fetcher(`/api/my-courses`);
}

export async function getCourseDetails(courseId: string) {
  return fetcher(`/api/courses/${courseId}`);
}

export async function enrollInCourse(courseId: string, enrollmentData: any) {
  return fetcher(`/api/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enrollmentData),
  });
}

// Learning & Progress
export async function getNotesForCourse(courseId: string) {
  return fetcher(`/api/courses/${courseId}/notes`);
}

export async function createOrUpdateNote(courseId: string, noteData: any) {
  return fetcher(`/api/courses/${courseId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
}

export async function deleteNote(courseId: string, noteId: string) {
  // As per instruction: "pass ID in body"
  // However, RESTful practice often puts ID in URL for DELETE.
  // Confirming API design: if noteId should be in URL, change to:
  // return fetcher(`/api/courses/${courseId}/notes/${noteId}`, { method: 'DELETE' });
  return fetcher(`/api/courses/${courseId}/notes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ noteId }),
  });
}

export async function getAssignments(courseId: string) {
  return fetcher(`/api/courses/${courseId}/assignments`);
}

// Exam & History
export async function submitExam(examData: any) {
  return fetcher(`/api/history/exams/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(examData),
  });
}

export async function getExamReview(examId: string) {
  return fetcher(`/api/history/exams/review/${examId}`);
}

// Community
export async function getLeaderboard() {
  return fetcher(`/api/community/leaderboard`);
}

export async function getStudyPartners() {
  return fetcher(`/api/community/partners`);
}

export async function sendPartnerRequest(toUserId: string) {
  return fetcher(`/api/community/partners/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ toUserId }),
  });
}

// Functions for accepting/declining requests and creating challenges
export async function acceptPartnerRequest(requestId: string) {
  return fetcher(`/api/community/partners/request/accept`, { // Assuming this endpoint structure
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId }),
  });
}

export async function declinePartnerRequest(requestId: string) {
  return fetcher(`/api/community/partners/request/decline`, { // Assuming this endpoint structure
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId }),
  });
}

export async function createChallenge(challengeData: any) {
  return fetcher(`/api/community/challenges`, { // Assuming this endpoint structure
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(challengeData),
  });
}

// Dashboard
export async function getDashboardData() {
  return fetcher(`/api/dashboard`);
}

// Admin Panel
export async function getAdminStats() {
  return fetcher(`/api/admin/stats`);
}

export async function getAdminUsers(filters?: any) {
  const queryParams = filters ? new URLSearchParams(filters).toString() : '';
  return fetcher(`/api/admin/users${queryParams ? `?${queryParams}` : ''}`);
}

export async function getAdminCourses(filters?: any) {
  const queryParams = filters ? new URLSearchParams(filters).toString() : '';
  return fetcher(`/api/admin/courses${queryParams ? `?${queryParams}` : ''}`);
}

export async function updateCourseStatus(courseId: string, status: string) {
  return fetcher(`/api/admin/courses/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, status }),
  });
}

// It is highly recommended to define specific TypeScript interfaces
// for your API request bodies and response payloads.
// Using 'any' is quick but sacrifices type safety.
// Example:
//
// interface UserProfile {
//   id: string;
//   username: string;
//   bio?: string;
// }
//
// export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
//   return fetcher(`/api/profile/update`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(profileData),
//   });
// }
//
// This provides better autocompletion, error checking, and code maintainability.
