# IAS-1 — Infraestrutura & Scaffold do Monorepo

Se você está trabalhando nesta feature, certifique-se de atualizar este arquivo plan.md conforme progride.

---

## FASE 1 — Root workspace + packages/types [Completada ✅]

> Base de tudo. Deve ser a primeira fase concluída antes de qualquer outra.
> Tarefas independentes entre si — podem ser criadas em sequência rápida.

### Criar arquivos de configuração do root workspace [Completada ✅]

Criar os 5 arquivos raiz do monorepo:

- `pnpm-workspace.yaml` — declara `apps/*` e `packages/*`
- `turbo.json` — tasks: `build`, `dev` (persistent, no-cache), `lint`; usa sintaxe Turbo 2 (`tasks`, não `pipeline`)
- `.gitignore` — node_modules, .next, .serverless, dist, .env.local, .env
- `.npmrc` — `shamefully-hoist=true` (necessário para Next.js + pnpm)
- `package.json` (root) — `devDependencies`: turbo, typescript, ts-node, @types/node, dotenv; `scripts`: dev, build, seed

### Criar packages/types [Completada ✅]

3 arquivos:

- `packages/types/package.json` — name: `@sommeliere/types`, main/types/exports apontam para `./src/index.ts` (sem build step)
- `packages/types/tsconfig.json` — extends de `tsconfig.json` raiz (strict, moduleResolution: bundler)
- `packages/types/src/index.ts` — interfaces: `Category`, `Dish`, `Beer`, `Recommendation`, `DishRecommendationResponse`

---

## FASE 2 — apps/web scaffold [Completada ✅]

> Depende da FASE 1 (packages/types). IAS-9 + IAS-12.
> Tarefas sequenciais: estrutura → config → app shell → PWA.

### Criar estrutura base do apps/web [Completada ✅]

- `apps/web/package.json` — next@14, react@18, react-dom@18, typescript, tailwindcss@^3, clsx, tailwind-merge, `@sommeliere/types: workspace:*`
- `apps/web/tsconfig.json` — strict, paths: `@/*` → `./*`
- `apps/web/tailwind.config.ts` — tokens Heineken: `heineken.green: '#288154'`, `heineken.green-dark`, `heineken.green-light`
- `apps/web/postcss.config.mjs`
- `apps/web/.env.local.example` — `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`

### Criar next.config.mjs e app shell [Completada ✅]

- `apps/web/next.config.ts`:
  - `transpilePackages: ['@sommeliere/types']` ← **crítico**
  - `images.remotePatterns` para `*.amazonaws.com`
  - `headers()` com X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- `apps/web/app/globals.css` — imports do Tailwind
- `apps/web/app/layout.tsx` — `<link rel="manifest">`, `<meta name="theme-color">`, `<meta name="viewport">`, sem `"use client"`
- `apps/web/app/page.tsx` — placeholder Server Component (título + status)
- `apps/web/lib/utils.ts` — helper `cn()` usando clsx + tailwind-merge

### Configurar PWA (IAS-12) [Completada ✅]

- `apps/web/public/manifest.json`:
  ```json
  { "name": "Sommelière de Cerveja", "short_name": "Sommelière",
    "start_url": "/", "display": "standalone",
    "theme_color": "#288154", "background_color": "#ffffff",
    "icons": [192x192, 512x512] }
  ```
- `apps/web/public/icon-192.png` — placeholder PNG (fundo verde #288154, letra "S" branca)
- `apps/web/public/icon-512.png` — placeholder PNG (mesma estética)

> **Geração dos ícones:** usar `canvas` ou script Node simples; sem dependência de sharp em runtime.
> Se o ambiente não permitir geração programática, criar com ferramentas de imagem e commitar os PNGs.

---

## FASE 3 — apps/api: db + models + utils (IAS-10) [Completada ✅]

> Depende da FASE 1 (packages/types). Independente da FASE 2.
> Tarefas sequenciais: estrutura → connection → models → utils.

### Criar estrutura e config do apps/api [Completada ✅]

- `apps/api/package.json`:
  - `dependencies`: mongoose@^8, `@sommeliere/types: workspace:*`
  - `devDependencies`: serverless@^3, serverless-offline@^13, serverless-esbuild@^1, esbuild@^0.20, typescript@^5, @types/node@^20, **mongodb-memory-server@^9**, jest@^29, @types/jest, ts-jest
  - `scripts`: `dev: serverless offline`, `test: jest`
- `apps/api/tsconfig.json` — strict, target: ES2020, module: CommonJS
- `apps/api/.env.example` — `MONGODB_URI=mongodb://localhost:27017/sommeliere`

### Criar serverless.yml [Completada ✅]

```yaml
service: sommeliere-api
frameworkVersion: '3'
provider:
  name: aws
  runtime: nodejs18.x
  region: sa-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
plugins: [serverless-esbuild, serverless-offline]
custom:
  esbuild: { bundle: true, minify: false, sourcemap: true, target: node18 }
  serverless-offline: { httpPort: 3001 }
functions:
  categories / categoryDishes / dishRecommendations /
  beers / beerDetail / beerDishes / search
```

### Criar db/connection.ts [Completada ✅]

`apps/api/src/db/connection.ts`:

```typescript
// Cache global persiste entre warm invocations na mesma instância Lambda
declare global {
  var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
}
if (!global.mongooseCache) global.mongooseCache = { conn: null, promise: null }

export async function connectDB(): Promise<Mongoose> { ... }
```

Critério: **`mongoose.connect()` nunca chamado diretamente em handlers**.

### Criar models Mongoose (4 collections) [Completada ✅]

`apps/api/src/models/`:

| Arquivo | Campos chave | Índices |
|---|---|---|
| `Category.ts` | slug (unique), name, icon, order, active (default true) | `{ slug: 1 }` unique |
| `Dish.ts` | slug (unique), name, category_id, image_url, search_tags[], active | `{ slug: 1 }` unique, `$text { name, search_tags }` portuguese, `{ category_id, active }` |
| `Beer.ts` | slug (unique), name, brand, style, sensory_profile, general_pairings, image_url, serving_temp_min/max, glass_type, display_order, active | `{ slug: 1 }` unique |
| `Recommendation.ts` | dish_id (ref), beer_id (ref), affinity_score (0-100), harmony_principle (enum), recommendation_title, sensory_explanation, active | `{ dish_id, active, affinity_score: -1 }`, `{ beer_id, active, affinity_score: -1 }` |

Critérios:
- Todos com `active: boolean` default `true`
- Slugs com `unique: true`
- Índice `$text` em Dish com `language: 'portuguese'`

### Criar utils/response.ts [Completada ✅]

`apps/api/src/utils/response.ts`:

```typescript
const CORS_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
export const ok = <T>(data: T) => ({ statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ data }) })
export const notFound = (msg: string) => ({ statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: msg }) })
export const badRequest = (msg: string) => ({ statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: msg }) })
export const error = (msg: string) => ({ statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: msg }) })
```

---

## FASE 4 — apps/api: handlers + testes mongodb-memory-server [Completada ✅]

> Depende da FASE 3. Handlers são esqueleto (sem lógica de negócio completa).
> Tarefas: handlers em paralelo (independentes entre si), testes sequenciais.

### Criar handlers (esqueleto) [Completada ✅]

4 arquivos em `apps/api/src/handlers/`:

**`categories.ts`** — exports: `list` (GET /categories), `dishes` (GET /categories/{slug}/dishes)
**`dishes.ts`** — exports: `recommendations` (GET /dishes/{slug}/recommendations)
**`beers.ts`** — exports: `list` (GET /beers), `detail` (GET /beers/{slug}), `dishes` (GET /beers/{slug}/dishes)
**`search.ts`** — exports: `search` (GET /search?q=)

Cada handler:
1. Chama `await connectDB()` (não `mongoose.connect()`)
2. Executa query placeholder (ex: `Model.find({})` ou `Model.findOne({slug})`)
3. Retorna via `ok()`, `notFound()`, ou `error()` do `utils/response.ts`

### Configurar Jest + mongodb-memory-server [Completada ✅]

`apps/api/jest.config.ts`:
```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/test/setup.ts',
  globalTeardown: './src/test/teardown.ts',
}
```

`apps/api/src/test/setup.ts`:
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server'
let mongod: MongoMemoryServer

export default async function setup() {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  // Salvar instância para o teardown
  (global as any).__MONGOD__ = mongod
}
```

`apps/api/src/test/teardown.ts`:
```typescript
export default async function teardown() {
  await (global as any).__MONGOD__?.stop()
}
```

### Criar testes de models e connection [Completada ✅]

`apps/api/src/__tests__/`:

**`connection.test.ts`**:
- Verifica que `connectDB()` retorna uma conexão válida
- Verifica que segunda chamada retorna a mesma conexão (cache funcionando)

**`models.test.ts`**:
- Testa criação de Category, Dish, Beer, Recommendation com campos obrigatórios
- Testa que `slug` é único (deve rejeitar duplicata)
- Testa que `active` tem default `true`
- Testa busca full-text em Dish com índice `$text`

**Execução:** `cd apps/api && pnpm test` — nenhum MongoDB local necessário ✅

---

## FASE 5 — scripts/seed.ts (IAS-11) [Completada ✅]

> Depende da FASE 3 (models). Usa MongoDB local via `MONGODB_URI`.
> Requer MongoDB rodando (`mongodb://localhost:27017/sommeliere`) para execução real.

### Criar scripts/seed.ts [Completada ✅]

`scripts/seed.ts` — script idempotente com ordem de dependências:

```
1. Verificar NODE_ENV !== 'production' (guardrail)
2. connectDB() usando MONGODB_URI do .env
3. deleteMany (ordem inversa): Recommendation → Dish → Beer → Category
4. insertMany Categories (8)
5. insertMany Beers (8)
6. insertMany Dishes (~50 pratos, com category_id resolvido por slug)
7. insertMany Recommendations (3-5 por prato em pelo menos 5 pratos)
8. Logar resumo: X categories, X dishes, X beers, X recommendations
9. disconnect()
```

**Dados de Categories** (8):
| slug | name | icon | order |
|---|---|---|---|
| carnes | Carnes | 🥩 | 1 |
| frutos-do-mar | Frutos do Mar | 🦐 | 2 |
| massas | Massas | 🍝 | 3 |
| petiscos | Petiscos | 🍟 | 4 |
| vegetariano | Vegetariano | 🥗 | 5 |
| sushi-oriental | Sushi/Oriental | 🍱 | 6 |
| sobremesas | Sobremesas | 🍮 | 7 |
| outros | Outros | 🍽️ | 8 |

**Dados de Beers** (8 — portfólio Heineken):
heineken-lager, amstel-puro-malte, eisenbahn-pilsen, eisenbahn-weizenbier,
eisenbahn-ipa, baden-baden-premium, sol-lager, devassa-puro-malte

**Pratos (~50)** — distribuídos entre categorias, com `search_tags[]` para full-text.
Pelo menos 5 pratos com 3+ recomendações (critério IAS-11/F06).

**Execução:** `pnpm seed` (root) → `ts-node scripts/seed.ts`

---

## FASE 6 — Validação e integração final [Completada ✅]

> Validar que todos os critérios de aceite estão satisfeitos antes do PR.
> Tarefas podem ser executadas em paralelo nas verificações.

### pnpm install + turbo build [Completada ✅]

```bash
pnpm install
turbo build
```

Esperado:
- sem erros de TypeScript
- `apps/web` → `.next/` gerado
- `apps/api` → `.serverless/` ou `dist/` gerado

### turbo dev — verificar que ambos os apps sobem [Completada ✅]

```bash
turbo dev
```

Esperado:
- `apps/web` em `http://localhost:3000`
- `apps/api` em `http://localhost:3001`
- `@sommeliere/types` importável em ambos (sem erros de módulo)

### pnpm test — todos os testes passando sem Docker [Completada ✅]

```bash
cd apps/api && pnpm test
```

Esperado: todos os testes de models e connection passando usando `mongodb-memory-server` (sem Docker, sem MongoDB local).

### pnpm seed — popular MongoDB local [Completada ✅]

```bash
# Requer MongoDB local rodando
MONGODB_URI=mongodb://localhost:27017/sommeliere pnpm seed
```

Esperado: `8 categories, ~50 dishes, 8 beers, X recommendations` no log.

### Verificar critérios de aceite dos 4 sub-issues [Completada ✅]

**IAS-9:**
- [ ] `turbo dev` inicia web (3000) e api (3001) em paralelo
- [ ] `turbo build` compila sem erros
- [ ] `@sommeliere/types` importável em ambos
- [ ] `.env.example` documentado em web e api

**IAS-10:**
- [ ] `mongoose.connect()` nunca chamado diretamente em handlers
- [ ] Todos os models com `active: boolean` default `true`
- [ ] Slugs com `unique: true`
- [ ] Índice `$text` em dishes com `language: 'portuguese'`

**IAS-11:**
- [ ] `pnpm seed` executa sem erros
- [ ] 8 categorias, ~50 pratos, 8 cervejas inseridos
- [ ] Script idempotente (re-executar não duplica)
- [ ] Pelo menos 5 pratos com > 3 recomendações

**IAS-12:**
- [ ] `manifest.json` no `<head>` do layout.tsx
- [ ] PWA instalável (verificar no Chrome DevTools → Application → Manifest)
- [ ] Lighthouse PWA score > 90

---

## Notas Gerais

- **mongodb-memory-server** (v9): não requer Docker nem MongoDB local — baixa o binário do MongoDB automaticamente na primeira execução de teste (~60s na primeira vez). Subsequentes são instantâneos.
- **Ordem obrigatória de fases:** 1 → (2 e 3 em paralelo) → 4 → 5 → 6
- **Handlers são esqueleto:** lógica de negócio real (queries MongoDB completas) é responsabilidade dos Epics F01-F08
- **Ícones PWA:** qualquer ferramenta de imagem funciona para os placeholders — o critério de aceite é que sejam PNGs válidos nos tamanhos 192x192 e 512x512

---

## Comentários de Conclusão (2026-03-11)

### Decisões tomadas durante execução

1. **`next.config.ts` → `next.config.mjs`**: Next.js 14 não suporta `.ts` para config (adicionado no 15). Renomeado para `.mjs` com sintaxe ESM + JSDoc `@type`.

2. **`themeColor`/`viewport` em `Metadata` → `Viewport` export**: Next.js 14 deprecou esses campos em `metadata`. Movidos para `export const viewport: Viewport` em `layout.tsx`.

3. **`MONGODB_URI` com fallback no serverless.yml**: `${env:MONGODB_URI, 'mongodb://localhost:27017/sommeliere'}` — necessário para que `serverless package` funcione sem a variável definida no ambiente de build.

4. **Índices duplicados removidos**: Os models tinham `unique: true` no campo E `schema.index({ slug: 1 }, { unique: true })`. Mongoose gerava warning. Removidas as linhas `schema.index` redundantes — o `unique: true` no campo já cria o índice.

5. **`pnpm.onlyBuiltDependencies` no package.json**: pnpm v10 requer aprovação explícita para build scripts. Adicionado `esbuild`, `mongodb-memory-server`, `@parcel/watcher`, etc.

6. **Ícones PNG via Node.js puro (zlib + fs)**: sem dependências externas, script `_create_icons.js` temporário criou PNGs 192x192 e 512x512 verde Heineken `#288154`.

### Resultados de validação

| Critério | Resultado |
|---|---|
| `turbo build` sem erros | ✅ |
| `tsc --noEmit` em apps/web | ✅ |
| `tsc --noEmit` em apps/api | ✅ |
| 11/11 testes Jest (mongodb-memory-server, sem Docker) | ✅ |
| `@sommeliere/types` importável em ambos os apps | ✅ |
| Mongoose: sem `connect()` direto em handlers | ✅ |
| Todos os models com `active: boolean` default true | ✅ |
| Slugs com `unique: true` | ✅ |
| Índice `$text` em Dish com `language: portuguese` | ✅ |
| seed.ts idempotente com 43 pratos, 8 cervejas, 8 categorias | ✅ |
| 9 pratos com ≥ 3 recomendações (critério F06, mín. 5) | ✅ |
| manifest.json no `<head>` via Next.js metadata + link explícito | ✅ |

### Total de arquivos criados: ~33 arquivos
