import { useMemo, useState } from 'react';
import { adminPhotoAssets, AdminPhotoAsset, AdminPhotoStatus } from '@/data/adminMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatPercent } from './utils';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

const statusLabels: Record<AdminPhotoStatus, { label: string; badge: string }> = {
  published: { label: 'Publicado', badge: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'Processando', badge: 'bg-amber-100 text-amber-700' },
  flagged: { label: 'Pendente de revisão', badge: 'bg-rose-100 text-rose-600' },
};

const Photos = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminPhotoStatus>('all');
  const [eventFilter, setEventFilter] = useState<'all' | string>('all');
  const [assets, setAssets] = useState(adminPhotoAssets);
  const [selectedId, setSelectedId] = useState(adminPhotoAssets[0]?.id ?? '');

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

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedId) ?? filtered[0] ?? null,
    [assets, selectedId, filtered],
  );

  const publishedCount = useMemo(
    () => assets.filter((asset) => asset.status === 'published').length,
    [assets],
  );
  const processingCount = useMemo(
    () => assets.filter((asset) => asset.status === 'processing').length,
    [assets],
  );
  const flaggedCount = useMemo(
    () => assets.filter((asset) => asset.status === 'flagged').length,
    [assets],
  );
  const averageConfidence = useMemo(() => {
    if (assets.length === 0) return 0;
    const total = assets.reduce((sum, asset) => sum + asset.aiConfidence, 0);
    return total / assets.length;
  }, [assets]);

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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Gestão de fotos"
        description="Acompanhe o fluxo de uploads, aprovação assistida por IA e liberação para venda das fotos nos eventos."
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catálogo publicado</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{publishedCount.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Processamento em curso</p>
          <p className="mt-1 text-lg font-semibold text-amber-600">{processingCount.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fila de revisão</p>
          <p className="mt-1 text-lg font-semibold text-rose-600">{flaggedCount.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confiança média da IA</p>
          <p className="mt-1 text-lg font-semibold text-primary">{formatPercent(averageConfidence)}%</p>
        </div>
      </AdminPageHeader>

      <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Busca</label>
            <Input
              placeholder="Evento ou fotógrafo"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | AdminPhotoStatus)}>
              <SelectTrigger className="mt-2">
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
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Evento</label>
            <Select value={eventFilter} onValueChange={(value) => setEventFilter(value)}>
              <SelectTrigger className="mt-2">
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
        <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
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
          <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
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
    </div>
  );
};

export default Photos;
