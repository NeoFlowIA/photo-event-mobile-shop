
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShoppingCart, DollarSign, PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';

// Mock cart items data
const mockCartItems = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    price: 29.90
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    price: 29.90
  }
];

interface CartProps {
  userBalance?: number;
}

const Cart = ({ userBalance = 0 }: CartProps) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('Item removido do carrinho');
  };
  
  const processPayment = (method: 'credit' | 'cash') => {
    toast.info('Processando pagamento...');
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentSuccess(true);
      toast.success('Pagamento realizado com sucesso!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/historico');
      }, 3000);
    }, 1500);
  };
  
  if (isPaymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col pb-16">
        <Header title="Pagamento" showCart={false} showBack={false} />
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 animate-fade-in">
          <div className="bg-green-100 rounded-full p-6 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Compra realizada com sucesso!</h2>
          <p className="text-gray-600 text-center mb-8">Suas fotos já estão disponíveis para download</p>
          
          <button 
            onClick={() => navigate('/historico')}
            className="btn-primary w-full max-w-xs"
          >
            Ver histórico de compras
          </button>
          
          <p className="text-sm text-gray-500 mt-6">Redirecionando automaticamente...</p>
        </main>
        
        <Navbar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Carrinho" showCart={false} showBack={true} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione fotos para continuar</p>
            <button 
              onClick={() => navigate('/buscar-fotos')}
              className="btn-primary"
            >
              Buscar fotos
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Meu Carrinho</h2>
            
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex bg-white rounded-lg shadow-sm overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.eventName} 
                    className="w-24 h-24 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/100?text=Foto";
                    }}
                  />
                  <div className="flex flex-1 p-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{item.eventName}</h3>
                      <p className="text-primary font-bold mt-1">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remover item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              
              {userBalance > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Créditos disponíveis</span>
                  <span className="text-green-600">R$ {userBalance.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 font-bold">
                <span>Total a pagar</span>
                <span className="text-lg">R$ {Math.max(0, totalPrice - (userBalance || 0)).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <button 
                onClick={() => navigate('/adicionar-credito')}
                className="w-full flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors"
              >
                <PlusCircle size={20} />
                Adicionar crédito
              </button>
              
              <button 
                onClick={() => processPayment('credit')}
                className="w-full flex items-center justify-center gap-2 btn-primary"
                disabled={cartItems.length === 0}
              >
                <CreditCard size={20} />
                Pagar com crédito
              </button>
              
              <button 
                onClick={() => processPayment('cash')}
                className="w-full flex items-center justify-center gap-2 btn-secondary"
                disabled={cartItems.length === 0}
              >
                <DollarSign size={20} />
                Pagar em dinheiro
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Cart;
