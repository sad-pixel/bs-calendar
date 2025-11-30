import { useSearchParams } from "wouter";
import { useState, useEffect } from "react";
import {
  useGetCoursesApiCoursesGet,
  useGetEventsApiEventsGet,
} from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Parse the selected course IDs from the URL
  const selectedCourseIds = searchParams.get("selectedCourseIds")
    ? searchParams.get("selectedCourseIds")!.split(",").filter(Boolean)
    : [];

  // Fetch courses
  const { data: courses = [], isLoading: isCoursesLoading } =
    useGetCoursesApiCoursesGet();

  // Calculate start and end dates for the current month
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  // Fetch events based on selected courses and current month/year
  const { data: events = [], isLoading: isEventsLoading } =
    useGetEventsApiEventsGet(
      {
        cid: selectedCourseIds.length > 0 ? selectedCourseIds : [],
        start_at: startDate.toISOString().split("T")[0],
        end_at: endDate.toISOString().split("T")[0],
      },
      { query: { enabled: selectedCourseIds.length > 0 } },
    );

  // Get selected courses details
  const selectedCourses = courses.filter((course) =>
    selectedCourseIds.includes(course.id),
  );

  // Filter courses in modal based on search term
  const filteredCoursesForModal = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(modalSearchTerm.toLowerCase()),
  );

  // Handle course selection
  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      const newSelectedCourses = selectedCourseIds.filter(
        (id) => id !== courseId,
      );
      setSearchParams({
        selectedCourseIds: newSelectedCourses.join(","),
      });
    } else {
      const newSelectedCourses = [...selectedCourseIds, courseId];
      setSearchParams({
        selectedCourseIds: newSelectedCourses.join(","),
      });
    }
  };

  // Remove a course from the selected list
  const removeCourse = (courseId: string) => {
    const newSelectedCourses = selectedCourseIds.filter(
      (id) => id !== courseId,
    );
    setSearchParams({
      selectedCourseIds: newSelectedCourses.join(","),
    });
  };

  // Navigation functions for the calendar
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleMonthChange = (value: string) => {
    setCurrentMonth(parseInt(value, 10));
  };

  const handleYearChange = (value: string) => {
    setCurrentYear(parseInt(value, 10));
  };

  // Generate years array for the select (5 years in the past and 5 years in the future)
  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - 5 + i,
  );

  // Month names for the select
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendar Events</h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Selected Calendars</h2>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add Course</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="relative mb-4">
                      <Input
                        placeholder="Search courses..."
                        value={modalSearchTerm}
                        onChange={(e) => setModalSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    {isCoursesLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <div className="w-full overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap">
                                  Course Code
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                  Course Name
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                  Level
                                </TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredCoursesForModal
                                .filter((course) => course.calendar_available)
                                .map((course) => (
                                  <TableRow key={course.id}>
                                    <TableCell className="whitespace-nowrap">
                                      {course.id}
                                    </TableCell>
                                    <TableCell className="max-w-[180px] truncate">
                                      {course.name}
                                    </TableCell>
                                    <TableCell>
                                      <Badge>{course.level}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          toggleCourseSelection(course.id)
                                        }
                                      >
                                        {selectedCourseIds.includes(
                                          course.id,
                                        ) ? (
                                          <>
                                            <X className="h-4 w-4 mr-1" />{" "}
                                            Remove
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="h-4 w-4 mr-1" />{" "}
                                            Add
                                          </>
                                        )}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              {filteredCoursesForModal.length === 0 ||
                              filteredCoursesForModal.filter(
                                (course) => course.calendar_available,
                              ).length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="text-center py-6"
                                  >
                                    No courses found with available calendars
                                  </TableCell>
                                </TableRow>
                              ) : null}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isCoursesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {selectedCourses.length === 0 ? (
                  <div className="text-center p-4 text-muted-foreground">
                    No calendars selected. Add a calendar to view events.
                  </div>
                ) : (
                  selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{course.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(course.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-3">
          <div className="border rounded-md p-4">
            {/* Date navigation controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={currentMonth.toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={currentYear.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isEventsLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                No events to display. Please select at least one course.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.calendar_id}</TableCell>
                        <TableCell>
                          {new Date(event.start_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {event.end_at
                            ? new Date(event.end_at).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
