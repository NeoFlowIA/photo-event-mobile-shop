import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Camera, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSessionMock } from '@/hooks/useSessionMock';
import AuthModal from './AuthModal';

const TopBar = () => {
  const navigate = useNavigate();
  const { session, logout } = useSessionMock();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Listen for custom event to open auth modal
  useEffect(() => {
    const handleOpenAuthModal = () => setShowAuthModal(true);
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, []);

  const scrollToPhotographers = () => {
    const element = document.querySelector('#encontrar-fotografo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
                onClick={scrollToPhotographers}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Contratar fotógrafo
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {session.loggedIn ? (
              <>
                <nav className="hidden sm:flex items-center gap-4">
                  {session.tipo === 'fotografo' ? (
                    <>
                      <button 
                        onClick={() => navigate('/fotografo/portfolio')}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        aria-label="Meu Portfólio"
                      >
                        <Camera size={16} />
                        <span className="hidden md:inline">Meu Portfólio</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate('/fotografo/eventos')}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        aria-label="Meus Eventos"
                      >
                        <Search size={16} />
                        <span className="hidden md:inline">Meus Eventos</span>
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </nav>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User size={16} />
                      <span className="hidden md:inline">{session.nome}</span>
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      Meu Perfil
                    </DropdownMenuItem>
                    {session.tipo === 'fotografo' && (
                      <DropdownMenuItem onClick={() => navigate('/fotografo/eventos/novo')}>
                        Criar Evento
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
              >
                Entrar / Cadastrar-se
              </Button>
            )}
          </div>
        </div>
      </div>
      
      
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
};

export default TopBar;