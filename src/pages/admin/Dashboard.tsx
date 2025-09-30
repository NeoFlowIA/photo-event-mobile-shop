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
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, Activity } from 'lucide-react';
import { formatCurrency, formatDate, formatPercent } from './utils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const approvalQueueSize = useMemo(
    () => adminPendingEvents.filter((event) => event.status === 'analysis').length,
    [],
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Olá, {user?.displayName ?? 'Administrador'} 👋
        </h1>
        <p className="text-slate-600">
          Visão geral do marketplace e métricas principais
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminSummaryMetrics.map((metric) => {
          const isPositive = metric.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          const MetricIcon = metric.id === 'gross-revenue' || metric.id === 'net-revenue' 
            ? DollarSign 
            : metric.id === 'active-events'
            ? Activity
            : CheckCircle;
          
          return (
            <Card key={metric.id} className="relative overflow-hidden border-0 shadow-sm">
              {/* Gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-1 ${
                isPositive 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                  : 'bg-gradient-to-r from-amber-400 to-amber-600'
              }`} />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                <CardTitle className="text-sm font-medium text-slate-600">{metric.title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-[hsl(var(--admin-primary))]/10 flex items-center justify-center text-[hsl(var(--admin-primary))]">
                  <MetricIcon size={16} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    {metric.format === 'currency'
                      ? formatCurrency(metric.value)
                      : metric.format === 'percentage'
                      ? `${formatPercent(metric.value)}%`
                      : metric.value.toLocaleString('pt-BR')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      <TrendIcon size={14} />
                      {formatPercent(Math.abs(metric.change), { maximumFractionDigits: 1 })}%
                    </span>
                    <span className="text-xs text-slate-500">{metric.comparisonLabel}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Performance Financeira</CardTitle>
            <p className="text-sm text-slate-600">Evolução mensal de receitas</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                gross: { label: 'Faturamento bruto', color: 'hsl(var(--admin-primary))' },
                net: { label: 'Receita líquida', color: 'hsl(var(--admin-accent))' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminMonthlyRevenue} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
                    axisLine={false} 
                    tickLine={false} 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="gross" strokeWidth={3} stroke="var(--color-gross)" dot={false} />
                  <Line type="monotone" dataKey="net" strokeWidth={3} stroke="var(--color-net)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Uploads e Aprovações</CardTitle>
            <p className="text-sm text-slate-600">Processamento diário de fotos</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                uploads: { label: 'Uploads', color: 'hsl(var(--admin-primary))' },
                approvals: { label: 'Aprovações', color: 'hsl(var(--admin-accent))' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminDailyUploads}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => formatDate(value).slice(0, 5)} 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString('pt-BR')} 
                    axisLine={false} 
                    tickLine={false} 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="uploads" fill="var(--color-uploads)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="approvals" fill="var(--color-approvals)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Events */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Fila de Aprovação</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Eventos aguardando validação</p>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">
              {approvalQueueSize} pendentes
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminPendingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {event.category} • {event.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Por {event.photographer}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2 shrink-0 border-amber-300 text-amber-700 text-xs">
                  Análise
                </Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={() => navigate('/admin/eventos')}
            >
              Ver todos os eventos
            </Button>
          </CardContent>
        </Card>

        {/* Payouts Queue */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">Pagamentos Pendentes</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Próximos repasses a fotógrafos</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminPayoutQueue.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{payout.photographer}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {payout.events} eventos • {formatDate(payout.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(payout.amountCents)}</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 text-xs border-0 ${
                      payout.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      payout.status === 'processing' ? 'bg-blue-100 text-blue-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {payout.status === 'pending' && 'Pendente'}
                    {payout.status === 'processing' && 'Processando'}
                    {payout.status === 'paid' && 'Pago'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Alertas Operacionais</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Ações sugeridas e monitoramento</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {adminOperationalAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 bg-white">
              <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                alert.severity === 'high' ? 'bg-rose-500' :
                alert.severity === 'medium' ? 'bg-amber-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                  <Badge 
                    variant="secondary"
                    className={`text-xs border-0 ${
                      alert.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {alert.severity === 'high' && 'Alta'}
                    {alert.severity === 'medium' && 'Média'}
                    {alert.severity === 'low' && 'Baixa'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-2">{formatDate(alert.createdAt)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
