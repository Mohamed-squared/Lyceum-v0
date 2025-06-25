"use client"

import { useState, useMemo, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr"; // globalMutate for optimistic updates
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getAdminCourses, updateCourseStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Removed CardTitle as it's not used directly here for main title
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast"; // Assuming you have a toast component

// Define AdminCourse structure
interface AdminCourse {
  id: string;
  title: string;
  instructorName: string; // Or an instructor object: { id: string, name: string }
  subject: string;
  price: string | number; // e.g., "Free" or 29.99
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Potentially other fields like enrollmentCount, averageRating
}

interface AdminCoursesApiResponse {
  courses: AdminCourse[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

const COURSE_STATUSES = ["pending", "approved", "rejected"];
// TODO: Subjects should ideally be fetched from an API or a shared config
const COURSE_SUBJECTS_MOCK = ["Mathematics", "Science", "History", "Programming", "Arts", "Business"];
const ITEMS_PER_PAGE = 10;

const AdminCoursesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get("subject") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (subjectFilter !== "all") params.set("subject", subjectFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", currentPage.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    return params;
  }, [searchTerm, subjectFilter, statusFilter, currentPage]);

  const swrKey = useMemo(() => ["/api/admin/courses", queryParams.toString()], [queryParams]);

  useEffect(() => {
    router.replace(`${pathname}?${queryParams.toString()}`, { scroll: false });
  }, [queryParams, pathname, router]);

  const { data, error, isLoading, mutate } = useSWR<AdminCoursesApiResponse>(
    swrKey,
    ([_url, queryString]) => getAdminCourses(Object.fromEntries(new URLSearchParams(queryString))),
    { keepPreviousData: true }
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
     if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
        const newParams = new URLSearchParams(queryParams);
        newParams.set("page", newPage.toString());
        // No need to call router.push here as useEffect already handles it
        // Manually trigger a re-fetch might not be necessary if SWR key changes enough
        // but for page changes, explicitly updating the URL via router and letting useEffect handle it is cleaner.
        // For immediate feedback, one could update a local page state and let SWR use that in its key.
        // However, relying on URL params for page state is generally good for bookmarking/sharing.
        // The current setup with useEffect should handle re-fetching correctly when queryParams (and thus swrKey) changes.
         router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  };

  const handleUpdateStatus = async (courseId: string, newStatus: AdminCourse["status"]) => {
    try {
      // Optimistic UI update
      globalMutate(swrKey, (currentData: AdminCoursesApiResponse | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          courses: currentData.courses.map(course =>
            course.id === courseId ? { ...course, status: newStatus } : course
          ),
        };
      }, false); // false means don't revalidate yet

      await updateCourseStatus(courseId, newStatus);
      toast({ title: "Success", description: `Course status updated to ${newStatus}.` });
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to update status: ${err.message}`,
        variant: "destructive",
      });
      // Revert optimistic update on error by revalidating
    } finally {
        // Revalidate to get the latest state from server
        mutate();
    }
  };

  if (error && !data) {
    return (
      <div className="p-6 bg-background min-h-screen flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load courses</h2>
        <p className="text-muted-foreground mb-4">Error: {error.message}</p>
        <Button onClick={() => mutate()}>Try Again</Button>
      </div>
    );
  }

  const courses = data?.courses || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
        <p className="text-muted-foreground mt-2">
          Review, approve, and manage platform courses. Displaying {courses.length} of {totalCount} courses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, instructor..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {COURSE_SUBJECTS_MOCK.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {COURSE_STATUSES.map(status => <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && courses.length === 0 ? (
            <p>Loading courses...</p> // Should be replaced by the skeleton loader
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Courses Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.instructorName}</TableCell>
                      <TableCell>{course.subject}</TableCell>
                      <TableCell>{typeof course.price === 'number' ? `$${course.price.toFixed(2)}` : course.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === 'approved' ? 'default' :
                            course.status === 'pending' ? 'secondary' : 'outline'
                          }
                          className={`capitalize ${
                            course.status === 'approved' ? 'bg-green-500 text-white' :
                            course.status === 'pending' ? 'bg-yellow-500 text-black' :
                            course.status === 'rejected' ? 'bg-red-500 text-white' : ''
                          }`}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/courses/${course.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Course
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {course.status !== 'approved' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'approved')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Approve
                              </DropdownMenuItem>
                            )}
                            {course.status !== 'rejected' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'rejected')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject
                              </DropdownMenuItem>
                            )}
                            {course.status !== 'pending' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(course.id, 'pending')}>
                                <Clock className="mr-2 h-4 w-4 text-yellow-600" /> Mark as Pending
                                </DropdownMenuItem>
                            )}
                             {/* Add other actions like "Edit Course Details", "Feature Course" etc. */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" /> First
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    Last <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoursesPage;
