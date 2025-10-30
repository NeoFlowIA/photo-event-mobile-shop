import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Download, Filter } from 'lucide-react';
import { formatCurrency, formatDateTime } from './utils';

interface SaleRecord {
  id: string;
  eventTitle: string;
  customerName: string;
  photographerName: string;
  date: string;
  photosCount: number;
  amountCents: number;
  status: 'completed' | 'pending' | 'refunded';
}

const mockSales: SaleRecord[] = [
  {
    id: 'sale-1001',
    eventTitle: 'Maratona de São Paulo 2024',
    customerName: 'João Silva',
    photographerName: 'Aline Castro',
    date: '2024-06-17T14:30:00-03:00',
    photosCount: 12,
    amountCents: 22680,
    status: 'completed',
  },
  {
    id: 'sale-1002',
    eventTitle: 'Triathlon Lagoa Azul',
    customerName: 'Maria Santos',
    photographerName: 'Diego Martins',
    date: '2024-06-17T10:15:00-03:00',
    photosCount: 8,
    amountCents: 17520,
    status: 'completed',
  },
  {
    id: 'sale-1003',
    eventTitle: 'Festival de Dança Urbana',
    customerName: 'Pedro Oliveira',
    photographerName: 'Juliana Pires',
    date: '2024-06-16T22:40:00-03:00',
    photosCount: 5,
    amountCents: 7950,
    status: 'pending',
  },
  {
    id: 'sale-1004',
    eventTitle: 'Meia Maratona Rio Sunrise',
    customerName: 'Ana Costa',
    photographerName: 'Bruno Alves',
    date: '2024-06-16T18:20:00-03:00',
    photosCount: 15,
    amountCents: 28350,
    status: 'completed',
  },
  {
    id: 'sale-1005',
    eventTitle: 'Gran Fondo Serra do Mar',
    customerName: 'Carlos Mendes',
    photographerName: 'Equipe EventosRun',
    date: '2024-06-15T16:55:00-03:00',
    photosCount: 3,
    amountCents: 5670,
    status: 'refunded',
  },
];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.photographerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: SaleRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-0">
            Concluída
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-0">
            Pendente
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-slate-100 text-slate-700 border-0">
            Reembolsada
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Vendas</h1>
        <p className="text-slate-600">Histórico de transações e pedidos</p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por evento, cliente ou fotógrafo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fotógrafo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Fotos</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {sale.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {sale.eventTitle}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {sale.customerName}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {sale.photographerName}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {formatDateTime(sale.date)}
                  </TableCell>
                  <TableCell className="text-center text-slate-700">
                    {sale.photosCount}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {formatCurrency(sale.amountCents)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(sale.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhuma transação encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
