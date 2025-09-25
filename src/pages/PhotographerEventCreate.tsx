import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { createEvent } from '@/services/eventService';

const PhotographerEventCreate = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [eventForm, setEventForm] = useState({
    nome: '',
    descricao: '',
    data: '',
    local: '',
    categoria: '',
    precoBase: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Corrida de rua',
    'Triathlon',
    'Ciclismo',
    'Maratona',
    'Natação',
    'Show',
    'Festival',
    'Evento corporativo',
    'Outro'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventForm.nome || !eventForm.data || !eventForm.local || !eventForm.categoria) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id || !accessToken) {
      toast({
        title: 'Sessão expirada',
        description: 'Faça login novamente para criar um evento.',
        variant: 'destructive',
      });
      return;
    }

    const parseLocation = (value: string) => {
      if (!value) return { city: null, state: null };
      const sanitized = value.replace(/,/g, '-');
      const [cityPart, statePart] = sanitized.split('-').map((part) => part.trim());
      return {
        city: cityPart || null,
        state: statePart || null,
      };
    };

    try {
      setIsSubmitting(true);
      const { city, state } = parseLocation(eventForm.local);
      const startAt = new Date(`${eventForm.data}T00:00:00`);
      const basePriceCents = eventForm.precoBase ? Math.round(parseFloat(eventForm.precoBase) * 100) : null;

      const created = await createEvent(
        {
          title: eventForm.nome,
          description: eventForm.descricao || null,
          start_at: Number.isNaN(startAt.getTime()) ? new Date().toISOString() : startAt.toISOString(),
          city,
          state,
          venue_name: city,
          base_price_cents: basePriceCents,
          owner_id: user.id,
          status: 'draft',
          visibility: 'public',
        },
        accessToken
      );

      toast({
        title: 'Evento criado!',
        description: `O evento "${created.title}" foi criado com sucesso.`,
      });

      navigate(`/fotografo/eventos/${created.id}`);
    } catch (error) {
      console.error('Erro ao criar evento', error);
      toast({
        title: 'Erro ao criar evento',
        description: error instanceof Error ? error.message : 'Não foi possível criar o evento.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Criar Evento" showCart={false} showBack={true} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nome">Nome do evento *</Label>
                <Input
                  id="nome"
                  value={eventForm.nome}
                  onChange={(e) => setEventForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex.: Corrida de 5k Centro Histórico"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={eventForm.descricao}
                  onChange={(e) => setEventForm(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o evento, percurso, características especiais..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data do evento *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={eventForm.data}
                    onChange={(e) => setEventForm(prev => ({ ...prev, data: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={eventForm.categoria} onValueChange={(value) => setEventForm(prev => ({ ...prev, categoria: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="local">Local *</Label>
                <Input
                  id="local"
                  value={eventForm.local}
                  onChange={(e) => setEventForm(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Ex.: Centro Histórico, Fortaleza - CE"
                  required
                />
              </div>

              <div>
                <Label htmlFor="precoBase">Preço base (R$)</Label>
                <Input
                  id="precoBase"
                  type="number"
                  min="0"
                  step="0.01"
                  value={eventForm.precoBase}
                  onChange={(e) => setEventForm(prev => ({ ...prev, precoBase: e.target.value }))}
                  placeholder="Ex.: 15.00"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Evento'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/fotografo/eventos')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotographerEventCreate;