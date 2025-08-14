
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import SearchPhotos from "./pages/SearchPhotos";
import SearchEvents from "./pages/SearchEvents";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AddCredit from "./pages/AddCredit";
import Portfolios from "./pages/Portfolios";
import PhotographerPortfolio from "./pages/PhotographerPortfolio";
import PhotographerEvents from "./pages/PhotographerEvents";
import PhotographerEventCreate from "./pages/PhotographerEventCreate";
import PhotographerEventDetails from "./pages/PhotographerEventDetails";
import PhotographerCollaborations from "./pages/PhotographerCollaborations";
import PhotographerRoute from "./components/PhotographerRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle route-based scroll and modal triggers
const RouteHandler = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Handle /?to=contratar - scroll to photographers section
    const toParam = searchParams.get('to');
    if (toParam === 'contratar' && window.location.pathname === '/') {
      setTimeout(() => {
        const element = document.querySelector('#encontrar-fotografo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Handle /contratar route - scroll to photographers section
    if (window.location.pathname === '/contratar') {
      setTimeout(() => {
        const element = document.querySelector('#encontrar-fotografo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Handle /fotografos route - scroll to photographers section
    if (window.location.pathname === '/fotografos') {
      setTimeout(() => {
        const element = document.querySelector('#encontrar-fotografo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Focus first photographer card
          const firstCard = element.querySelector('button');
          if (firstCard) {
            firstCard.focus();
          }
        }
      }, 100);
    }
    
    // Handle /?login=1 parameter - dispatch custom event to open auth modal
    const loginParam = searchParams.get('login');
    if (loginParam === '1' && window.location.pathname === '/') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAuthModal'));
      }, 100);
    }
  }, [searchParams]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteHandler />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/contratar" element={<Landing />} />
          <Route path="/fotografos" element={<Landing />} />
          <Route path="/home" element={<Home userName="João" isPhotographer={true} />} />
          <Route path="/buscar-fotos" element={<SearchPhotos />} />
          <Route path="/buscar-eventos" element={<SearchEvents />} />
          <Route path="/carrinho" element={<Cart userBalance={25} />} />
          <Route path="/historico" element={<History />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/adicionar-credito" element={<AddCredit />} />
          <Route path="/portfolios" element={<Portfolios />} />
          
          {/* Photographer Routes */}
          <Route path="/fotografo/portfolio" element={
            <PhotographerRoute>
              <PhotographerPortfolio />
            </PhotographerRoute>
          } />
          <Route path="/fotografo/eventos" element={
            <PhotographerRoute>
              <PhotographerEvents />
            </PhotographerRoute>
          } />
          <Route path="/fotografo/eventos/novo" element={
            <PhotographerRoute>
              <PhotographerEventCreate />
            </PhotographerRoute>
          } />
          <Route path="/fotografo/eventos/:id" element={
            <PhotographerRoute>
              <PhotographerEventDetails />
            </PhotographerRoute>
          } />
          <Route path="/fotografo/colaboracoes" element={
            <PhotographerRoute>
              <PhotographerCollaborations />
            </PhotographerRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
