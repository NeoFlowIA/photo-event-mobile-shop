import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

type PeriodOption = 'today' | '7days' | '30days' | 'custom';

interface DashboardFiltersProps {
  onFiltersChange?: (period: PeriodOption, dateRange?: { from: Date; to?: Date }) => void;
}

const DashboardFilters = ({ onFiltersChange }: DashboardFiltersProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('30days');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>();

  const periodOptions = [
    { value: 'today' as const, label: 'Hoje' },
    { value: '7days' as const, label: '7 dias' },
    { value: '30days' as const, label: '30 dias' },
    { value: 'custom' as const, label: 'Personalizado' },
  ];

  const handlePeriodChange = (period: PeriodOption) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setDateRange(undefined);
      onFiltersChange?.(period);
      toast({
        description: 'Filtros aplicados.',
      });
    }
  };

  const handleCustomDateApply = () => {
    if (dateRange?.from) {
      onFiltersChange?.('custom', dateRange);
      toast({
        description: 'Filtros aplicados.',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-slate-700">Período:</span>
      
      {periodOptions.slice(0, 3).map((option) => (
        <Button
          key={option.value}
          variant={selectedPeriod === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodChange(option.value)}
          className={cn(
            selectedPeriod === option.value &&
              'bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/90'
          )}
        >
          {selectedPeriod === option.value && <Check size={14} className="mr-1" />}
          {option.label}
        </Button>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={selectedPeriod === 'custom' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'gap-2',
              selectedPeriod === 'custom' &&
                'bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/90'
            )}
          >
            <CalendarIcon size={14} />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'dd/MM', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              'Personalizado'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range as { from: Date; to?: Date });
              setSelectedPeriod('custom');
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
          {dateRange?.from && (
            <div className="p-3 border-t">
              <Button
                size="sm"
                className="w-full bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary))]/90"
                onClick={handleCustomDateApply}
              >
                Aplicar
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardFilters;
