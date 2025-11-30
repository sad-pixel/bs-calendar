import { Navbar } from "./Navbar";
import { Route } from "wouter";
import { CoursesPage } from "./pages/CoursesPage";
import { CalendarPage } from "./pages/CalendarPage";
function MainComponent() {
  return (
    <div className="flex flex-col">
      <header className="flex-1 container mx-auto px-4 py-2">
        <Navbar />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div>
          <Route path="/">Home Page Content</Route>
          <Route path="/about">About Page Content</Route>
          <Route path="/courses" component={CoursesPage} />
          <Route path="/calendar" component={CalendarPage} />
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://ishan.page"
              className="underline hover:text-primary"
            >
              Ishan Das Sharma
            </a>
            . Licensed under{" "}
            <a
              href="https://opensource.org/licenses/MIT"
              className="underline hover:text-primary"
            >
              MIT License
            </a>
            .
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            This is an unofficial project and is not affiliated with, endorsed
            by, or connected to the Indian Institute of Technology Madras (IITM)
            or the IITM B.S. Degree program in any capacity.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
