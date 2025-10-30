import { useNavigate } from 'react-router-dom';
import {
  adminDailyUploads,
  adminMonthlyRevenue,
  adminOperationalAlerts,
} from '@/data/adminMock';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Users as UsersIcon, Target, Receipt } from 'lucide-react';
import { formatCurrency, formatDate, formatPercent } from './utils';
import DashboardFilters from './DashboardFilters';
import EventCalendar from './EventCalendar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for new KPIs
  const kpiData = {
    totalSales: 324500000, // R$ 3.245.000,00 em centavos
    totalSlots: 1250,
    filledSlots: 987,
    pendingCommissions: 198700, // R$ 1.987,00 em centavos
    conversionRate: 0.285, // 28.5%
    averageTicket: 18920, // R$ 189,20 em centavos
  };

  const kpis = [
    {
      id: 'sales',
      title: 'Vendas Totais',
      subtitle: 'no período selecionado',
      value: formatCurrency(kpiData.totalSales),
      change: 8.2,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      id: 'slots',
      title: 'Vagas Preenchidas',
      subtitle: `de ${kpiData.totalSlots}`,
      value: kpiData.filledSlots.toLocaleString('pt-BR'),
      change: 12.4,
      trend: 'up' as const,
      icon: UsersIcon,
      color: 'blue',
      progress: (kpiData.filledSlots / kpiData.totalSlots) * 100,
    },
    {
      id: 'commissions',
      title: 'Comissões Pendentes',
      subtitle: 'a confirmar até 19/06',
      value: formatCurrency(kpiData.pendingCommissions),
      change: -3.1,
      trend: 'down' as const,
      icon: Receipt,
      color: 'amber',
    },
    {
      id: 'conversion',
      title: 'Taxa de Conversão',
      subtitle: 'visão macro',
      value: `${formatPercent(kpiData.conversionRate)}%`,
      change: 2.7,
      trend: 'up' as const,
      icon: Target,
      color: 'violet',
    },
    {
      id: 'ticket',
      title: 'Ticket Médio',
      subtitle: 'valor médio por pedido',
      value: formatCurrency(kpiData.averageTicket),
      change: 5.8,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'cyan',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-600">Visão Geral</p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <DashboardFilters />
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const isPositive = kpi.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          const KpiIcon = kpi.icon;

          return (
            <Card key={kpi.id} className="relative overflow-hidden border-0 shadow-sm">
              {/* Gradient accent */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                  kpi.color === 'emerald'
                    ? 'from-emerald-400 to-emerald-600'
                    : kpi.color === 'blue'
                    ? 'from-blue-400 to-blue-600'
                    : kpi.color === 'amber'
                    ? 'from-amber-400 to-amber-600'
                    : kpi.color === 'violet'
                    ? 'from-violet-400 to-violet-600'
                    : 'from-cyan-400 to-cyan-600'
                }`}
              />

              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {kpi.title}
                  </CardTitle>
                  <p className="text-xs text-slate-500">{kpi.subtitle}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-[hsl(var(--admin-primary))]/10 flex items-center justify-center text-[hsl(var(--admin-primary))]">
                  <KpiIcon size={16} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                  
                  {kpi.progress !== undefined && (
                    <Progress value={kpi.progress} className="h-1.5" />
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        isPositive ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      <TrendIcon size={12} />
                      {Math.abs(kpi.change)}%
                    </span>
                    <span className="text-xs text-slate-500">vs. período anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calendar Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Calendário de Eventos
          </CardTitle>
          <p className="text-sm text-slate-600">Agenda do mês</p>
        </CardHeader>
        <CardContent>
          <EventCalendar />
        </CardContent>
      </Card>

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
        {/* Top Eventos por Vendas */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Top Eventos por Vendas</CardTitle>
            <p className="text-sm text-slate-600">Melhor desempenho no período</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Maratona da Beira Mar', sales: 124, revenue: 245800 },
                { name: 'Triatlo do Rio', sales: 98, revenue: 198600 },
                { name: 'Surf das Dunas', sales: 76, revenue: 152400 },
                { name: 'Campeonato de Vôlei', sales: 64, revenue: 128900 },
              ].map((event, index) => {
                const maxSales = 124;
                const percentage = (event.sales / maxSales) * 100;
                
                return (
                  <div key={event.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--admin-primary))]/10 text-[hsl(var(--admin-primary))] text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-900">{event.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(event.revenue)}</p>
                        <p className="text-xs text-slate-600">{event.sales} vendas</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Últimas Transações */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Últimas Transações</CardTitle>
            <p className="text-sm text-slate-600">Atividade recente</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: '#12988', customer: 'João Silva', amount: 22680, time: '14:30', status: 'completed' },
                { id: '#12987', customer: 'Maria Santos', amount: 17520, time: '10:15', status: 'completed' },
                { id: '#12986', customer: 'Pedro Oliveira', amount: 7950, time: '22:40', status: 'pending' },
                { id: '#12985', customer: 'Ana Costa', amount: 28350, time: '18:20', status: 'completed' },
              ].map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-slate-600">{transaction.id}</p>
                      <Badge
                        className={`text-xs border-0 ${
                          transaction.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mt-1">{transaction.customer}</p>
                    <p className="text-xs text-slate-600">{transaction.time}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/admin/vendas')}
            >
              Ver todas as transações
            </Button>
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
