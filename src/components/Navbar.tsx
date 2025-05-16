
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Clock, Camera } from 'lucide-react';

interface NavbarProps {
  isPhotographer?: boolean;
}

const Navbar = ({ isPhotographer = false }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "text-gray-600";
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => navigate('/buscar-eventos')}
            className="flex flex-col items-center"
          >
            <Search size={20} className={isActive('/buscar-eventos')} />
            <span className={`text-xs mt-1 ${isActive('/buscar-eventos')}`}>Eventos</span>
          </button>
          
          <button 
            onClick={() => navigate('/buscar-fotos')}
            className="flex flex-col items-center"
          >
            <Search size={20} className={isActive('/buscar-fotos')} />
            <span className={`text-xs mt-1 ${isActive('/buscar-fotos')}`}>Fotos</span>
          </button>
          
          <button 
            onClick={() => navigate('/carrinho')}
            className="flex flex-col items-center"
          >
            <ShoppingCart size={20} className={isActive('/carrinho')} />
            <span className={`text-xs mt-1 ${isActive('/carrinho')}`}>Carrinho</span>
          </button>
          
          <button 
            onClick={() => navigate('/historico')}
            className="flex flex-col items-center"
          >
            <Clock size={20} className={isActive('/historico')} />
            <span className={`text-xs mt-1 ${isActive('/historico')}`}>Histórico</span>
          </button>
          
          {isPhotographer && (
            <button 
              onClick={() => navigate('/area-fotografo')}
              className="flex flex-col items-center"
            >
              <Camera size={20} className={isActive('/area-fotografo')} />
              <span className={`text-xs mt-1 ${isActive('/area-fotografo')}`}>Fotógrafo</span>
            </button>
          )}
          
          <button 
            onClick={() => navigate('/perfil')}
            className="flex flex-col items-center"
          >
            <User size={20} className={isActive('/perfil')} />
            <span className={`text-xs mt-1 ${isActive('/perfil')}`}>Perfil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
