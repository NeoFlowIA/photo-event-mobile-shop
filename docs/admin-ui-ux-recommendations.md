# Marketplace Olha a Foto — Recomendações de UI/UX para o módulo administrativo

## Objetivo
Refinar a experiência do painel administrativo mantendo a paleta já adotada no projeto, enquanto se aprimoram legibilidade, hierarquia da informação e usabilidade em diferentes breakpoints.

## 1. Layout e Navegação
- **Menu lateral adaptativo**: manter o menu fixo em telas `lg`+ e transformá-lo em menu hambúrguer em `md` e inferiores (aproveitar o `Sheet` móvel existente) para liberar área útil do conteúdo.【F:src/pages/admin/AdminLayout.tsx†L49-L119】
- **Topo condensado com breadcrumbs**: converter o bloco de cabeçalho em duas faixas — superior com logo, título e ação rápida (ex.: botão "Nova ação" contextual) e inferior com breadcrumbs + estado da sessão para reforçar orientação contextual.【F:src/pages/admin/AdminLayout.tsx†L74-L104】
- **Dashboard como landing funcional**: reorganizar a primeira dobra do dashboard destacando KPIs críticos em uma grade 2x2 e um CTA para "Ver eventos pendentes" para guiar foco operacional.【F:src/pages/admin/Dashboard.tsx†L32-L111】
- **Agrupamento por tarefas**: dividir o conteúdo em blocos "Monitorar", "Aprovar" e "Atuar" para criar ritmo visual e facilitar scanning de decisões.【F:src/pages/admin/Dashboard.tsx†L116-L208】

## 2. Hierarquia Visual
- **Tipografia**: adotar escala com `h1` 28–32px (seções principais), `h2` 22–24px (subseções), textos de suporte 14–16px e labels 12–13px com tracking leve. Ajustar `font-weight` para 600 em títulos de cards e 400 em descrições para contraste textual.【F:src/pages/admin/Dashboard.tsx†L38-L201】
- **Separadores sutis**: trocar bordas de cartões por `shadow-sm` + `border` de 1px em `slate-100` apenas quando necessário, mantendo divisores horizontais com `border-b` para estruturar listas longas (ex.: fila de aprovação).【F:src/pages/admin/Dashboard.tsx†L61-L202】
- **Ícones de apoio**: alinhar ícones (lucide) à esquerda de títulos ou ações para reforçar significado sem poluir — utilizar apenas em seções-chave (alertas, status de payout) para evitar ruído visual.【F:src/pages/admin/Dashboard.tsx†L21-L200】

## 3. Componentes e Espaçamento
- **Cards respirando**: padronizar paddings internos (ex.: `px-6 py-5` para cards maiores, `px-5 py-4` para cards médios) e gap vertical de `24px` entre seções para ritmo consistente.【F:src/pages/admin/Dashboard.tsx†L32-L205】
- **Grades responsivas**: definir grid `md:cols-2` e `xl:cols-3/4` conforme densidade informacional, evitando que em `xl` as cards fiquem muito estreitas. Para listagens, preferir `grid` ou `stack` com colunas definidas em `minmax(0, 1fr)` para evitar quebra de texto.【F:src/pages/admin/Dashboard.tsx†L63-L205】
- **Botões e CTAs**: incluir ícones à direita/esquerda conforme ação (ex.: `ArrowRight` em "Abrir gestão de eventos") e garantir padding mínimo `px-4 py-2.5`. Consolidar botões secundários com `variant="outline"` e borda `primary/30` para consistência.【F:src/pages/admin/Dashboard.tsx†L150-L204】

## 4. Acessibilidade (WCAG 2.1 AA)
- **Contraste**: revisar combinações de `text-slate-500` sobre `bg-white` e `bg-slate-50`; quando necessário, subir para `slate-600`/`slate-700` ou reforçar peso para alcançar 4.5:1, principalmente em legendas de gráficos e breadcrumbs.【F:src/pages/admin/AdminLayout.tsx†L71-L118】【F:src/pages/admin/Dashboard.tsx†L40-L205】
- **Labels e inputs**: garantir `label` explícito e `aria-describedby` em formulários de eventos/usuários; utilizar `HelperText` persistente para taxas e comissões evitando ambiguidades (aplicar nos cards de Configurações).【F:src/pages/admin/Settings.tsx†L1-L200】
- **Teclado e foco**: assegurar estados de foco visíveis em `NavLink`, botões e cards interativos com outline de 2px (`outline-primary/60`) e não remover `:focus-visible`. Atualizar `Sheet` móvel para focar primeiro item ao abrir.【F:src/pages/admin/AdminLayout.tsx†L49-L144】

## 5. Padrões e Escalabilidade
- **Tokens de espaçamento**: mapear escala (`spacing-2`/`4`/`6`/`8`) em `tailwind.config` para reutilização consistente em cards, listas e formulários.【F:tailwind.config.ts†L1-L120】
- **Sombreamento leve**: substituir bordas pesadas por `shadow-xs`/`shadow-sm` nos cards principais, inspirando-se em shadcn/ui para sensação de profundidade sutil.【F:src/pages/admin/Dashboard.tsx†L61-L205】
- **Divisores**: empregar `Separator` nos módulos de Configurações para fatiar grupos de parâmetros em vez de múltiplos cards independentes, reduzindo fragmentação visual.【F:src/pages/admin/Settings.tsx†L1-L200】
- **Componentização**: extrair padrões recorrentes (lista de alertas, fila de aprovação, cards de KPI) para componentes reutilizáveis (`<MetricCard>`, `<ApprovalList>`) visando manutenção e consistência futura.【F:src/pages/admin/Dashboard.tsx†L61-L208】

## 6. Estrutura Sugerida do Dashboard
1. **Hero operacional**: bloco com saudação, KPIs-chave e botão primário (ex.: "Revisar eventos pendentes").
2. **KPIs principais**: grade 2x2 com métricas financeiras e operacionais mais importantes.
3. **Monitoramento contínuo**: seção com gráfico de receita e gráfico de processamento lado a lado, compartilhando legenda unificada.
4. **Tarefas prioritárias**: fila de aprovação e pagamentos em duas colunas, cada qual com CTA direto.
5. **Alertas e insights**: lista simplificada com tags de prioridade e ações rápidas ("Atribuir", "Marcar como resolvido").

## 7. Referências Práticas
- [Lovable Admin Patterns](https://lovable.so) — tipografia limpa, cartões espaçosos e microinterações suaves.
- [Material Design 3 - Layout](https://m3.material.io/foundations/layout/overview) — diretrizes de densidade, breakpoints e alinhamento.
- [shadcn/ui Dashboard Example](https://ui.shadcn.com/examples/dashboard) — uso consistente de cards, sombras leves e hierarquia tipográfica.
- [WCAG 2.1 AA Contrast Guidelines](https://www.w3.org/TR/WCAG21/#contrast-minimum) — referência para validar combinações de cores.

## 8. Próximos Passos Recomendados
- Criar protótipo de alta fidelidade (Figma) aplicando as sugestões para validar hierarquia e interações responsivas.
- Executar teste de usabilidade rápido com 2–3 perfis administrativos para validar navegação móvel e clareza das métricas.
- Elaborar checklist de acessibilidade com foco em teclado, leitores de tela e contraste antes da implementação.

---
Essas recomendações buscam elevar a consistência visual, reduzir atrito operacional e manter a identidade cromática original, alinhando o painel às melhores práticas modernas de UI/UX para dashboards administrativos.
