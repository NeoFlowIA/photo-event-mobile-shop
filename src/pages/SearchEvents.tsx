
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { EventSummary, searchEvents } from '@/services/eventService';

const SearchEvents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    searchEvents(
      {
        searchTerm: debouncedSearch || undefined,
        city: selectedCity || undefined,
        limit: 30,
      },
      controller.signal
    )
      .then((response) => {
        setEvents(response);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Falha ao carregar eventos', err);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os eventos.');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSearch, selectedCity]);

  const cities = useMemo(() => {
    const allCities = events
      .map((event) => {
        const locationParts = [event.city, event.state].filter(Boolean);
        return locationParts.join(' ').trim();
      })
      .filter(Boolean);
    return Array.from(new Set(allCities)).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const hasEvents = events.length > 0;

  const formatDate = (date?: string | null) => {
    if (!date) return 'Data a definir';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Data a definir';
    return parsed.toLocaleDateString('pt-BR');
  };

  const getLocationLabel = (event: EventSummary) => {
    if (event.city && event.state) return `${event.city} ${event.state}`.trim();
    return event.city || event.state || 'Local a definir';
  };
  
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
        
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Carregando eventos...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {!isLoading && !error && hasEvents ? (
          <div className="grid grid-cols-1 gap-4">
            {events.map(event => (
              <div
                key={event.id}
                className="card card-hover"
                onClick={() => navigate(`/eventos/${event.slug ?? event.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/eventos/${event.slug ?? event.id}`);
                  }
                }}
              >
                <img
                  src={event.cover_url || 'https://via.placeholder.com/400x200?text=Evento'}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x200?text=Evento";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getLocationLabel(event)} - {formatDate(event.start_at)}
                  </p>
                  <button
                    type="button"
                    className="w-full btn-primary mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/eventos/${event.slug ?? event.id}`);
                    }}
                  >
                    Ver fotos
                  </button>
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
