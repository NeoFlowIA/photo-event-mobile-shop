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
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatPercent } from './utils';
import { CalendarClock, FileWarning, Info } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

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
  const [tab, setTab] = useState<'approval' | 'catalog'>('approval');
  const [search, setSearch] = useState('');
  const [pendingEvents, setPendingEvents] = useState(initialPending);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminManagedEvent['status']>('all');

  const waitingAnalysis = useMemo(
    () => pendingEvents.filter((event) => event.status === 'analysis').length,
    [pendingEvents],
  );
  const publishedOrRunning = useMemo(
    () => adminManagedEvents.filter((event) => ['published', 'running'].includes(event.status)).length,
    [],
  );
  const flaggedInCatalog = useMemo(
    () => adminManagedEvents.filter((event) => event.flagged).length,
    [],
  );
  const totalRevenue = useMemo(
    () => adminManagedEvents.reduce((sum, event) => sum + event.revenueCents, 0),
    [],
  );
  const avgConversion = useMemo(() => {
    if (adminManagedEvents.length === 0) return 0;
    const total = adminManagedEvents.reduce((sum, event) => sum + event.conversionRate, 0);
    return total / adminManagedEvents.length;
  }, []);

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
      <AdminPageHeader
        eyebrow="Operação"
        title="Gestão de eventos"
        description="Aprove eventos submetidos e acompanhe performance comercial de cada edição publicada no marketplace."
        actions={
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-3 text-xs text-slate-500">
            <CalendarClock size={18} className="text-primary" />
            <div>
              <p className="font-semibold text-slate-600">{waitingAnalysis} na fila de aprovação</p>
              <p className="leading-relaxed">Priorize eventos com risco alto para manter a curadoria em dia.</p>
            </div>
          </div>
        }
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Eventos ativos</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publishedOrRunning.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conversão média</p>
          <p className="mt-1 text-lg font-semibold text-primary">{formatPercent(avgConversion)}%</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Receita acumulada</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Eventos sinalizados</p>
          <p className="mt-1 text-lg font-semibold text-rose-600">{flaggedInCatalog.toLocaleString('pt-BR')}</p>
        </div>
      </AdminPageHeader>

      <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3 md:w-2/3">
            <Input
              placeholder="Buscar por evento, fotógrafo ou cidade"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Fila atual</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">{waitingAnalysis}</span>
            <span className="text-slate-400">eventos</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(value) => setTab(value as 'approval' | 'catalog')}>
        <TabsList className="rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-sm">
          <TabsTrigger value="approval">Fila de aprovação</TabsTrigger>
          <TabsTrigger value="catalog">Eventos publicados</TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="mt-6 space-y-4">
          {filteredPending.length === 0 ? (
            <Card className="border-dashed border-slate-200/80 bg-white/70 text-center shadow-sm">
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
                <Card key={event.id} className="border border-slate-200/80 bg-white/80 shadow-sm">
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
          <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
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
              <Card key={event.id} className="border border-slate-200/80 bg-white/80 shadow-sm">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-800">{event.title}</CardTitle>
                    <p className="text-xs text-slate-500">
                      {event.category} • {event.location} • início {formatDateTime(event.startAt)}
                    </p>
                  </div>
                  <Badge className={status.badge}>{status.label}</Badge>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-slate-600 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Fotógrafo responsável</p>
                    <p className="text-slate-900">{event.photographer}</p>
                    <p className="text-xs text-slate-500">Taxa da plataforma {event.platformFeePercent}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Conversão</p>
                    <p className="text-slate-900">{formatPercent(event.conversionRate)}%</p>
                    <p className="text-xs text-slate-500">Fotos vendidas {event.soldPhotos.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Receita total</p>
                    <p className="text-slate-900">{formatCurrency(event.revenueCents)}</p>
                    <p className="text-xs text-slate-500">Base {event.totalPhotos.toLocaleString('pt-BR')} fotos</p>
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
                </CardContent>
              </Card>
            );
          })}

          {filteredCatalog.length === 0 && (
            <Card className="border-dashed border-slate-200/80 bg-white/70 text-center shadow-sm">
              <CardContent className="py-16">
                <Info className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-4 text-sm font-medium text-slate-600">Nenhum evento encontrado com os filtros atuais.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
