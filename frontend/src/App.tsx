import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from '@avalabs/builderkit';
import { avalanche, avalancheFuji } from '@wagmi/core/chains';
import { echo } from './chains/definitions/echo';
import { dispatch } from './chains/definitions/dispatch';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Web3Provider>
  );
};

export default App;
