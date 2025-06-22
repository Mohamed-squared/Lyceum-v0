"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CourseCard } from "@/components/CourseCard"
import { mockUser, mockCreatedCourses } from "@/lib/mock-data"
import { MapPin, Calendar, Award, ExternalLink, Github, Twitter, Linkedin } from "lucide-react"

const mockProfileData = {
  ...mockUser,
  username: "johndoe",
  bio: "Passionate educator and researcher in quantum physics and machine learning. Love sharing knowledge and helping students understand complex concepts.",
  location: "San Francisco, CA",
  joinDate: "2023-01-15",
  bannerImage: "/placeholder.svg?height=200&width=800",
  // Add academic information
  academic: {
    fieldOfStudy: "Quantum Physics",
    levelOfStudy: "Ph.D. Student",
    studiedSubjects: ["Quantum Mechanics", "Statistical Physics", "Linear Algebra", "Calculus", "Computer Science"],
    interestedMajors: ["Machine Learning", "Quantum Computing", "Educational Technology", "Data Science"],
  },
  badges: [
    { name: "Top Educator", color: "bg-yellow-500", icon: "🏆" },
    { name: "Course Creator", color: "bg-blue-500", icon: "📚" },
    { name: "Community Helper", color: "bg-green-500", icon: "🤝" },
    { name: "Early Adopter", color: "bg-purple-500", icon: "🚀" },
  ],
  academicProfile: `## Academic Background

I hold a Ph.D. in Quantum Physics from MIT and have been teaching for over 8 years. My research focuses on quantum computing applications and educational technology.

### Research Interests
- Quantum Computing
- Machine Learning Applications in Physics
- Educational Technology
- Online Learning Methodologies

### Publications
- "Quantum Algorithms for Educational Applications" (2023)
- "Interactive Learning in Physics Education" (2022)
- "AI-Assisted Course Generation" (2024)`,
  socials: [
    { platform: "GitHub", url: "https://github.com/johndoe", icon: Github },
    { platform: "Twitter", url: "https://twitter.com/johndoe", icon: Twitter },
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: Linkedin },
  ],
  stats: {
    coursesCreated: 12,
    studentsEnrolled: 2450,
    totalRating: 4.8,
    creditsEarned: 15600,
  },
}

export default function ProfilePage() {
  const params = useParams()
  const [isOwnProfile] = useState(params.username === "johndoe") // Mock check

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarFallback className="text-2xl font-bold">{mockProfileData.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold">{mockProfileData.name}</h1>
              <p className="text-white/90">@{mockProfileData.username}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mockProfileData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(mockProfileData.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            {isOwnProfile && <Button variant="secondary">Edit Profile</Button>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockProfileData.stats.coursesCreated}</div>
              <div className="text-sm text-muted-foreground">Courses Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockProfileData.stats.studentsEnrolled.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Students Enrolled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{mockProfileData.stats.totalRating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockProfileData.stats.creditsEarned.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Credits Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Bio and Badges */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{mockProfileData.bio}</p>
            <div className="flex flex-wrap gap-2">
              {mockProfileData.badges.map((badge, index) => (
                <Badge key={index} className={`${badge.color} text-white`}>
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="academic">Academic Profile</TabsTrigger>
            <TabsTrigger value="socials">Social Links</TabsTrigger>
            <TabsTrigger value="courses">Courses Created</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="academic">
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
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Field of Study</h4>
                        <Badge variant="default" className="text-sm">
                          {mockProfileData.academic.fieldOfStudy}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Level of Study</h4>
                        <p className="text-gray-600">{mockProfileData.academic.levelOfStudy}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Studied Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockProfileData.academic.studiedSubjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Interested Fields</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockProfileData.academic.interestedMajors.map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Profile</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{mockProfileData.academicProfile}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="socials">
            <Card>
              <CardHeader>
                <CardTitle>Social Media & Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProfileData.socials.map((social, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <social.icon className="w-5 h-5" />
                        <span className="font-medium">{social.platform}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Created Courses</h3>
                <Badge variant="secondary">{mockCreatedCourses.length} courses</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCreatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Badges & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockProfileData.badges && mockProfileData.badges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockProfileData.badges.map((badge, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h3 className="font-semibold text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Earned {new Date().toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No badges earned yet</p>
                    <p className="text-sm">Complete courses and challenges to earn badges</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
