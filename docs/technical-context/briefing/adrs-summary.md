# ADRs Summary — Sommelière de Cerveja

> 8 ADRs consolidadas. Todas com status **Aceito**.
> Fonte: `master-docs/tech-context/adr/`
> Gerado em Março/2026.

---

## Índice por Categoria

| Categoria | ADRs |
|---|---|
| **Monorepo / Infra** | ADR-001 (Turborepo) |
| **Frontend** | ADR-002 (Next.js App Router), ADR-005 (Tailwind + Shadcn), ADR-007 (ISR) |
| **Backend** | ADR-003 (Serverless Framework) |
| **Database** | ADR-004 (MongoDB Self-Hosted) |
| **Segurança / Legal** | ADR-006 (Age Gate localStorage) |
| **Produto / UX** | ADR-008 (WhatsApp Sharing) |

---

## ADR-001 — Turborepo como Orquestrador do Monorepo
**Status:** Aceito | **Impacto:** Alto | **Categoria:** Monorepo / Infra

### Decisão
Monorepo com Turborepo. Estrutura de workspaces:
```
apps/web     → Next.js PWA
apps/api     → Serverless API
packages/types  → @sommeliere/types (compartilhado)
packages/db     → Modelos/helpers Mongoose (opcional)
```

### Convenções Obrigatórias
- Tipos TypeScript compartilhados SEMPRE em `packages/types` — nunca duplicar
- `turbo build` para build incremental — não rodar builds isolados sem necessidade

### Por que não alternativas
- **NX:** curva de aprendizado desnecessária para 2 apps
- **Repos separados:** duplicação de tipos; sincronização manual

---

## ADR-002 — Next.js 14 com App Router
**Status:** Aceito | **Impacto:** Alto | **Categoria:** Frontend

### Decisão
Next.js 14 com **App Router** (não Pages Router).

### Motivação
- `generateMetadata` por rota → OG tags dinâmicas para WhatsApp preview
- Server Components por padrão → menos JS no bundle
- `revalidate` por segmento → ISR granular

### Convenção Crítica: `"use client"` somente quando necessário
Adicionar `"use client"` apenas para:
- `useState`, `useEffect`, `useRef`
- `localStorage` / `sessionStorage`
- Event handlers de UI (`onClick`, `onChange`)
- Context API consumers

### Estratégia de Rendering por Rota
| Rota | Estratégia | Razão |
|---|---|---|
| `/` | ISR (3600s) | Categorias estáveis |
| `/categoria/[slug]` | ISR (3600s) | Lista de pratos estável |
| `/prato/[slug]` | ISR (1800s) | Recomendações podem mudar |
| `/cervejas` | ISR (3600s) | Portfólio estável |
| `/cervejas/[slug]` | ISR (3600s) | Dados de marca estáveis |
| `/cervejas/[slug]/pratos` | SSR | Parâmetros em runtime |
| `/gate` | Static | Sem dados dinâmicos |

### Por que não alternativas
- **Pages Router:** API legada, sem vantagem
- **Vite SPA:** sem SSR/ISR; OG tags quebrariam WhatsApp preview
- **Remix:** menor ecossistema, equipe menos familiar

---

## ADR-003 — Serverless Framework para a API
**Status:** Aceito | **Impacto:** Alto | **Categoria:** Backend

### Decisão
Serverless Framework (Node.js) em `apps/api` — roda localmente via `serverless offline` e na AWS Lambda sem mudança de código.

### Estrutura da API
```
apps/api/src/
├── handlers/
│   ├── categories.ts    → list(), dishes()
│   ├── dishes.ts        → recommendations()
│   ├── beers.ts         → list(), detail(), dishes()
│   └── search.ts        → search()
├── models/
│   ├── Category.ts, Dish.ts, Beer.ts, Recommendation.ts
├── db/
│   └── connection.ts    ← SEMPRE usar isto para conectar
└── utils/
    └── response.ts      ← ok(), notFound(), badRequest(), error()
```

### Convenção Crítica: MongoDB em Serverless
```typescript
// db/connection.ts — padrão obrigatório
let cached: mongoose.Connection | null = null
export async function connectDB() {
  if (cached) return cached
  cached = await mongoose.connect(process.env.MONGODB_URI!)
  return cached
}
```
**Nunca** chamar `mongoose.connect()` dentro do handler.

### Por que não alternativas
- **Next.js API Routes:** acoplamento frontend/backend
- **Express em EC2:** sem portabilidade Lambda
- **NestJS:** over-engineering para 6–8 endpoints simples

---

## ADR-004 — MongoDB Self-Hosted
**Status:** Aceito | **Impacto:** Alto | **Categoria:** Database

### Decisão
MongoDB self-hosted (local em dev, instância própria em prod futura).

### Collections e Volumes MVP
| Collection | Volume | Descrição |
|---|---|---|
| `categories` | 8 docs | Categorias de pratos |
| `dishes` | ~50 docs | Pratos com search_tags |
| `beers` | 8 docs | Cervejas do portfólio |
| `recommendations` | ~200 docs | Relacionamento prato × cerveja |

### Índices Obrigatórios
```js
// Busca textual (F03)
db.dishes.createIndex(
  { name: "text", search_tags: "text" },
  { weights: { name: 10, search_tags: 5 }, default_language: "portuguese" }
)
// Recomendações por prato (F04)
db.recommendations.createIndex({ dish_id: 1, active: 1, affinity_score: -1 })
// Navegação reversa (F07)
db.recommendations.createIndex({ beer_id: 1, active: 1, affinity_score: -1 })
// Filtro por categoria (F02)
db.dishes.createIndex({ category_id: 1, active: 1 })
// Slugs únicos
db.categories.createIndex({ slug: 1 }, { unique: true })
db.dishes.createIndex({ slug: 1 }, { unique: true })
db.beers.createIndex({ slug: 1 }, { unique: true })
```

### Variável de Ambiente
```
MONGODB_URI=mongodb://localhost:27017/sommeliere
```

### Por que não alternativas
- **PostgreSQL:** busca textual PT-BR requer extensão extra
- **Firebase:** busca textual limitada, sem suporte a português
- **MongoDB Atlas:** custo desnecessário no protótipo

---

## ADR-005 — Tailwind CSS + Shadcn/UI
**Status:** Aceito | **Impacto:** Médio | **Categoria:** Frontend

### Decisão
Tailwind CSS (utility-first) + Shadcn/UI (componentes acessíveis baseados em Radix UI).

### Paleta de Cores Heineken (obrigatória)
```typescript
// tailwind.config.ts
colors: {
  heineken: {
    green: '#00A650',   // Verde principal
    dark:  '#1A1A1A',   // Fundo escuro
    gold:  '#C8A951',   // Destaques dourados
    cream: '#F5F0E8',   // Fundo claro
  }
}
```

### Convenções
- Usar `cn()` (clsx + tailwind-merge) para classes condicionais
- Adicionar Shadcn via CLI: `npx shadcn-ui@latest add [component]`
- **Nunca editar** arquivos em `components/ui/` diretamente
- Componentes ficam no projeto (copy-paste model) — sem lock de versão de lib

### Por que não alternativas
- **styled-components / Chakra:** runtime CSS-in-JS, incompatível com Server Components
- **Material UI:** estilo muito distante do branding Heineken
- **CSS Modules:** sem biblioteca de componentes acessíveis

---

## ADR-006 — Age Gate via localStorage (Client-Side)
**Status:** Aceito | **Impacto:** Alto | **Categoria:** Segurança / Legal

### Decisão
Gate de maioridade 100% client-side usando `localStorage`. Verificado via `useEffect` antes de renderizar conteúdo protegido.

### Implementação de Referência
```typescript
const AGE_GATE_KEY = 'sommeliere_age_verified'

// Verificação
useEffect(() => {
  const verified = localStorage.getItem(AGE_GATE_KEY)
  if (verified === 'true') router.replace(redirect || '/')
}, [])

// Aprovação
function handleApprove() {
  localStorage.setItem(AGE_GATE_KEY, 'true')
  router.replace(redirect || '/')
}
```

### Preservação do Deep Link
Deep link recebido via WhatsApp → gate → rota original:
```
/prato/salmao-grelhado → /gate?redirect=/prato/salmao-grelhado → /prato/salmao-grelhado
```

### Por que não alternativas
- **Cookie HTTP-only:** complexidade adicional sem benefício (gate é declaratório)
- **Session storage:** pede confirmação em cada aba — UX ruim
- **Sempre exibir:** abandono alto para usuários recorrentes

---

## ADR-007 — ISR para Páginas de Conteúdo
**Status:** Aceito | **Impacto:** Médio | **Categoria:** Frontend / Performance

### Decisão
ISR (Incremental Static Regeneration) do Next.js App Router para páginas de conteúdo com `revalidate` por segmento.

### Implementação de Referência
```typescript
// apps/web/app/prato/[slug]/page.tsx
export const revalidate = 1800  // 30 minutos

export async function generateStaticParams() {
  const dishes = await fetch(`${process.env.API_URL}/dishes`)
  return dishes.map(d => ({ slug: d.slug }))
}
```

### Impacto
- `generateStaticParams` pré-gera ~50 páginas de prato no build
- MongoDB consultado apenas quando cache expira, não a cada request
- OG tags presentes no HTML (crítico para preview WhatsApp)
- Após seed, páginas antigas ficam em cache por até 30–60min (aceitável)

### Por que não alternativas
- **SSR sempre:** MongoDB consultado a cada request; latência alta
- **SSG puro:** conteúdo nunca atualizado sem rebuild completo
- **SPA client-fetch:** OG tags ausentes no servidor; WhatsApp preview quebrado

---

## ADR-008 — Compartilhamento via wa.me (sem card visual)
**Status:** Aceito | **Impacto:** Médio | **Categoria:** Produto / UX

### Decisão
Compartilhamento exclusivamente via **link WhatsApp (`wa.me`)** com mensagem pré-formatada. Preview visual via OG tags da página, não por imagem gerada dinamicamente.

### Implementação de Referência
```typescript
// ShareButton — link obrigatório
const message = encodeURIComponent(
  `🍺 Descobri uma combinação incrível!\n\n` +
  `${dish.name} + ${beer.name}\n\n` +
  `Descubra mais: ${url}\n\nBeba com moderação.`
)
return <a href={`https://wa.me/?text=${message}`}>Compartilhar no WhatsApp</a>
```

```typescript
// OG tags via generateMetadata (App Router)
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getRecommendations(params.slug)
  return {
    title: `${data.dish.name} + ${data.topBeer.name} | Sommelière de Cerveja`,
    description: data.topRecommendation.recommendation_title,
    openGraph: { images: [{ url: data.topBeer.image_url }] }
  }
}
```

### UTM Params
- Compartilhamento: `?utm_source=whatsapp&utm_medium=share&utm_campaign=recomendacao`
- Navegação reversa: `?utm_campaign=portfolio`

### Por que não alternativas
- **Geração de imagem (Puppeteer):** infra complexa; custo Lambda
- **Web Share API:** incompatível com todos os browsers mobile
- **Instagram:** requer app registration Meta; fora do escopo

---

*8 ADRs analisadas — todas Aceitas | Março/2026*
