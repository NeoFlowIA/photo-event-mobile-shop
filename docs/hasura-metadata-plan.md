# Plano de metadata do Hasura e requisitos de autenticação

Este documento consolida o modelo de dados, relacionamentos, permissões e operações GraphQL necessários para implementar o backend do Photo Event Mobile Shop utilizando **Hasura Metadata v3** sobre PostgreSQL. Ele também descreve os requisitos de uma API de autenticação que forneça JWTs compatíveis com os papéis de acesso da aplicação (cliente, fotógrafo e administrador).

## 1. Objetivos e escopo

- Cobrir as funcionalidades expostas nas telas do aplicativo (busca de eventos/fotos, carrinho, histórico, área do fotógrafo, portfólios, etc.).
- Definir todas as entidades, relacionamentos e enums que deverão compor o schema relacional administrado pelo Hasura.
- Mapear queries, mutations, views e actions que suportam cada fluxo da interface.
- Documentar permissões por papel, automatizações necessárias (event triggers, cron jobs, actions) e integrações externas.
- Descrever a API de autenticação responsável por emissão/renovação de tokens e gestão das credenciais dos três perfis de usuário.

## 2. Versão da metadata e estrutura geral

- **Hasura metadata version**: `3` (último formato suportado pela documentação oficial).
- **Data sources**: instância PostgreSQL padrão (`default`).
- **Esquemas recomendados**:
  - `auth`: tabelas de credenciais, roles e sessões.
  - `public`: entidades centrais de negócio (eventos, fotos, pedidos, carteiras, colaborações, etc.).
  - `analytics`: views e materialized views para dashboards.
- **Extensões PostgreSQL** sugeridas: `uuid-ossp`, `pgcrypto`, `postgis` (se necessário para georreferência), `pg_trgm` (apoio a buscas por similaridade), `citext` (normalização de campos de texto).

## 3. Modelo de dados

A seguir, as entidades agrupadas por domínio com campos principais, chaves e observações. Todos os campos `*_id` são UUIDs, salvo indicação contrária.

### 3.1 Identidade e perfis

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `auth.roles` | `name (PK)`, `description` | Papéis válidos: `cliente`, `fotografo`, `admin`. |
| `auth.users` | `id (PK)`, `email (unique, citext)`, `password_hash`, `default_role`, `allowed_roles (text[])`, `is_active`, `last_login_at`, `created_at`, `updated_at` | Campos sensíveis (senha, CPF) armazenados com `pgcrypto`. |
| `auth.user_roles` | `user_id (FK auth.users)`, `role_name (FK auth.roles)`, `assigned_by`, `created_at` | Permite múltiplos papéis. |
| `public.user_profiles` | `user_id (PK/FK auth.users)`, `full_name`, `avatar_url`, `phone`, `cpf_hash`, `cpf_last4`, `birth_date`, `locale`, `timezone` | CPF armazenado em hash + sufixo para exibição. |
| `public.photographer_profiles` | `user_id (PK/FK)`, `handle (unique)`, `bio`, `website`, `social_links (jsonb)`, `city`, `state`, `coverage_radius_km`, `experience_years`, `is_verified`, `portfolio_highlight_url`, `avg_rating`, `total_reviews`, `status (enum: draft, pending_review, active, suspended)` | Apenas usuários com role `fotografo`. |
| `public.photographer_portfolio_images` | `id (PK)`, `photographer_id (FK)`, `image_url`, `caption`, `sort_order`, `created_at` | Usada nas telas de portfólio. |
| `public.client_profiles` | `user_id (PK/FK)`, `document_verified_at`, `marketing_opt_in`, `default_city` | Dados específicos de clientes. |
| `public.admin_profiles` | `user_id (PK/FK)`, `display_name`, `notes` | Metadados administrativos. |

### 3.2 Eventos, categorias e localizações

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.event_categories` | `id (PK)`, `name`, `slug (unique)` | Ex.: corrida, triathlon, ciclismo. |
| `public.events` | `id (PK)`, `slug (unique)`, `title`, `description`, `category_id (FK)`, `owner_id (FK photographer_profiles)`, `cover_url`, `start_at`, `end_at`, `timezone`, `venue_name`, `street`, `city`, `state`, `country`, `latitude`, `longitude`, `base_price_cents`, `currency`, `policy`, `resolution`, `status (enum: draft, scheduled, active, archived, completed)`, `visibility (enum: public, unlisted, private)`, `max_participants`, `created_at`, `updated_at`, `published_at` | Suporta agendamentos e exibição pública. |
| `public.event_tags` | `id`, `event_id (FK)`, `tag`, `created_at` | Busca temática. |
| `public.event_highlights` | `id`, `event_id`, `type (enum: banner, reel, story)`, `asset_url`, `caption`, `sort_order` | Conteúdo extra. |

### 3.3 Participantes e identificação

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.event_participants` | `id`, `event_id (FK)`, `bib_number`, `full_name`, `cpf_hash`, `email`, `team_name`, `consent_face_match (bool)`, `created_at` | Suporta busca por número/CPF. |
| `public.participant_identifiers` | `id`, `participant_id (FK)`, `type (enum: cpf, phone, email, tag)`, `value_hash`, `last4`, `created_at` | Normaliza múltiplos identificadores. |
| `public.participant_photo_matches` | `id`, `participant_id (FK)`, `photo_id (FK event_photos)`, `match_type (enum: manual, ai_selfie, ai_bib)`, `confidence`, `created_at`, `created_by` | Permite match por selfie/número. |

### 3.4 Fotos e uploads

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.photo_upload_batches` | `id`, `event_id`, `uploaded_by (FK auth.users)`, `total_files`, `processed_files`, `status (enum: pending, processing, completed, failed)`, `storage_path`, `created_at`, `completed_at` | Controle de upload em lote. |
| `public.event_photos` | `id`, `event_id (FK)`, `batch_id (FK)`, `storage_key`, `original_url`, `thumbnail_url`, `width`, `height`, `filesize_bytes`, `price_cents`, `currency`, `status (enum: draft, published, hidden, removed)`, `watermark_url`, `ai_tags (jsonb)`, `bib_number`, `faceprint (vector)`, `created_at`, `updated_at`, `published_at` | Base para a galeria e carrinho. |
| `public.event_photo_tags` | `photo_id (FK)`, `tag` | Suporte a filtros adicionais. |
| `public.photo_renditions` | `id`, `photo_id (FK)`, `variant (enum: original, web, thumb)`, `url`, `storage_key`, `filesize_bytes` | Diferentes tamanhos/licenças. |

### 3.5 Carrinho, pedidos e créditos

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.shopping_carts` | `id`, `user_id (FK, nullable para visitantes)`, `session_id`, `status (enum: open, converted, abandoned)`, `credit_applied_cents`, `created_at`, `updated_at`, `expires_at` | Permite sincronizar carrinho multi-dispositivo. |
| `public.shopping_cart_items` | `id`, `cart_id (FK)`, `photo_id (FK)`, `unit_price_cents`, `quantity`, `added_at`, `removed_at` | Usa `on_conflict` para evitar duplicidade. |
| `public.orders` | `id`, `user_id`, `cart_id`, `status (enum: pending_payment, paid, failed, refunded)`, `payment_method (enum: credit, pix, cash)`, `payment_reference`, `subtotal_cents`, `discount_cents`, `credit_used_cents`, `total_cents`, `currency`, `purchased_at`, `created_at`, `updated_at` | Histórico de compras. |
| `public.order_items` | `id`, `order_id`, `photo_id`, `event_id`, `unit_price_cents`, `quantity`, `license_type (enum: personal, commercial)`, `download_url`, `delivered_at` | Garante rastreio de downloads. |
| `public.order_downloads` | `id`, `order_item_id`, `downloaded_at`, `ip_address`, `device_info` | Auditoria de downloads. |
| `public.wallet_transactions` | `id`, `user_id`, `type (enum: credit_purchase, debit_purchase, refund, adjustment)`, `amount_cents`, `balance_after_cents`, `reference_order_id`, `metadata (jsonb)`, `created_at` | Mantém extrato da carteira. |
| `public.credit_packages` | `id`, `name`, `value_cents`, `bonus_percent`, `is_active`, `sort_order` | Pré-definições da tela “Adicionar crédito”. |
| `public.payment_notifications` | `id`, `order_id`, `provider`, `payload (jsonb)`, `status`, `received_at` | Webhooks de gateway. |

### 3.6 Colaborações, comissões e estatísticas

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.event_collaborators` | `id`, `event_id`, `photographer_id`, `role (enum: owner, co_owner, assistant, editor)`, `revenue_share_percent`, `invitation_status (enum: pending, accepted, declined, removed)`, `invited_at`, `accepted_at`, `removed_at` | Suporta tela de colaboradores e comissões. |
| `public.collaboration_commissions` | `id`, `collaborator_id (FK)`, `order_item_id (FK)`, `commission_cents`, `status (enum: pending, payable, paid, reversed)`, `calculated_at`, `paid_at` | Permite calcular ganhos individuais. |
| `public.photographer_metrics_daily` | `id`, `photographer_id`, `metric_date`, `events_active`, `photos_published`, `orders_count`, `gross_cents`, `net_cents` | Populado via cron / materialized view para estatísticas. |

### 3.7 Marketing e relacionamento

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.hire_requests` | `id`, `name`, `email`, `phone`, `city`, `event_type`, `event_date`, `budget_range`, `notes`, `preferred_photographer`, `status (enum: new, in_contact, converted, archived)`, `assigned_to (FK admin)`, `created_at`, `updated_at` | Utilizada pelo modal “Solicitar orçamento”. |
| `public.contact_threads` | `id`, `event_id`, `client_id`, `photographer_id`, `channel (enum: whatsapp, email, in_app)`, `status`, `created_at` | Futuro chat/contato com fotógrafo. |
| `public.contact_messages` | `id`, `thread_id`, `sender_id`, `body`, `attachments (jsonb)`, `sent_at`, `read_at` | Mensagens entre usuários. |

### 3.8 Auditoria e suporte

| Tabela | Campos essenciais | Observações |
| --- | --- | --- |
| `public.activity_logs` | `id`, `user_id`, `action`, `entity`, `entity_id`, `metadata`, `created_at` | Registro de ações administrativas. |
| `public.file_storage_logs` | `id`, `photo_id`, `operation (enum: upload, delete, regenerate)`, `performed_by`, `performed_at`, `details (jsonb)` | Auditoria de uploads. |

## 4. Relacionamentos chave

- `auth.users 1:N auth.user_roles`
- `auth.users 1:1 public.user_profiles`
- `auth.users 1:1 public.photographer_profiles` (somente quando role fotográfico)
- `public.events N:1 public.photographer_profiles (owner)`
- `public.events 1:N public.event_photos`
- `public.event_photos N:M public.event_participants` via `participant_photo_matches`
- `public.shopping_carts 1:N public.shopping_cart_items`
- `public.orders 1:N public.order_items`
- `public.order_items 1:N public.order_downloads`
- `public.wallet_transactions` relaciona-se a `public.orders` (debitos) e gateways (créditos)
- `public.events 1:N public.event_collaborators`
- `public.event_collaborators 1:N public.collaboration_commissions`
- `public.photographer_profiles 1:N public.photographer_portfolio_images`
- `public.photographer_profiles 1:N public.events` (owner) e `N:M` via colaboradores.

## 5. Enums recomendados

Criar tabelas `public.enum_*` ou tipos enumerados PostgreSQL para os seguintes valores:

- `event_status`: `draft`, `scheduled`, `active`, `completed`, `archived`
- `event_visibility`: `public`, `unlisted`, `private`
- `photo_status`: `draft`, `published`, `hidden`, `removed`
- `upload_status`: `pending`, `processing`, `completed`, `failed`
- `payment_method`: `credit`, `pix`, `cash`, `card`
- `order_status`: `pending_payment`, `paid`, `failed`, `refunded`
- `wallet_transaction_type`: `credit_purchase`, `debit_purchase`, `refund`, `adjustment`
- `collaborator_role`: `owner`, `co_owner`, `assistant`, `editor`
- `collaboration_status`: `pending`, `accepted`, `declined`, `removed`
- `commission_status`: `pending`, `payable`, `paid`, `reversed`
- `hire_request_status`: `new`, `in_contact`, `converted`, `archived`
- `match_type`: `manual`, `ai_selfie`, `ai_bib`

## 6. Permissões por papel (Hasura RLS)

Resumo das regras de acesso que deverão ser configuradas no metadata:

| Tabela / View | Papel `cliente` | Papel `fotografo` | Papel `admin` |
| --- | --- | --- | --- |
| `events` | `select` (somente `visibility = 'public'` ou eventos com fotos compradas) | `select`/`insert`/`update`/`delete` quando `owner_id = X-Hasura-User-Id` ou colaborador com `role` adequado | total acesso |
| `event_photos` | `select` somente fotos `status = 'published'`; `select` com restrição adicional para downloads comprados | `select` todas do próprio evento, `insert`/`update`/`delete` quando dono ou colaborador com permissão | total acesso |
| `participant_photo_matches` | leitura apenas para fotos compradas ou quando `participant_id` pertence ao usuário (validação via CPF) | leitura/escrita para eventos próprios | total |
| `shopping_carts` | leitura/escrita quando `user_id = X-Hasura-User-Id` ou `session_id` fornecido | idem | total |
| `orders` / `order_items` | leitura quando `user_id` corresponde ao token | leitura quando evento pertence ao fotógrafo (somente itens do evento) | total |
| `wallet_transactions` | leitura quando `user_id` corresponde ao token | leitura (somente lançamentos associados ao fotógrafo) | total |
| `event_collaborators` | sem acesso direto | leitura/escrita quando fotógrafo é `owner` do evento | total |
| `photographer_profiles` | leitura pública com filtros | leitura/escrita limitada ao próprio registro | total |
| `photographer_portfolio_images` | leitura pública | `select`/`insert`/`update`/`delete` do próprio perfil | total |
| `hire_requests` | `insert` livre; `select` apenas das suas solicitações | leitura de solicitações em que o fotógrafo é preferido | total |
| `activity_logs` | sem acesso | leitura limitada a ações próprias | total |

Além das permissões tabela a tabela, configurar **session variables** (`X-Hasura-User-Id`, `X-Hasura-Role`, `X-Hasura-Allowed-Roles`, `X-Hasura-Default-Role`) via JWT emitido pela API de autenticação.

## 7. Views e funções auxiliares

### Views principais

- `public.events_public_view`: combina dados do evento, proprietário e contadores de fotos/publicações para uso nas listagens.
- `public.event_sales_summary`: agrega vendas, fotos vendidas e receita por evento (usada na aba Estatísticas).
- `public.photographer_collaborations_view`: reúne eventos em que o fotógrafo é colaborador + métricas de comissão.
- `public.wallet_balance_view`: calcula o saldo atual por usuário (sumário das transações).
- `public.order_history_view`: junta pedidos, itens e URLs de download para a tela “Histórico”.
- `public.photographer_portfolios_view`: pré-carrega portfólios e ratings para a página de busca.

### Funções / Computed fields

- `public.related_events(event_id UUID, limit INT)` → retorna eventos da mesma categoria/cidade.
- `public.event_photo_search(event_id UUID, search_text TEXT, participant UUID, bib TEXT)` → função SQL usada por `select` com `argumentos` (Hasura v2+). Possibilita busca por número ou CPF.
- `public.can_download_photo(order_item_id UUID, user_id UUID)` → boolean auxiliar para RLS.

### Ações/custom actions

Algumas regras de negócio exigem lógica fora do banco. Definir actions Hasura com webhooks:

| Action | Método | Descrição |
| --- | --- | --- |
| `initiateSelfieMatch` | `POST` | Recebe imagem, delega para serviço ML, grava candidatos em `participant_photo_matches`. |
| `checkoutOrder` | `POST` | Cria pedido, debita créditos, dispara integração de pagamento e retorna status/URL de pagamento. |
| `completeCashPayment` | `POST` | Finaliza pedido com método “dinheiro” informado no app. |
| `topUpWallet` | `POST` | Registra compra de créditos e gera transação pendente. |
| `inviteCollaborator` | `POST` | Envia convite e cria registro em `event_collaborators`. |
| `recordHireRequest` | `POST` | Trata submissão do modal “Solicitar orçamento”, envia e-mail e cria `hire_requests`. |

## 8. Mapeamento funcional (tela → operações GraphQL)

### 8.1 Home / Landing

- **Queries**: `events_public_view` (destaques), `wallet_balance_view` (saldo do usuário logado), `photographer_profiles` (quando `isPhotographer`).
- **Mutations**: nenhuma.

### 8.2 Buscar eventos (`/buscar-eventos`)

- Query `events_public_view(where: {title/_ilike, city/_eq, status: {_eq: "active"}})` com ordenação `start_at`.
- Possibilidade de converter filtros fixos da UI (cidades pré-definidas) em valores de enum.

### 8.3 Buscar fotos (`/buscar-fotos`)

- Query `events` para preencher seletores (ou input manual).
- Query `event_photo_search` com argumentos: `event_id`, `participant_bib`, `participant_cpf` (valores mascarados). Retorna fotos com preço e thumbnails.
- Action `initiateSelfieMatch` retorna `matchCandidates` com `photo_id` e `confidence`.
- Mutation `insert_shopping_cart_items_one` para adicionar fotos ao carrinho.

### 8.4 Detalhe do evento (`/eventos/:slug`)

- Query `events_by_pk` com relacionamentos: `owner { user { user_profiles } }`, `event_photos(limit, order_by)`.
- Query `related_events` (function) para cards relacionados.
- Mutation `insert_shopping_cart_items` e `delete_shopping_cart_items_by_pk` para adicionar/remover fotos.
- Action `initiateSelfieMatch` vinculada ao modal CPF/selfie.

### 8.5 Carrinho (`/carrinho`)

- Query `shopping_carts(where: {user_id: {_eq: X-Hasura-User-Id}, status: {_eq: "open"}})` com `shopping_cart_items { photo { event { title } } }`.
- Mutation `delete_shopping_cart_items_by_pk` (remover item).
- Mutation `update_shopping_carts_by_pk` (aplicar créditos).
- Action `checkoutOrder` retornando `order_id`, `payment_status`, `redirect_url` (se necessário).
- Action `completeCashPayment` utilizada quando usuário escolhe “Pagar em dinheiro”.

### 8.6 Adicionar crédito (`/adicionar-credito`)

- Query `credit_packages` para valores sugeridos.
- Action `topUpWallet` cria transação pendente e devolve instruções de pagamento.
- Webhook de pagamento deverá confirmar e atualizar `wallet_transactions` + `orders` (quando top-up gera crédito). Hasura event trigger no `payment_notifications` cuidará de atualizar o saldo.

### 8.7 Histórico (`/historico`)

- Query `order_history_view(where: {user_id: {_eq: X-Hasura-User-Id}})` listando pedidos, itens e URLs de download.
- Mutation `insert_order_downloads` quando usuário baixa uma foto (auditoria).

### 8.8 Perfil (`/perfil`)

- Query `auth.users_by_pk` + `user_profiles`, `wallet_balance_view`.
- Mutation `update_user_profiles_by_pk` para alterar telefone etc.
- Mutation `update_photographer_profiles_by_pk` quando usuário possui role fotógrafo.
- Action `logout` (fornecida pela API externa) apenas invalida refresh tokens.

### 8.9 Área do fotógrafo – Meus eventos (`/fotografo/eventos`)

- Query `events(where: {owner_id: {_eq: X-Hasura-User-Id}})` com agregações `event_photos_aggregate { aggregate { count } }`.
- Mutation `insert_events_one` para “Criar evento”.
- Mutation `update_events_by_pk` para alterar status.

### 8.10 Criar evento (`/fotografo/eventos/novo`)

- Mutation `insert_events_one` com campos: título, descrição, data, local, categoria, preço base.
- Mutation `insert_event_tags` (opcional) e `insert_event_highlights`.

### 8.11 Detalhe do evento do fotógrafo (`/fotografo/eventos/:id`)

- Query `events_by_pk` + agregados (`event_photos`, `event_collaborators`, `collaboration_commissions` sum`).
- Mutation `insert_event_photos` (upload em lote) com campo `batch_id` gerado em `photo_upload_batches`.
- Mutation `update_event_photos` para aplicar preço em lote (usando `where` condicional).
- Mutation `insert_event_collaborators_one` / `delete_event_collaborators_by_pk` para gerenciar colaboradores.
- Query `participant_photo_matches` para conferência de identificações.

### 8.12 Colaborações (`/fotografo/colaboracoes`)

- Query `photographer_collaborations_view(where: {photographer_id: {_eq: X-Hasura-User-Id}})` com métricas de fotos, vendas e comissões.
- Mutations para aceitar/recusar convites (`update_event_collaborators_by_pk`).

### 8.13 Portfólio do fotógrafo (`/fotografo/portfolio`)

- Query `photographer_profiles_by_pk` + `photographer_portfolio_images(order_by: {sort_order: asc})`.
- Mutations `update_photographer_profiles_by_pk`, `insert_photographer_portfolio_images`, `delete_photographer_portfolio_images_by_pk`.

### 8.14 Busca de portfólios (`/portfolios`)

- Query `photographer_portfolios_view` com filtros `city`, `category`, `handle`.
- Action `recordHireRequest` para o modal “Solicitar orçamento”.

## 9. Triggers, cron jobs e automações

- **Trigger `after insert` em `orders`**: cria registros em `wallet_transactions` (débito), gera comissões em `collaboration_commissions` e envia notificações.
- **Trigger `after insert` em `wallet_transactions`**: atualiza `wallet_balance_view` (materialized) ou dispara recalculo.
- **Trigger `after insert/update` em `participant_photo_matches`**: mantém contagem de fotos identificadas por participante.
- **Cron job diário (Hasura cron)**: atualiza `photographer_metrics_daily` e marca carrinhos expirados como `abandoned`.
- **Event trigger `payment_notifications`**: processa callbacks dos gateways (PIX/cartão), confirmando pedidos ou créditos.
- **Event trigger `hire_requests`**: envia e-mail/WhatsApp ao fotógrafo preferido e notifica equipe interna.

## 10. API de autenticação

A aplicação precisará de um serviço externo (Node, Go, etc.) responsável por autenticação/autorização e emissão de JWTs compatíveis com o Hasura. Requisitos principais:

### 10.1 Fluxo e armazenamento

- **Cadastro**: grava usuário em `auth.users`, atribui papéis iniciais (`cliente` por padrão, `fotografo` após validação de documentos). Cria registros correspondentes em `public.user_profiles` e, quando aplicável, `public.photographer_profiles` com status `pending_review`.
- **Login**: valida credenciais (Argon2id/BCrypt), emite JWT curto (15 min) com claims Hasura e refresh token de longa duração (armazenado em `auth.refresh_tokens`).
- **Refresh token**: endpoint dedicado que valida token ativo e emite novo par de tokens.
- **Revogação**: logout invalida refresh token; mudança de senha invalida todos os tokens ativos.
- **Verificação de e-mail/CPF**: endpoints para confirmar e-mail (link assinado) e anexar CPF (exigido para clientes). Fotógrafos podem precisar enviar documentos adicionais (armazenados em storage externo e referenciados em `photographer_profiles`).

### 10.2 JWT claims Hasura

JWT payload deve conter:

```json
{
  "sub": "<user-id>",
  "email": "user@example.com",
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "<user-id>",
    "x-hasura-default-role": "cliente",
    "x-hasura-allowed-roles": ["cliente", "fotografo", "admin"],
    "x-hasura-role": "cliente"
  }
}
```

Para fotógrafos, `x-hasura-default-role` e `x-hasura-role` serão `fotografo`; administradores recebem `admin`.

### 10.3 Endpoints REST

| Método & rota | Descrição | Regras |
| --- | --- | --- |
| `POST /auth/register` | Cadastro de cliente. Campos: `full_name`, `email`, `password`, `cpf`. Retorna tokens + perfil. | Gera `allowed_roles = ['cliente']`. Valida CPF (algoritmo + duplicidade). |
| `POST /auth/register/photographer` | Cadastro (ou solicitação) de fotógrafo com `portfolio_links`, `document_urls`, `city`. | Cria usuário com `default_role = 'fotografo'`, `status = pending_review`. Pode exigir aprovação manual (admin). |
| `POST /auth/login` | Autenticação por e-mail/senha. | Retorna `access_token`, `refresh_token`, `expires_in`, dados básicos do perfil. |
| `POST /auth/refresh` | Renovação de tokens. | Exige refresh token válido; responde novo par. |
| `POST /auth/logout` | Revogação do refresh token em uso. | Necessário enviar `refresh_token`. |
| `POST /auth/password/forgot` | Solicita reset de senha. | Envia e-mail com token assinado. |
| `POST /auth/password/reset` | Troca a senha usando token de reset. | Invalida refresh tokens anteriores. |
| `GET /auth/me` | Retorna perfil + roles do usuário autenticado. | Útil para bootstrap do app. |
| `POST /auth/admin/invite` | Admin convida novo membro (admin/fotógrafo). | Requer role `admin`. |
| `POST /auth/mfa/enable` (opcional) | Habilita MFA (TOTP). | Retorna secret + QR. |

### 10.4 Integração com Hasura

- Configurar Hasura com `HASURA_GRAPHQL_JWT_SECRET` alinhado à chave usada pela API.
- Opcional: usar webhook `HASURA_GRAPHQL_AUTH_HOOK` para cenários onde autorização é dinâmica (ex.: suspensão de usuário).
- Para rotas públicas (não autenticadas) utilizar role anônima `public` com permissões restritas (ex.: `events_public_view`).

### 10.5 Gestão de perfis e verificação

- **Clientes**: obrigar CPF válido antes de permitir checkout; guardar hash + últimos 4 dígitos em `user_profiles`.
- **Fotógrafos**: exigir handle único, documentos (RG/CPF, comprovante), redes sociais. Admin precisa aprovar (`photographer_profiles.status` → `active`).
- **Administradores**: somente via convite interno + 2FA obrigatório.

## 11. Considerações adicionais

- **Storage**: armazenar URLs de fotos em provider compatível (S3, GCS). Guardar `storage_key` para remoção/rotinas de lifecycle.
- **Watermark**: gerar renditions com e sem marca d’água; manter referência em `event_photos`.
- **Compliance**: dados pessoais sensíveis (CPF, telefone) devem ser criptografados (pgcrypto) e expostos via views que aplicam mascaramento.
- **Observabilidade**: configurar logs de event triggers (Hasura) e manter tabela `activity_logs` para rastreamento.
- **Testes**: criar seeds e snapshots (Hasura `seeds/`) para ambientes de desenvolvimento.
- **Deploy**: armazenar metadata versionada (`metadata/`), migrations em `migrations/`, actions definidas em `actions.yaml`. Documentar workflows CI/CD que sincronizam metadata com instância Hasura.

---

Este guia estabelece a base para implementar a metadata do Hasura e a API de autenticação necessárias para suportar todas as funcionalidades previstas nas telas atuais do Photo Event Mobile Shop. Ajustes adicionais poderão ser feitos conforme evoluírem requisitos de negócio, integrações com gateways de pagamento e serviços de reconhecimento facial.
