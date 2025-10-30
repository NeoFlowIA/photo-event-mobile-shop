import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { formatDateTime } from './utils';

interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  location: string;
  totalSlots: number;
  filledSlots: number;
  status: 'active' | 'almost-full' | 'full' | 'cancelled';
}

const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Maratona da Beira Mar',
    startAt: '2024-06-20T06:00:00-03:00',
    location: 'Florianópolis • SC',
    totalSlots: 100,
    filledSlots: 45,
    status: 'active',
  },
  {
    id: 'evt-2',
    title: 'Triatlo do Rio',
    startAt: '2024-06-22T07:30:00-03:00',
    location: 'Rio de Janeiro • RJ',
    totalSlots: 80,
    filledSlots: 72,
    status: 'almost-full',
  },
  {
    id: 'evt-3',
    title: 'Surf das Dunas',
    startAt: '2024-06-25T08:00:00-03:00',
    location: 'Natal • RN',
    totalSlots: 50,
    filledSlots: 50,
    status: 'full',
  },
  {
    id: 'evt-4',
    title: 'Campeonato de Vôlei',
    startAt: '2024-06-28T09:00:00-03:00',
    location: 'São Paulo • SP',
    totalSlots: 120,
    filledSlots: 38,
    status: 'active',
  },
];

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return mockCalendarEvents.filter((event) =>
      isSameDay(new Date(event.startAt), day)
    );
  };

  const getStatusBadge = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
            Ativo
          </Badge>
        );
      case 'almost-full':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
            Quase lotado
          </Badge>
        );
      case 'full':
        return (
          <Badge className="bg-slate-100 text-slate-700 border-0 text-xs">
            Lotado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
            Cancelado
          </Badge>
        );
    }
  };

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'almost-full':
        return 'bg-amber-500';
      case 'full':
        return 'bg-slate-400';
      case 'cancelled':
        return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <CalendarDays size={20} className="text-[hsl(var(--admin-primary))]" />
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {daysInMonth.map((day) => {
          const events = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={cn(
                'min-h-[80px] p-2 border rounded-lg transition-colors',
                isSameMonth(day, currentDate)
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-slate-100',
                isToday && 'ring-2 ring-[hsl(var(--admin-primary))]'
              )}
            >
              <div
                className={cn(
                  'text-xs font-medium mb-1',
                  isToday
                    ? 'text-[hsl(var(--admin-primary))]'
                    : 'text-slate-700'
                )}
              >
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={cn(
                      'w-full text-left p-1 rounded text-xs truncate',
                      'hover:bg-slate-100 transition-colors',
                      'flex items-center gap-1'
                    )}
                  >
                    <div
                      className={cn('w-2 h-2 rounded-full shrink-0', getStatusColor(event.status))}
                    />
                    <span className="truncate text-slate-800">{event.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Data/Hora:</span>
                  <span className="font-medium text-slate-900">
                    {formatDateTime(selectedEvent.startAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Local:</span>
                  <span className="font-medium text-slate-900">{selectedEvent.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vagas vendidas/total:</span>
                  <span className="font-medium text-slate-900">
                    {selectedEvent.filledSlots}/{selectedEvent.totalSlots}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  {getStatusBadge(selectedEvent.status)}
                </div>
              </div>

              <Button
                className="w-full gap-2 bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/90"
                onClick={() => {
                  // Navigate to event details
                  window.location.href = `/admin/eventos`;
                }}
              >
                <ExternalLink size={16} />
                Abrir em Eventos
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
