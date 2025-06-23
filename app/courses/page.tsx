"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getAllCourses } from "@/lib/api"
import { CourseCard } from "@/components/CourseCard" // Assuming CourseCard is adapted for live data
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// TODO: Replace mock data for filters with API-driven data or a more robust solution.
import { subjects, languages, languageLabels, type Course } from "@/lib/mock-data"

// Define a type for the API response if it's not just Course[]
// For example, if it includes pagination or total counts:
// interface CoursesApiResponse {
//   courses: Course[];
//   totalCount: number;
//   // ... other metadata
// }
// For now, assuming getAllCourses returns Course[] directly based on its current usage.


function CoursesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-10 w-36" /> {/* Create Course Button */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Skeleton */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" /> {/* Search input */}
            <Skeleton className="h-10 w-full" /> {/* Subject select */}
            <Skeleton className="h-10 w-full" /> {/* Language select */}
            <Skeleton className="h-10 w-full" /> {/* Pricing select */}
          </div>
        </div>

        {/* Results Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-48" /> {/* Showing X of Y courses */}
        </div>

        {/* Course Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex items-center justify-between mt-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedPricing, setSelectedPricing] = useState("all")

  // Prepare filters for the API call
  const filters = useMemo(() => {
    const activeFilters: Record<string, string> = {}
    if (searchTerm) activeFilters.search = searchTerm
    if (selectedSubject !== "all") activeFilters.subject = selectedSubject
    if (selectedLanguage !== "all") activeFilters.language = selectedLanguage
    if (selectedPricing !== "all") activeFilters.pricing = selectedPricing
    return activeFilters
  }, [searchTerm, selectedSubject, selectedLanguage, selectedPricing])

  // SWR key will change when filters change, triggering a re-fetch.
  // The fetcher function `getAllCourses` will receive the filters object.
  const { data: courses, error, isLoading } = useSWR<Course[]>(
    ['/api/courses', filters], // Key is an array: path and parameters
    ([_url, queryParams]) => getAllCourses(queryParams) // Fetcher receives the key parts
  );

  if (isLoading) {
    return <CoursesPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Courses</h2>
        <p className="text-gray-600 mb-6">
          We couldn't fetch the courses. It might be a temporary issue. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mb-4">Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // courses could be undefined if SWR is fetching for the first time and no initialData is provided
  // or if the API successfully returns an empty list (which is valid).
  const displayedCourses = courses || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
              <p className="text-gray-600 mt-1">Discover courses created by educators worldwide</p>
            </div>
            <Button asChild>
              <Link href="/create-course">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Courses</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* TODO: Populate these selects with data from an API or a more robust source than mock-data */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {languageLabels[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPricing} onValueChange={setSelectedPricing}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {/* The API should ideally return the total number of courses before filtering for a more accurate message.
                For now, using the length of the returned (potentially filtered) courses. */}
            Showing {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''}
            {Object.keys(filters).length > 0 && " (filtered)"}
          </p>
        </div>

        {/* Course Grid */}
        {displayedCourses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              // Assuming CourseCard is compatible with the live Course type
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {displayedCourses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
              {Object.keys(filters).length === 0 && " Or perhaps, create the first one!"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/create-course">Create Course</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
