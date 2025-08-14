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

const PhotographerEventCreate = () => {
  const navigate = useNavigate();
  const [eventForm, setEventForm] = useState({
    nome: '',
    descricao: '',
    data: '',
    local: '',
    categoria: '',
    precoBase: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventForm.nome || !eventForm.data || !eventForm.local || !eventForm.categoria) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Mock creation - generate random ID
    const eventId = Math.random().toString(36).substr(2, 9);
    
    toast({
      title: "Evento criado (mock)!",
      description: `O evento "${eventForm.nome}" foi criado com sucesso.`,
    });
    
    // Redirect to event details
    navigate(`/fotografo/eventos/${eventId}`);
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
                <Button type="submit" className="flex-1">
                  Criar Evento
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