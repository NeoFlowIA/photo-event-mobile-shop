import { useState } from 'react';
import { Calendar, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const PhotographerCollaborations = () => {
  // Mock collaborations data
  const [colaboracoes] = useState([
    {
      id: '1',
      evento: 'Maratona Internacional',
      fotografoPrincipal: 'Carlos Santos',
      data: '2024-02-15',
      local: 'Beira Mar, Fortaleza - CE',
      percentual: 25,
      fotos: 120,
      vendas: 45,
      comissao: 675.00,
      status: 'ativo'
    },
    {
      id: '2',
      evento: 'Triathlon Aquiraz',
      fotografoPrincipal: 'Marina Costa',
      data: '2024-01-20',
      local: 'Aquiraz, CE',
      percentual: 30,
      fotos: 89,
      vendas: 32,
      comissao: 480.00,
      status: 'concluido'
    },
    {
      id: '3',
      evento: 'Corrida Noturna',
      fotografoPrincipal: 'Pedro Lima',
      data: '2024-03-30',
      local: 'Lagoa da Parangaba, Fortaleza - CE',
      percentual: 20,
      fotos: 0,
      vendas: 0,
      comissao: 0,
      status: 'agendado'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'agendado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Em andamento';
      case 'concluido': return 'Concluído';
      case 'agendado': return 'Agendado';
      default: return status;
    }
  };

  const totalComissoes = colaboracoes.reduce((total, col) => total + col.comissao, 0);
  const totalFotos = colaboracoes.reduce((total, col) => total + col.fotos, 0);
  const totalVendas = colaboracoes.reduce((total, col) => total + col.vendas, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Colaborações" showCart={false} showBack={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Colaborações</h1>
          <p className="text-muted-foreground">
            Eventos em que você participa como colaborador
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalComissoes.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotos Enviadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFotos}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVendas}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaborações Ativas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {colaboracoes.filter(c => c.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collaborations List */}
        <div className="space-y-4">
          {colaboracoes.map((colaboracao) => (
            <Card key={colaboracao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{colaboracao.evento}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fotógrafo principal: {colaboracao.fotografoPrincipal}
                    </p>
                  </div>
                  <Badge className={getStatusColor(colaboracao.status)}>
                    {getStatusText(colaboracao.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{new Date(colaboracao.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{colaboracao.local}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Percentual:</span>
                    <span className="ml-1 font-semibold">{colaboracao.percentual}%</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Fotos:</span>
                    <span className="ml-1 font-semibold">{colaboracao.fotos}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Comissão:</span>
                    <span className="ml-1 font-semibold text-green-600">
                      R$ {colaboracao.comissao.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {colaboracoes.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma colaboração encontrada</h3>
            <p className="text-muted-foreground">
              Você ainda não participa de nenhum evento como colaborador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotographerCollaborations;