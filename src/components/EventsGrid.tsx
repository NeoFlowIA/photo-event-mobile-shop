import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building2 } from 'lucide-react';
import eventsData from '@/data/events.json';

interface Event {
  id: string;
  title: string;
  city: string;
  date: string;
  venue: string;
  handle: string;
  image: string;
}

interface EventsGridProps {
  searchQuery?: string;
  cityFilter?: string;
  sortBy?: string;
}

const EventsGrid = ({ searchQuery = '', cityFilter = '', sortBy = 'date-desc' }: EventsGridProps) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(eventsData);

  useEffect(() => {
    let filtered = [...eventsData];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by city
    if (cityFilter && cityFilter !== 'all') {
      const cityMap: { [key: string]: string } = {
        'fortaleza': 'Fortaleza - CE',
        'sao-paulo': 'São Paulo - SP',
        'rio-de-janeiro': 'Rio de Janeiro - RJ',
        'salvador': 'Salvador - BA',
        'belo-horizonte': 'Belo Horizonte - MG',
        'brasilia': 'Brasília - DF',
        'recife': 'Recife - PE',
        'niteroi': 'Niterói - RJ',
        'campos-do-jordao': 'Campos do Jordão - SP'
      };
      
      const cityName = cityMap[cityFilter];
      if (cityName) {
        filtered = filtered.filter(event => event.city === cityName);
      }
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredEvents(filtered);
  }, [searchQuery, cityFilter, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl border shadow-sm">
              <div className="h-48 relative overflow-hidden rounded-t-xl">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&crop=faces`;
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-md font-medium">
                    {event.handle}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Ver todos os eventos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsGrid;