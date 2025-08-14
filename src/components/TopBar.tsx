import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Camera, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="OlhaFoto Logo" 
                className="h-8" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/120x40/E03A3A/FFFFFF?text=OlhaFoto";
                }} 
              />
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/contratar-fotografo')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Contratar fotógrafo
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-4">
              <button 
                onClick={() => navigate('/carrinho')}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                aria-label="Carrinho"
              >
                <ShoppingCart size={16} />
                <span className="hidden md:inline">Carrinho</span>
              </button>
              
              <button 
                onClick={() => navigate('/minhas-fotos')}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                aria-label="Minhas fotos"
              >
                <Camera size={16} />
                <span className="hidden md:inline">Minhas fotos</span>
              </button>
            </nav>
            
            <Button 
              onClick={() => navigate('/explorar')}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explorar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;