import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminDailyUploads,
  adminMonthlyRevenue,
  adminOperationalAlerts,
  adminPendingEvents,
  adminPayoutQueue,
  adminSummaryMetrics,
} from '@/data/adminMock';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, ShieldAlert } from 'lucide-react';
import { formatCurrency, formatDate, formatPercent } from './utils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const approvalQueueSize = useMemo(
    () => adminPendingEvents.filter((event) => event.status === 'analysis').length,
    [],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-primary">Olá, {user?.displayName ?? 'admin'} 👋</p>
            <h2 className="text-2xl font-semibold text-slate-900">Resumo operacional do marketplace</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Acompanhe faturamento, conversão de eventos e saúde dos fluxos de aprovação.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Eventos ativos</p>
              <p className="text-lg font-semibold text-slate-900">
                {
                  adminSummaryMetrics.find((metric) => metric.id === 'active-events')?.value.toLocaleString('pt-BR') ?? '—'
                }
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Fila de aprovação</p>
              <p className="text-lg font-semibold text-slate-900">{approvalQueueSize}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminSummaryMetrics.map((metric) => {
            const isPositive = metric.trend === 'up';
            const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
            return (
              <Card key={metric.id} className="border-transparent bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">{metric.title}</CardTitle>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>
                    <Icon size={18} />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metric.format === 'currency'
                      ? formatCurrency(metric.value)
                      : metric.format === 'percentage'
                      ? `${formatPercent(metric.value)}%`
                      : metric.value.toLocaleString('pt-BR')}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {isPositive ? 'Crescimento' : 'Variação negativa'} de {formatPercent(metric.change, {
                      maximumFractionDigits: 2,
                    })}% {metric.comparisonLabel}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-transparent bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Performance financeira</CardTitle>
            <p className="text-sm text-slate-500">Faturamento bruto, líquido e volume de repasses nos últimos meses.</p>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ChartContainer
              config={{
                gross: { label: 'Faturamento bruto', color: 'hsl(var(--primary))' },
                net: { label: 'Receita líquida', color: 'hsl(var(--muted-foreground))' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminMonthlyRevenue} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="gross" strokeWidth={2} stroke="var(--color-gross)" dot={false} />
                  <Line type="monotone" dataKey="net" strokeWidth={2} stroke="var(--color-net)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Uploads e aprovações diárias</CardTitle>
            <p className="text-sm text-slate-500">Monitoramento da capacidade de processamento e matching via IA.</p>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ChartContainer
              config={{
                uploads: { label: 'Uploads', color: 'hsl(var(--primary))' },
                approvals: { label: 'Aprovações', color: 'hsl(var(--chart-2))' },
                aiMatches: { label: 'Matches IA', color: 'hsl(var(--chart-3))' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminDailyUploads}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickFormatter={(value) => formatDate(value).slice(0, 5)} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis tickFormatter={(value) => value.toLocaleString('pt-BR')} axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="uploads" fill="var(--color-uploads)" radius={6} />
                  <Bar dataKey="approvals" fill="var(--color-approvals)" radius={6} />
                  <Bar dataKey="aiMatches" fill="var(--color-aiMatches)" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-transparent bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Fila de aprovação</CardTitle>
              <p className="text-sm text-slate-500">
                Eventos aguardando validação de curadoria e política comercial.
              </p>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              {approvalQueueSize} em análise
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminPendingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {event.category} • {formatDate(event.startAt)} • {event.location}
                    </p>
                  </div>
                  <Badge className="w-fit bg-amber-100 text-amber-700">Em análise</Badge>
                </div>
                <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                  <div>
                    <p className="font-medium text-slate-500">Fotógrafo</p>
                    <p>{event.photographer}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-500">Expectativa de fotos</p>
                    <p>{event.expectedPhotos.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-500">Fee sugerido</p>
                    <p>{formatCurrency(event.suggestedPhotoFeeCents)}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/eventos')}>
              Abrir gestão de eventos
            </Button>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Pagamentos a fotógrafos</CardTitle>
              <p className="text-sm text-slate-500">Próximos repasses previstos para os próximos 5 dias úteis.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminPayoutQueue.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{payout.photographer}</p>
                  <p className="text-xs text-slate-500">{payout.events} eventos • pagamento em {formatDate(payout.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(payout.amountCents)}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {payout.status === 'pending' && 'Pendente'}
                    {payout.status === 'processing' && 'Processando'}
                    {payout.status === 'paid' && 'Liquidado'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-transparent bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Alertas operacionais</CardTitle>
              <p className="text-sm text-slate-500">
                Ações sugeridas pelo time de risco, antifraude e qualidade do conteúdo.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminOperationalAlerts.map((alert) => (
              <div key={alert.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`uppercase ${
                        alert.severity === 'high'
                          ? 'bg-rose-100 text-rose-600'
                          : alert.severity === 'medium'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-sky-100 text-sky-600'
                      }`}
                    >
                      {alert.severity === 'high' && 'Alta prioridade'}
                      {alert.severity === 'medium' && 'Atenção'}
                      {alert.severity === 'low' && 'Monitorar'}
                    </Badge>
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Clock3 size={16} />
                  <span>{formatDate(alert.createdAt)}</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Fila de acompanhamento</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
