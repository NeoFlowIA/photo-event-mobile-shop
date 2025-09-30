import { useMemo, useState } from 'react';
import {
  adminDailyUploads,
  adminFinancialPolicies,
  adminMonthlyRevenue,
  adminOperationalAlerts,
  adminPendingEvents,
  adminPayoutQueue,
  adminSummaryMetrics,
  FinancialPolicies,
  PendingEvent,
  PendingEventStatus,
} from '@/data/adminMock';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock3,
  Coins,
  FileCheck2,
  LineChart as LineChartIcon,
  Percent,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (valueInCents: number) =>
  (valueInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });

const formatMetricValue = (
  value: number,
  formatType: 'currency' | 'integer' | 'percentage',
) => {
  if (formatType === 'currency') {
    return formatCurrency(value);
  }
  if (formatType === 'percentage') {
    return `${(value * 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }
  return value.toLocaleString('pt-BR');
};

const formatPercentChange = (value: number) =>
  `${Math.abs(value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Data não disponível';
  return format(parsed, "dd/MM/yyyy 'às' HH'h'mm", { locale: ptBR });
};

const formatDateShort = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return format(parsed, "dd MMM", { locale: ptBR });
};

const statusConfig: Record<PendingEventStatus, { label: string; className: string }> = {
  analysis: { label: 'Em análise', className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Recusado', className: 'bg-red-100 text-red-800' },
  needs_revision: { label: 'Ajustes solicitados', className: 'bg-blue-100 text-blue-800' },
};

const getRiskConfig = (score: number) => {
  if (score >= 40) {
    return { label: 'Risco alto', className: 'bg-red-100 text-red-800' };
  }
  if (score >= 20) {
    return { label: 'Risco moderado', className: 'bg-amber-100 text-amber-800' };
  }
  return { label: 'Risco baixo', className: 'bg-emerald-100 text-emerald-800' };
};

const payoutStatusConfig = {
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  processing: { label: 'Processando', className: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Liquidado', className: 'bg-emerald-100 text-emerald-800' },
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(adminPendingEvents);
  const [policies, setPolicies] = useState<FinancialPolicies>(adminFinancialPolicies);

  const eventsWaitingApproval = useMemo(
    () => pendingEvents.filter((event) => event.status === 'analysis').length,
    [pendingEvents],
  );

  const revenueMetric = adminSummaryMetrics.find((metric) => metric.id === 'gross-revenue');

  const isPoliciesDirty = useMemo(
    () => JSON.stringify(policies) !== JSON.stringify(adminFinancialPolicies),
    [policies],
  );

  const handleEventDecision = (id: string, nextStatus: PendingEventStatus) => {
    setPendingEvents((events) =>
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              status: nextStatus,
            }
          : event,
      ),
    );

    const feedback = {
      approved: {
        title: 'Evento aprovado',
        description: 'O fotógrafo será notificado e poderá iniciar os uploads.',
      },
      rejected: {
        title: 'Evento recusado',
        description: 'O solicitante receberá orientações para reenviar o evento.',
      },
      needs_revision: {
        title: 'Ajustes solicitados',
        description:
          'Envie comentários específicos pelo canal interno para agilizar o retorno.',
      },
      analysis: {
        title: 'Evento marcado como em análise',
        description: 'O fluxo foi reiniciado para revisão manual.',
      },
    } as const;

    const message = feedback[nextStatus];
    toast({
      title: message.title,
      description: message.description,
    });
  };

  const updateEventField = <K extends keyof PendingEvent>(
    id: string,
    field: K,
    value: PendingEvent[K],
  ) => {
    setPendingEvents((events) =>
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              [field]: value,
            }
          : event,
      ),
    );
  };

  const handlePolicyChange = <K extends keyof FinancialPolicies>(
    field: K,
    value: FinancialPolicies[K],
  ) => {
    setPolicies((current) => ({
      ...current,
      [field]: value,
      ...(field === 'platformFeePercent'
        ? {
            photographerSharePercent: Math.max(
              0,
              Math.min(100, 100 - Number(value)),
            ),
          }
        : {}),
    }));
  };

  const handleSavePolicies = () => {
    toast({
      title: 'Políticas financeiras atualizadas',
      description:
        'Os ajustes foram registrados e serão sincronizados com o Hasura após a validação de conformidade.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <Header title="Painel Administrativo" showCart={false} />

      <main className="container mx-auto px-4 py-8 space-y-10">
        <section className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                Olá, {user?.displayName ?? 'admin da plataforma'}
              </h1>
              <Badge variant="secondary" className="text-xs">
                {eventsWaitingApproval} eventos aguardando análise
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              Acompanhe métricas financeiras, gerencie a fila de aprovação e ajuste as políticas de monetização
              do marketplace.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminSummaryMetrics.map((metric) => {
            const isPositive = metric.trend === 'up';
            const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

            return (
              <Card key={metric.id} className="relative overflow-hidden">
                <CardHeader className="space-y-0 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {metric.title}
                    </CardTitle>
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">
                      {metric.format === 'currency' && <Coins size={16} />}
                      {metric.format === 'integer' && <Camera size={16} />}
                      {metric.format === 'percentage' && <Percent size={16} />}
                    </div>
                  </div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold">
                    {formatMetricValue(metric.value, metric.format)}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{formatPercentChange(metric.change)}</span>
                    <span className="text-muted-foreground font-normal">
                      {metric.comparisonLabel}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Receita mensal</CardTitle>
                <CardDescription>
                  Evolução do faturamento bruto, líquido e volume de repasses aos fotógrafos.
                </CardDescription>
              </div>
              {revenueMetric && (
                <Badge variant="outline" className="text-xs font-medium">
                  {formatPercentChange(revenueMetric.change)} {revenueMetric.comparisonLabel}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  gross: {
                    label: 'Faturamento bruto',
                    color: 'hsl(var(--chart-1))',
                  },
                  net: {
                    label: 'Receita líquida',
                    color: 'hsl(var(--chart-2))',
                  },
                  payouts: {
                    label: 'Pagamentos a fotógrafos',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[320px]"
              >
                <BarChart data={adminMonthlyRevenue}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="gross" fill="var(--color-gross)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="net" fill="var(--color-net)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="payouts" fill="var(--color-payouts)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Uploads e aprovações diárias</CardTitle>
              <CardDescription>
                Monitoramento da cadência de novas fotos e das aprovações automáticas com IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  uploads: {
                    label: 'Uploads recebidos',
                    color: 'hsl(var(--chart-4))',
                  },
                  approvals: {
                    label: 'Fotos aprovadas',
                    color: 'hsl(var(--chart-2))',
                  },
                  aiMatches: {
                    label: 'Matches via IA',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[320px]"
              >
                <LineChart data={adminDailyUploads}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => formatDateShort(value)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="var(--color-uploads)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke="var(--color-approvals)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="aiMatches"
                    stroke="var(--color-aiMatches)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Fila de aprovação de eventos</CardTitle>
                <CardDescription>
                  Ajuste valores financeiros antes de liberar os eventos para publicação no marketplace.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                {eventsWaitingApproval} eventos aguardando decisão
              </Badge>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[280px]">Evento</TableHead>
                    <TableHead className="min-w-[320px]">Regras financeiras</TableHead>
                    <TableHead className="min-w-[140px] text-center">Risco</TableHead>
                    <TableHead className="min-w-[140px] text-center">Status</TableHead>
                    <TableHead className="min-w-[220px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEvents.map((event) => {
                    const risk = getRiskConfig(event.riskScore);
                    const status = statusConfig[event.status];

                    return (
                      <TableRow key={event.id} className="align-top">
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold leading-tight">{event.title}</p>
                              <Badge variant="secondary" className="text-xs">
                                {event.category}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>
                                Fotógrafo: {event.photographer}{' '}
                                <span className="text-muted-foreground/80">({event.photographerHandle})</span>
                              </p>
                              <p>Local: {event.location}</p>
                              <p>Início: {formatDateTime(event.startAt)}</p>
                              <p>Enviado em: {formatDateTime(event.submittedAt)}</p>
                              <p>
                                Volume estimado: {event.expectedPhotos.toLocaleString('pt-BR')} fotos
                              </p>
                            </div>
                            {event.notes && (
                              <p className="text-xs text-muted-foreground bg-muted/80 rounded-md px-2 py-1">
                                {event.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label htmlFor={`basePrice-${event.id}`} className="text-xs uppercase text-muted-foreground">
                                Preço base (R$)
                              </Label>
                              <Input
                                id={`basePrice-${event.id}`}
                                type="number"
                                step="0.1"
                                min="0"
                                value={(event.basePriceCents / 100).toFixed(2)}
                                onChange={(e) =>
                                  updateEventField(
                                    event.id,
                                    'basePriceCents',
                                    Math.round(Number(e.target.value || 0) * 100),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`photoFee-${event.id}`} className="text-xs uppercase text-muted-foreground">
                                Valor por foto (R$)
                              </Label>
                              <Input
                                id={`photoFee-${event.id}`}
                                type="number"
                                step="0.1"
                                min="0"
                                value={(event.suggestedPhotoFeeCents / 100).toFixed(2)}
                                onChange={(e) =>
                                  updateEventField(
                                    event.id,
                                    'suggestedPhotoFeeCents',
                                    Math.round(Number(e.target.value || 0) * 100),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`fee-${event.id}`} className="text-xs uppercase text-muted-foreground">
                                Taxa plataforma (%)
                              </Label>
                              <Input
                                id={`fee-${event.id}`}
                                type="number"
                                step="0.5"
                                min="0"
                                max="40"
                                value={event.platformFeePercent}
                                onChange={(e) =>
                                  updateEventField(
                                    event.id,
                                    'platformFeePercent',
                                    Number(e.target.value || 0),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs uppercase text-muted-foreground">
                                Receita potencial
                              </Label>
                              <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
                                {formatCurrency(event.suggestedPhotoFeeCents * event.expectedPhotos)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Badge className={`${risk.className} text-xs`}>{risk.label}</Badge>
                            <span className="text-xs text-muted-foreground">Score: {event.riskScore}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${status.className} text-xs`}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEventDecision(event.id, 'approved')}
                              disabled={event.status === 'approved'}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle2 size={14} /> Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEventDecision(event.id, 'needs_revision')}
                              disabled={event.status === 'needs_revision'}
                              className="flex items-center gap-1"
                            >
                              <FileCheck2 size={14} /> Solicitar ajuste
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleEventDecision(event.id, 'rejected')}
                              disabled={event.status === 'rejected'}
                              className="flex items-center gap-1"
                            >
                              <XCircle size={14} /> Recusar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fila de repasses</CardTitle>
              <CardDescription>
                Solicitações de saque e repasses automáticos aguardando aprovação financeira.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminPayoutQueue.map((payout) => {
                const status = payoutStatusConfig[payout.status];
                return (
                  <div
                    key={payout.id}
                    className="rounded-lg border border-border/60 bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-tight">
                          {payout.photographer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(payout.amountCents)} • {payout.events}{' '}
                          {payout.events === 1 ? 'evento' : 'eventos'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock3 size={12} /> Vencimento: {formatDateShort(payout.dueDate)}
                        </p>
                      </div>
                      <Badge className={`${status.className} text-xs`}>{status.label}</Badge>
                    </div>
                    <CardFooter className="px-0 pb-0 pt-4">
                      <div className="flex w-full flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() =>
                            toast({
                              title: 'Pagamentos priorizados',
                              description: `O repasse para ${payout.photographer} foi sinalizado para liquidação imediata.`,
                            })
                          }
                        >
                          <LineChartIcon size={14} /> Priorizar liquidação
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1"
                          onClick={() =>
                            toast({
                              title: 'Auditoria iniciada',
                              description: 'A equipe financeira foi notificada para revisar a solicitação.',
                            })
                          }
                        >
                          <ShieldAlert size={14} /> Enviar para auditoria
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Políticas financeiras</CardTitle>
              <CardDescription>
                Defina limites de monetização, taxas da plataforma e configurações automáticas de aprovação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-fee">Taxa da plataforma (%)</Label>
                  <Input
                    id="platform-fee"
                    type="number"
                    step="0.5"
                    min="0"
                    max="40"
                    value={policies.platformFeePercent}
                    onChange={(event) =>
                      handlePolicyChange('platformFeePercent', Number(event.target.value || 0))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentual retido pela OlhaFoto em cada pedido concluído.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Repasse padrão ao fotógrafo (%)</Label>
                  <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
                    {policies.photographerSharePercent.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculado automaticamente a partir da taxa da plataforma.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo-fee">Taxa diária por foto (R$)</Label>
                  <Input
                    id="photo-fee"
                    type="number"
                    step="0.1"
                    min="0"
                    value={(policies.photoDailyFeeCents / 100).toFixed(2)}
                    onChange={(event) =>
                      handlePolicyChange(
                        'photoDailyFeeCents',
                        Math.round(Number(event.target.value || 0) * 100),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Cobrança aplicada diariamente sobre fotos publicadas e monetizadas.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-fee">Taxa de processamento IA (R$)</Label>
                  <Input
                    id="ai-fee"
                    type="number"
                    step="0.1"
                    min="0"
                    value={(policies.aiProcessingFeeCents / 100).toFixed(2)}
                    onChange={(event) =>
                      handlePolicyChange(
                        'aiProcessingFeeCents',
                        Math.round(Number(event.target.value || 0) * 100),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Rateio do custo de reconhecimento facial e OCR para cada lote.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum-payout">Mínimo para saque (R$)</Label>
                  <Input
                    id="minimum-payout"
                    type="number"
                    step="10"
                    min="0"
                    value={(policies.minimumPayoutCents / 100).toFixed(2)}
                    onChange={(event) =>
                      handlePolicyChange(
                        'minimumPayoutCents',
                        Math.round(Number(event.target.value || 0) * 100),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo acumulado para liberar novos pagamentos automáticos.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-approve">Auto-aprovação até (R$)</Label>
                  <Input
                    id="auto-approve"
                    type="number"
                    step="50"
                    min="0"
                    value={(policies.autoApproveThresholdCents / 100).toFixed(2)}
                    onChange={(event) =>
                      handlePolicyChange(
                        'autoApproveThresholdCents',
                        Math.round(Number(event.target.value || 0) * 100),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Eventos abaixo desse valor são liberados automaticamente após validação de risco.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Limite diário de fotos</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[policies.dailyUploadLimit]}
                    min={500}
                    max={6000}
                    step={100}
                    onValueChange={(value) => handlePolicyChange('dailyUploadLimit', value[0])}
                    className="flex-1"
                  />
                  <div className="w-24 rounded-md border bg-muted/50 px-3 py-2 text-center text-sm font-medium">
                    {policies.dailyUploadLimit.toLocaleString('pt-BR')} fotos
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Capacidade máxima diária de fotos processadas com garantia de SLA.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Payout instantâneo</p>
                    <p className="text-xs text-muted-foreground">
                      Libera pagamentos em até 2h após a confirmação da venda.
                    </p>
                  </div>
                  <Switch
                    checked={policies.instantPayoutEnabled}
                    onCheckedChange={(checked) =>
                      handlePolicyChange('instantPayoutEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Auditoria automática</p>
                    <p className="text-xs text-muted-foreground">
                      Eventos com risco alto entram automaticamente na fila de auditoria.
                    </p>
                  </div>
                  <Switch
                    checked={policies.auditQueueEnabled}
                    onCheckedChange={(checked) =>
                      handlePolicyChange('auditQueueEnabled', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Última sincronização manual às 08h12 — alterações ficam registradas para auditoria.
              </div>
              <Button onClick={handleSavePolicies} disabled={!isPoliciesDirty}>
                Salvar ajustes financeiros
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Alertas operacionais</CardTitle>
              <CardDescription>
                Indicadores críticos monitorados pela central de operações e compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminOperationalAlerts.map((alert) => {
                const severityConfig = {
                  high: 'text-red-600',
                  medium: 'text-amber-600',
                  low: 'text-sky-600',
                }[alert.severity];

                const severityLabel = {
                  high: 'Alta',
                  medium: 'Média',
                  low: 'Baixa',
                }[alert.severity];

                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-4"
                  >
                    <AlertTriangle className={severityConfig} size={20} />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold leading-tight">{alert.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          Criticidade: {severityLabel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Registrado em {formatDateTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
