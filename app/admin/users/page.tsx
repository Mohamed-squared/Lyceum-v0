"use client"

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getAdminUsers } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define AdminUser structure based on expected API response
interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: "student" | "instructor" | "admin" | "moderator"; // Example roles
  status: "active" | "suspended" | "pending_verification"; // Example statuses
  joinDate: string; // ISO date string
  lastLogin?: string; // ISO date string
  coursesCreated?: number;
  coursesEnrolled?: number;
}

interface AdminUsersApiResponse {
  users: AdminUser[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

const USER_ROLES = ["student", "instructor", "admin", "moderator"];
const USER_STATUSES = ["active", "suspended", "pending_verification"];
const ITEMS_PER_PAGE = 10;

const AdminUsersPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [initialParamsLoaded, setInitialParamsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize state from URL params after component mounts
  useEffect(() => {
    if (!initialParamsLoaded) {
      setSearchTerm(searchParams.get("search") || "");
      setRoleFilter(searchParams.get("role") || "all");
      setStatusFilter(searchParams.get("status") || "all");
      setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
      setInitialParamsLoaded(true);
    }
  }, [searchParams, initialParamsLoaded]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", currentPage.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    return params;
  }, [searchTerm, roleFilter, statusFilter, currentPage]);

  useEffect(() => {
    if (initialParamsLoaded) {
      router.replace(`${pathname}?${queryParams.toString()}`, { scroll: false });
    }
  }, [queryParams, pathname, router, initialParamsLoaded]);

  const { data, error, isLoading, mutate } = useSWR<AdminUsersApiResponse>(
    initialParamsLoaded ? ["/api/admin/users", queryParams.toString()] : null, // SWR key includes query string for re-fetching
    ([_url, queryString]) => getAdminUsers(Object.fromEntries(new URLSearchParams(queryString))),
    { keepPreviousData: true }
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Placeholder actions - these would trigger API calls
  const handleEditUser = (userId: string) => console.log("Edit user:", userId);
  const handleDeleteUser = (userId: string) => console.log("Delete user:", userId);
  const handleToggleUserStatus = (userId: string, currentStatus: string) => console.log("Toggle status for user:", userId, "current:", currentStatus);

  // Show loading state until params are loaded
  if (!initialParamsLoaded) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !data) { // Show error only if there's no stale data to display
    return (
      <div className="p-6 bg-background min-h-screen flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load users</h2>
        <p className="text-muted-foreground mb-4">Error: {error.message}</p>
        <Button onClick={() => mutate()}>Try Again</Button>
      </div>
    );
  }
  // isLoading is true on initial load or if revalidating after error without data
  // if (isLoading && !data) return <AdminUsersLoading />; // Re-enable if AdminUsersLoading is defined

  const users = data?.users || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Search, filter, and manage platform users. Currently displaying {users.length} of {totalCount} users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {USER_ROLES.map(role => <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {USER_STATUSES.map(status => <SelectItem key={status} value={status} className="capitalize">{status.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && users.length === 0 ? ( // Show skeleton if loading and no users yet
             <p>Loading users...</p> // Replace with actual skeleton from loading.tsx if merged
          ) : users.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Users Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">{user.role}</Badge></TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'outline' : 'secondary'}
                          className={`capitalize ${user.status === 'active' ? 'bg-green-500 text-white' : user.status === 'suspended' ? 'bg-yellow-500 text-black' : ''}`}
                        >
                          {user.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/profile/${user.username}`)}>View Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>Edit User</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.status)} className={user.status === 'suspended' ? 'text-green-600 focus:text-green-700' : 'text-yellow-600 focus:text-yellow-700'}>
                              {user.status === 'suspended' ? <UserCheck className="mr-2 h-4 w-4" /> : <UserX className="mr-2 h-4 w-4" />}
                              {user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" /> First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
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

export default AdminUsersPage;