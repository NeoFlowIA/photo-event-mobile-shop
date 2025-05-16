
import { useState } from 'react';
import { Camera, Upload, Search } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';

// Mock data for photo results
const mockPhotos = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE - 18/02/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
    price: 29.90
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE - 18/02/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
    price: 29.90
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541625810516-44f1ce894bcd',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE - 18/02/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
    price: 29.90
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1517649281203-dad836b4abe5',
    eventName: '6º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE - 18/02/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
    price: 29.90
  }
];

const SearchPhotos = () => {
  const [searchMethod, setSearchMethod] = useState<'selfie' | 'number' | null>(null);
  const [participantNumber, setParticipantNumber] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockPhotos | null>(null);
  
  const handleSelfieUpload = () => {
    // In a real app, this would handle the camera functionality
    console.log('Selfie upload triggered');
    toast.info('Carregando...');
    
    // Simulate search results after a delay
    setTimeout(() => {
      setSearchResults(mockPhotos);
      toast.success('Busca finalizada!');
    }, 1500);
  };
  
  const handleGalleryUpload = () => {
    // In a real app, this would open the file picker
    console.log('Gallery upload triggered');
    toast.info('Carregando...');
    
    // Simulate search results after a delay
    setTimeout(() => {
      setSearchResults(mockPhotos);
      toast.success('Busca finalizada!');
    }, 1500);
  };
  
  const handleNumberSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantNumber) return;
    
    toast.info('Buscando...');
    
    // Simulate search results after a delay
    setTimeout(() => {
      setSearchResults(mockPhotos);
      toast.success('Busca finalizada!');
    }, 1500);
  };
  
  const addToCart = (photoId: number) => {
    // In a real app, this would add to cart in state/context
    console.log('Added to cart:', photoId);
    toast.success('Foto adicionada ao carrinho!');
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Buscar Fotos" showBack={true} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {!searchMethod && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-center mb-8">Como deseja buscar suas fotos?</h2>
            
            <button 
              onClick={() => setSearchMethod('selfie')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Camera size={24} className="text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Busca por selfie</h3>
                  <p className="text-sm text-gray-600">Use uma foto sua para encontrar outras fotos</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={() => setSearchMethod('number')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Search size={24} className="text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Busca por número</h3>
                  <p className="text-sm text-gray-600">Digite o número do seu kit/participante</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {searchMethod === 'selfie' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-center mb-8">Buscar por selfie</h2>
            
            <div className="space-y-4">
              <button 
                onClick={handleSelfieUpload}
                className="w-full flex items-center justify-center gap-3 btn-primary"
              >
                <Camera size={20} />
                Tirar selfie
              </button>
              
              <div className="flex items-center justify-center">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="px-3 text-gray-500 text-sm">ou</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>
              
              <button 
                onClick={handleGalleryUpload}
                className="w-full flex items-center justify-center gap-3 btn-secondary"
              >
                <Upload size={20} />
                Enviar imagem
              </button>
            </div>
            
            <button 
              onClick={() => setSearchMethod(null)}
              className="w-full text-center text-primary underline mt-6"
            >
              Voltar
            </button>
          </div>
        )}
        
        {searchMethod === 'number' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-center mb-8">Buscar por número</h2>
            
            <form onSubmit={handleNumberSearch}>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="participantNumber">
                  Número do participante
                </label>
                <input
                  id="participantNumber"
                  type="text"
                  className="input-field"
                  placeholder="Digite o número do participante"
                  value={participantNumber}
                  onChange={(e) => setParticipantNumber(e.target.value)}
                />
                
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 btn-primary mt-4"
                >
                  <Search size={20} />
                  Buscar fotos
                </button>
              </div>
            </form>
            
            <button 
              onClick={() => setSearchMethod(null)}
              className="w-full text-center text-primary underline mt-6"
            >
              Voltar
            </button>
          </div>
        )}
        
        {searchResults && (
          <div className="mt-8 animate-fade-in">
            <h3 className="font-semibold text-lg mb-4">Resultados da busca</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((photo) => (
                <div key={photo.id} className="card card-hover">
                  <div className="relative">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.eventName} 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300x200?text=Foto+do+Evento";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2">
                      <p className="text-xs">{photo.eventName}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600">{photo.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold">R$ {photo.price.toFixed(2)}</p>
                      <button 
                        onClick={() => addToCart(photo.id)}
                        className="bg-primary text-white text-xs px-3 py-1 rounded-full"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default SearchPhotos;
