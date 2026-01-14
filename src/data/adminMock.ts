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

export type AdminUserStatus = 'active' | 'suspended' | 'invited';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'fotografo' | 'admin';
  plan: 'gratuito' | 'pro' | 'enterprise';
  status: AdminUserStatus;
  phone: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  totalSpendCents: number;
  totalUploads: number;
  flagged: boolean;
  tags: string[];
  documentsVerified: boolean;
}

export const adminUsers: AdminUserRecord[] = [
  {
    id: 'usr-1001',
    name: 'Camila Nogueira',
    email: 'camila.nogueira@email.com',
    role: 'cliente',
    plan: 'pro',
    status: 'active',
    phone: '+55 11 98888-1212',
    location: 'São Paulo • SP',
    createdAt: '2023-02-11T18:32:00-03:00',
    lastActiveAt: '2024-06-17T20:41:00-03:00',
    totalSpendCents: 128900,
    totalUploads: 0,
    flagged: false,
    tags: ['alto engajamento', 'assinante'],
    documentsVerified: true,
  },
  {
    id: 'usr-1002',
    name: 'Bruno Alves',
    email: 'bruno.alves@flashrun.com',
    role: 'fotografo',
    plan: 'enterprise',
    status: 'active',
    phone: '+55 21 99921-3344',
    location: 'Rio de Janeiro • RJ',
    createdAt: '2022-11-03T09:20:00-03:00',
    lastActiveAt: '2024-06-17T19:05:00-03:00',
    totalSpendCents: 0,
    totalUploads: 128400,
    flagged: false,
    tags: ['top seller', 'kpi acima'],
    documentsVerified: true,
  },
  {
    id: 'usr-1003',
    name: 'Larissa Campos',
    email: 'larissa.campos@studiohorizonte.com',
    role: 'fotografo',
    plan: 'pro',
    status: 'suspended',
    phone: '+55 31 98777-9876',
    location: 'Belo Horizonte • MG',
    createdAt: '2023-06-25T13:10:00-03:00',
    lastActiveAt: '2024-06-16T22:40:00-03:00',
    totalSpendCents: 0,
    totalUploads: 45210,
    flagged: true,
    tags: ['pendência fiscal'],
    documentsVerified: false,
  },
  {
    id: 'usr-1004',
    name: 'Felipe Duarte',
    email: 'felipe.duarte@email.com',
    role: 'cliente',
    plan: 'gratuito',
    status: 'invited',
    phone: '+55 41 98812-4545',
    location: 'Curitiba • PR',
    createdAt: '2024-01-18T07:52:00-03:00',
    lastActiveAt: '2024-06-15T17:10:00-03:00',
    totalSpendCents: 32900,
    totalUploads: 0,
    flagged: false,
    tags: ['potencial upgrade'],
    documentsVerified: true,
  },
  {
    id: 'usr-1005',
    name: 'Equipe EventosRun',
    email: 'contato@eventosrun.com.br',
    role: 'admin',
    plan: 'enterprise',
    status: 'active',
    phone: '+55 48 99551-2020',
    location: 'Florianópolis • SC',
    createdAt: '2022-07-01T08:00:00-03:00',
    lastActiveAt: '2024-06-17T11:15:00-03:00',
    totalSpendCents: 0,
    totalUploads: 0,
    flagged: false,
    tags: ['suporte regional'],
    documentsVerified: true,
  },
];

export type AdminEventLifecycle = 'draft' | 'pending' | 'published' | 'running' | 'archived';

export interface AdminManagedEvent {
  id: string;
  title: string;
  category: string;
  status: AdminEventLifecycle;
  startAt: string;
  endAt: string;
  location: string;
  photographer: string;
  conversionRate: number;
  totalPhotos: number;
  soldPhotos: number;
  revenueCents: number;
  platformFeePercent: number;
  aiReviewStatus: 'pending' | 'completed' | 'blocked';
  flagged: boolean;
}

export const adminManagedEvents: AdminManagedEvent[] = [
  {
    id: 'evt-9500',
    title: 'Meia Maratona Rio Sunrise',
    category: 'Corrida de rua',
    status: 'running',
    startAt: '2024-06-16T05:30:00-03:00',
    endAt: '2024-06-16T12:00:00-03:00',
    location: 'Rio de Janeiro • RJ',
    photographer: 'Bruno Alves',
    conversionRate: 0.42,
    totalPhotos: 18650,
    soldPhotos: 7820,
    revenueCents: 542800,
    platformFeePercent: 20,
    aiReviewStatus: 'completed',
    flagged: false,
  },
  {
    id: 'evt-9512',
    title: 'Gran Fondo Serra do Mar',
    category: 'Ciclismo',
    status: 'published',
    startAt: '2024-06-22T07:00:00-03:00',
    endAt: '2024-06-22T17:00:00-03:00',
    location: 'Joinville • SC',
    photographer: 'Equipe EventosRun',
    conversionRate: 0.37,
    totalPhotos: 13400,
    soldPhotos: 4980,
    revenueCents: 368900,
    platformFeePercent: 19,
    aiReviewStatus: 'pending',
    flagged: false,
  },
  {
    id: 'evt-9535',
    title: 'Festival de Dança Urbana',
    category: 'Eventos culturais',
    status: 'pending',
    startAt: '2024-07-05T19:00:00-03:00',
    endAt: '2024-07-07T23:00:00-03:00',
    location: 'Belo Horizonte • MG',
    photographer: 'Juliana Pires',
    conversionRate: 0.0,
    totalPhotos: 0,
    soldPhotos: 0,
    revenueCents: 0,
    platformFeePercent: 16,
    aiReviewStatus: 'blocked',
    flagged: true,
  },
  {
    id: 'evt-9541',
    title: 'Campeonato de Natação Masters',
    category: 'Natação',
    status: 'published',
    startAt: '2024-06-29T08:00:00-03:00',
    endAt: '2024-06-29T18:00:00-03:00',
    location: 'São Paulo • SP',
    photographer: 'Aline Castro',
    conversionRate: 0.48,
    totalPhotos: 9200,
    soldPhotos: 4420,
    revenueCents: 289600,
    platformFeePercent: 18,
    aiReviewStatus: 'completed',
    flagged: false,
  },
  {
    id: 'evt-9550',
    title: 'Corrida Noturna Porto Alegre',
    category: 'Corrida de rua',
    status: 'archived',
    startAt: '2024-05-12T19:00:00-03:00',
    endAt: '2024-05-12T23:00:00-03:00',
    location: 'Porto Alegre • RS',
    photographer: 'Equipe FlashRun',
    conversionRate: 0.31,
    totalPhotos: 15400,
    soldPhotos: 4780,
    revenueCents: 258100,
    platformFeePercent: 20,
    aiReviewStatus: 'completed',
    flagged: false,
  },
];

export type AdminPhotoStatus = 'published' | 'processing' | 'flagged';

export interface AdminPhotoAsset {
  id: string;
  eventId: string;
  eventTitle: string;
  photographer: string;
  uploadedAt: string;
  status: AdminPhotoStatus;
  aiConfidence: number;
  faceMatches: number;
  downloads: number;
  priceCents: number;
  storageRegion: string;
  flaggedReason?: string;
}

export const adminPhotoAssets: AdminPhotoAsset[] = [
  {
    id: 'pic-78001',
    eventId: 'evt-9500',
    eventTitle: 'Meia Maratona Rio Sunrise',
    photographer: 'Bruno Alves',
    uploadedAt: '2024-06-16T06:15:00-03:00',
    status: 'published',
    aiConfidence: 0.97,
    faceMatches: 2,
    downloads: 128,
    priceCents: 1890,
    storageRegion: 'GCP • us-central1',
  },
  {
    id: 'pic-78002',
    eventId: 'evt-9500',
    eventTitle: 'Meia Maratona Rio Sunrise',
    photographer: 'Bruno Alves',
    uploadedAt: '2024-06-16T06:18:00-03:00',
    status: 'processing',
    aiConfidence: 0.88,
    faceMatches: 0,
    downloads: 0,
    priceCents: 1890,
    storageRegion: 'GCP • us-central1',
  },
  {
    id: 'pic-79010',
    eventId: 'evt-9512',
    eventTitle: 'Gran Fondo Serra do Mar',
    photographer: 'Equipe EventosRun',
    uploadedAt: '2024-06-15T14:40:00-03:00',
    status: 'published',
    aiConfidence: 0.92,
    faceMatches: 3,
    downloads: 76,
    priceCents: 2090,
    storageRegion: 'AWS • sa-east-1',
  },
  {
    id: 'pic-79022',
    eventId: 'evt-9535',
    eventTitle: 'Festival de Dança Urbana',
    photographer: 'Juliana Pires',
    uploadedAt: '2024-06-14T22:05:00-03:00',
    status: 'flagged',
    aiConfidence: 0.54,
    faceMatches: 0,
    downloads: 0,
    priceCents: 1590,
    storageRegion: 'AWS • sa-east-1',
    flaggedReason: 'Solicitada revisão manual por baixa nitidez.',
  },
  {
    id: 'pic-80011',
    eventId: 'evt-9541',
    eventTitle: 'Campeonato de Natação Masters',
    photographer: 'Aline Castro',
    uploadedAt: '2024-06-12T10:30:00-03:00',
    status: 'published',
    aiConfidence: 0.95,
    faceMatches: 1,
    downloads: 54,
    priceCents: 1790,
    storageRegion: 'GCP • us-east1',
  },
];

export interface AdminSystemParameters {
  platformName: string;
  supportEmail: string;
  supportWhatsApp: string;
  defaultCurrency: string;
  timezone: string;
  autoArchiveDays: number;
  instantDeliveryEnabled: boolean;
  aiMatchingEnabled: boolean;
  reviewWindowHours: number;
}

export const adminSystemParameters: AdminSystemParameters = {
  platformName: 'Olha a Foto Marketplace',
  supportEmail: 'suporte@olhaafoto.com.br',
  supportWhatsApp: '+55 11 4002-8922',
  defaultCurrency: 'BRL',
  timezone: 'America/Sao_Paulo',
  autoArchiveDays: 90,
  instantDeliveryEnabled: true,
  aiMatchingEnabled: true,
  reviewWindowHours: 12,
};

export interface AdminEventCategory {
  id: string;
  name: string;
  description: string;
  defaultPlatformFee: number;
}

export const adminEventCategories: AdminEventCategory[] = [
  {
    id: 'cat-running',
    name: 'Corridas e maratonas',
    description: 'Provas de rua, trail run e eventos de endurance.',
    defaultPlatformFee: 20,
  },
  {
    id: 'cat-cycling',
    name: 'Ciclismo',
    description: 'Competições de estrada, mountain bike e gran fondo.',
    defaultPlatformFee: 18,
  },
  {
    id: 'cat-swimming',
    name: 'Natação e águas abertas',
    description: 'Campeonatos aquáticos e travessias.',
    defaultPlatformFee: 18,
  },
  {
    id: 'cat-culture',
    name: 'Eventos culturais',
    description: 'Shows, festivais, teatro, dança e eventos corporativos.',
    defaultPlatformFee: 16,
  },
  {
    id: 'cat-education',
    name: 'Eventos escolares',
    description: 'Formaturas, colações de grau e competições estudantis.',
    defaultPlatformFee: 15,
  },
];

export interface AdminIntegrationConfig {
  hasuraEndpoint: string;
  adminSecretMasked: string;
  analyticsProvider: string;
  storageProvider: string;
  storageRegion: string;
  cdnDomain: string;
  paymentGateway: string;
}

export const adminIntegrationConfig: AdminIntegrationConfig = {
  hasuraEndpoint: import.meta.env.VITE_HASURA_GRAPHQL_URL ?? '',
  adminSecretMasked: 'hasura-admin-***',
  analyticsProvider: 'Posthog Cloud (região: US)',
  storageProvider: 'Google Cloud Storage',
  storageRegion: 'us-central1',
  cdnDomain: 'cdn.olhaafoto.com.br',
  paymentGateway: 'Pagar.me - marketplace flow',
};
