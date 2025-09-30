import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Upload, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { deleteEvent, EventDetail, getEventById } from '@/services/eventService';

const statusMap = {
  active: { label: 'Em andamento', className: 'bg-green-100 text-green-800' },
  scheduled: { label: 'Agendado', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Concluído', className: 'bg-blue-100 text-blue-800' },
  draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
  archived: { label: 'Arquivado', className: 'bg-gray-100 text-gray-800' },
} as const;

const PhotographerEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [bulkPrice, setBulkPrice] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/fotografo/eventos');
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getEventById(id, accessToken, controller.signal)
      .then((data) => {
        if (!data) {
          setError('Evento não encontrado.');
        }
        setEvent(data);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Erro ao carregar evento', err);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o evento.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [id, accessToken, navigate]);

  const statusInfo = useMemo(() => {
    if (!event?.status) return statusMap.draft;
    return statusMap[event.status as keyof typeof statusMap] ?? statusMap.draft;
  }, [event?.status]);

  const formatDate = (value?: string | null) => {
    if (!value) return 'Data a definir';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Data a definir';
    return parsed.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (value?: number | null) => {
    if (!value) return 'Valor a definir';
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const locationLabel = useMemo(() => {
    if (!event) return 'Local a definir';
    const parts = [event.city, event.state].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Local a definir';
  }, [event]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadedImages((prev) => [...prev, ...files]);
    toast({
      title: 'Imagens carregadas!',
      description: `${files.length} imagem(ns) adicionada(s) com sucesso.`,
    });
  };

  const handleBulkPriceChange = () => {
    const value = parseFloat(bulkPrice);
    if (Number.isNaN(value)) {
      toast({
        title: 'Valor inválido',
        description: 'Informe um valor numérico válido.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Preço base atualizado!',
      description: `Aplicaríamos o novo valor de R$ ${value.toFixed(2)} para todas as fotos publicadas.`,
    });
    setBulkPrice('');
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    if (!accessToken) {
      toast({
        title: 'Sessão expirada',
        description: 'Faça login novamente para gerenciar seus eventos.',
        variant: 'destructive',
      });
      return;
    }

    const confirmation = window.confirm('Tem certeza de que deseja excluir este evento? Esta ação não pode ser desfeita.');
    if (!confirmation) return;

    try {
      setIsDeleting(true);
      await deleteEvent(event.id, accessToken);
      toast({
        title: 'Evento excluído',
        description: 'O evento foi removido da sua lista.',
      });
      navigate('/fotografo/eventos');
    } catch (err) {
      console.error('Erro ao excluir evento', err);
      toast({
        title: 'Erro ao excluir evento',
        description: err instanceof Error ? err.message : 'Não foi possível remover o evento.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate('/fotografo/eventos')}>Voltar para meus eventos</Button>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={event.title ?? 'Detalhes do evento'} showCart={false} showBack={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground">{event.description || 'Este evento ainda não possui descrição.'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 size={16} className="mr-2" />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-muted-foreground" />
              <span>{formatDate(event.start_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <span>{locationLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={16} className="text-muted-foreground" />
              <span>{formatPrice(event.base_price_cents)}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="precos">Preços</TabsTrigger>
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do evento</Label>
                    <Input value={event.title ?? ''} readOnly />
                  </div>
                  <div>
                    <Label>Data de início</Label>
                    <Input value={formatDate(event.start_at)} readOnly />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <Input value={event.city ?? 'Não informado'} readOnly />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Input value={event.state ?? 'Não informado'} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={event.description ?? ''} readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={20} />
                  Upload em Lote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulk-upload">Selecionar imagens</Label>
                  <Input
                    id="bulk-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecione múltiplas imagens para upload em lote. O processamento será realizado pelo fluxo de ingestão configurado no Hasura.
                  </p>
                </div>

                {uploadedImages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Imagens carregadas ({uploadedImages.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedImages.slice(0, 8).map((file, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{file.name.substring(0, 10)}...</span>
                        </div>
                      ))}
                    </div>
                    {uploadedImages.length > 8 && (
                      <p className="text-sm text-muted-foreground mt-2">+{uploadedImages.length - 8} imagens adicionais</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="precos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Definir Preços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Utilize esta seção para aplicar rapidamente um novo preço base a todas as fotos do evento por meio de mutações GraphQL em lote.
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Novo preço base"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="md:flex-1"
                  />
                  <Button type="button" onClick={handleBulkPriceChange}>Aplicar em lote</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A ação acionará a mutation <code>update_event_photos</code> filtrando por <code>event_id</code> no Hasura.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colaboradores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Colaboradores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Convide outros fotógrafos para colaborar neste evento. Use a mutation <code>insert_event_collaborators_one</code> para registrar convites e <code>delete_event_collaborators_by_pk</code> para remoções.
                </p>
                <Button type="button" variant="outline" onClick={() => toast({ title: 'Convite enviado!', description: 'Integração de convites será implementada utilizando Hasura Actions.' })}>
                  Criar convite
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estatisticas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dashboards com vendas, downloads e comissões podem ser montados a partir das views <code>photographer_metrics_daily</code> e agregações em <code>event_photos</code> e <code>orders</code>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PhotographerEventDetails;
