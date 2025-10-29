import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Camera, Search, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout, isPhotographer, isUser, isAuthenticated, pendingAction, isAdmin } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8 text-[var(--brand-secondary)] sm:px-16 lg:px-24">
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/f596c292-f0ef-4243-9d2e-647a4765cfbf.png"
              alt="OlhaFoto Logo"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/120x40/E03A3A/FFFFFF?text=OlhaFoto";
              }}
            />
          </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button
                onClick={scrollToPhotographers}
                className="transition-colors hover:text-[var(--brand-primary)]"
              >
                Contratar fotógrafo
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <nav className="hidden sm:flex items-center gap-4">
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--brand-primary)]"
                      aria-label="Painel administrativo"
                    >
                      <ShieldCheck size={16} />
                      <span className="hidden md:inline">Painel admin</span>
                    </button>
                  )}
                  {isPhotographer ? (
                    <>
                      <button
                        onClick={() => navigate('/fotografo/portfolio')}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--brand-primary)]"
                        aria-label="Meu Portfólio"
                      >
                        <Camera size={16} />
                        <span className="hidden md:inline">Meu Portfólio</span>
                      </button>

                      <button
                        onClick={() => navigate('/fotografo/eventos')}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--brand-primary)]"
                        aria-label="Meus Eventos"
                      >
                        <Search size={16} />
                        <span className="hidden md:inline">Meus Eventos</span>
                      </button>
                    </>
                  ) : isUser ? (
                    <>
                      <button
                        onClick={() => navigate('/carrinho')}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--brand-primary)]"
                        aria-label="Carrinho"
                      >
                        <ShoppingCart size={16} />
                        <span className="hidden md:inline">Carrinho</span>
                      </button>

                      <button
                        onClick={() => navigate('/minhas-fotos')}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--brand-primary)]"
                        aria-label="Minhas fotos"
                      >
                        <Camera size={16} />
                        <span className="hidden md:inline">Minhas fotos</span>
                      </button>
                    </>
                  ) : null}
                </nav>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-[var(--brand-secondary)]">
                      <User size={16} />
                      <span className="hidden md:inline">{user?.displayName}</span>
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Painel administrativo
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      Meu Perfil
                    </DropdownMenuItem>
                    {isPhotographer && (
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
                className="text-sm font-medium text-[var(--brand-secondary)] hover:text-[var(--brand-primary)]"
                disabled={pendingAction === 'login' || pendingAction === 'register'}
              >
                Entrar / Cadastrar-se
              </Button>
            )}
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