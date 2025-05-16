
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import Header from '../components/Header';
import { toast } from 'sonner';

const AddCredit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const presetAmounts = [50, 100, 150, 200];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, informe um valor válido');
      return;
    }
    
    setLoading(true);
    toast.info('Processando...');
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.success('Crédito adicionado com sucesso!');
      navigate('/carrinho');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Adicionar Crédito" showCart={false} showBack={true} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-6">Quanto você deseja adicionar?</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Valor em reais (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <input
                  id="amount"
                  type="number"
                  className="input-field pl-10"
                  placeholder="0,00"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-700 mb-2">Valores sugeridos:</p>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`py-2 rounded-md border ${amount === value.toString() ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => setAmount(value.toString())}
                  >
                    R$ {value.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 btn-primary"
              disabled={loading}
            >
              <CreditCard size={20} />
              {loading ? 'Processando...' : 'Continuar para pagamento'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCredit;
