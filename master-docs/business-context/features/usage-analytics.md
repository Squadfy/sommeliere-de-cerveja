# Feature: Analytics de Uso

**ID:** F09
**Status:** MVP — Escopo Core
**Prioridade:** Média (invisível ao usuário, crítica para o negócio)

---

## Propósito

Coletar dados agregados e anônimos de uso para informar decisões de produto, conteúdo e marketing, em conformidade com LGPD.

---

## Valor de Negócio

- Identifica pratos mais consultados → prioriza qualidade editorial
- Identifica buscas sem resultado → expande o catálogo
- Rastreia origem de acessos (QR code vs link compartilhado) → informa estratégia de ativação
- Mede efetividade de campanhas via UTM parameters

---

## User Stories

**US-F09-01**
> Como time de Marketing Heineken, quero ver quais pratos e cervejas são mais consultados para priorizar a curadoria editorial e decisões de portfólio.

**US-F09-02**
> Como time de Produto, quero ver os termos buscados sem resultado para identificar lacunas no catálogo e expandir os pratos disponíveis.

---

## Ferramenta de Analytics

**Status:** Pendente — P06 (a definir pelo cliente).

| Opção | Prós | Contras |
|---|---|---|
| Firebase Analytics | Gratuito, integração nativa com PWA, tempo real | Dados no Google Cloud |
| Google Analytics 4 (GA4) | Robusto, free, relatórios conhecidos pelo cliente | Configuração de eventos customizados mais verbosa |
| Mixpanel | Funil de eventos granular | Custo a partir de certo volume |

**Recomendação técnica:** GA4 para MVP — free, relatórios familiares ao time de Marketing, integração simples via `gtag.js`.

**Decisão deve ser tomada até o início da Fase 3** para não bloquear a instrumentação.

---

## Camada de Abstração

Para facilitar migração de ferramenta no futuro, implementar uma camada de abstração:

```typescript
// lib/analytics.ts
export function trackEvent(name: string, params?: Record<string, string | number>) {
  // Internamente chama GA4, Firebase ou Mixpanel
  // Troca de ferramenta = mudar só esta função
}
```

---

## Eventos Rastreados

### Aquisição

| Evento | Parâmetros | Finalidade |
|---|---|---|
| `session_start` | `source` (qr_code \| shared_link \| direct), `utm_campaign`, `utm_medium` | Medir canais de aquisição |
| `age_gate_passed` | — | Taxa de aprovação no gate |
| `age_gate_failed` | — | Taxa de bloqueio por menoridade |

### Navegação e Engajamento

| Evento | Parâmetros | Finalidade |
|---|---|---|
| `category_selected` | `category_name` | Categorias mais acessadas |
| `dish_searched` | `search_term` | Termos mais buscados |
| `dish_search_no_result` | `search_term` | Gap de catálogo |
| `dish_selected` | `dish_name`, `dish_category`, `source` (category \| search) | Pratos mais consultados |
| `recommendation_viewed` | `dish_name`, `beers_shown` (array de slugs) | Chegada à tela core |
| `more_combinations_opened` | `dish_name` | Taxa de exploração |
| `portfolio_viewed` | `beer_slug` | Interesse por marca |

### Compartilhamento

| Evento | Parâmetros | Finalidade |
|---|---|---|
| `share_initiated` | `dish_name`, `beer_name` | Intenção de compartilhar |
| `share_completed` | `dish_name`, `beer_name` | Compartilhamento efetivado |

---

## Regras de Negócio e Compliance

| Código | Regra |
|---|---|
| RN07 | Coleta apenas de dados agregados e anônimos |
| RN07 | Sem coleta de dados pessoais sem consentimento explícito |
| RN07 | Conformidade com LGPD |

**Dados que NÃO devem ser coletados:**
- IP addresses individuais
- Device IDs persistentes sem consentimento
- Qualquer PII (nome, e-mail, telefone)

---

## Critérios de Aceite

- [ ] Todos os eventos listados são disparados nos momentos corretos
- [ ] Eventos de compartilhamento distinguem `share_initiated` de `share_completed`
- [ ] Parâmetros UTM do link de compartilhamento são capturados em `session_start`
- [ ] Nenhum dado pessoal identificável é coletado
- [ ] A camada de abstração `trackEvent` está implementada — troca de ferramenta não exige mudança nos componentes
- [ ] `dish_search_no_result` registra os termos sem resultado para análise

---

## Dashboard Prioritário (MVP)

As 5 métricas mais importantes para acompanhar no lançamento:

| # | Métrica | Evento base |
|---|---|---|
| 1 | Total de sessões iniciadas | `session_start` |
| 2 | Taxa de chegada à recomendação | `recommendation_viewed` / `session_start` |
| 3 | Taxa de compartilhamento | `share_completed` / `session_start` |
| 4 | Top termos buscados sem resultado | `dish_search_no_result` |
| 5 | Diversidade de cervejas visualizadas | `beers_shown` em `recommendation_viewed` |

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- `trackEvent` chamado nos componentes React — sem lógica de analytics nos Server Components
- Para GA4: carregar `gtag.js` via Script do Next.js com `strategy="afterInteractive"`
- Eventos no lado servidor (ex: API calls) não são rastreados — analytics é client-side only no MVP
- UTM params: lidos de `window.location.search` no `session_start` e persistidos em `sessionStorage`

---

## Dependências

- Todas as features (F01–F10) — analytics é transversal
- F08 (Compartilhamento) — UTM params nos links gerados
- F10 (Painel de Gestão) — relatório de buscas sem resultado alimenta decisões de curadoria
