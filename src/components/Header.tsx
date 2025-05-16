
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showCart?: boolean;
  showBack?: boolean;
}

const Header = ({ title, showCart = true, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 text-gray-600 hover:text-gray-900"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div className="flex items-center">
            <img src="/logo.png" alt="OlhaFoto Logo" className="h-8" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120x40?text=OlhaFoto";
            }} />
            {title && <h1 className="ml-4 text-lg font-medium">{title}</h1>}
          </div>
        </div>
        
        {showCart && (
          <button 
            onClick={() => navigate('/carrinho')} 
            className="relative text-gray-600 hover:text-gray-900"
            aria-label="Carrinho de compras"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
