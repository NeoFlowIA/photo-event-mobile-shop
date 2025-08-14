
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import SearchPhotos from "./pages/SearchPhotos";
import SearchEvents from "./pages/SearchEvents";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AddCredit from "./pages/AddCredit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home userName="João" isPhotographer={true} />} />
          <Route path="/buscar-fotos" element={<SearchPhotos />} />
          <Route path="/buscar-eventos" element={<SearchEvents />} />
          <Route path="/carrinho" element={<Cart userBalance={25} />} />
          <Route path="/historico" element={<History />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/adicionar-credito" element={<AddCredit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
