import { useMemo, useState } from 'react';
import {
  adminManagedEvents,
  adminPendingEvents as initialPending,
  AdminManagedEvent,
  PendingEventStatus,
} from '@/data/adminMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatPercent } from './utils';
import { CalendarClock, FileWarning, Info, Plus, DollarSign } from 'lucide-react';

const pendingStatusConfig: Record<PendingEventStatus, { label: string; badge: string }> = {
  analysis: { label: 'Em análise', badge: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Aprovado', badge: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Recusado', badge: 'bg-rose-100 text-rose-600' },
  needs_revision: { label: 'Solicitar ajustes', badge: 'bg-sky-100 text-sky-700' },
};

const eventStatusLabels: Record<AdminManagedEvent['status'], { label: string; badge: string }> = {
  draft: { label: 'Rascunho', badge: 'bg-slate-100 text-slate-600' },
  pending: { label: 'Pendente', badge: 'bg-amber-100 text-amber-700' },
  published: { label: 'Publicado', badge: 'bg-primary/10 text-primary' },
  running: { label: 'Em andamento', badge: 'bg-emerald-100 text-emerald-700' },
  archived: { label: 'Arquivado', badge: 'bg-slate-200 text-slate-600' },
};

const Events = () => {
  const [tab, setTab] = useState<'approval' | 'catalog' | 'requested'>('approval');
  const [search, setSearch] = useState('');
  const [pendingEvents, setPendingEvents] = useState(initialPending);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminManagedEvent['status']>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reportDrawerOpen, setReportDrawerOpen] = useState(false);
  const [selectedEventForReport, setSelectedEventForReport] = useState<AdminManagedEvent | null>(null);
  
  // Mock requested events data
  const requestedEvents = [
    { id: 'req1', data: '2025-11-15', cliente: 'João Silva', evento: 'Corrida Noturna', status: 'pendente', valor: 250000 },
    { id: 'req2', data: '2025-11-20', cliente: 'Maria Santos', evento: 'Triatlo Urbano', status: 'aprovado', valor: 450000 },
  ];

  const filteredPending = useMemo(() => {
    if (!search) return pendingEvents;
    return pendingEvents.filter((event) =>
      `${event.title} ${event.photographer} ${event.location}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pendingEvents, search]);

  const filteredCatalog = useMemo(() => {
    return adminManagedEvents.filter((event) => {
      const matchSearch = search
        ? `${event.title} ${event.photographer} ${event.location}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStatus = statusFilter === 'all' ? true : event.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const maxVacancy = parseInt(formData.get('maxVacancy') as string);
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (maxVacancy <= 0) {
      toast({ title: 'Erro', description: 'Informe um valor maior que zero para vagas máximas.', variant: 'destructive' });
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast({ title: 'Erro', description: 'O término deve ser posterior ao início.', variant: 'destructive' });
      return;
    }

    toast({ title: 'Evento criado com sucesso.', description: `${title} foi adicionado ao catálogo.` });
    setCreateDialogOpen(false);
  };

  const updatePendingStatus = (eventId: string, nextStatus: PendingEventStatus) => {
    setPendingEvents((current) =>
      current.map((event) => (event.id === eventId ? { ...event, status: nextStatus } : event)),
    );

    const eventData = pendingEvents.find((event) => event.id === eventId);
    if (!eventData) return;

    const actionLabel =
      nextStatus === 'approved'
        ? 'Evento aprovado'
        : nextStatus === 'rejected'
        ? 'Evento recusado'
        : 'Ajustes solicitados';

    toast({
      title: actionLabel,
      description:
        nextStatus === 'approved'
          ? `${eventData.title} será publicado automaticamente conforme a configuração padrão.`
          : nextStatus === 'rejected'
          ? `${eventData.title} foi marcado como recusado. O fotógrafo será notificado.`
          : `${eventData.title} foi marcado para ajustes. O fotógrafo receberá a lista de pendências.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-transparent bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Gestão de eventos</CardTitle>
              <p className="text-sm text-slate-500">
                Aprove eventos submetidos e acompanhe performance comercial de cada edição publicada.
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar novo evento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" required placeholder="Nome do evento" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="startDate">Data e hora de início</Label>
                      <Input id="startDate" name="startDate" type="datetime-local" required />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Data e hora de término</Label>
                      <Input id="endDate" name="endDate" type="datetime-local" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Local</Label>
                    <Input id="location" name="location" required placeholder="Endereço do evento" />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" placeholder="Detalhes do evento" />
                  </div>
                  <div>
                    <Label htmlFor="maxVacancy">Vagas máximas</Label>
                    <Input id="maxVacancy" name="maxVacancy" type="number" min="1" required placeholder="100" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">Criar evento</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-2/3">
            <Input
              placeholder="Buscar por evento, fotógrafo ou cidade"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <CalendarClock size={16} />
            <span>{pendingEvents.filter((event) => event.status === 'analysis').length} eventos aguardando análise</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(value) => setTab(value as 'approval' | 'catalog' | 'requested')}>
        <TabsList className="bg-white">
          <TabsTrigger value="approval">Fila de aprovação</TabsTrigger>
          <TabsTrigger value="catalog">Eventos publicados</TabsTrigger>
          <TabsTrigger value="requested">Eventos solicitados</TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="mt-6 space-y-4">
          {filteredPending.length === 0 ? (
            <Card className="border-dashed border-slate-200 bg-white text-center shadow-sm">
              <CardContent className="py-16">
                <Info className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-4 text-sm font-medium text-slate-600">Nenhum evento aguardando aprovação.</p>
                <p className="mt-1 text-xs text-slate-500">Todos os envios recentes já foram revisados pela curadoria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPending.map((event) => {
              const status = pendingStatusConfig[event.status];
              return (
                <Card key={event.id} className="border-transparent bg-white shadow-sm">
                  <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-800">{event.title}</CardTitle>
                      <p className="text-xs text-slate-500">
                        {event.category} • {event.location} • início {formatDateTime(event.startAt)}
                      </p>
                    </div>
                    <Badge className={status.badge}>{status.label}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-600">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Fotógrafo</p>
                        <p className="text-slate-900">{event.photographer}</p>
                        <p className="text-xs text-slate-500">{event.photographerHandle}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Volume estimado</p>
                        <p className="text-slate-900">{event.expectedPhotos.toLocaleString('pt-BR')} fotos</p>
                        <p className="text-xs text-slate-500">Fee sugerido {formatCurrency(event.suggestedPhotoFeeCents)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Risco</p>
                        <p className="text-slate-900">Score {event.riskScore}</p>
                        <p className="text-xs text-slate-500">Taxa da plataforma {event.platformFeePercent}%</p>
                      </div>
                    </div>
                    {event.notes && <p className="text-xs text-slate-500">Observações: {event.notes}</p>}
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Button
                        className="md:flex-1"
                        variant="default"
                        onClick={() => updatePendingStatus(event.id, 'approved')}
                      >
                        Aprovar evento
                      </Button>
                      <Button
                        className="md:flex-1"
                        variant="outline"
                        onClick={() => updatePendingStatus(event.id, 'needs_revision')}
                      >
                        Solicitar ajustes
                      </Button>
                      <Button
                        className="md:flex-1"
                        variant="ghost"
                        onClick={() => updatePendingStatus(event.id, 'rejected')}
                      >
                        Recusar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="catalog" className="mt-6 space-y-4">
          <Card className="border-transparent bg-white shadow-sm">
            <CardContent className="flex flex-wrap items-center gap-2">
              {(['all', 'running', 'published', 'pending', 'archived'] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? 'Todos' : eventStatusLabels[status].label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {filteredCatalog.map((event) => {
            const status = eventStatusLabels[event.status];
            return (
              <Card key={event.id} className="border-transparent bg-white shadow-sm">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-800">{event.title}</CardTitle>
                    <p className="text-xs text-slate-500">
                      {event.category} • {event.location} • início {formatDateTime(event.startAt)}
                    </p>
                  </div>
                  <Badge className={status.badge}>{status.label}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 text-sm text-slate-600 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Fotógrafo responsável</p>
                      <p className="text-slate-900">{event.photographer}</p>
                      <p className="text-xs text-slate-500">Taxa da plataforma {event.platformFeePercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Vagas</p>
                      <p className="text-slate-900">{event.soldPhotos}/{event.totalPhotos}</p>
                      <Progress 
                        value={(event.soldPhotos / event.totalPhotos) * 100} 
                        className="mt-2 h-2"
                      />
                      <p className="mt-1 text-xs">
                        <Badge className={
                          event.soldPhotos / event.totalPhotos >= 1 ? 'bg-slate-100 text-slate-600' :
                          event.soldPhotos / event.totalPhotos >= 0.8 ? 'bg-amber-100 text-amber-700' :
                          'bg-primary/10 text-primary'
                        }>
                          {event.soldPhotos / event.totalPhotos >= 1 ? 'Lotado' :
                           event.soldPhotos / event.totalPhotos >= 0.8 ? 'Quase lotado' : 'Normal'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Receita total</p>
                      <p className="text-slate-900">{formatCurrency(event.revenueCents)}</p>
                      <p className="text-xs text-slate-500">Conversão {formatPercent(event.conversionRate)}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Processamento IA</p>
                      <p className="text-slate-900">{event.aiReviewStatus === 'completed' ? 'Concluído' : event.aiReviewStatus === 'blocked' ? 'Bloqueado' : 'Pendente'}</p>
                      {event.flagged && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-rose-500">
                          <FileWarning size={14} />
                          Revisão manual necessária
                        </p>
                      )}
                    </div>
                  </div>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedEventForReport(event)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Relatório Financeiro
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh]">
                      <DrawerHeader>
                        <DrawerTitle>Relatório Financeiro - {event.title}</DrawerTitle>
                      </DrawerHeader>
                      <div className="overflow-auto p-6">
                        <div className="grid gap-4 sm:grid-cols-4">
                          <Card>
                            <CardContent className="pt-6">
                              <p className="text-xs font-semibold uppercase text-slate-500">Receita Bruta</p>
                              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(event.revenueCents)}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <p className="text-xs font-semibold uppercase text-slate-500">Taxas/Encargos</p>
                              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(Math.floor(event.revenueCents * 0.05))}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <p className="text-xs font-semibold uppercase text-slate-500">Comissões</p>
                              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(Math.floor(event.revenueCents * event.platformFeePercent / 100))}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <p className="text-xs font-semibold uppercase text-slate-500">Receita Líquida</p>
                              <p className="mt-2 text-2xl font-bold text-emerald-600">
                                {formatCurrency(Math.floor(event.revenueCents * (1 - 0.05 - event.platformFeePercent / 100)))}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-base">Transações</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b text-left">
                                    <th className="pb-2 font-semibold">Transação</th>
                                    <th className="pb-2 font-semibold">Comprador</th>
                                    <th className="pb-2 font-semibold">Data</th>
                                    <th className="pb-2 font-semibold">Valor</th>
                                    <th className="pb-2 font-semibold">Taxas</th>
                                    <th className="pb-2 font-semibold">Comissão</th>
                                    <th className="pb-2 font-semibold">Líquido</th>
                                    <th className="pb-2 font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[1, 2, 3].map((i) => (
                                    <tr key={i} className="border-b">
                                      <td className="py-3">#{1000 + i}</td>
                                      <td className="py-3">Cliente {i}</td>
                                      <td className="py-3">{formatDateTime(event.startAt)}</td>
                                      <td className="py-3">{formatCurrency(15000)}</td>
                                      <td className="py-3">{formatCurrency(750)}</td>
                                      <td className="py-3">{formatCurrency(1500)}</td>
                                      <td className="py-3 font-semibold">{formatCurrency(12750)}</td>
                                      <td className="py-3">
                                        <Badge className="bg-emerald-100 text-emerald-700">Pago</Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {event.totalPhotos === 0 && (
                              <p className="py-8 text-center text-sm text-slate-500">Sem transações para este evento.</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>
            );
          })}

          {filteredCatalog.length === 0 && (
            <Card className="border-dashed border-slate-200 bg-white text-center shadow-sm">
              <CardContent className="py-16">
                <Info className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-4 text-sm font-medium text-slate-600">Nenhum evento encontrado com os filtros atuais.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requested" className="mt-6 space-y-4">
          <Card className="border-transparent bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Eventos Solicitados</CardTitle>
              <p className="text-sm text-slate-500">Gerencie solicitações de eventos recebidas de clientes.</p>
            </CardHeader>
            <CardContent>
              {requestedEvents.length === 0 ? (
                <div className="py-16 text-center">
                  <Info className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-4 text-sm font-medium text-slate-600">Nenhuma solicitação encontrada no período.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-semibold">Data</th>
                        <th className="pb-3 font-semibold">Cliente</th>
                        <th className="pb-3 font-semibold">Evento</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Valor</th>
                        <th className="pb-3 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestedEvents.map((req) => (
                        <tr key={req.id} className="border-b">
                          <td className="py-4">{req.data}</td>
                          <td className="py-4">{req.cliente}</td>
                          <td className="py-4">{req.evento}</td>
                          <td className="py-4">
                            <Badge className={req.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                              {req.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                            </Badge>
                          </td>
                          <td className="py-4">{formatCurrency(req.valor)}</td>
                          <td className="py-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast({ title: 'Status atualizado.' })}
                            >
                              Processar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
