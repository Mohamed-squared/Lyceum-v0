"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, TrendingUp, Award, Settings, Eye, Edit, Trash2, GripVertical } from "lucide-react"

// Mock analytics data
const enrollmentData = [
  { month: "Jan", enrollments: 45 },
  { month: "Feb", enrollments: 67 },
  { month: "Mar", enrollments: 89 },
  { month: "Apr", enrollments: 123 },
  { month: "May", enrollments: 156 },
  { month: "Jun", enrollments: 189 },
]

const progressData = [
  { week: "Week 1", completion: 85 },
  { week: "Week 2", completion: 78 },
  { week: "Week 3", completion: 72 },
  { week: "Week 4", completion: 68 },
  { week: "Week 5", completion: 65 },
  { week: "Week 6", completion: 62 },
]

const mockChapters = [
  { id: "1", title: "Introduction to Quantum Mechanics", status: "published", students: 189, avgScore: 85 },
  { id: "2", title: "Wave-Particle Duality", status: "published", students: 167, avgScore: 78 },
  { id: "3", title: "Uncertainty Principle", status: "draft", students: 0, avgScore: 0 },
  { id: "4", title: "Schrödinger Equation", status: "draft", students: 0, avgScore: 0 },
]

export default function CourseManagePage() {
  const params = useParams()
  const [isPrivate, setIsPrivate] = useState(false)
  const [coursePassword, setCoursePassword] = useState("")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground mt-2">Quantum Mechanics Fundamentals</p>
        </div>
        <Badge variant="secondary">189 Students Enrolled</Badge>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                    <p className="text-2xl font-bold">189</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                    <p className="text-2xl font-bold">68%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">42%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrollments" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="completion" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChapters.map((chapter) => (
                    <TableRow key={chapter.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </TableCell>
                      <TableCell className="font-medium">{chapter.title}</TableCell>
                      <TableCell>
                        <Badge variant={chapter.status === "published" ? "default" : "secondary"}>
                          {chapter.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{chapter.students}</TableCell>
                      <TableCell>{chapter.avgScore > 0 ? `${chapter.avgScore}%` : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Access Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-course">Private Course</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this course private and require a password to enroll
                  </p>
                </div>
                <Switch id="private-course" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              {isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="course-password">Course Password</Label>
                  <Input
                    id="course-password"
                    type="password"
                    placeholder="Enter course password"
                    value={coursePassword}
                    onChange={(e) => setCoursePassword(e.target.value)}
                  />
                </div>
              )}

              <div className="pt-4">
                <Button>Save Access Settings</Button>
              </div>
            </CardContent>
          </Card>

          {isPrivate && (
            <Card>
              <CardHeader>
                <CardTitle>Invited Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Enter email address" />
                    <Button>Send Invitation</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    No invitations sent yet. Add email addresses to invite users to this private course.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
