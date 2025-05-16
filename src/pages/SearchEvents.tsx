
import { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// Mock events data
const mockEvents = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
    name: '6º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE',
    date: '18/02/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    name: '7º NIGHT BIKE CRASA MOTOS',
    location: 'Fortaleza CE',
    date: '25/03/2023',
    photographer: 'Crasa Motos Yamaha Matriz',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541625810516-44f1ce894bcd',
    name: 'CORRIDA DA PRIMAVERA',
    location: 'Fortaleza CE',
    date: '15/04/2023',
    photographer: 'Foto Esportes',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1517649281203-dad836b4abe5',
    name: 'MARATONA DE FORTALEZA',
    location: 'Fortaleza CE',
    date: '22/05/2023',
    photographer: 'Atleta Fotografia',
  }
];

const SearchEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState(mockEvents);
  const [selectedCity, setSelectedCity] = useState('');
  
  const cities = ['Fortaleza CE', 'Recife PE', 'Salvador BA', 'São Paulo SP'];
  
  const filteredEvents = events.filter(event => {
    return (
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCity === '' || event.location === selectedCity)
    );
  });
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Buscar Eventos" showBack={true} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Pesquisar evento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
            <button
              className={`px-4 py-1 rounded-full whitespace-nowrap text-sm ${selectedCity === '' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedCity('')}
            >
              Todos
            </button>
            {cities.map(city => (
              <button
                key={city}
                className={`px-4 py-1 rounded-full whitespace-nowrap text-sm ${selectedCity === city ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="card card-hover">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x200?text=Evento";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.location} - {event.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.photographer}</p>
                  <button className="w-full btn-primary mt-3">Ver fotos</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Nenhum evento encontrado</p>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default SearchEvents;
