import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainComponent from "./components/MainComponent";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MainComponent />
    </QueryClientProvider>
  );
}

export default App;
