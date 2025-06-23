"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation" // useRouter for navigation
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Added AvatarImage
import { CourseCard } from "@/components/CourseCard"
import { getUserProfile } from "@/lib/api"
import { MapPin, Calendar, Award, ExternalLink, Github, Twitter, Linkedin, AlertTriangle, UserCircle, Library, Edit3 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Course } from "@/lib/mock-data" // Base course type

// Define UserProfile structure based on expected API response
interface UserProfileStats {
  coursesCreated: number;
  studentsEnrolled: number;
  totalRating: number;
  creditsEarned: number;
}

interface UserProfileAcademic {
  fieldOfStudy?: string;
  levelOfStudy?: string;
  studiedSubjects?: string[];
  interestedMajors?: string[];
  academicProfile?: string; // Markdown or HTML string for detailed profile
}

interface UserProfileBadge {
  id: string;
  name: string;
  icon?: string; // Emoji or URL
  color?: string; // Tailwind color class
  earnedDate?: string;
}

interface UserProfileSocial {
  id: string;
  platform: string; // e.g., "GitHub", "Twitter"
  url: string;
  // Icon will be mapped client-side based on platform name
}

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string; // If public
  avatarUrl?: string; // URL for avatar image
  bannerImageUrl?: string;
  bio?: string;
  location?: string;
  joinDate: string; // ISO date string
  stats?: UserProfileStats;
  academic?: UserProfileAcademic;
  badges?: UserProfileBadge[];
  socials?: UserProfileSocial[];
  createdCourses?: Course[]; // Array of courses created by the user
  // TODO: Add field to determine if this is the currently authenticated user's profile
  isOwnProfile?: boolean; // This would ideally come from the API or session
}

const socialIcons: { [key: string]: React.ElementType } = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  default: ExternalLink,
}

function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner Skeleton */}
      <div className="relative h-48 bg-gray-200 animate-pulse">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-4">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48 bg-gray-300" />
              <Skeleton className="h-5 w-32 bg-gray-300" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-4 w-24 bg-gray-300" />
                <Skeleton className="h-4 w-32 bg-gray-300" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 bg-gray-300" /> {/* Edit Profile Button */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-4 text-center space-y-1"><Skeleton className="h-7 w-12 mx-auto bg-gray-300" /><Skeleton className="h-4 w-24 mx-auto bg-gray-300" /></CardContent></Card>
          ))}
        </div>

        {/* Bio and Badges Skeleton */}
        <Card className="mb-6"><CardContent className="p-6 space-y-3"><Skeleton className="h-4 w-full bg-gray-300" /><Skeleton className="h-4 w-5/6 bg-gray-300" /><div className="flex flex-wrap gap-2"><Skeleton className="h-6 w-24 bg-gray-300" /><Skeleton className="h-6 w-20 bg-gray-300" /></div></CardContent></Card>

        {/* Tabs Skeleton */}
        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <Skeleton className="h-10 w-full bg-gray-200" /> <Skeleton className="h-10 w-full bg-gray-200" /> <Skeleton className="h-10 w-full bg-gray-200" /> <Skeleton className="h-10 w-full bg-gray-200" />
          </TabsList>
          <TabsContent value="academic">
            <Card><CardHeader><Skeleton className="h-6 w-48 bg-gray-300" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-4 w-full bg-gray-300" /><Skeleton className="h-4 w-5/6 bg-gray-300" /></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EmptySection({ title, message, icon: Icon }: { title: string, message: string, icon: React.ElementType }) {
    return (
        <div className="text-center py-10 text-muted-foreground">
            <Icon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p>{message}</p>
        </div>
    );
}


export default function ProfilePage() {
  const params = useParams();
  const router = useRouter(); // For navigation, e.g., to edit profile page
  const username = params.username as string;

  // TODO: Get current authenticated user's username/ID to compare for 'isOwnProfile'
  // For now, this will be a placeholder. In a real app, this might come from a session context or another SWR hook.
  // const { data: sessionUser } = useSWR('/api/auth/session', fetcher);
  // const isOwnProfile = sessionUser?.username === username;
  const isOwnProfile = username === "currentuser"; // Placeholder - replace with actual logic

  const { data: profile, error, isLoading } = useSWR<UserProfile>(
    username ? `/api/users/${username}` : null,
    () => getUserProfile(username)
  );

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {error.message?.includes("not found") || error.message?.includes("404") ? "User Not Found" : "Failed to Load Profile"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message?.includes("not found") || error.message?.includes("404")
            ? "The profile you are looking for doesn't exist."
            : "We couldn't fetch the profile details. It might be a temporary issue."}
        </p>
        <Button onClick={() => router.push('/community/partners')}>Browse Users</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile Data Unavailable</h2>
        <p className="text-muted-foreground mb-6">User data could not be loaded.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U';
  const createdCourses = profile.createdCourses || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div
        className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.bannerImageUrl || '/placeholder-banner.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black/30" /> {/* Dark overlay for better text visibility */}
        <div className="absolute bottom-4 left-4 right-4 container mx-auto px-4">
          <div className="flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="text-3xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold drop-shadow-md">{profile.name}</h1>
              <p className="text-white/90 drop-shadow-sm">@{profile.username}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                {profile.location && (
                  <span className="flex items-center gap-1 drop-shadow-sm">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                {profile.joinDate && (
                  <span className="flex items-center gap-1 drop-shadow-sm">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                )}
              </div>
            </div>
            {/* TODO: Replace isOwnProfile with actual logic based on authenticated user */}
            {profile.isOwnProfile && (
                <Button variant="secondary" onClick={() => router.push('/settings/profile')}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        {profile.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{profile.stats.coursesCreated || 0}</div>
                <div className="text-sm text-muted-foreground">Courses Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(profile.stats.studentsEnrolled || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Students Enrolled</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{(profile.stats.totalRating || 0).toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(profile.stats.creditsEarned || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Credits Earned</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bio and Badges */}
        {(profile.bio || (profile.badges && profile.badges.length > 0)) && (
            <Card className="mb-6">
            <CardContent className="p-6">
                {profile.bio && <p className="text-muted-foreground mb-4">{profile.bio}</p>}
                {profile.badges && profile.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge) => (
                    <Badge key={badge.id} className={`${badge.color || 'bg-gray-500'} text-white`}>
                        {badge.icon && <span className="mr-1">{badge.icon}</span>}
                        {badge.name}
                    </Badge>
                    ))}
                </div>
                )}
            </CardContent>
            </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="courses">Courses ({createdCourses.length})</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
            <TabsTrigger value="badges">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            {createdCourses.length > 0 ? (
                <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                </div>
            ) : (
                <EmptySection title="No Courses Created Yet" message={`${profile.name} hasn't created any courses.`} icon={Library} />
            )}
          </TabsContent>

          <TabsContent value="academic">
            {profile.academic ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {profile.academic.fieldOfStudy && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Field of Study</h4>
                            <Badge variant="default" className="text-sm">{profile.academic.fieldOfStudy}</Badge>
                          </div>
                        )}
                        {profile.academic.levelOfStudy && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Level of Study</h4>
                            <p className="text-muted-foreground">{profile.academic.levelOfStudy}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {profile.academic.studiedSubjects && profile.academic.studiedSubjects.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Studied Subjects</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.academic.studiedSubjects.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{subject}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {profile.academic.interestedMajors && profile.academic.interestedMajors.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Interested Fields</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.academic.interestedMajors.map((field, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{field}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {profile.academic.academicProfile && (
                  <Card>
                    <CardHeader><CardTitle>Detailed Profile</CardTitle></CardHeader>
                    {/* Consider using a Markdown renderer here if academicProfile is Markdown */}
                    <CardContent className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                        {profile.academic.academicProfile}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
                <EmptySection title="No Academic Information" message={`${profile.name} has not provided academic details.`} icon={Award} />
            )}
          </TabsContent>

          <TabsContent value="socials">
            {profile.socials && profile.socials.length > 0 ? (
              <Card>
                <CardHeader><CardTitle>Social Media & Links</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.socials.map((social) => {
                      const Icon = socialIcons[social.platform.toLowerCase()] || socialIcons.default;
                      return (
                        <div key={social.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{social.platform}</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" /> Visit
                            </a>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
                <EmptySection title="No Social Links" message={`${profile.name} has not added any social links.`} icon={Link} />
            )}
          </TabsContent>

          <TabsContent value="badges">
            {profile.badges && profile.badges.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" /> Badges & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {profile.badges.map((badge) => (
                      <div key={badge.id} className={`text-center p-4 border rounded-lg ${badge.color || 'bg-card'} hover:shadow-md transition-shadow`}>
                        {badge.icon && badge.icon.startsWith('http') ?
                            <img src={badge.icon} alt={badge.name} className="w-10 h-10 mx-auto mb-2"/> :
                            <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                        }
                        <h3 className="font-semibold text-sm text-foreground">{badge.name}</h3>
                        {badge.earnedDate && <p className="text-xs text-muted-foreground mt-1">Earned {new Date(badge.earnedDate).toLocaleDateString()}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
                <EmptySection title="No Badges Yet" message={`Complete courses and challenges to earn badges!`} icon={Award} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
