import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { EventSummary, listPhotographerEvents } from '@/services/eventService';

const PhotographerEvents = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !accessToken) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    listPhotographerEvents(user.id, accessToken, controller.signal)
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erro ao carregar eventos do fotógrafo', err);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar seus eventos.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [user?.id, accessToken]);

  const statusBadges = useMemo(
    () => ({
      active: { color: 'bg-green-100 text-green-800', label: 'Em andamento' },
      scheduled: { color: 'bg-yellow-100 text-yellow-800', label: 'Agendado' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Concluído' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Arquivado' },
    } as const),
    []
  );

  const formatDate = (value?: string | null) => {
    if (!value) return 'Data a definir';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Data a definir';
    return parsed.toLocaleDateString('pt-BR');
  };

  const formatLocation = (event: EventSummary) => {
    if (event.city && event.state) return `${event.city} ${event.state}`.trim();
    return event.city || event.state || 'Local a definir';
  };

  const formatPrice = (value?: number | null) => {
    if (!value) return 'Valor a definir';
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Meus Eventos" showCart={false} showBack={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meus Eventos</h1>
          <Button onClick={() => navigate('/fotografo/eventos/novo')} className="flex items-center gap-2">
            <Plus size={20} />
            Criar Evento
          </Button>
        </div>

        {isLoading && <p className="text-center text-muted-foreground py-12">Carregando seus eventos...</p>}

        {error && !isLoading && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const statusKey = event.status ?? 'draft';
              const statusInfo = statusBadges[statusKey as keyof typeof statusBadges] ?? statusBadges.draft;

              return (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/fotografo/eventos/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      <span>{formatDate(event.start_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={16} />
                      <span>{formatLocation(event)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign size={16} />
                      <span>{formatPrice(event.base_price_cents)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro evento e publique suas fotos.
            </p>
            <Button onClick={() => navigate('/fotografo/eventos/novo')} className="flex items-center gap-2">
              <Plus size={20} />
              Criar Primeiro Evento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotographerEvents;