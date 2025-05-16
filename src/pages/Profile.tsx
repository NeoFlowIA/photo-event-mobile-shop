
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, LogOut } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao.silva@example.com',
  balance: 120.50,
  isPhotographer: true
};

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState(mockUser);
  
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logout');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Perfil" showBack={false} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-gray-600 text-sm">Seu saldo</p>
              <p className="font-bold text-2xl">R$ {user.balance.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => navigate('/adicionar-credito')}
              className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
            >
              <CreditCard size={16} />
              Adicionar crédito
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/meus-dados')}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <span>Meus dados</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => navigate('/historico')}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <span>Histórico de compras</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {user.isPhotographer && (
            <button 
              onClick={() => navigate('/area-fotografo')}
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <span>Área do fotógrafo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <button 
            onClick={() => navigate('/ajuda')}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <span>Ajuda</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm text-red-500"
          >
            <span className="flex items-center gap-2">
              <LogOut size={18} />
              Sair
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </main>
      
      <Navbar isPhotographer={user.isPhotographer} />
    </div>
  );
};

export default Profile;
