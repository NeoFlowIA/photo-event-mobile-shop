import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const PhotographerEvents = () => {
  const navigate = useNavigate();
  
  // Mock events data
  const [events] = useState([
    {
      id: '1',
      nome: 'Corrida de 5k Centro Histórico',
      data: '2024-03-15',
      local: 'Centro Histórico, Fortaleza - CE',
      categoria: 'Corrida de rua',
      participantes: 250,
      fotos: 340,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Triathlon Praia do Futuro',
      data: '2024-02-28',
      local: 'Praia do Futuro, Fortaleza - CE',
      categoria: 'Triathlon',
      participantes: 180,
      fotos: 520,
      status: 'concluido'
    },
    {
      id: '3',
      nome: 'Maratona da Cidade',
      data: '2024-04-20',
      local: 'Aterro da Praia de Iracema, Fortaleza - CE',
      categoria: 'Maratona',
      participantes: 500,
      fotos: 0,
      status: 'agendado'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'agendado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Em andamento';
      case 'concluido': return 'Concluído';
      case 'agendado': return 'Agendado';
      default: return status;
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/fotografo/eventos/${event.id}`)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.nome}</CardTitle>
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>{new Date(event.data).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  <span>{event.local}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={16} />
                  <span>{event.participantes} participantes</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm">
                    <span className="font-semibold">{event.fotos}</span> fotos enviadas
                  </p>
                </div>

                <Badge variant="outline">{event.categoria}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu primeiro evento.</p>
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