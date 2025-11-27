import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetCoursesCoursesGet,
  useGetEventsEventsGet,
} from "@/lib/api/endpoints";

function MainComponent() {
  const [selectedCourse, setSelectedCourse] = useState(0);

  const { data: courses, isLoading } = useGetCoursesCoursesGet();
  const { data: events } = useGetEventsEventsGet(
    {
      cid: [selectedCourse],
      start_at: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      end_at: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split("T")[0],
    },
    {
      query: {
        enabled: !!selectedCourse,
      },
    },
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center space-x-4 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Vite + React</h1>

      <div className="flex flex-row space-x-4">
        <Card className="w-1/4">
          <CardHeader>
            <CardTitle>Courses (Selected: {selectedCourse})</CardTitle>
            <CardDescription>These are the available courses:</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && courses && Array.isArray(courses) ? (
              courses.map((course) => (
                <Button
                  key={course.id}
                  className="w-full mb-2"
                  variant="outline"
                  onClick={() => setSelectedCourse(course.id)}
                >
                  {course.id} - {course.name}
                </Button>
              ))
            ) : (
              <p>No courses available.</p>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card className="w-3/4">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>Events for the selected course:</CardDescription>
          </CardHeader>
          <CardContent>
            {events && Array.isArray(events) && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border p-3 rounded-md">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      Start: {new Date(event.start_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      End:{" "}
                      {event.end_at &&
                        new Date(event.end_at).toLocaleDateString()}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">
                {selectedCourse
                  ? "No events found for this course."
                  : "Select a course to view events."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MainComponent;
