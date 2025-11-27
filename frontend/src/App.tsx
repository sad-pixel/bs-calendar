import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function App() {
  const [count, setCount] = useState(0);

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

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Counter Example</CardTitle>
          <CardDescription>
            Click the button to increment the counter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setCount((count) => count + 1)}
            className="w-full"
          >
            count is {count}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </CardContent>
        <CardFooter>
          <Badge
            variant="outline"
            className="w-full text-center justify-center"
          >
            Click on the Vite and React logos to learn more
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
