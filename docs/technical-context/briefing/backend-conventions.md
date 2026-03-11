# Backend Conventions — Sommelière de Cerveja

> Convenções de código e estrutura para `apps/api` (Serverless Framework + Node.js).
> Março/2026.

---

## Estrutura de Pastas

```
apps/api/
├── src/
│   ├── handlers/                 ← HTTP handlers (1 arquivo por recurso)
│   │   ├── categories.ts         → list(), dishes()
│   │   ├── dishes.ts             → recommendations()
│   │   ├── beers.ts              → list(), detail(), dishes()
│   │   └── search.ts             → search()
│   ├── models/                   ← Mongoose models
│   │   ├── Category.ts
│   │   ├── Dish.ts               → inclui índice $text (search_tags)
│   │   ├── Beer.ts
│   │   └── Recommendation.ts
│   ├── db/
│   │   └── connection.ts         ← ÚNICO ponto de conexão MongoDB
│   └── utils/
│       └── response.ts           ← Helpers de resposta HTTP
├── serverless.yml                ← Funções + rotas HTTP
├── tsconfig.json
├── package.json
└── .env                          → MONGODB_URI
```

---

## Endpoints da API

| Método | Path | Handler | Feature |
|---|---|---|---|
| GET | `/categories` | `categories.list` | F02 |
| GET | `/categories/:slug/dishes` | `categories.dishes` | F02 |
| GET | `/dishes/:slug/recommendations` | `dishes.recommendations` | F04, F05 |
| GET | `/beers` | `beers.list` | F07 |
| GET | `/beers/:slug` | `beers.detail` | F07 |
| GET | `/beers/:slug/dishes` | `beers.dishes` | F07 |
| GET | `/search?q=` | `search.search` | F03 |

- **Base URL local:** `http://localhost:3001` (serverless offline)
- **Base URL prod:** AWS API Gateway (a definir)

---

## Padrão de Código: Handler

```typescript
// apps/api/src/handlers/dishes.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { connectDB } from '../db/connection'
import { Dish } from '../models/Dish'
import { Recommendation } from '../models/Recommendation'
import { ok, notFound, error } from '../utils/response'

export const recommendations = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB()               // ← sempre primeiro

    const { slug } = event.pathParameters!
    const dish = await Dish.findOne({ slug, active: true })
    if (!dish) return notFound('Prato não encontrado')

    const recommendations = await Recommendation
      .find({ dish_id: dish._id, active: true })
      .sort({ affinity_score: -1 })
      .populate('beer_id')

    if (!recommendations.length) return notFound('Nenhuma recomendação encontrada')

    return ok({ dish, recommendations })
  } catch (err) {
    return error('Erro interno')
  }
}
```

---

## Padrão de Código: Response Helpers

```typescript
// apps/api/src/utils/response.ts
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',  // restringir em prod
}

export const ok = (data: unknown): APIGatewayProxyResult => ({
  statusCode: 200,
  headers,
  body: JSON.stringify({ data }),
})

export const notFound = (message: string): APIGatewayProxyResult => ({
  statusCode: 404,
  headers,
  body: JSON.stringify({ error: message }),
})

export const badRequest = (message: string): APIGatewayProxyResult => ({
  statusCode: 400,
  headers,
  body: JSON.stringify({ error: message }),
})

export const error = (message: string): APIGatewayProxyResult => ({
  statusCode: 500,
  headers,
  body: JSON.stringify({ error: message }),
})
```

---

## Padrão de Código: Conexão MongoDB

```typescript
// apps/api/src/db/connection.ts
import mongoose from 'mongoose'

let cached: typeof mongoose | null = null

export async function connectDB() {
  if (cached) return cached
  cached = await mongoose.connect(process.env.MONGODB_URI!)
  return cached
}
```

**Regra:** Nunca `mongoose.connect()` dentro de um handler. Sempre importar e chamar `connectDB()`.

---

## Padrão de Código: Mongoose Models

```typescript
// apps/api/src/models/Beer.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IBeer extends Document {
  slug: string
  name: string
  brand: string
  style: string
  image_url: string
  serving_temp_min?: number
  serving_temp_max?: number
  glass_type?: string
  display_order: number
  active: boolean
}

const BeerSchema = new Schema<IBeer>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  style: { type: String, required: true },
  image_url: { type: String, required: true },
  serving_temp_min: Number,
  serving_temp_max: Number,
  glass_type: String,
  display_order: { type: Number, required: true },
  active: { type: Boolean, default: true },
})

export const Beer = mongoose.model<IBeer>('Beer', BeerSchema)
```

---

## Formato de Resposta (obrigatório)

```typescript
// Sucesso
{ "data": T }

// Erro
{ "error": "Mensagem legível" }
```

**Nunca** retornar objeto plano sem o wrapper `data` ou `error`.

---

## Nomenclatura

| Item | Padrão | Exemplo |
|---|---|---|
| Arquivos de handler | kebab-case | `categories.ts` |
| Funções de handler | camelCase | `export const list = async ...` |
| Models | PascalCase | `Category.ts`, `Beer.ts` |
| Interfaces Mongoose | `I` + PascalCase | `ICategory`, `IBeer` |
| Variáveis | camelCase | `const categorySlug = ...` |
| Slugs de URL | kebab-case | `salmao-grelhado`, `eisenbahn-weizenbier` |

---

## Serverless Framework — Estrutura do `serverless.yml`

```yaml
service: sommeliere-api
provider:
  name: aws
  runtime: nodejs18.x
  region: sa-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}

functions:
  categories:
    handler: src/handlers/categories.list
    events:
      - http: { path: categories, method: get, cors: true }
  categoryDishes:
    handler: src/handlers/categories.dishes
    events:
      - http: { path: categories/{slug}/dishes, method: get, cors: true }
  dishRecommendations:
    handler: src/handlers/dishes.recommendations
    events:
      - http: { path: dishes/{slug}/recommendations, method: get, cors: true }
  beers:
    handler: src/handlers/beers.list
    events:
      - http: { path: beers, method: get, cors: true }
  beerDetail:
    handler: src/handlers/beers.detail
    events:
      - http: { path: beers/{slug}, method: get, cors: true }
  beerDishes:
    handler: src/handlers/beers.dishes
    events:
      - http: { path: beers/{slug}/dishes, method: get, cors: true }
  search:
    handler: src/handlers/search.search
    events:
      - http: { path: search, method: get, cors: true }

plugins:
  - serverless-offline
```

---

## Regras de Ativação de Conteúdo

Todos os documentos MongoDB têm `active: boolean`. Sempre filtrar `active: true`:

```typescript
// ✅ CORRETO
Dish.findOne({ slug, active: true })
Recommendation.find({ dish_id, active: true })

// ❌ ERRADO — retorna itens desativados
Dish.findOne({ slug })
```

---

## Casos de Borda Mapeados

| Cenário | Comportamento |
|---|---|
| Prato com slug inexistente | `notFound('Prato não encontrado')` |
| Prato sem recomendações ativas | `notFound('Nenhuma recomendação encontrada')` |
| Busca com `q` < 2 chars | `badRequest('Parâmetro q deve ter pelo menos 2 caracteres')` |
| Cerveja inativa em recomendação | `active: true` no populate filtra automaticamente |
| `?beer=` com slug inexistente | Ignorar parâmetro (lógica client-side, não na API) |
| MongoDB indisponível | `error('Erro interno')` — 500 |

---

*Fonte: ADR-003, ADR-004, API_SPECIFICATION.md, ARCHITECTURE.md*
*Março/2026 — Projeto educacional Mentoria Time 4*
