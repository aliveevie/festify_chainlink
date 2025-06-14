import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from '@avalabs/builderkit';
import { avalanche, avalancheFuji } from '@wagmi/core/chains';
import { echo } from './chains/definitions/echo';
import { dispatch } from './chains/definitions/dispatch';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from './components/Header';

// Configure chains
const chains = [avalanche, avalancheFuji, echo, dispatch];
const queryClient = new QueryClient();

const App = () => {
  return (
    <Web3Provider
      appName="Festify"
      projectId={import.meta.env.VITE_PROJECT_ID}
      chains={chains}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/features" element={<div className="container mx-auto px-4 py-8">Features Page</div>} />
                  <Route path="/events" element={<div className="container mx-auto px-4 py-8">Events Page</div>} />
                  <Route path="/create" element={<div className="container mx-auto px-4 py-8">Create Event Page</div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </Web3Provider>
  );
};

export default App;
