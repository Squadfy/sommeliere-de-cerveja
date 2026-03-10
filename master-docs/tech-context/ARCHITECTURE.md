# Arquitetura Geral — Sommelière de Cerveja

> Documento de arquitetura do protótipo MVP.
> Stack: Turborepo · Next.js 14 (App Router) · Serverless Framework · MongoDB
> Gerado em Março/2026 — Projeto educacional Mentoria Time 4

---

## Visão Geral

**Tipo:** Monorepo Turborepo — PWA mobile-first de harmonização cervejeira
**Padrão:** Frontend Next.js (ISR/SSR) + Backend REST Serverless + MongoDB
**Fase:** Protótipo MVP — features F01–F08

---

## Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    Usuário (mobile PWA)                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│              Next.js App Router (apps/web)               │
│                                                          │
│  middleware.ts [Edge Runtime] — Age Gate redirect        │
│                                                          │
│  ISR pages: /, /categoria/[slug], /prato/[slug]          │
│             /cervejas, /cervejas/[slug]                   │
│  SSR pages: /cervejas/[slug]/pratos                      │
│  Static:    /gate                                        │
│                                                          │
│  Client: useAgeGate (localStorage), useSearch (debounce) │
└────────────────────────┬────────────────────────────────┘
                         │ REST (fetch)
┌────────────────────────▼────────────────────────────────┐
│          Serverless Framework API (apps/api)             │
│                                                          │
│  GET /categories                                         │
│  GET /categories/:slug/dishes                            │
│  GET /dishes/:slug/recommendations                       │
│  GET /beers · GET /beers/:slug                           │
│  GET /beers/:slug/dishes                                 │
│  GET /search?q=                                          │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose
┌────────────────────────▼────────────────────────────────┐
│              MongoDB (self-hosted)                        │
│  Collections: categories · dishes · beers                │
│               recommendations                            │
└─────────────────────────────────────────────────────────┘
```

---

## Estrutura de Diretórios

```
sommeliere-de-cerveja/
├── apps/
│   ├── web/                              → Next.js 14 (App Router) — PWA frontend
│   │   ├── app/
│   │   │   ├── layout.tsx                → Root layout: OG tags globais, fontes, providers
│   │   │   ├── page.tsx                  → Home (/) — CategoryGrid ISR
│   │   │   ├── gate/page.tsx             → /gate — Age Gate UI (F01)
│   │   │   ├── categoria/[slug]/page.tsx → Lista de pratos por categoria (F02)
│   │   │   ├── prato/[slug]/page.tsx     → Recomendação — rota core (F04, F05, F08)
│   │   │   └── cervejas/
│   │   │       ├── page.tsx              → Portfólio de cervejas (F07)
│   │   │       └── [slug]/
│   │   │           ├── page.tsx          → Detalhe da marca
│   │   │           └── pratos/page.tsx   → Navegação reversa SSR (F07)
│   │   ├── components/
│   │   │   ├── ui/                       → Shadcn/UI — não editar diretamente
│   │   │   ├── AgeGate/                  → UI do gate de maioridade (F01)
│   │   │   ├── CategoryGrid/             → Grid de categorias (F02)
│   │   │   ├── DishCard/                 → Card de prato (F02, F03)
│   │   │   ├── SearchBar/                → Input com debounce 300ms (F03)
│   │   │   ├── RecommendationCard/       → Card da recomendação principal (F04)
│   │   │   ├── ServiceTips/              → Temperatura + tipo de copo (F05)
│   │   │   ├── BeerCard/                 → Card do portfólio (F07)
│   │   │   └── ShareButton/              → Link WhatsApp + OG tags (F08)
│   │   ├── hooks/
│   │   │   ├── useAgeGate.ts             → Lê/escreve localStorage, redirect
│   │   │   └── useSearch.ts              → Debounce + fetch /search
│   │   ├── lib/
│   │   │   ├── api.ts                    → Fetch helpers (getCategories, getDish, etc.)
│   │   │   └── utils.ts                  → cn() — clsx + tailwind-merge
│   │   ├── middleware.ts                 → Edge Runtime — verifica age gate, redireciona
│   │   ├── public/                       → manifest.json, icons PWA, favicon
│   │   ├── tailwind.config.ts            → Tokens de cor Heineken, breakpoints
│   │   ├── next.config.ts                → remotePatterns S3, headers
│   │   ├── tsconfig.json                 → Paths: @/* → ./
│   │   ├── package.json
│   │   └── .env.local                    → NEXT_PUBLIC_APP_URL, API_URL
│   │
│   └── api/                              → Node.js + Serverless Framework
│       ├── src/
│       │   ├── handlers/
│       │   │   ├── categories.ts         → list(), dishes()
│       │   │   ├── dishes.ts             → recommendations()
│       │   │   ├── beers.ts              → list(), detail(), dishes()
│       │   │   └── search.ts             → search()
│       │   ├── models/
│       │   │   ├── Category.ts           → Mongoose model
│       │   │   ├── Dish.ts               → Mongoose model + $text index
│       │   │   ├── Beer.ts               → Mongoose model
│       │   │   └── Recommendation.ts     → Mongoose model
│       │   ├── db/
│       │   │   └── connection.ts         → Conexão cacheada (padrão serverless)
│       │   └── utils/
│       │       └── response.ts           → ok(), notFound(), badRequest(), error()
│       ├── serverless.yml                → Funções Lambda + rotas HTTP
│       ├── tsconfig.json
│       ├── package.json
│       └── .env                          → MONGODB_URI
│
├── packages/
│   ├── types/                            → Tipos TypeScript compartilhados
│   │   ├── src/index.ts                  → Category, Dish, Beer, Recommendation
│   │   ├── tsconfig.json
│   │   └── package.json                  → name: @sommeliere/types
│   └── db/                               → (Opcional) Modelos e helpers Mongoose compartilhados
│
├── scripts/
│   └── seed.ts                           → Popula MongoDB com dados iniciais
│
├── master-docs/                          → Documentação do projeto
├── turbo.json                            → Pipeline: build, dev, lint
├── package.json                          → Workspace root — scripts globais
├── .gitignore
└── .env.example                          → Template de variáveis de ambiente
```

---

## Modelo de Domínio

```
categories ──(1:N)── dishes ──(1:N)── recommendations ──(N:1)── beers
```

| Collection | Campos-chave |
|---|---|
| `categories` | `slug`, `name`, `icon`, `order`, `active` |
| `dishes` | `slug`, `name`, `category_id`, `image_url`, `search_tags[]`, `active` |
| `beers` | `slug`, `name`, `brand`, `style`, `image_url`, `serving_temp_min`, `serving_temp_max`, `glass_type`, `display_order`, `active` |
| `recommendations` | `dish_id`, `beer_id`, `affinity_score` (0–100), `harmony_principle`, `recommendation_title`, `sensory_explanation`, `active` |

**Invariante de ativação:** `active: false` exclui o documento de todas as listagens e retorna 404 no detalhe.

---

## Fluxo de Dados Principal (F04 — Recomendação)

```
GET /prato/salmao-grelhado
        │
Next.js Server Component (ISR — revalidate: 3600)
        │
fetch → GET /dishes/salmao-grelhado/recommendations
        │
Serverless Handler
        │
MongoDB aggregate:
  match dish (slug, active: true)
  → lookup category
  → match recommendations (dish_id, active: true, sort affinity_score DESC)
  → lookup beers
        │
Response: { data: { dish, recommendations[] } }
        │
Renderiza: RecommendationCard + ServiceTips + ShareButton
        │
Client: ShareButton monta wa.me URL (sem fetch adicional)
```

**Fluxo com navegação reversa (`?beer=`):**
```
Server Component recebe searchParams.beer = "heineken-lager"
  → API retorna todas recomendações (mesmo fluxo acima)
  → Client reordena: move heineken-lager para posição #1
  → Renderiza com cerveja em destaque
```

---

## Estratégias de Renderização por Rota

| Rota | Estratégia | Razão |
|---|---|---|
| `/` | ISR (revalidate: 3600) | Categorias mudam raramente |
| `/categoria/[slug]` | ISR (revalidate: 3600) | Lista de pratos estável |
| `/prato/[slug]` | ISR (revalidate: 3600) | Conteúdo de recomendação estável |
| `/cervejas` | ISR (revalidate: 3600) | Portfólio raramente muda |
| `/cervejas/[slug]` | ISR (revalidate: 3600) | Detalhe estável |
| `/cervejas/[slug]/pratos` | SSR | Resultado depende de parâmetros dinâmicos |
| `/gate` | Static | Sem dados dinâmicos |

---

## Contratos de Tipagem (`packages/types/src/index.ts`)

```typescript
export interface Category {
  slug: string
  name: string
  icon: string
  order: number
}

export interface Dish {
  slug: string
  name: string
  category: string
  image_url: string
}

export interface Beer {
  slug: string
  name: string
  brand: string
  style: string
  image_url: string
  serving_temp_min?: number
  serving_temp_max?: number
  glass_type?: string
}

export interface Recommendation {
  beer: Beer
  affinity_score: number
  harmony_principle: 'semelhança' | 'contraste' | 'complementação'
  recommendation_title: string
  sensory_explanation: string
}

export interface DishRecommendationResponse {
  dish: Dish
  recommendations: Recommendation[]
}
```

---

## API REST — Endpoints

| Método | Path | Handler | Feature |
|---|---|---|---|
| GET | `/categories` | `categories.list` | F02 |
| GET | `/categories/:slug/dishes` | `categories.dishes` | F02 |
| GET | `/dishes/:slug/recommendations` | `dishes.recommendations` | F04, F05 |
| GET | `/beers` | `beers.list` | F07 |
| GET | `/beers/:slug` | `beers.detail` | F07 |
| GET | `/beers/:slug/dishes` | `beers.dishes` | F07 |
| GET | `/search?q=` | `search.search` | F03 |

**Formato de resposta:**
```typescript
{ "data": T }           // sucesso
{ "error": "mensagem" } // erro
```

---

## Padrões e Convenções

| Área | Padrão |
|---|---|
| URLs | Sempre `slug` kebab-case — nunca `_id` MongoDB |
| Imports frontend | `@/components/...`, `@/lib/...`, `@sommeliere/types` |
| Conexão MongoDB | Sempre via `db/connection.ts` cacheado — nunca `mongoose.connect()` em handler |
| Componentes Shadcn | Via CLI `npx shadcn-ui@latest add` — nunca editar `components/ui/` diretamente |
| Age Gate | `localStorage` key: `sommeliere_age_verified = 'true'` |
| Compartilhamento | Mensagem sempre inclui "Beba com moderação" (RN08) |
| `packages/types` | Fonte única de verdade — mudanças afetam `web` e `api` |

---

## Dependências Externas

| Pacote / Serviço | Uso | Ambiente |
|---|---|---|
| `next` 14 | Framework frontend | Web |
| `tailwindcss` + `shadcn/ui` | UI / design system | Web |
| `mongoose` | ODM MongoDB | API |
| `serverless` + `serverless-offline` | Deploy Lambda / dev local | API |
| `typescript` | Tipagem — ambos os apps | Ambos |
| MongoDB self-hosted | Banco de dados | Dev → Prod |
| AWS Amplify (futuro) | Hosting frontend | Prod |
| AWS Lambda + API Gateway (futuro) | Hosting backend | Prod |
| AWS S3 + CloudFront (futuro) | Assets / imagens | Prod |
| WhatsApp `wa.me` | Compartilhamento | Prod — sem API key |

---

## Trade-offs e Decisões

| Decisão | Alternativa recusada | Razão |
|---|---|---|
| ISR para rotas de conteúdo | SSR sempre fresco | Dados do seed mudam raramente; ISR reduz latência |
| localStorage para age gate (client-side) | Cookie server-side | Edge Runtime não acessa localStorage; cookie adicionaria complexidade |
| Reordenação `?beer=` no cliente | Parâmetro na API | API mais simples; já retorna todos os scores; reordenação é UI-only |
| Seed em vez de CMS | Strapi / Contentful | Over-engineering para protótipo; CMS planejado para F10 |
| `wa.me` sem API (WhatsApp only) | WhatsApp Business API | Sem custo, sem onboarding; suficiente para protótipo. Instagram adiado para v2.0 — ver `business-context/PRODUCT_STRATEGY.md` |
| Context API (sem Zustand/Redux) | State managers externos | Estado global mínimo — não justifica dependência extra |

---

## Débitos Técnicos (aceitos para o protótipo)

| # | Débito | Prioridade | Solução futura |
|---|---|---|---|
| 1 | Sem CI/CD | Alta | GitHub Actions: lint + build em PR, deploy automático |
| 2 | Sem testes automatizados | Alta | Jest + RTL (unit) · Playwright (E2E smoke) |
| 3 | Analytics ausente (F09) | Alta | GA4 antes do lançamento público |
| 4 | Seed manual sem painel (viola RN06 do `pre-prd.md`) | Média | F10 — Painel de Gestão de Conteúdo com atualização sem deploy |
| 5 | Assets sem CDN | Média | S3 + CloudFront + `next/image` remotePatterns |
| 6 | MongoDB self-hosted sem backup | Média | Avaliar MongoDB Atlas para produção |
| 7 | Revalidação manual pós-seed | Baixa | Script de seed chama API de revalidação Next.js |

---

## Critérios de Qualidade Técnica (Protótipo)

| Critério | Meta |
|---|---|
| PWA — tempo até primeira interação | < 3s em 4G |
| API de recomendação | < 200ms |
| Busca de pratos | < 100ms |
| Lighthouse Accessibility Score | > 90 |
| Funcionamento Android + iOS (browsers padrão) | 100% |
| Deep link WhatsApp com gate preservado | ✅ |
| OG tags geram preview no WhatsApp | ✅ |
