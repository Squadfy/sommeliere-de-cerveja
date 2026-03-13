# Codebase Navigation Guide — Sommelière de Cerveja

> Guia de navegação para desenvolvedores e sistemas de IA compreenderem a estrutura do projeto.

---

## Estrutura de Diretórios

```
sommeliere-de-cerveja/
├── apps/
│   ├── web/                          → Aplicação Next.js 14 (App Router)
│   │   ├── app/                      → App Router — rotas, layouts, pages
│   │   │   ├── layout.tsx            → Root layout — OG tags globais, fontes, providers
│   │   │   ├── page.tsx              → Home (/) — grid de categorias
│   │   │   ├── gate/
│   │   │   │   └── page.tsx          → Gate de maioridade (/gate)
│   │   │   ├── categoria/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      → Lista de pratos por categoria
│   │   │   ├── prato/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      → Tela de recomendação (rota core)
│   │   │   └── cervejas/
│   │   │       ├── page.tsx          → Grid do portfólio de cervejas
│   │   │       └── [slug]/
│   │   │           ├── page.tsx      → Detalhe da marca
│   │   │           └── pratos/
│   │   │               └── page.tsx  → Pratos que combinam (navegação reversa)
│   │   ├── components/               → Componentes React compartilhados
│   │   │   ├── ui/                   → Componentes Shadcn/UI (gerados — não editar)
│   │   │   ├── AgeGate/              → Lógica e UI do gate de maioridade
│   │   │   ├── CategoryGrid/         → Grid de categorias na home
│   │   │   ├── DishCard/             → Card de prato (categoria + busca)
│   │   │   ├── SearchBar/            → Busca de pratos com debounce
│   │   │   ├── BeerCard/             → Card de cerveja no portfólio
│   │   │   ├── RecommendationCard/   → Card da recomendação principal
│   │   │   ├── ServiceTips/          → Dica de temperatura e copo
│   │   │   └── ShareButton/          → Botão de compartilhamento WhatsApp
│   │   ├── hooks/                    → Hooks customizados
│   │   │   ├── useAgeGate.ts         → Leitura de localStorage + redirect
│   │   │   └── useSearch.ts          → Debounce + fetch de busca
│   │   ├── lib/                      → Utilitários
│   │   │   ├── utils.ts              → cn() = clsx + tailwind-merge
│   │   │   └── api.ts                → Funções fetch para API (getCategories, getDish, etc.)
│   │   ├── middleware.ts             → Next.js middleware — verificação do age gate
│   │   ├── tailwind.config.ts        → Tokens de cor Heineken, breakpoints
│   │   ├── next.config.ts            → Configuração Next.js
│   │   └── .env.local                → NEXT_PUBLIC_APP_URL, API_URL
│   │
│   └── api/                          → API Serverless (Node.js + Serverless Framework)
│       ├── src/
│       │   ├── handlers/             → Handlers das funções Lambda
│       │   │   ├── categories.ts     → GET /categories, GET /categories/:slug/dishes
│       │   │   ├── dishes.ts         → GET /dishes/:slug/recommendations
│       │   │   ├── beers.ts          → GET /beers, GET /beers/:slug, GET /beers/:slug/dishes
│       │   │   └── search.ts         → GET /search?q=
│       │   ├── models/               → Modelos Mongoose
│       │   │   ├── Category.ts
│       │   │   ├── Dish.ts
│       │   │   ├── Beer.ts
│       │   │   └── Recommendation.ts
│       │   ├── db/
│       │   │   └── connection.ts     → Conexão MongoDB cacheada (padrão serverless)
│       │   └── utils/
│       │       └── response.ts       → Helpers para respostas HTTP padronizadas
│       ├── serverless.yml            → Definição de funções e rotas AWS Lambda
│       └── .env                      → MONGODB_URI
│
├── packages/
│   └── types/                        → Tipos TypeScript compartilhados
│       └── src/
│           └── index.ts              → Interfaces: Category, Dish, Beer, Recommendation, DishRecommendationResponse + type HarmonyPrinciple
│
├── scripts/
│   └── seed.ts                       → Script de seed do MongoDB (categorias, pratos, cervejas, recomendações)
│
├── master-docs/                      → Documentação do projeto
│   ├── business-context/             → Features e regras de negócio
│   └── tech-context/                 → Esta pasta — contexto técnico
│
├── pnpm-workspace.yaml               → Declaração dos workspaces pnpm (apps/*, packages/*)
├── package.json                      → Workspace root (scripts globais, engines: node>=18, pnpm>=8)
└── .gitignore
```

---

## Arquivos-Chave por Funcionalidade

### Age Gate (F01)
| Arquivo | Papel |
|---|---|
| `apps/web/middleware.ts` | Intercepta todas as rotas, verifica cookie/localStorage |
| `apps/web/app/gate/page.tsx` | UI do gate — formulário de confirmação de maioridade |
| `apps/web/hooks/useAgeGate.ts` | Lógica client: lê localStorage, escreve `sommeliere_age_verified` |

### Busca de Pratos (F03)
| Arquivo | Papel |
|---|---|
| `apps/web/components/SearchBar/` | Input com debounce 300ms |
| `apps/web/hooks/useSearch.ts` | Fetch para `GET /search?q=` |
| `apps/api/src/handlers/search.ts` | Query MongoDB `$text` com language portuguese |

### Recomendação — Rota Core (F04)
| Arquivo | Papel |
|---|---|
| `apps/web/app/prato/[slug]/page.tsx` | Server Component — ISR, `generateMetadata` para OG tags |
| `apps/web/components/RecommendationCard/` | Card da cerveja principal com `affinity_score` |
| `apps/web/components/ServiceTips/` | Temperatura + tipo de copo (F05) |
| `apps/web/components/ShareButton/` | Link WhatsApp (F08) |
| `apps/api/src/handlers/dishes.ts` | `GET /dishes/:slug/recommendations` com `$lookup` |

### Portfólio de Cervejas (F07)
| Arquivo | Papel |
|---|---|
| `apps/web/app/cervejas/page.tsx` | Grid ISR de todas as cervejas |
| `apps/web/app/cervejas/[slug]/page.tsx` | Detalhe da marca |
| `apps/web/app/cervejas/[slug]/pratos/page.tsx` | SSR — pratos que combinam (navegação reversa) |
| `apps/api/src/handlers/beers.ts` | `GET /beers/:slug/dishes` |

### Compartilhamento (F08)
| Arquivo | Papel |
|---|---|
| `apps/web/components/ShareButton/` | Gera URL `wa.me/?text=...` com UTM params |
| `apps/web/app/prato/[slug]/page.tsx` | `generateMetadata` → OG tags para preview WhatsApp |

---

## Fluxo de Dados

```
Usuário acessa /prato/salmao-grelhado
        ↓
Next.js (Server Component — ISR)
  └── fetch → apps/api GET /dishes/salmao-grelhado/recommendations
                └── MongoDB: recommendations.find({ dish_id, active: true })
                             .sort({ affinity_score: -1 })
                             .lookup(beers)
                             .lookup(dishes)
        ↓
Renderiza: RecommendationCard + ServiceTips + ShareButton
        ↓
Client-side: ShareButton gera link wa.me (sem fetch adicional)
```

```
Usuário acessa /prato/salmao-grelhado?beer=heineken-lager
        ↓
Server Component lê searchParams.beer
  └── Query idêntica ao fluxo acima
  └── Reordena: move heineken-lager para posição #1 na lista
        ↓
Renderiza igual, mas com cerveja específica em destaque
```

---

## Integrações e Dependências Externas

| Serviço | Uso | Ambiente |
|---|---|---|
| **MongoDB** | Banco de dados principal | Local (dev) → Self-hosted (prod) |
| **WhatsApp `wa.me`** | Compartilhamento via link | Produção — sem API key |
| **AWS Lambda** | Deploy das funções API | Produção via Serverless Framework |
| **AWS Amplify** | Deploy do Next.js | Produção |
| **AWS S3** | Assets estáticos (imagens) | Produção |

**Nenhuma API externa** é consumida em runtime no protótipo — todo dado vem do MongoDB local.

---

## Padrões de Import

```typescript
// Alias configurado em tsconfig.json do apps/web
import { cn } from '@/lib/utils'
import { BeerCard } from '@/components/BeerCard'

// Tipos compartilhados do package
import type { Beer, Dish, Recommendation } from '@sommeliere/types'

// API fetch helper
import { getRecommendations } from '@/lib/api'
```

---

## Pontos de Entrada de Desenvolvimento

| Comando | O que faz |
|---|---|
| `pnpm dev` | Inicia `apps/web` (Next.js dev) e `apps/api` (serverless offline) em paralelo via Turborepo |
| `pnpm build` | Build de produção de todos os apps |
| `pnpm lint` | Lint em todos os pacotes |
| `pnpm test` | Executa testes em todos os pacotes (jest com mongodb-memory-server em `apps/api`) |
| `pnpm seed` | Popula MongoDB com dados iniciais via `scripts/seed.ts` |

---

## Pontos de Atenção na Navegação

1. **`apps/web/components/ui/`** — Gerado pelo Shadcn CLI. Não editar diretamente; adicionar via `npx shadcn-ui@latest add [component]`.
2. **`packages/types/src/index.ts`** — Fonte única de verdade para interfaces TypeScript. Mudanças aqui afetam `web` e `api`.
3. **`apps/api/src/db/connection.ts`** — Conexão cacheada. Jamais criar `mongoose.connect()` dentro de handlers.
4. **`apps/web/middleware.ts`** — Executado em Edge Runtime. Não pode usar Node.js APIs ou mongoose.
5. **`scripts/seed.ts`** — Único ponto de escrita de dados no protótipo (sem painel admin).
