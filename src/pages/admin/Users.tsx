import { useMemo, useState } from 'react';
import { adminUsers, AdminUserRecord, AdminUserStatus } from '@/data/adminMock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime } from './utils';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

const statusLabels: Record<AdminUserStatus, { label: string; badge: string }> = {
  active: { label: 'Ativo', badge: 'bg-emerald-100 text-emerald-700' },
  suspended: { label: 'Suspenso', badge: 'bg-rose-100 text-rose-600' },
  invited: { label: 'Convite pendente', badge: 'bg-amber-100 text-amber-700' },
};

const roleLabels: Record<AdminUserRecord['role'], string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
  fotografo: 'Fotógrafo',
};

const planLabel: Record<AdminUserRecord['plan'], string> = {
  gratuito: 'Gratuito',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const Users = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUserRecord['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminUserStatus>('all');
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [records, setRecords] = useState(adminUsers);
  const [selectedId, setSelectedId] = useState(records[0]?.id ?? '');

  const totalActive = useMemo(
    () => records.filter((user) => user.status === 'active').length,
    [records],
  );
  const totalInvited = useMemo(
    () => records.filter((user) => user.status === 'invited').length,
    [records],
  );
  const flaggedCount = useMemo(
    () => records.filter((user) => user.flagged).length,
    [records],
  );
  const photographersCount = useMemo(
    () => records.filter((user) => user.role === 'fotografo').length,
    [records],
  );

  const filtered = useMemo(() => {
    return records.filter((user) => {
      const matchSearch = search
        ? `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchRole = roleFilter === 'all' ? true : user.role === roleFilter;
      const matchStatus = statusFilter === 'all' ? true : user.status === statusFilter;
      const matchFlag = onlyFlagged ? user.flagged : true;
      return matchSearch && matchRole && matchStatus && matchFlag;
    });
  }, [records, search, roleFilter, statusFilter, onlyFlagged]);

  const selectedUser = useMemo(
    () => records.find((user) => user.id === selectedId) ?? filtered[0] ?? null,
    [records, selectedId, filtered],
  );

  const toggleStatus = (user: AdminUserRecord) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setRecords((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
    );
    setSelectedId(user.id);
    toast({
      title: 'Status atualizado',
      description:
        nextStatus === 'active'
          ? `${user.name} foi reativado e receberá um e-mail de confirmação.`
          : `${user.name} foi suspenso. A conta fica bloqueada para login até reavaliação.`,
    });
  };

  const resendInvite = (user: AdminUserRecord) => {
    toast({
      title: 'Convite reenviado',
      description: `Um novo e-mail de convite foi disparado para ${user.email}.`,
    });
  };

  const markDocuments = (user: AdminUserRecord, verified: boolean) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, documentsVerified: verified } : item)),
    );
    toast({
      title: 'Documentação atualizada',
      description: verified
        ? `Documentos de ${user.name} marcados como verificados.`
        : `Solicitamos novos documentos para ${user.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Administração"
        title="Gestão de usuários"
        description="Acompanhe clientes e fotógrafos habilitados no marketplace. Use filtros consistentes para localizar contas e aplicar ações administrativas com confiança."
        actions={
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Dica rápida</p>
            <p className="mt-1 leading-relaxed">
              Use TAB para navegar pelos filtros. Todos os botões e seletores podem ser ativados via teclado.
            </p>
          </div>
        }
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total cadastrados</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{records.length.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ativos</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">{totalActive.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Convites pendentes</p>
          <p className="mt-1 text-lg font-semibold text-amber-600">{totalInvited.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fotógrafos verificados</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{photographersCount.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contas sinalizadas</p>
          <p className="mt-1 text-lg font-semibold text-rose-600">{flaggedCount.toLocaleString('pt-BR')}</p>
        </div>
      </AdminPageHeader>

      <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Busca</label>
            <Input
              placeholder="Nome, e-mail ou telefone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Perfil</label>
            <div className="mt-2 flex gap-2">
              {(['all', 'cliente', 'fotografo', 'admin'] as const).map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant={roleFilter === role ? 'default' : 'outline'}
                  onClick={() => setRoleFilter(role)}
                  className="flex-1 rounded-lg"
                >
                  {role === 'all' ? 'Todos' : roleLabels[role]}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <div className="mt-2 flex gap-2">
              {(['all', 'active', 'suspended', 'invited'] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className="flex-1 rounded-lg"
                >
                  {status === 'all' ? 'Todos' : statusLabels[status].label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/70 px-3 py-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">Somente sinalizados</p>
              <p className="text-xs text-slate-500">Contas com pendências de compliance.</p>
            </div>
            <Switch checked={onlyFlagged} onCheckedChange={setOnlyFlagged} aria-label="Filtrar contas sinalizadas" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">{filtered.length} usuários encontrados</CardTitle>
            <p className="text-sm text-slate-500">Clique para ver os detalhes completos e aplicar ações pontuais.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((user) => {
              const status = statusLabels[user.status];
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedId(user.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selectedId === user.id ? 'border-primary/50 bg-primary/5' : 'border-slate-200 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Badge className={status.badge}>{status.label}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-4">
                    <div>
                      <p className="font-medium text-slate-500">Perfil</p>
                      <p>{roleLabels[user.role]}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Plano</p>
                      <p>{planLabel[user.plan]}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Último acesso</p>
                      <p>{formatDateTime(user.lastActiveAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Tags</p>
                      <p>{user.tags.join(', ') || '—'}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {selectedUser && (
          <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Detalhes do usuário</CardTitle>
              <p className="text-sm text-slate-500">Resumo financeiro e status de compliance.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Identificação</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedUser.name}</p>
                <p>{selectedUser.email}</p>
                <p>{selectedUser.phone}</p>
                <p>{selectedUser.location}</p>
              </div>

              <div className="grid gap-3 rounded-xl border border-slate-200 p-4 text-xs uppercase text-slate-500 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Registro</p>
                  <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                    {formatDateTime(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Volume transacionado</p>
                  <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                    {formatCurrency(selectedUser.totalSpendCents)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Uploads realizados</p>
                  <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                    {selectedUser.totalUploads.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Documentos</p>
                  <p className="mt-1 text-sm font-semibold normal-case text-slate-900">
                    {selectedUser.documentsVerified ? 'Verificados' : 'Pendente de análise'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="default" className="w-full" onClick={() => toggleStatus(selectedUser)}>
                  {selectedUser.status === 'suspended' ? 'Reativar conta' : 'Suspender conta'}
                </Button>
                {selectedUser.status === 'invited' && (
                  <Button variant="outline" className="w-full" onClick={() => resendInvite(selectedUser)}>
                    Reenviar convite de acesso
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => markDocuments(selectedUser, !selectedUser.documentsVerified)}
                >
                  {selectedUser.documentsVerified ? 'Marcar documentos como pendentes' : 'Confirmar verificação de documentos'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Users;
