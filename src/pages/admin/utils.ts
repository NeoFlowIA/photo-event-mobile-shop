import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (valueInCents: number) =>
  (valueInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });

export const formatNumber = (value: number) =>
  value.toLocaleString('pt-BR', {
    maximumFractionDigits: 0,
  });

export const formatPercent = (value: number, options?: Intl.NumberFormatOptions) =>
  (value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options,
  });

export const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return format(parsed, "dd/MM/yyyy 'às' HH'h'mm", { locale: ptBR });
};

export const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return format(parsed, 'dd/MM/yyyy', { locale: ptBR });
};
