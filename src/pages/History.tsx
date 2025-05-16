
import { Clock } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// Mock purchase history data
const mockHistory = [
  {
    id: 1,
    date: '15/05/2023',
    total: 59.80,
    items: [
      {
        id: 101,
        imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
        eventName: '6º NIGHT BIKE CRASA MOTOS',
      },
      {
        id: 102,
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
        eventName: '6º NIGHT BIKE CRASA MOTOS',
      }
    ]
  },
  {
    id: 2,
    date: '03/04/2023',
    total: 29.90,
    items: [
      {
        id: 201,
        imageUrl: 'https://images.unsplash.com/photo-1517649281203-dad836b4abe5',
        eventName: 'MARATONA DE FORTALEZA',
      }
    ]
  }
];

const History = () => {
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Histórico de Compras" showBack={false} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {mockHistory.length > 0 ? (
          <div className="space-y-6">
            {mockHistory.map(purchase => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Compra em {purchase.date}</span>
                    <span className="font-semibold">R$ {purchase.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">Fotos compradas:</h3>
                  <div className="space-y-3">
                    {purchase.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.eventName}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/100?text=Foto";
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{item.eventName}</p>
                        </div>
                        <a
                          href="#download"
                          className="text-primary font-medium text-sm"
                          download
                        >
                          Baixar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sem histórico de compras</h2>
            <p className="text-gray-600">Você ainda não comprou nenhuma foto</p>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default History;
