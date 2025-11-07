import { useMemo, useState } from 'react';
import { adminPhotoAssets, AdminPhotoAsset, AdminPhotoStatus } from '@/data/adminMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import PhotoLightbox from '@/components/PhotoLightbox';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatPercent } from './utils';
import { DollarSign, Download, Users, Receipt, Search, Upload, Image } from 'lucide-react';

const statusLabels: Record<AdminPhotoStatus, { label: string; badge: string }> = {
  published: { label: 'Publicado', badge: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'Processando', badge: 'bg-amber-100 text-amber-700' },
  flagged: { label: 'Pendente de revisão', badge: 'bg-rose-100 text-rose-600' },
};

// Mock data para KPIs e comissões
const mockOverviewData = {
  vendas_fotos: 1245000,
  downloads: 847,
  fotografos_ativos: 23,
  taxas: 186750,
};

const mockCommissionsData = [
  {
    id: '1',
    fotografo: 'Ana Costa',
    evento: 'Maratona Beira Mar',
    vendas: 320000,
    taxas: 48000,
    comissao: 96000,
    liquido: 176000,
    status: 'pendente' as const,
  },
  {
    id: '2',
    fotografo: 'Bruno Silva',
    evento: 'Triatlo do Rio',
    vendas: 480000,
    taxas: 72000,
    comissao: 144000,
    liquido: 264000,
    status: 'pago' as const,
  },
  {
    id: '3',
    fotografo: 'Carlos Mendes',
    evento: 'Surf das Dunas',
    vendas: 280000,
    taxas: 42000,
    comissao: 84000,
    liquido: 154000,
    status: 'pendente' as const,
  },
];

// Mock data para aba "Todas"
const mockAllPhotos = adminPhotoAssets.map((asset, idx) => ({
  id: asset.id,
  thumb: `https://images.unsplash.com/photo-${1500000000000 + idx}?w=400&h=300&fit=crop`,
  url: `https://images.unsplash.com/photo-${1500000000000 + idx}?w=1200&h=900&fit=crop`,
  price: asset.priceCents / 100,
  eventTitle: asset.eventTitle,
  photographer: asset.photographer,
  uploadedAt: asset.uploadedAt,
  status: asset.status,
}));

const Photos = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminPhotoStatus>('all');
  const [eventFilter, setEventFilter] = useState<'all' | string>('all');
  const [assets, setAssets] = useState(adminPhotoAssets);
  const [selectedId, setSelectedId] = useState(adminPhotoAssets[0]?.id ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('30');
  const [commissionStatus, setCommissionStatus] = useState<'all' | 'pendente' | 'pago'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchCode, setSearchCode] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [faceSearchFile, setFaceSearchFile] = useState<File | null>(null);

  const eventOptions = useMemo(() => {
    const unique = new Map<string, string>();
    assets.forEach((asset) => {
      if (!unique.has(asset.eventId)) {
        unique.set(asset.eventId, asset.eventTitle);
      }
    });
    return Array.from(unique.entries());
  }, [assets]);

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch = search
        ? `${asset.eventTitle} ${asset.photographer}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStatus = statusFilter === 'all' ? true : asset.status === statusFilter;
      const matchEvent = eventFilter === 'all' ? true : asset.eventId === eventFilter;
      return matchSearch && matchStatus && matchEvent;
    });
  }, [assets, search, statusFilter, eventFilter]);

  const filteredCommissions = useMemo(() => {
    return mockCommissionsData.filter((c) => commissionStatus === 'all' || c.status === commissionStatus);
  }, [commissionStatus]);

  const filteredAllPhotos = useMemo(() => {
    return mockAllPhotos.filter((photo) => {
      const matchSearch = search
        ? `${photo.eventTitle} ${photo.photographer}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStatus = statusFilter === 'all' ? true : photo.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedId) ?? filtered[0] ?? null,
    [assets, selectedId, filtered],
  );

  const updateAssetStatus = (asset: AdminPhotoAsset, status: AdminPhotoStatus, reason?: string) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === asset.id ? { ...item, status, flaggedReason: reason } : item)),
    );
    setSelectedId(asset.id);
  };

  const approveAsset = (asset: AdminPhotoAsset) => {
    updateAssetStatus(asset, 'published');
    toast({
      title: 'Foto liberada para venda',
      description: `${asset.id} foi publicada e ficará disponível imediatamente no evento ${asset.eventTitle}.`,
    });
  };

  const flagAsset = (asset: AdminPhotoAsset) => {
    updateAssetStatus(asset, 'flagged', 'Marcado manualmente para revisão de conteúdo.');
    toast({
      title: 'Foto marcada para revisão',
      description: `${asset.id} foi enviada à fila de moderação especializada.`,
    });
  };

  const handleSearchByCode = () => {
    if (!searchCode.trim()) {
      toast({
        title: 'Informe um código válido.',
        variant: 'destructive',
      });
      return;
    }
    // Mock search
    const results = mockAllPhotos.filter((p) => p.id.toLowerCase().includes(searchCode.toLowerCase()));
    setSearchResults(results);
    if (results.length === 0) {
      toast({
        title: 'Nenhuma foto encontrada.',
      });
    }
  };

  const handleFaceSearch = () => {
    if (!faceSearchFile) {
      toast({
        title: 'Faça upload de uma imagem.',
        variant: 'destructive',
      });
      return;
    }
    // Mock face search - seria POST /api/fotos/search/face
    toast({
      title: 'Busca facial em desenvolvimento',
      description: 'Esta funcionalidade será integrada em breve.',
    });
    setSearchResults(mockAllPhotos.slice(0, 3));
  };

  const commissionSummary = useMemo(() => {
    const receita = filteredCommissions.reduce((acc, c) => acc + c.vendas, 0);
    const taxas = filteredCommissions.reduce((acc, c) => acc + c.taxas, 0);
    const comissoes = filteredCommissions.reduce((acc, c) => acc + c.comissao, 0);
    const liquido = filteredCommissions.reduce((acc, c) => acc + c.liquido, 0);
    return { receita, taxas, comissoes, liquido };
  }, [filteredCommissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-transparent bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Gestão de Fotos</CardTitle>
          <p className="text-sm text-slate-500">
            Acompanhe vendas, comissões e gerencie o catálogo completo de fotos dos eventos.
          </p>
        </CardHeader>
      </Card>

      {/* KPIs Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-transparent bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Vendas de Fotos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(mockOverviewData.vendas_fotos)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Downloads</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{mockOverviewData.downloads.toLocaleString('pt-BR')}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Download className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Fotógrafos Ativos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{mockOverviewData.fotografos_ativos}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Taxas</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(mockOverviewData.taxas)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="gestao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="gestao">Gestão</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="busca">
            <Search className="mr-2 h-4 w-4" />
            Busca
          </TabsTrigger>
        </TabsList>

        {/* Aba Gestão (conteúdo original) */}
        <TabsContent value="gestao" className="space-y-6">
          <Card className="border-transparent bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="text-xs font-medium uppercase text-slate-500">Busca</label>
                <Input
                  placeholder="Evento ou fotógrafo"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-slate-500">Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | AdminPhotoStatus)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="flagged">Pendente de revisão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-slate-500">Evento</label>
                <Select value={eventFilter} onValueChange={(value) => setEventFilter(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {eventOptions.map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card className="border-transparent bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">{filtered.length} fotos filtradas</CardTitle>
                <p className="text-sm text-slate-500">Selecione um item para revisar detalhes técnicos e tomar ações.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {filtered.map((asset) => {
                  const status = statusLabels[asset.status];
                  return (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedId(asset.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        selectedId === asset.id ? 'border-primary/50 bg-primary/5' : 'border-slate-200 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{asset.id}</p>
                          <p className="text-xs text-slate-500">{asset.eventTitle}</p>
                        </div>
                        <Badge className={status.badge}>{status.label}</Badge>
                      </div>
                      <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-4">
                        <div>
                          <p className="font-medium text-slate-500">Fotógrafo</p>
                          <p>{asset.photographer}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-500">Upload</p>
                          <p>{formatDateTime(asset.uploadedAt)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-500">Preço</p>
                          <p>{formatCurrency(asset.priceCents)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-500">Downloads</p>
                          <p>{asset.downloads.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {selectedAsset && (
              <Card className="border-transparent bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-800">Detalhes da foto</CardTitle>
                  <p className="text-sm text-slate-500">Informações técnicas do processamento automático.</p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Evento</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedAsset.eventTitle}</p>
                    <p className="text-xs text-slate-500">Fotógrafo {selectedAsset.photographer}</p>
                    <p className="text-xs text-slate-500">Armazenamento {selectedAsset.storageRegion}</p>
                  </div>

                  <div className="grid gap-3 rounded-xl border border-slate-200 p-4 text-xs uppercase text-slate-500">
                    <div>
                      <p className="text-slate-500">Confidence IA</p>
                      <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                        {formatPercent(selectedAsset.aiConfidence)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Matches por rosto</p>
                      <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                        {selectedAsset.faceMatches.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Downloads</p>
                      <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                        {selectedAsset.downloads.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Status</p>
                      <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                        {statusLabels[selectedAsset.status].label}
                      </p>
                    </div>
                  </div>

                  {selectedAsset.flaggedReason && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600">
                      <p className="font-semibold uppercase">Motivo da sinalização</p>
                      <p className="mt-2 text-rose-600">{selectedAsset.flaggedReason}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button variant="default" className="w-full" onClick={() => approveAsset(selectedAsset)}>
                      Liberar para venda
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => flagAsset(selectedAsset)}>
                      Encaminhar para moderação manual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Aba Comissões */}
        <TabsContent value="comissoes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-transparent bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase text-slate-500">Receita Bruta</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(commissionSummary.receita)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </CardContent>
            </Card>
            <Card className="border-transparent bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase text-slate-500">Taxas</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(commissionSummary.taxas)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </CardContent>
            </Card>
            <Card className="border-transparent bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase text-slate-500">Comissões a Pagar</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(commissionSummary.comissoes)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </CardContent>
            </Card>
            <Card className="border-transparent bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase text-slate-500">Receita Líquida</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(commissionSummary.liquido)}</p>
                <p className="mt-1 text-xs text-slate-500">no período selecionado</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-transparent bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-800">Comissões por Fotógrafo</CardTitle>
                  <p className="text-sm text-slate-500">Detalhamento de vendas e comissões a pagar</p>
                </div>
                <Select value={commissionStatus} onValueChange={(value) => setCommissionStatus(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fotógrafo</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead className="text-right">Vendas</TableHead>
                    <TableHead className="text-right">Taxas</TableHead>
                    <TableHead className="text-right">Comissão</TableHead>
                    <TableHead className="text-right">Líquido</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">{commission.fotografo}</TableCell>
                      <TableCell>{commission.evento}</TableCell>
                      <TableCell className="text-right">{formatCurrency(commission.vendas)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(commission.taxas)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(commission.comissao)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(commission.liquido)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            commission.status === 'pago'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {commission.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Todas */}
        <TabsContent value="todas" className="space-y-6">
          <Card className="border-transparent bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Todas as Fotos</CardTitle>
              <p className="text-sm text-slate-500">Acesso completo ao catálogo de fotos da plataforma</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium uppercase text-slate-500">Busca</label>
                  <Input
                    placeholder="Evento ou fotógrafo"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Status</label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="flagged">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredAllPhotos.length === 0 ? (
                <div className="py-12 text-center">
                  <Image className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-500">Nenhuma foto encontrada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredAllPhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100"
                    >
                      <div className="aspect-[4/3]">
                        <img
                          src={photo.thumb}
                          alt={photo.eventTitle}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <div className="translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                          <Badge className="bg-white/90 text-slate-900">{formatCurrency(photo.price * 100)}</Badge>
                        </div>
                      </div>
                      <div className="absolute right-2 top-2">
                        <Badge className={statusLabels[photo.status].badge}>{statusLabels[photo.status].label}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Busca */}
        <TabsContent value="busca" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Busca por Código */}
            <Card className="border-transparent bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Busca por Código de Suporte</CardTitle>
                <p className="text-sm text-slate-500">Localize fotos usando código de pedido ou suporte</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Código</label>
                  <Input
                    placeholder="Ex: PHO_20241107_001"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSearchByCode} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </CardContent>
            </Card>

            {/* Busca Facial */}
            <Card className="border-transparent bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Busca por Reconhecimento Facial</CardTitle>
                <p className="text-sm text-slate-500">Upload de foto para buscar rostos similares</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500">Imagem</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFaceSearchFile(e.target.files?.[0] || null)}
                      className="file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary"
                    />
                  </div>
                  {faceSearchFile && (
                    <p className="mt-2 text-xs text-slate-600">
                      Arquivo: {faceSearchFile.name}
                    </p>
                  )}
                </div>
                <Button onClick={handleFaceSearch} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Buscar por Rosto
                </Button>
                <p className="text-xs text-slate-500">
                  Endpoint: POST /api/fotos/search/face
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          {searchResults.length > 0 && (
            <Card className="border-transparent bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">
                  {searchResults.length} Resultados Encontrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {searchResults.map((photo, idx) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100"
                    >
                      <div className="aspect-[4/3]">
                        <img
                          src={photo.thumb}
                          alt={photo.eventTitle}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <Badge className="bg-white/90 text-slate-900">{photo.id}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {filteredAllPhotos.length > 0 && (
        <PhotoLightbox
          photos={filteredAllPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          eventId="admin-view"
          eventTitle="Admin - Todas as Fotos"
        />
      )}
    </div>
  );
};

export default Photos;
