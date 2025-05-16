
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Clock, Camera, CameraIcon } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

interface HomeProps {
  userName?: string;
  isPhotographer?: boolean;
}

const Home = ({ userName = "Usuário", isPhotographer = false }: HomeProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Olá, {userName}!</h1>
          <p className="text-gray-600">O que você deseja fazer hoje?</p>
        </section>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/buscar-eventos')}
            className="nav-item"
          >
            <Search size={32} className="text-primary" />
            <span className="font-medium mt-2">Buscar eventos</span>
          </button>
          
          <button 
            onClick={() => navigate('/buscar-fotos')}
            className="nav-item"
          >
            <CameraIcon size={32} className="text-primary" />
            <span className="font-medium mt-2">Buscar fotos</span>
          </button>
          
          <button 
            onClick={() => navigate('/carrinho')}
            className="nav-item"
          >
            <ShoppingCart size={32} className="text-primary" />
            <span className="font-medium mt-2">Carrinho</span>
          </button>
          
          <button 
            onClick={() => navigate('/historico')}
            className="nav-item"
          >
            <Clock size={32} className="text-primary" />
            <span className="font-medium mt-2">Histórico de compras</span>
          </button>
          
          {isPhotographer && (
            <button 
              onClick={() => navigate('/area-fotografo')}
              className="nav-item col-span-2"
            >
              <Camera size={32} className="text-primary" />
              <span className="font-medium mt-2">Área do Fotógrafo</span>
            </button>
          )}
        </div>
      </main>
      
      <Navbar isPhotographer={isPhotographer} />
    </div>
  );
};

export default Home;
