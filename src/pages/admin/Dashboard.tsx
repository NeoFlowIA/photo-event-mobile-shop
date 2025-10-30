import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { AdminManagedEvent, PayoutQueueItem } from '@/data/adminMock';
import {
  adminManagedEvents,
  adminOperationalAlerts,
  adminPayoutQueue,
  adminSummaryMetrics,
} from '@/data/adminMock';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
} from './utils';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type PeriodPreset = 'today' | '7d' | '30d' | 'custom';
type CalendarView = 'month' | 'week';

type EventStatusBadge = {
  label: string;
  className: string;
};

const createRange = (preset: Exclude<PeriodPreset, 'custom'>): DateRange => {
  const now = new Date();

  if (preset === 'today') {
    return { from: now, to: now };
  }

  if (preset === '7d') {
    const end = now;
    const start = subDays(end, 6);
    return { from: start, to: end };
  }

  const end = now;
  const start = subDays(end, 29);
  return { from: start, to: end };
};

const summaryById = adminSummaryMetrics.reduce<
  Record<string, (typeof adminSummaryMetrics)[number]>
>((accumulator, metric) => {
  accumulator[metric.id] = metric;
  return accumulator;
}, {});

const resolveEventBadge = (event: AdminManagedEvent): EventStatusBadge => {
  if (event.status === 'archived') {
    return { label: 'Cancelado', className: 'border-0 bg-rose-100 text-rose-700' };
  }

  if (event.totalPhotos === 0) {
    return {
      label: 'Ativo',
      className: 'border-0 bg-[hsl(var(--admin-primary))]/15 text-[hsl(var(--admin-primary))]',
    };
  }

  const occupancy = event.soldPhotos / event.totalPhotos;

  if (occupancy >= 1) {
    return { label: 'Lotado', className: 'border-0 bg-slate-200 text-slate-600' };
  }

  if (occupancy >= 0.8) {
    return { label: 'Quase lotado', className: 'border-0 bg-amber-100 text-amber-700' };
  }

  return {
    label: 'Ativo',
    className: 'border-0 bg-[hsl(var(--admin-primary))]/15 text-[hsl(var(--admin-primary))]',
  };
};

const formatRangeLabel = (range?: DateRange) => {
  if (!range?.from) return 'Personalizado';
  if (!range.to) return `${format(range.from, 'dd/MM', { locale: ptBR })} • …`;
  return `${format(range.from, 'dd/MM', { locale: ptBR })} – ${format(range.to, 'dd/MM', { locale: ptBR })}`;
};

const formatCurrencyFromReais = (value: number) => formatCurrency(Math.round(value * 100));

const Dashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodPreset>('7d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => createRange('7d'));
  const [selectedUnit, setSelectedUnit] = useState<string>('todas');
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AdminManagedEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 280);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
      setCalendarView('week');
    }
  }, []);

  const normalizedRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to),
    };
  }, [dateRange]);

  const unitOptions = useMemo(() => {
    const units = new Set<string>();
    adminManagedEvents.forEach((event) => units.add(event.photographer));
    adminPayoutQueue.forEach((item) => units.add(item.photographer));
    return ['todas', ...Array.from(units)];
  }, []);

  const filteredEvents = useMemo(() => {
    const byUnit =
      selectedUnit === 'todas'
        ? adminManagedEvents
        : adminManagedEvents.filter((event) => event.photographer === selectedUnit);

    if (!normalizedRange) {
      return byUnit;
    }

    return byUnit.filter((event) => {
      const startAt = parseISO(event.startAt);
      return isWithinInterval(startAt, normalizedRange);
    });
  }, [normalizedRange, selectedUnit]);

  const filteredPayouts = useMemo(() => {
    const byUnit =
      selectedUnit === 'todas'
        ? adminPayoutQueue
        : adminPayoutQueue.filter((payout) => payout.photographer === selectedUnit);

    if (!normalizedRange) {
      return byUnit;
    }

    return byUnit.filter((payout) => {
      const dueDate = parseISO(payout.dueDate);
      return isWithinInterval(dueDate, normalizedRange);
    });
  }, [normalizedRange, selectedUnit]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, AdminManagedEvent[]>();

    filteredEvents.forEach((event) => {
      const key = format(parseISO(event.startAt), 'yyyy-MM-dd');
      const existing = map.get(key) ?? [];
      existing.push(event);
      map.set(key, existing);
    });

    return map;
  }, [filteredEvents]);

  const eventDays = useMemo(
    () => Array.from(eventsByDay.keys()).map((key) => parseISO(key)),
    [eventsByDay],
  );

  const metrics = useMemo(() => {
    const totalSalesCents = filteredEvents.reduce((sum, event) => sum + event.revenueCents, 0);
    const totalSlots = filteredEvents.reduce((sum, event) => sum + event.totalPhotos, 0);
    const filledSlots = filteredEvents.reduce((sum, event) => sum + event.soldPhotos, 0);
    const conversionAverage =
      filteredEvents.length === 0
        ? 0
        : filteredEvents.reduce((sum, event) => sum + event.conversionRate, 0) /
          filteredEvents.length;
    const pendingCommissionCents = filteredPayouts.reduce(
      (sum, payout) => sum + payout.amountCents,
      0,
    );

    const nextDueDate = filteredPayouts.reduce<Date | undefined>((closest, payout) => {
      const dueDate = parseISO(payout.dueDate);
      if (!closest || dueDate < closest) {
        return dueDate;
      }
      return closest;
    }, undefined);

    const averageTicketCents = filledSlots > 0 ? totalSalesCents / filledSlots : 0;
    const occupancyPercent = totalSlots > 0 ? filledSlots / totalSlots : 0;

    return {
      totalSalesCents,
      totalSlots,
      filledSlots,
      conversionAverage,
      pendingCommissionCents,
      nextDueDate,
      averageTicketCents,
      occupancyPercent,
    };
  }, [filteredEvents, filteredPayouts]);

  const kpiItems = useMemo(() => {
    if (filteredEvents.length === 0 && filteredPayouts.length === 0) {
      return [];
    }

    const items = [
      {
        id: 'total-sales',
        title: 'Vendas Totais (R$)',
        value: formatCurrency(metrics.totalSalesCents),
        subtext: 'no período selecionado',
        change: summaryById['gross-revenue']?.change ?? 0,
        trendIcon: summaryById['gross-revenue']?.change ?? 0 >= 0 ? TrendingUp : TrendingDown,
      },
      {
        id: 'filled-slots',
        title: 'Vagas Preenchidas (Qtd)',
        value: formatNumber(metrics.filledSlots),
        subtext: `de ${formatNumber(metrics.totalSlots)}`,
        progress: Math.min(100, metrics.occupancyPercent * 100),
        change: summaryById['active-events']?.change ?? 0,
        trendIcon: summaryById['active-events']?.change ?? 0 >= 0 ? TrendingUp : TrendingDown,
      },
      {
        id: 'pending-commissions',
        title: 'Comissões Pendentes (R$)',
        value: formatCurrency(metrics.pendingCommissionCents),
        subtext: metrics.nextDueDate
          ? `a confirmar até ${formatDate(metrics.nextDueDate.toISOString())}`
          : 'a confirmar até —',
        change: summaryById['net-revenue']?.change ?? 0,
        trendIcon: summaryById['net-revenue']?.change ?? 0 >= 0 ? TrendingUp : TrendingDown,
      },
      {
        id: 'conversion-rate',
        title: 'Taxa de Conversão (%)',
        value: `${formatPercent(metrics.conversionAverage, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}%`,
        subtext: 'visão macro',
        change: summaryById['approval-rate']?.change ?? 0,
        trendIcon: summaryById['approval-rate']?.change ?? 0 >= 0 ? TrendingUp : TrendingDown,
      },
    ];

    if (metrics.averageTicketCents > 0) {
      items.push({
        id: 'average-ticket',
        title: 'Ticket Médio (R$)',
        value: formatCurrency(Math.round(metrics.averageTicketCents)),
        subtext: 'valor médio por pedido',
        change: summaryById['net-revenue']?.change ?? 0,
        trendIcon: summaryById['net-revenue']?.change ?? 0 >= 0 ? TrendingUp : TrendingDown,
      });
    }

    return items;
  }, [filteredEvents.length, filteredPayouts.length, metrics]);

  const topEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => event.revenueCents > 0)
      .sort((a, b) => b.revenueCents - a.revenueCents)
      .slice(0, 5)
      .map((event) => ({
        id: event.id,
        title: event.title,
        revenue: event.revenueCents / 100,
      }));
  }, [filteredEvents]);

  const transactions = useMemo(() => {
    return filteredPayouts
      .slice()
      .sort((a, b) => parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime())
      .slice(0, 5);
  }, [filteredPayouts]);

  const selectedDayKey = format(selectedDate, 'yyyy-MM-dd');
  const eventsForSelectedDate = eventsByDay.get(selectedDayKey) ?? [];
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todaysEvents = eventsByDay.get(todayKey) ?? [];

  const weekStart = useMemo(
    () => startOfWeek(viewDate, { weekStartsOn: 1 }),
    [viewDate],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const handlePresetChange = (preset: Exclude<PeriodPreset, 'custom'>) => {
    const range = createRange(preset);
    setPeriod(preset);
    setDateRange(range);
    if (range.to) {
      setSelectedDate(range.to);
      setViewDate(range.to);
    }
  };

  const handleApplyFilters = () => {
    if (filteredEvents.length === 0 && filteredPayouts.length === 0) {
      toast({ description: 'Sem dados para o período selecionado.' });
      return;
    }

    toast({ description: 'Filtros aplicados.' });
  };

  const handleCalendarViewChange = (mode: CalendarView) => {
    setCalendarView(mode);
    setViewDate(mode === 'month' ? startOfMonth(selectedDate) : selectedDate);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -1 : 1;

    if (calendarView === 'month') {
      const nextDate = addMonths(selectedDate, offset);
      setSelectedDate(nextDate);
      setViewDate(nextDate);
      return;
    }

    const nextDate = addWeeks(selectedDate, offset);
    setSelectedDate(nextDate);
    setViewDate(nextDate);
  };

  const handleToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewDate(now);
  };

  const statusBadgeLegend: Array<{ label: string; className: string }> = [
    { label: 'Ativo', className: 'border-0 bg-[hsl(var(--admin-primary))]/15 text-[hsl(var(--admin-primary))]' },
    { label: 'Quase lotado', className: 'border-0 bg-amber-100 text-amber-700' },
    { label: 'Lotado', className: 'border-0 bg-slate-200 text-slate-600' },
    { label: 'Cancelado', className: 'border-0 bg-rose-100 text-rose-700' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Visão Geral</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={period === 'today' ? 'default' : 'outline'}
                onClick={() => handlePresetChange('today')}
              >
                Hoje
              </Button>
              <Button
                size="sm"
                variant={period === '7d' ? 'default' : 'outline'}
                onClick={() => handlePresetChange('7d')}
              >
                7 dias
              </Button>
              <Button
                size="sm"
                variant={period === '30d' ? 'default' : 'outline'}
                onClick={() => handlePresetChange('30d')}
              >
                30 dias
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant={period === 'custom' ? 'default' : 'outline'}
                    className="gap-2"
                  >
                    <CalendarRange size={16} />
                    {period === 'custom' ? formatRangeLabel(dateRange) : 'Personalizado'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      setPeriod('custom');
                      if (range?.to) {
                        setSelectedDate(range.to);
                        setViewDate(range.to);
                      } else if (range?.from) {
                        setSelectedDate(range.from);
                        setViewDate(range.from);
                      }
                    }}
                    numberOfMonths={1}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[200px]">
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger aria-label="Selecionar unidade">
                    <SelectValue placeholder="Todas as unidades" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit === 'todas' ? 'Todas as unidades' : unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" onClick={handleApplyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Visão Geral</h2>
            <p className="text-sm text-slate-500">Indicadores consolidados no período selecionado.</p>
          </div>
          {filteredEvents.length === 0 && filteredPayouts.length === 0 && !isLoading ? (
            <Badge variant="secondary" className="border-0 bg-amber-100 text-amber-700">
              Sem dados no período.
            </Badge>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="space-y-2 pb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : kpiItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {kpiItems.map((item) => {
              const TrendIcon = item.trendIcon ?? TrendingUp;
              const isPositive = item.change >= 0;
              return (
                <Card key={item.id} className="border border-slate-200 bg-white shadow-sm">
                  <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-sm font-semibold text-slate-600">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-3xl font-bold text-slate-900">{item.value}</span>
                      <Badge
                        variant="secondary"
                        className={`border-0 ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <TrendIcon size={14} />
                        <span className="ml-1">
                          {formatPercent(Math.abs(item.change), { maximumFractionDigits: 1 })}%
                        </span>
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{item.subtext}</p>
                  </CardHeader>
                  {item.id === 'filled-slots' ? (
                    <CardContent className="pt-0">
                      <Progress value={item.progress ?? 0} className="h-2" />
                      <p className="mt-2 text-xs text-slate-500">
                        {metrics.totalSlots > 0
                          ? `${formatPercent(Math.min(metrics.occupancyPercent, 1), {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}% de ocupação`
                          : 'Sem dados no período.'}
                      </p>
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6 text-sm text-slate-500">Sem dados no período.</CardContent>
          </Card>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="space-y-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-slate-900">Calendário de Eventos</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Navegue pela agenda e acompanhe o status de cada evento.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
                <Button
                  size="sm"
                  variant={calendarView === 'month' ? 'secondary' : 'ghost'}
                  onClick={() => handleCalendarViewChange('month')}
                >
                  Mês
                </Button>
                <Button
                  size="sm"
                  variant={calendarView === 'week' ? 'secondary' : 'ghost'}
                  onClick={() => handleCalendarViewChange('week')}
                >
                  Semana
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigate('prev')}
                  aria-label="Visualizar período anterior"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleToday}>
                  Hoje
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigate('next')}
                  aria-label="Visualizar próximo período"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {calendarView === 'month' ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(date);
                  setViewDate(date);
                }}
                month={viewDate}
                onMonthChange={setViewDate}
                modifiers={{ hasEvents: eventDays }}
                modifiersClassNames={{
                  hasEvents:
                    'relative after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-[hsl(var(--admin-primary))]',
                }}
                locale={ptBR}
                className="border border-slate-200 rounded-lg"
              />
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayEvents = eventsByDay.get(key) ?? [];
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day);
                        setViewDate(day);
                      }}
                      className={`min-w-[140px] rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--admin-primary))]/40 ${
                        isSelected
                          ? 'border-[hsl(var(--admin-primary))]/40 bg-[hsl(var(--admin-primary))]/10'
                          : 'border-slate-200 bg-white hover:border-[hsl(var(--admin-primary))]/30'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {format(day, 'EEE', { locale: ptBR })}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {format(day, 'dd', { locale: ptBR })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {dayEvents.length > 0
                          ? `${dayEvents.length} evento${dayEvents.length > 1 ? 's' : ''}`
                          : 'Sem eventos'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {statusBadgeLegend.map((item) => (
                <Badge key={item.label} variant="secondary" className={item.className}>
                  {item.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Agenda do Dia</CardTitle>
            <CardDescription>
              {`Eventos em ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => {
                const badge = resolveEventBadge(event);
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-[hsl(var(--admin-primary))]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--admin-primary))]/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">
                          {formatDateTime(event.startAt)} • {event.location}
                        </p>
                      </div>
                      <Badge variant="secondary" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {formatNumber(event.soldPhotos)} / {formatNumber(event.totalPhotos)} vagas
                      </span>
                      <span>{formatCurrency(event.revenueCents)}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                {isSameDay(selectedDate, new Date())
                  ? 'Sem eventos para hoje.'
                  : 'Nenhum evento neste dia.'}
              </p>
            )}
          </CardContent>
          {todaysEvents.length === 0 && !isSameDay(selectedDate, new Date()) ? (
            <div className="px-6 pb-6 text-xs text-slate-500">Sem eventos para hoje.</div>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1.2fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Top Eventos por vendas</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Ranking baseado na receita líquida do período.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="border-0 bg-[hsl(var(--admin-primary))]/10 text-[hsl(var(--admin-primary))]">
                <ArrowUpRight size={14} className="mr-1" />
                Receita
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            {topEvents.length > 0 ? (
              <ChartContainer
                config={{
                  revenue: {
                    label: 'Receita',
                    color: 'hsl(var(--admin-primary))',
                  },
                }}
                className="h-full"
              >
                <BarChart
                  data={topEvents}
                  layout="vertical"
                  margin={{ left: 24, right: 16, top: 16, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    type="number"
                    tickFormatter={formatCurrencyFromReais}
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis
                    dataKey="title"
                    type="category"
                    width={160}
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [formatCurrencyFromReais(Number(value)), 'Receita']}
                      />
                    }
                  />
                  <ChartLegend />
                  <Bar dataKey="revenue" radius={[6, 6, 6, 6]} fill="var(--color-revenue)" />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Sem dados no período.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Últimas Transações</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Acompanhamento de repasses e status financeiros recentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Previsto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => {
                    const statusTone: Record<PayoutQueueItem['status'], string> = {
                      pending: 'bg-amber-100 text-amber-700',
                      processing: 'bg-blue-100 text-blue-700',
                      paid: 'bg-emerald-100 text-emerald-700',
                    };
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium text-slate-800">
                          {transaction.photographer}
                        </TableCell>
                        <TableCell>{formatCurrency(transaction.amountCents)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`border-0 ${statusTone[transaction.status]}`}>
                            {transaction.status === 'pending' && 'Pendente'}
                            {transaction.status === 'processing' && 'Processando'}
                            {transaction.status === 'paid' && 'Pago'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(transaction.dueDate)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-slate-500">Sem dados no período.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Alertas</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Monitoramento das principais ações operacionais.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="border-0 bg-slate-100 text-slate-600">
            {adminOperationalAlerts.length} ativos
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminOperationalAlerts.map((alert) => {
            const severityTone =
              alert.severity === 'high'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : alert.severity === 'medium'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-blue-200 bg-blue-50 text-blue-700';
            return (
              <div
                key={alert.id}
                className={`flex flex-col gap-2 rounded-xl border p-4 ${severityTone}`}
              >
                <span className="text-xs font-semibold uppercase">
                  {alert.severity === 'high' && 'Alta'}
                  {alert.severity === 'medium' && 'Média'}
                  {alert.severity === 'low' && 'Baixa'}
                </span>
                <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                <p className="text-sm text-slate-700">{alert.description}</p>
                <p className="text-xs text-slate-600">{formatDateTime(alert.createdAt)}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-xl">
          {selectedEvent ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {formatDateTime(selectedEvent.startAt)} • {selectedEvent.location}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                    <Badge
                      variant="secondary"
                      className={resolveEventBadge(selectedEvent).className}
                    >
                      {resolveEventBadge(selectedEvent).label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Organização</p>
                    <p>{selectedEvent.photographer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Vagas</p>
                    <p>
                      {formatNumber(selectedEvent.soldPhotos)} / {formatNumber(selectedEvent.totalPhotos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Conversão</p>
                    <p>
                      {formatPercent(selectedEvent.conversionRate, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}%
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Resumo financeiro</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase text-slate-500">Receita estimada</span>
                      <p>{formatCurrency(selectedEvent.revenueCents)}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-500">Taxa da plataforma</span>
                      <p>{selectedEvent.platformFeePercent}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    const eventId = selectedEvent.id;
                    setSelectedEvent(null);
                    navigate(`/admin/eventos?highlight=${eventId}`);
                  }}
                >
                  Abrir em Eventos
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
