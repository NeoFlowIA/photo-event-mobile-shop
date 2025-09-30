export type TrendDirection = 'up' | 'down';

export interface AdminSummaryMetric {
  id: string;
  title: string;
  description: string;
  value: number;
  format: 'currency' | 'integer' | 'percentage';
  change: number;
  trend: TrendDirection;
  comparisonLabel: string;
}

export interface MonthlyRevenuePoint {
  month: string;
  gross: number;
  net: number;
  payouts: number;
}

export interface DailyUploadPoint {
  date: string;
  uploads: number;
  approvals: number;
  aiMatches: number;
}

export type PendingEventStatus = 'analysis' | 'approved' | 'rejected' | 'needs_revision';

export interface PendingEvent {
  id: string;
  title: string;
  category: string;
  photographer: string;
  photographerHandle: string;
  submittedAt: string;
  startAt: string;
  location: string;
  expectedPhotos: number;
  basePriceCents: number;
  suggestedPhotoFeeCents: number;
  platformFeePercent: number;
  riskScore: number;
  status: PendingEventStatus;
  notes?: string;
}

export interface PayoutQueueItem {
  id: string;
  photographer: string;
  amountCents: number;
  dueDate: string;
  events: number;
  status: 'pending' | 'processing' | 'paid';
}

export interface FinancialPolicies {
  platformFeePercent: number;
  photographerSharePercent: number;
  photoDailyFeeCents: number;
  aiProcessingFeeCents: number;
  minimumPayoutCents: number;
  dailyUploadLimit: number;
  instantPayoutEnabled: boolean;
  auditQueueEnabled: boolean;
  autoApproveThresholdCents: number;
}

export interface OperationalAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export const adminSummaryMetrics: AdminSummaryMetric[] = [
  {
    id: 'gross-revenue',
    title: 'Faturamento bruto',
    description: 'Volume total processado nas últimas 4 semanas.',
    value: 3245000,
    format: 'currency',
    change: 0.082,
    trend: 'up',
    comparisonLabel: 'vs. último mês',
  },
  {
    id: 'net-revenue',
    title: 'Receita líquida',
    description: 'Valor líquido após taxas de processamento e repasses.',
    value: 2187000,
    format: 'currency',
    change: 0.043,
    trend: 'up',
    comparisonLabel: 'vs. último mês',
  },
  {
    id: 'active-events',
    title: 'Eventos ativos',
    description: 'Eventos publicados e com fotos disponíveis.',
    value: 126,
    format: 'integer',
    change: -0.015,
    trend: 'down',
    comparisonLabel: 'vs. última semana',
  },
  {
    id: 'approval-rate',
    title: 'Taxa de aprovação',
    description: 'Percentual de eventos aprovados sem ajustes.',
    value: 0.914,
    format: 'percentage',
    change: 0.027,
    trend: 'up',
    comparisonLabel: 'vs. média histórica',
  },
];

export const adminMonthlyRevenue: MonthlyRevenuePoint[] = [
  { month: 'Jan', gross: 1840000, net: 1240000, payouts: 680000 },
  { month: 'Fev', gross: 1925000, net: 1315000, payouts: 710000 },
  { month: 'Mar', gross: 2058000, net: 1424000, payouts: 735000 },
  { month: 'Abr', gross: 2189000, net: 1516000, payouts: 780000 },
  { month: 'Mai', gross: 2304000, net: 1598000, payouts: 812000 },
  { month: 'Jun', gross: 2417000, net: 1689000, payouts: 845000 },
];

export const adminDailyUploads: DailyUploadPoint[] = [
  { date: '2024-06-10', uploads: 3100, approvals: 2875, aiMatches: 1640 },
  { date: '2024-06-11', uploads: 3280, approvals: 2990, aiMatches: 1720 },
  { date: '2024-06-12', uploads: 3425, approvals: 3150, aiMatches: 1810 },
  { date: '2024-06-13', uploads: 3560, approvals: 3285, aiMatches: 1895 },
  { date: '2024-06-14', uploads: 3720, approvals: 3460, aiMatches: 1980 },
  { date: '2024-06-15', uploads: 3890, approvals: 3625, aiMatches: 2055 },
  { date: '2024-06-16', uploads: 4010, approvals: 3750, aiMatches: 2140 },
];

export const adminPendingEvents: PendingEvent[] = [
  {
    id: 'evt-9810',
    title: 'Maratona de São Paulo 2024',
    category: 'Corrida de rua',
    photographer: 'Aline Castro',
    photographerHandle: '@aline.castro',
    submittedAt: '2024-06-15T09:30:00-03:00',
    startAt: '2024-07-02T06:00:00-03:00',
    location: 'São Paulo • SP',
    expectedPhotos: 4800,
    basePriceCents: 2490,
    suggestedPhotoFeeCents: 1890,
    platformFeePercent: 18,
    riskScore: 12,
    status: 'analysis',
    notes: 'Evento recorrente com alta conversão de pedidos.',
  },
  {
    id: 'evt-9822',
    title: 'Triathlon Lagoa Azul',
    category: 'Triathlon',
    photographer: 'Diego Martins',
    photographerHandle: '@diego.martins',
    submittedAt: '2024-06-16T14:20:00-03:00',
    startAt: '2024-07-10T07:30:00-03:00',
    location: 'Florianópolis • SC',
    expectedPhotos: 5200,
    basePriceCents: 2990,
    suggestedPhotoFeeCents: 2190,
    platformFeePercent: 21,
    riskScore: 24,
    status: 'analysis',
    notes: 'Solicitou priorização no processamento de IA.',
  },
  {
    id: 'evt-9828',
    title: 'Festival de Dança Urbana',
    category: 'Eventos culturais',
    photographer: 'Juliana Pires',
    photographerHandle: '@ju.pires',
    submittedAt: '2024-06-17T11:10:00-03:00',
    startAt: '2024-07-05T19:00:00-03:00',
    location: 'Belo Horizonte • MG',
    expectedPhotos: 2650,
    basePriceCents: 2190,
    suggestedPhotoFeeCents: 1590,
    platformFeePercent: 16,
    riskScore: 35,
    status: 'analysis',
    notes: 'Primeira edição — incluir acompanhamento manual.',
  },
];

export const adminPayoutQueue: PayoutQueueItem[] = [
  {
    id: 'payout-4102',
    photographer: 'Carlos Lima',
    amountCents: 428500,
    dueDate: '2024-06-19',
    events: 3,
    status: 'pending',
  },
  {
    id: 'payout-4103',
    photographer: 'Studio Horizonte',
    amountCents: 312900,
    dueDate: '2024-06-20',
    events: 2,
    status: 'processing',
  },
  {
    id: 'payout-4104',
    photographer: 'Equipe FlashRun',
    amountCents: 198700,
    dueDate: '2024-06-18',
    events: 1,
    status: 'pending',
  },
];

export const adminFinancialPolicies: FinancialPolicies = {
  platformFeePercent: 18,
  photographerSharePercent: 82,
  photoDailyFeeCents: 290,
  aiProcessingFeeCents: 120,
  minimumPayoutCents: 20000,
  dailyUploadLimit: 3800,
  instantPayoutEnabled: true,
  auditQueueEnabled: true,
  autoApproveThresholdCents: 150000,
};

export const adminOperationalAlerts: OperationalAlert[] = [
  {
    id: 'alert-9001',
    title: 'Fila de aprovação alta',
    description: 'Tempo médio de aprovação acima de 6 horas para eventos culturais.',
    severity: 'medium',
    createdAt: '2024-06-17T08:00:00-03:00',
  },
  {
    id: 'alert-9002',
    title: 'Taxa de chargeback acima do esperado',
    description: 'Dois pedidos com chargeback nas últimas 24h. Revisar pedido #12988.',
    severity: 'high',
    createdAt: '2024-06-16T21:15:00-03:00',
  },
  {
    id: 'alert-9003',
    title: 'Limite diário de fotos próximo do teto',
    description: 'Upload diário atingiu 92% da capacidade configurada.',
    severity: 'low',
    createdAt: '2024-06-16T23:45:00-03:00',
  },
];
