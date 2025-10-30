import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Sales = () => (
  <div className="space-y-6">
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Relatório de vendas</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Consolidado de pedidos, receitas e comissões. TODO: integrar com a fonte oficial de dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-500">
        Nenhum painel ativo nesta seção ainda. Utilize os filtros do Dashboard enquanto os dados de vendas são conectados.
      </CardContent>
    </Card>
  </div>
);

export default Sales;
