import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminCoursesLoading() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <Skeleton className="h-9 w-72 mb-2" /> {/* Title: Course Management */}
        <Skeleton className="h-5 w-80" /> {/* Subtitle */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-10 w-full sm:w-72" /> {/* Search Input Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" /> {/* Filter Dropdown Skeleton (e.g., Subject) */}
              <Skeleton className="h-10 w-32" /> {/* Filter Dropdown Skeleton (e.g., Status) */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead> {/* Course Title */}
                <TableHead><Skeleton className="h-5 w-20" /></TableHead> {/* Instructor */}
                <TableHead><Skeleton className="h-5 w-20" /></TableHead> {/* Subject */}
                <TableHead><Skeleton className="h-5 w-16" /></TableHead> {/* Price */}
                <TableHead><Skeleton className="h-5 w-16" /></TableHead> {/* Status */}
                <TableHead><Skeleton className="h-5 w-24" /></TableHead> {/* Created At */}
                <TableHead><Skeleton className="h-5 w-20" /></TableHead> {/* Actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="space-x-2">
                    <Skeleton className="h-8 w-8 inline-block" />
                    <Skeleton className="h-8 w-8 inline-block" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Skeleton */}
          <div className="flex justify-end items-center gap-2 mt-6">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
