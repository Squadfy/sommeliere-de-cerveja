# API Specification — Sommelière de Cerveja

> Especificação dos endpoints REST da API serverless (`apps/api`).
> Base URL local: `http://localhost:3001`
> Base URL produção: a definir (AWS API Gateway)

---

## Convenções Gerais

### Formato de Resposta

```typescript
// Sucesso
{ "data": T }

// Erro
{ "error": "Mensagem de erro legível" }
```

### HTTP Status Codes
| Código | Uso |
|---|---|
| `200` | Sucesso |
| `400` | Parâmetro inválido (ex: `q` vazio na busca) |
| `404` | Recurso não encontrado (slug inválido) |
| `500` | Erro interno (MongoDB indisponível) |

### Identificadores nas URLs
Sempre `slug` (string legível, kebab-case) — nunca `_id` ObjectId do MongoDB.

---

## Endpoints

### GET /categories

Retorna todas as categorias ativas, ordenadas por `order`.

**Response**
```typescript
{
  data: Array<{
    slug: string       // "frutos-do-mar"
    name: string       // "Frutos do Mar"
    icon: string       // "🦐"
    order: number
  }>
}
```

**Exemplo**
```json
{
  "data": [
    { "slug": "carnes", "name": "Carnes", "icon": "🥩", "order": 1 },
    { "slug": "frutos-do-mar", "name": "Frutos do Mar", "icon": "🦐", "order": 2 }
  ]
}
```

**MongoDB Query**
```js
db.categories.find({ active: true }).sort({ order: 1 })
```

---

### GET /categories/:slug/dishes

Retorna pratos ativos de uma categoria, ordenados alfabeticamente por `name`.

**Parâmetros de rota**
| Param | Tipo | Exemplo |
|---|---|---|
| `slug` | string | `frutos-do-mar` |

**Response**
```typescript
{
  data: {
    category: {
      slug: string
      name: string
      icon: string
    }
    dishes: Array<{
      slug: string       // "salmao-grelhado"
      name: string       // "Salmão Grelhado"
      image_url: string
    }>
  }
}
```

**Erros**
- `404` — categoria não encontrada ou inativa

**MongoDB Query**
```js
const category = db.categories.findOne({ slug, active: true })
const dishes = db.dishes.find({ category_id: category._id, active: true }).sort({ name: 1 })
```

---

### GET /dishes/:slug/recommendations

Endpoint central do app. Retorna a recomendação de cervejas para um prato, com dados completos da cerveja e dica de serviço.

**Parâmetros de rota**
| Param | Tipo | Exemplo |
|---|---|---|
| `slug` | string | `salmao-grelhado` |

**Response**
```typescript
{
  data: {
    dish: {
      slug: string
      name: string
      category: {        // null se categoria não encontrada
        slug: string
        name: string
      } | null
    }
    recommendations: Array<{
      beer: {
        slug: string
        name: string
        brand: string
        style: string
        image_url: string
        serving_temp_min: number
        serving_temp_max: number
        glass_type: string
      }
      affinity_score: number           // 0–100
      harmony_principle: 'complemento' | 'contraste' | 'regionalidade' | 'intensidade' | 'limpeza_do_paladar'
      recommendation_title: string
      sensory_explanation: string
    }>
  }
}
```

**Ordenação:** `affinity_score DESC` — a cerveja #1 tem o maior score.

**Erros**
- `404` — prato não encontrado ou inativo
- `404` — nenhuma recomendação ativa para o prato

**MongoDB Query (com $lookup)**
```js
db.dishes.aggregate([
  { $match: { slug, active: true } },
  { $lookup: { from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category' } },
  // Em seguida, query de recommendations com $lookup para beers
])

db.recommendations.aggregate([
  { $match: { dish_id: dish._id, active: true } },
  { $sort: { affinity_score: -1 } },
  { $lookup: { from: 'beers', localField: 'beer_id', foreignField: '_id', as: 'beer' } }
])
```

**Nota:** A reordenação para o parâmetro `?beer=` (navegação reversa F07) ocorre no **cliente** (Next.js), não na API.

---

### GET /beers

Retorna todas as cervejas ativas do portfólio Heineken, ordenadas por `display_order`.

**Response**
```typescript
{
  data: Array<{
    slug: string
    name: string
    brand: string
    style: string
    image_url: string
    display_order: number
  }>
}
```

**MongoDB Query**
```js
db.beers.find({ active: true }).sort({ display_order: 1 })
```

---

### GET /beers/:slug

Retorna detalhes completos de uma cerveja.

**Parâmetros de rota**
| Param | Tipo | Exemplo |
|---|---|---|
| `slug` | string | `eisenbahn-weizenbier` |

**Response**
```typescript
{
  data: {
    slug: string
    name: string
    brand: string
    style: string
    sensory_profile: string
    general_pairings: string[]
    image_url: string
    serving_temp_min: number
    serving_temp_max: number
    glass_type: string
    display_order: number
  }
}
```

**Erros**
- `404` — cerveja não encontrada ou inativa

---

### GET /beers/:slug/dishes

Navegação reversa (F07): retorna pratos que têm recomendação ativa com esta cerveja, ordenados por `affinity_score` DESC.

**Parâmetros de rota**
| Param | Tipo | Exemplo |
|---|---|---|
| `slug` | string | `heineken-lager` |

**Response**
```typescript
{
  data: {
    beer: {
      slug: string
      name: string
      brand: string
      image_url: string
    }
    dishes: Array<{
      slug: string
      name: string
      image_url: string
      category_id: string
      search_tags: string[]
      active: boolean
    }>  // pratos com recomendação ativa para esta cerveja, ordenados por affinity_score DESC
  }
}
```

**MongoDB Query**
```js
db.recommendations.aggregate([
  { $match: { beer_id: beer._id, active: true } },
  { $sort: { affinity_score: -1 } },
  { $lookup: { from: 'dishes', localField: 'dish_id', foreignField: '_id', as: 'dish' } },
  { $match: { 'dish.active': true } }
])
```

---

### GET /search?q=

Busca full-text de pratos por nome ou tags.

**Query params**
| Param | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| `q` | string | Sim | `salmao` |

**Comportamento**
- Mínimo 2 caracteres — retorna `400` se `q.length < 2`
- Busca usando índice MongoDB `$text` nas coleções `name` + `search_tags`
- Language: `"portuguese"` (stemming: "salmão" ↔ "salmões")
- Retorna máximo 20 resultados

**Response**
```typescript
{
  data: {
    query: string
    results: Array<{
      slug: string
      name: string
      image_url: string
      search_tags: string[]
      category_id: string
    }>
    count: number
  }
}
```

**Resposta vazia (sem resultados)**
```json
{ "data": { "query": "xyz", "results": [], "count": 0 } }
```

**Erros**
- `400` — parâmetro `q` ausente ou com menos de 2 caracteres

**MongoDB Query**
```js
db.dishes.aggregate([
  { $match: { $text: { $search: q, $language: "portuguese" }, active: true } },
  { $sort: { score: { $meta: "textScore" } } },
  { $limit: 20 },
  { $lookup: { from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category' } }
])
```

---

## Índices MongoDB Necessários

```js
// Busca full-text
db.dishes.createIndex(
  { name: "text", search_tags: "text" },
  { default_language: "portuguese" }
)

// Recomendações por prato
db.recommendations.createIndex({ dish_id: 1, active: 1, affinity_score: -1 })

// Recomendações por cerveja (navegação reversa)
db.recommendations.createIndex({ beer_id: 1, active: 1, affinity_score: -1 })

// Pratos por categoria
db.dishes.createIndex({ category_id: 1, active: 1 })

// Lookup por slug (todos os documentos)
db.categories.createIndex({ slug: 1 }, { unique: true })
db.dishes.createIndex({ slug: 1 }, { unique: true })
db.beers.createIndex({ slug: 1 }, { unique: true })
```

---

## Configuração Serverless Framework

```yaml
# serverless.yml — estrutura implementada (HTTP API v2 — httpApi)
functions:
  categories:
    handler: src/handlers/categories.list
    events:
      - httpApi: { path: /categories, method: GET }
  categoryDishes:
    handler: src/handlers/categories.dishes
    events:
      - httpApi: { path: /categories/{slug}/dishes, method: GET }
  dishRecommendations:
    handler: src/handlers/dishes.recommendations
    events:
      - httpApi: { path: /dishes/{slug}/recommendations, method: GET }
  beers:
    handler: src/handlers/beers.list
    events:
      - httpApi: { path: /beers, method: GET }
  beerDetail:
    handler: src/handlers/beers.detail
    events:
      - httpApi: { path: /beers/{slug}, method: GET }
  beerDishes:
    handler: src/handlers/beers.dishes
    events:
      - httpApi: { path: /beers/{slug}/dishes, method: GET }
  search:
    handler: src/handlers/search.search
    events:
      - httpApi: { path: /search, method: GET }
```

---

## CORS

Em desenvolvimento local (`serverless offline`), CORS é permissivo para aceitar requests do Next.js em `localhost:3000`.

Em produção, restringir ao domínio da aplicação via configuração do AWS API Gateway.
