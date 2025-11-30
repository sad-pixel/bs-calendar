import { useState } from "react";
import { useGetCoursesApiCoursesGet } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, Filter, Calendar, Share } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

export function CoursesPage() {
  const { data: courses, isLoading, error } = useGetCoursesApiCoursesGet();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [syncStatusFilter, setSyncStatusFilter] = useState<
    "synced" | "not_synced" | null
  >(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl text-red-600">Error loading courses</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Get unique levels for filter dropdown
  const levels = courses
    ? [...new Set(courses.map((course) => course.level))]
    : [];

  // Filter courses
  const filteredCourses =
    courses?.filter(
      (course) =>
        (selectedLevels.length === 0 ||
          selectedLevels.includes(course.level)) &&
        (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (syncStatusFilter === null ||
          (syncStatusFilter === "synced" && course.last_sync_at) ||
          (syncStatusFilter === "not_synced" && !course.last_sync_at)),
    ) || [];

  // Define the level order for sorting
  const levelOrder = {
    Foundation: 1,
    Diploma: 2,
    Degree: 3,
  };

  // Sort courses by status (synced first), then level (Foundation, Diploma, Degree), then by id
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    // Sort by sync status (synced courses first)
    if (!!a.last_sync_at !== !!b.last_sync_at) {
      return a.last_sync_at ? -1 : 1;
    }

    // Sort by level (Foundation, Diploma, Degree)
    const levelA = levelOrder[a.level as keyof typeof levelOrder] || 999;
    const levelB = levelOrder[b.level as keyof typeof levelOrder] || 999;
    if (levelA !== levelB) {
      return levelA - levelB;
    }

    // Sort by id
    return a.id.localeCompare(b.id);
  });

  // Toggle level selection
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
      </div>

      <div className="space-y-8">
        <div>
          <div className="border rounded-md">
            <div className="p-4 border-b flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Level:</span>
                  <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Filter className="h-4 w-4 mr-2" />
                        {selectedLevels.length > 0
                          ? `${selectedLevels.length} selected`
                          : "All Levels"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {levels.map((level) => (
                        <DropdownMenuCheckboxItem
                          key={level}
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                        >
                          {level}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sync Status:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Filter className="h-4 w-4 mr-2" />
                        {syncStatusFilter === "synced"
                          ? "Synced"
                          : syncStatusFilter === "not_synced"
                            ? "Not Synced"
                            : "Any Status"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuCheckboxItem
                        checked={syncStatusFilter === null}
                        onCheckedChange={() => setSyncStatusFilter(null)}
                      >
                        Any Status
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={syncStatusFilter === "synced"}
                        onCheckedChange={() => setSyncStatusFilter("synced")}
                      >
                        Synced
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={syncStatusFilter === "not_synced"}
                        onCheckedChange={() =>
                          setSyncStatusFilter("not_synced")
                        }
                      >
                        Not Synced
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            {sortedCourses.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  No courses match your filters
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Sync Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCourses.map((course) => (
                    <TableRow
                      key={course.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>{course.id}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <Badge>{course.level}</Badge>
                      </TableCell>
                      <TableCell>
                        {course.last_sync_at ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Synced
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700"
                          >
                            Not Synced
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {course.last_sync_at && course.calendar_available ? (
                          <div className="flex space-x-2">
                            <Link
                              href={`/calendar?selectedCourseIds=${course.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Calendar className="h-4 w-4 mr-2" /> View
                                Events
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle subscribe action
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Subscribe
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle adding calendar functionality
                            }}
                          >
                            <Share className="h-4 w-4 mr-2" /> Contribute
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
