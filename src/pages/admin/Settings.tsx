import { useMemo, useState } from 'react';
import {
  adminEventCategories,
  adminFinancialPolicies,
  adminIntegrationConfig,
  adminSystemParameters,
  AdminEventCategory,
  FinancialPolicies,
} from '@/data/adminMock';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [systemParams, setSystemParams] = useState(adminSystemParameters);
  const [financialPolicies, setFinancialPolicies] = useState(adminFinancialPolicies);
  const [categories, setCategories] = useState(adminEventCategories);
  const [integrationConfig, setIntegrationConfig] = useState(adminIntegrationConfig);

  const isDirty = useMemo(
    () =>
      JSON.stringify(systemParams) !== JSON.stringify(adminSystemParameters) ||
      JSON.stringify(financialPolicies) !== JSON.stringify(adminFinancialPolicies) ||
      JSON.stringify(categories) !== JSON.stringify(adminEventCategories) ||
      JSON.stringify(integrationConfig) !== JSON.stringify(adminIntegrationConfig),
    [systemParams, financialPolicies, categories, integrationConfig],
  );

  const updateFinancialPolicy = <Key extends keyof FinancialPolicies>(key: Key, value: FinancialPolicies[Key]) => {
    setFinancialPolicies((prev) => ({ ...prev, [key]: value }));
  };

  const updateCategory = (id: string, updates: Partial<AdminEventCategory>) => {
    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, ...updates } : category)));
  };

  const addCategory = () => {
    const newCategory: AdminEventCategory = {
      id: `cat-${Date.now()}`,
      name: 'Nova categoria',
      description: 'Atualize a descrição após salvar.',
      defaultPlatformFee: 18,
    };
    setCategories((prev) => [newCategory, ...prev]);
  };

  const handleSave = () => {
    toast({
      title: 'Configurações atualizadas',
      description:
        'Os parâmetros foram persistidos localmente. Integrações com Hasura e serviços externos seriam atualizadas via mutation.',
    });
  };

  const resetAll = () => {
    setSystemParams(adminSystemParameters);
    setFinancialPolicies(adminFinancialPolicies);
    setCategories(adminEventCategories);
    setIntegrationConfig(adminIntegrationConfig);
  };

  return (
    <div className="space-y-6">
      <Card className="border-transparent bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Configurações do sistema</CardTitle>
          <p className="text-sm text-slate-500">
            Parâmetros gerais, categorias de eventos, taxas e integrações com Hasura e provedores externos.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Parâmetros gerais</CardTitle>
              <p className="text-sm text-slate-500">Identidade da plataforma e políticas operacionais padrão.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Nome da plataforma</label>
                <Input
                  className="mt-1"
                  value={systemParams.platformName}
                  onChange={(event) => setSystemParams({ ...systemParams, platformName: event.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">E-mail de suporte</label>
                  <Input
                    className="mt-1"
                    value={systemParams.supportEmail}
                    onChange={(event) => setSystemParams({ ...systemParams, supportEmail: event.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">WhatsApp</label>
                  <Input
                    className="mt-1"
                    value={systemParams.supportWhatsApp}
                    onChange={(event) => setSystemParams({ ...systemParams, supportWhatsApp: event.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Moeda padrão</label>
                  <Input
                    className="mt-1"
                    value={systemParams.defaultCurrency}
                    onChange={(event) => setSystemParams({ ...systemParams, defaultCurrency: event.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Timezone</label>
                  <Input
                    className="mt-1"
                    value={systemParams.timezone}
                    onChange={(event) => setSystemParams({ ...systemParams, timezone: event.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Auto arquivar (dias)</label>
                  <Input
                    type="number"
                    min={1}
                    className="mt-1"
                    value={systemParams.autoArchiveDays}
                    onChange={(event) =>
                      setSystemParams({ ...systemParams, autoArchiveDays: Number(event.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Janela de revisão (h)</label>
                  <Input
                    type="number"
                    min={1}
                    className="mt-1"
                    value={systemParams.reviewWindowHours}
                    onChange={(event) =>
                      setSystemParams({ ...systemParams, reviewWindowHours: Number(event.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                <label className="text-xs font-semibold uppercase text-slate-500">Recursos</label>
                <div className="flex items-center justify-between text-sm">
                  <span>Entrega instantânea para clientes</span>
                  <Switch
                    checked={systemParams.instantDeliveryEnabled}
                    onCheckedChange={(value) =>
                      setSystemParams({ ...systemParams, instantDeliveryEnabled: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Matching automático via IA</span>
                  <Switch
                    checked={systemParams.aiMatchingEnabled}
                    onCheckedChange={(value) => setSystemParams({ ...systemParams, aiMatchingEnabled: value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-800">Comissões e taxas</CardTitle>
              <p className="text-sm text-slate-500">Controle da precificação, limites e políticas de payout.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Fee da plataforma (%)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.platformFeePercent}
                    onChange={(event) => updateFinancialPolicy('platformFeePercent', Number(event.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Share do fotógrafo (%)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.photographerSharePercent}
                    onChange={(event) =>
                      updateFinancialPolicy('photographerSharePercent', Number(event.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Taxa diária por foto (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.photoDailyFeeCents / 100}
                    onChange={(event) =>
                      updateFinancialPolicy('photoDailyFeeCents', Math.round(Number(event.target.value) * 100) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Processamento IA (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.aiProcessingFeeCents / 100}
                    onChange={(event) =>
                      updateFinancialPolicy('aiProcessingFeeCents', Math.round(Number(event.target.value) * 100) || 0)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Payout mínimo (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.minimumPayoutCents / 100}
                    onChange={(event) =>
                      updateFinancialPolicy('minimumPayoutCents', Math.round(Number(event.target.value) * 100) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Limite diário de upload</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.dailyUploadLimit}
                    onChange={(event) =>
                      updateFinancialPolicy('dailyUploadLimit', Number(event.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                <label className="text-xs font-semibold uppercase text-slate-500">Políticas automáticas</label>
                <div className="flex items-center justify-between text-sm">
                  <span>Payout instantâneo habilitado</span>
                  <Switch
                    checked={financialPolicies.instantPayoutEnabled}
                    onCheckedChange={(value) => updateFinancialPolicy('instantPayoutEnabled', value)}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Fila de auditoria automática</span>
                  <Switch
                    checked={financialPolicies.auditQueueEnabled}
                    onCheckedChange={(value) => updateFinancialPolicy('auditQueueEnabled', value)}
                  />
                </div>
                <div>
                  <label className="mt-3 text-xs font-semibold uppercase text-slate-500">Autorização automática (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={financialPolicies.autoApproveThresholdCents / 100}
                    onChange={(event) =>
                      updateFinancialPolicy('autoApproveThresholdCents', Math.round(Number(event.target.value) * 100) || 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="border-transparent bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-800">Categorias de eventos</CardTitle>
            <p className="text-sm text-slate-500">
              Estas categorias alimentam o catálogo público e as permissões do Hasura para filtragem dinâmica.
            </p>
          </div>
          <Button variant="outline" onClick={addCategory}>
            Adicionar categoria
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Input
                    value={category.name}
                    onChange={(event) => updateCategory(category.id, { name: event.target.value })}
                    className="font-semibold text-slate-900"
                  />
                  <Input
                    value={category.description}
                    onChange={(event) => updateCategory(category.id, { description: event.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="sm:w-48">
                  <label className="text-xs font-semibold uppercase text-slate-500">Fee sugerido (%)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={category.defaultPlatformFee}
                    onChange={(event) =>
                      updateCategory(category.id, { defaultPlatformFee: Number(event.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-transparent bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">Integrações</CardTitle>
          <p className="text-sm text-slate-500">
            Configurações relacionadas ao Hasura, armazenamento e provedores de pagamentos.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Endpoint Hasura</label>
            <Input
              className="mt-1"
              value={integrationConfig.hasuraEndpoint}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, hasuraEndpoint: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Role padrão</label>
            <Input
              className="mt-1"
              value={integrationConfig.analyticsProvider}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, analyticsProvider: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Provedor de storage</label>
            <Input
              className="mt-1"
              value={integrationConfig.storageProvider}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, storageProvider: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Região</label>
            <Input
              className="mt-1"
              value={integrationConfig.storageRegion}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, storageRegion: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Domínio CDN</label>
            <Input
              className="mt-1"
              value={integrationConfig.cdnDomain}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, cdnDomain: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Gateway de pagamento</label>
            <Input
              className="mt-1"
              value={integrationConfig.paymentGateway}
              onChange={(event) => setIntegrationConfig({ ...integrationConfig, paymentGateway: event.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50 py-4">
          <div className="text-xs text-slate-500">
            Última sincronização com Hasura há 2h. Alterações serão aplicadas via mutation protegida.
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={resetAll} disabled={!isDirty}>
              Descartar alterações
            </Button>
            <Button onClick={handleSave} disabled={!isDirty}>
              Salvar tudo
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
