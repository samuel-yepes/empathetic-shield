import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const PathSelector = lazy(() => import('./pages/PathSelector'));
const AggressorRoute = lazy(() => import('./pages/AggressorRoute'));
const VictimRoute = lazy(() => import('./pages/VictimRoute'));
const WitnessRoute = lazy(() => import('./pages/WitnessRoute'));
const EmergencyDirectory = lazy(() => import('./pages/EmergencyDirectory'));

const queryClient = new QueryClient();

function Loading() {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-trust/30 border-t-trust rounded-full animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/caminos" element={<PathSelector />} />
          <Route path="/ruta/agresor" element={<AggressorRoute />} />
          <Route path="/ruta/victima" element={<VictimRoute />} />
          <Route path="/ruta/testigo" element={<WitnessRoute />} />
          <Route path="/emergencia" element={<EmergencyDirectory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="grain-overlay">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
