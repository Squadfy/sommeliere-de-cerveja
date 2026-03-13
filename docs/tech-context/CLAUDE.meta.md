# AI Development Guide — Sommelière de Cerveja

> Guia para sistemas de IA (Claude, Copilot, etc.) trabalhando neste codebase.
> Leia este arquivo antes de qualquer tarefa de desenvolvimento.

---

## Stack e Estrutura

```
Monorepo: Turborepo
├── apps/web/    → Next.js 14 (App Router) · TypeScript · Tailwind · Shadcn
└── apps/api/    → Node.js · Serverless Framework · TypeScript
packages/
├── types/       → Tipos TypeScript compartilhados
└── db/          → Modelos MongoDB e helper de conexão
```

---

## Regras Críticas — Nunca Viole

### 1. Server Components por padrão
Não adicione `"use client"` sem necessidade explícita. Adicionar somente quando usar:
- `useState`, `useEffect`, `useContext`
- `localStorage`, `sessionStorage`
- Event handlers (`onClick`, `onChange`)
- Context consumers

### 2. Não misture lógica de negócio no frontend
Toda query ao MongoDB ocorre na **API** (`apps/api`). O Next.js apenas consome os endpoints REST. Não importe `mongoose` ou conecte ao MongoDB diretamente de `apps/web`.

### 3. Conexão MongoDB em serverless — padrão obrigatório
```typescript
// apps/api/src/db/connection.ts — SEMPRE use este padrão
let cached: typeof mongoose | null = null;
export async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGODB_URI!);
  return cached;
}
```
Nunca crie `mongoose.connect()` dentro de um handler diretamente.

### 4. ISR com revalidate — não use `cache: 'no-store'` sem justificativa
Páginas de conteúdo usam ISR. Adicionar `cache: 'no-store'` transforma em SSR e aumenta carga no MongoDB.

### 5. Slug como identificador único — nunca use `_id` do MongoDB nas URLs
URLs usam `slug` (string legível), não ObjectId. Exemplo: `/prato/feijoada`, não `/prato/64abc123`.

---

## Padrões de Código

### Nomenclatura
- **Componentes:** PascalCase — `BeerCard`, `CategoryGrid`
- **Hooks:** camelCase com prefixo `use` — `useAgeGate`, `useSearch`
- **API handlers:** camelCase — `getRecommendations`, `searchDishes`
- **Collections MongoDB:** plural + camelCase — `dishes`, `beers`, `recommendations`
- **Slugs:** kebab-case — `salmao-grelhado`, `eisenbahn-weizenbier`

### TypeScript
- Sem `any` — use `unknown` e faça type narrowing
- Tipos compartilhados em `packages/types/` — não duplique entre `apps/web` e `apps/api`
- Interfaces para objetos de domínio, `type` para unions e utilitários

### Tailwind
- Use `cn()` (clsx + tailwind-merge) para classes condicionais:
  ```typescript
  import { cn } from '@/lib/utils'
  <div className={cn("base-class", condition && "conditional-class")} />
  ```
- Cores do branding sempre via tokens configurados em `tailwind.config.ts` — nunca hardcode hex

### API Responses
```typescript
// Padrão de resposta da API
type ApiResponse<T> = {
  data: T
  error?: never
} | {
  data?: never
  error: string
}
```

---

## Modelo de Dados — Referência Rápida

```typescript
// packages/types/src/index.ts

interface Category {
  _id: ObjectId
  slug: string           // "frutos-do-mar"
  name: string           // "Frutos do Mar"
  icon: string           // "🦐"
  order: number
  active: boolean
}

interface Dish {
  _id: ObjectId
  slug: string           // "salmao-grelhado"
  name: string           // "Salmão Grelhado"
  category_id: ObjectId
  search_tags: string[]  // ["salmão", "peixe", "grelhado"]
  image_url: string
  active: boolean
}

interface Beer {
  _id: ObjectId
  slug: string           // "eisenbahn-weizenbier"
  name: string           // "Eisenbahn Weizenbier"
  brand: string          // "Eisenbahn"
  style: string          // "Weizen"
  sensory_profile: string
  general_pairings: string
  image_url: string
  serving_temp_min: number   // 6
  serving_temp_max: number   // 8
  glass_type: string         // "Copo de trigo (Weizen)"
  display_order: number
  active: boolean
}

interface Recommendation {
  _id: ObjectId
  dish_id: ObjectId
  beer_id: ObjectId
  affinity_score: number         // 0-100
  harmony_principle: 'semelhança' | 'contraste' | 'complementação'
  recommendation_title: string
  sensory_explanation: string
  active: boolean
}
```

---

## Rotas e API Endpoints — Referência Rápida

### Frontend (Next.js)
| Rota | Tipo | Feature |
|---|---|---|
| `/` | ISR | Home — grid de categorias |
| `/gate` | Static | Gate de maioridade |
| `/categoria/[slug]` | ISR | Lista de pratos por categoria |
| `/prato/[slug]` | ISR | Tela de recomendação |
| `/cervejas` | ISR | Grid do portfólio |
| `/cervejas/[slug]` | ISR | Detalhe da marca |
| `/cervejas/[slug]/pratos` | SSR | Lista reversa de pratos |

### Backend (Serverless API)
| Endpoint | Método | Feature |
|---|---|---|
| `/categories` | GET | F02 |
| `/categories/:slug/dishes` | GET | F02 |
| `/dishes/:slug/recommendations` | GET | F04/F06 |
| `/beers` | GET | F07 |
| `/beers/:slug` | GET | F07 |
| `/beers/:slug/dishes` | GET | F07 navegação reversa |
| `/search?q=` | GET | F03 |

---

## Comportamentos Especiais

### Age Gate (F01)
- `localStorage.getItem('sommeliere_age_verified')` — verificado no client
- Deep link preservation: `/gate?redirect=/prato/[slug]`
- Após aprovação: `localStorage.setItem('sommeliere_age_verified', 'true')` + redirect

### Navegação Reversa (F07)
- URL: `/prato/[slug]?beer=[beer-slug]`
- Em F04, ler `searchParams.beer` e mover a cerveja correspondente para `affinity_score` máximo na exibição (reordenação client-side ou query específica)

### WhatsApp Sharing (F08)
- `https://wa.me/?text=` + `encodeURIComponent(mensagem+link)`
- UTM: `?utm_source=whatsapp&utm_medium=share&utm_campaign=recomendacao`
- OG tags geradas por `generateMetadata` em cada `/prato/[slug]`

---

## Armadilhas Conhecidas

| Armadilha | Como evitar |
|---|---|
| Flash de conteúdo no gate | Usar `loading` state antes de ler localStorage no `useEffect` |
| Cold start MongoDB em serverless | Usar padrão de conexão cacheada (ver ADR-003) |
| Tailwind classes não purgadas | Não construir classes com string interpolation: `bg-${color}` não funciona |
| ObjectId não serializável em JSON | Converter `_id` para string antes de retornar da API |
| ISR com dados de seed desatualizados | Chamar `res.revalidate('/prato/[slug]')` manualmente após novo seed |

---

## Variáveis de Ambiente

```bash
# apps/api/.env
MONGODB_URI=mongodb://localhost:27017/sommeliere

# apps/web/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:3001   # URL da Serverless API local
```
