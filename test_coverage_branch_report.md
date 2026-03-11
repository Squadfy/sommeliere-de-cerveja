# Exame de Cobertura de Testes do Branch

## Informações do Branch
- Branch: `alessandrosilva/ias-1-epic-infraestrutura-scaffold-do-monorepo`
- Base: `main`
- Total de arquivos alterados no branch: 40 (todos documentação — `.claude/` e `master-docs/`)
- Arquivos de código sem cobertura (presentes no worktree, fora do diff): 5

## Nota sobre o Diff do Branch

O `git diff origin/main...HEAD` não contém nenhum arquivo de código TypeScript — os quatro commits do branch adicionaram exclusivamente documentação e arquivos de sessão. O código da API (`apps/api/src/`) já estava presente no worktree mas não foi commitado neste branch. A análise abaixo trata esses arquivos como **código a ser coberto antes do merge**, independentemente de qual commit os introduziu.

---

## Resumo Executivo

A infraestrutura de testes está bem estruturada: `mongodb-memory-server` isolado por suite, `jest.config.ts` correto, setup/teardown globais funcionando. Os testes existentes (`connection.test.ts` e `models.test.ts`) cobrem adequadamente a camada de persistência — conexão com cache e todos os quatro modelos Mongoose.

O gap de cobertura está em dois níveis com pesos diferentes:

1. **`utils/response.ts` — gap imediato e de baixo custo.** Quatro funções puras sem dependência de banco. Teste escrito e entregue neste relatório.
2. **Handlers (`categories`, `dishes`, `beers`, `search`) — gap planejado.** Os handlers têm lógica de integração real (não são esqueletos vazios), mas dependem de dados seed para testar comportamento de negócio. Testes de integração devem ser escritos junto com as features F02–F04 e F07.

---

## Exame dos Arquivos de Código sem Cobertura

### 1. `apps/api/src/utils/response.ts`

**O que faz:**
- Quatro funções puras (`ok`, `notFound`, `badRequest`, `error`) que constroem respostas Lambda padronizadas
- Define e exporta os headers CORS usados em todos os endpoints

**Cobertura de Testes Atual:**
- Arquivo de teste: nenhum
- Status: Não coberto

**Por que testar agora:**
- Sem dependência de Mongoose, MongoDB ou AWS — zero custo de setup
- Contrato de resposta usado por todos os handlers: se o formato quebrar (`data` vs `error`, statusCode errado, header CORS ausente), todos os handlers silenciosamente retornam respostas incorretas
- Risco concreto: um refactor futuro pode trocar `{ data }` por `{ result }` e nenhum teste de handler vai capturar isso porque os handlers mocam a resposta inteira

**Testes ausentes:**
- [x] IMPLEMENTADO — `apps/api/src/__tests__/response.test.ts` (entregue neste relatório)

**Prioridade:** Alta — custo zero, protege o contrato de todos os endpoints

---

### 2. `apps/api/src/handlers/categories.ts`

**O que faz:**
- `list`: busca `CategoryModel` onde `active: true`, ordena por `order`
- `dishes`: recebe `slug` no path, busca categoria, depois busca `DishModel` por `category_id`

**Cobertura de Testes Atual:**
- Arquivo de teste: nenhum
- Status: Não coberto

**Lógica presente que precisa de teste (quando as features chegarem):**
- `list` retorna lista vazia quando não há categorias ativas
- `list` ordena pelo campo `order` corretamente
- `dishes` retorna 404 quando `slug` ausente no path
- `dishes` retorna 404 quando categoria não existe no banco
- `dishes` retorna 404 quando categoria existe mas `active: false`
- `dishes` retorna apenas pratos com `active: true`
- `dishes` inclui o objeto `category` no payload de resposta
- `list` retorna 500 em erro de banco (mock de falha)

**Prioridade:** Média — aguarda seed de dados da feature F02 (Navegação por Categorias)

---

### 3. `apps/api/src/handlers/dishes.ts`

**O que faz:**
- `recommendations`: recebe `slug` de prato, monta payload com `dish`, `category` e lista de `recommendations` ordenadas por `affinity_score`

**Cobertura de Testes Atual:**
- Arquivo de teste: nenhum
- Status: Não coberto

**Lógica presente que precisa de teste:**
- Retorna 404 quando `slug` ausente
- Retorna 404 quando prato não existe ou `active: false`
- Inclui `category: null` quando prato existe mas categoria foi removida
- Recomendações são ordenadas por `affinity_score` decrescente
- `beerMap` filtra corretamente cervejas inativas (beer existe na Recommendation mas `active: false` no Beer)
- Payload inclui `harmony_principle`, `recommendation_title`, `sensory_explanation` de cada recomendação
- Retorna lista vazia de `recommendations` quando prato existe mas não tem recomendações ativas

**Prioridade:** Alta quando feature F04 (Recomendação de Cerveja) for implementada — este handler é o núcleo do produto

---

### 4. `apps/api/src/handlers/beers.ts`

**O que faz:**
- `list`: busca todas as cervejas ativas, ordena por `display_order`
- `detail`: busca uma cerveja por `slug`
- `dishes`: busca cervejas por `slug`, depois monta lista de pratos via `RecommendationModel`

**Cobertura de Testes Atual:**
- Arquivo de teste: nenhum
- Status: Não coberto

**Lógica presente que precisa de teste:**
- `list` retorna lista vazia quando nenhuma cerveja ativa
- `list` respeita ordenação por `display_order`
- `detail` retorna 404 para slug inexistente
- `detail` retorna 404 para cerveja com `active: false`
- `dishes` busca pratos via join por `RecommendationModel` (não diretamente no `DishModel`)
- `dishes` filtra pratos inativos no `DishModel` mesmo se existir `Recommendation` ativa

**Prioridade:** Média — aguarda seed da feature F07 (Portfólio de Marcas)

---

### 5. `apps/api/src/handlers/search.ts`

**O que faz:**
- `search`: valida que `q` tem pelo menos 2 caracteres, executa `$text` search no `DishModel` com score de relevância, limita a 20 resultados

**Cobertura de Testes Atual:**
- Arquivo de teste: nenhum
- Status: Não coberto

**Lógica presente que precisa de teste:**
- Retorna 400 quando `q` ausente
- Retorna 400 quando `q` tem 1 caractere
- Retorna 400 quando `q` tem apenas espaços (`.trim()` reduz para vazio)
- Retorna 400 quando `q` tem apenas 1 caractere após trim
- Retorna resultados ordenados por relevância textual
- Limita resultados a 20 itens
- Payload inclui `query`, `results` e `count`
- `count` é igual a `results.length`

**Nota sobre o índice de texto:** O `DishModel` define `{ name: 'text', search_tags: 'text' }` com `default_language: 'portuguese'`. O `mongodb-memory-server` suporta índices de texto, mas o comportamento de stemming em português pode diferir do Atlas. Os testes de integração devem usar termos exatos ou verificar `count >= 0` sem assumir ranking específico.

**Prioridade:** Alta quando feature F03 (Busca por Nome de Prato) for implementada

---

## Lacunas nos Testes Existentes

### `connection.test.ts` — uma lacuna encontrada

O teste de erro sem URI manipula o cache manualmente (`global.mongooseCache.conn = null`), mas não restaura o cache após o `rejects.toThrow`. A restauração está presente mas ocorre fora de um `finally` — se o `rejects` em si lançar uma exceção inesperada, o estado do cache fica corrompido para os testes seguintes.

Recomendação: envolver a manipulação do cache em `try/finally`:

```typescript
it('lança erro se MONGODB_URI não estiver definido', async () => {
  const originalUri = process.env.MONGODB_URI
  if (global.mongooseCache) {
    global.mongooseCache.conn = null
    global.mongooseCache.promise = null
  }
  delete process.env.MONGODB_URI

  try {
    await expect(connectDB()).rejects.toThrow('MONGODB_URI environment variable is not set')
  } finally {
    process.env.MONGODB_URI = originalUri
    if (global.mongooseCache) {
      global.mongooseCache.conn = null
      global.mongooseCache.promise = null
    }
  }
})
```

### `models.test.ts` — lacunas encontradas

Os modelos têm campos com lógica de validação que não são testados:

**BeerModel:**
- [ ] `slug` deve ser armazenado em lowercase (schema tem `lowercase: true`)
- [ ] `serving_temp_min` e `serving_temp_max` são obrigatórios — teste de rejeição faltando
- [ ] `display_order` default é `0` — não verificado
- [ ] `general_pairings` default é `[]` — não verificado
- [ ] `image_url` default é `/placeholder-beer.jpg` — não verificado

**DishModel:**
- [ ] `slug` deve ser armazenado em lowercase — não verificado
- [ ] `image_url` default é `/placeholder-dish.jpg` — não verificado

**RecommendationModel:**
- [ ] `affinity_score` rejeita valores abaixo de 0 (`min: 0` no schema)
- [ ] `affinity_score` rejeita valores acima de 100 (`max: 100` no schema)
- [ ] Todos os outros valores de `harmony_principle` válidos além de `complemento` — apenas um valor positivo testado

---

## Plano de Implementação de Testes

### Testes de Alta Prioridade — Fazer Agora

**1. `utils/response.ts` — ENTREGUE**
- Arquivo: `apps/api/src/__tests__/response.test.ts`
- 11 cenários cobrindo: statusCode correto, formato do body, headers CORS, separação `data`/`error`, serialização de array e null
- Sem dependência de banco — executa em milissegundos

**2. Lacunas nos testes de modelos existentes (afinity_score fora dos limites)**

```typescript
// Adicionar em models.test.ts dentro de describe('RecommendationModel')
it('rejeita affinity_score acima de 100', async () => {
  // ... setup de cat/dish/beer igual ao teste existente
  await expect(
    RecommendationModel.create({ ...validFields, affinity_score: 101 })
  ).rejects.toThrow()
})

it('rejeita affinity_score abaixo de 0', async () => {
  await expect(
    RecommendationModel.create({ ...validFields, affinity_score: -1 })
  ).rejects.toThrow()
})
```

---

### Testes de Média Prioridade — Junto com as Features

**Feature F02 / F07 — Handlers `categories.list`, `beers.list`, `beers.detail`**

Estrutura sugerida para `apps/api/src/__tests__/handlers.categories.test.ts`:

```typescript
import { connectDB, disconnectDB } from '../db/connection'
import { CategoryModel } from '../models/Category'
import { DishModel } from '../models/Dish'
import { list, dishes } from '../handlers/categories'
import { mockEvent } from './helpers' // helper a criar

describe('handlers/categories', () => {
  beforeAll(() => connectDB())
  afterAll(() => disconnectDB())
  beforeEach(async () => {
    await CategoryModel.deleteMany({})
    await DishModel.deleteMany({})
  })

  describe('list', () => {
    it('retorna 200 com lista vazia quando não há categorias ativas', async () => {
      const res = await list(mockEvent(), {} as any, {} as any)
      expect(res?.statusCode).toBe(200)
      expect(JSON.parse(res?.body ?? '').data).toEqual([])
    })

    it('retorna somente categorias com active: true ordenadas por order', async () => {
      // seed + assert
    })
  })

  describe('dishes', () => {
    it('retorna 404 quando slug não está no pathParameters', async () => {
      const res = await dishes(mockEvent({}), {} as any, {} as any)
      expect(res?.statusCode).toBe(404)
    })

    it('retorna 404 quando categoria não existe', async () => { /* ... */ })
    it('retorna 404 quando categoria existe mas active: false', async () => { /* ... */ })
    it('retorna pratos da categoria com active: true', async () => { /* ... */ })
  })
})
```

---

### Testes de Alta Prioridade — Junto com Feature F04

**`dishes.recommendations` — handler mais crítico do produto**

```typescript
describe('recommendations', () => {
  it('retorna 404 quando slug não está no path', async () => { /* ... */ })
  it('retorna 404 quando prato não existe', async () => { /* ... */ })
  it('retorna recomendações ordenadas por affinity_score decrescente', async () => { /* ... */ })
  it('inclui category: null quando categoria foi removida', async () => { /* ... */ })
  it('filtra cervejas com active: false mesmo com Recommendation ativa', async () => { /* ... */ })
  it('retorna recommendations: [] quando prato existe mas não tem recomendações', async () => { /* ... */ })
})
```

---

### Testes de Alta Prioridade — Junto com Feature F03

**`search.search` — validação de input é testável sem seed complexo**

```typescript
describe('search', () => {
  it('retorna 400 quando q está ausente', async () => { /* ... */ })
  it('retorna 400 quando q tem 1 caractere', async () => { /* ... */ })
  it('retorna 400 quando q tem apenas espaços', async () => { /* ... */ })
  it('retorna 200 com count igual ao length de results', async () => { /* ... */ })
  it('limita resultados a 20 itens', async () => { /* seed 25 pratos + assert */ })
})
```

Os três primeiros casos (validação de input) podem ser escritos **agora** sem seed, pois retornam `badRequest` antes de tocar o banco.

---

## Estatísticas Resumidas

| Métrica | Valor |
|---|---|
| Arquivos de código analisados | 7 (connection, 4 models, utils/response, 4 handlers) |
| Arquivos com cobertura adequada | 5 (connection + 4 models) |
| Arquivos sem nenhuma cobertura | 5 (response + 4 handlers) |
| Testes entregues neste relatório | 11 cenários (response.test.ts) |
| Cenários documentados para features futuras | 28 |
| Lacunas encontradas em testes existentes | 8 (BeerModel defaults, affinity_score bounds, slug lowercase, try/finally) |
| Esforço estimado — testes imediatos | response.ts: feito; lacunas de models: 1h |
| Esforço estimado — testes de handlers | 4–6h por handler, feito junto com cada feature |

---

## Recomendações

1. **Rodar `response.test.ts` agora** para confirmar que os 11 cenários passam antes do merge. Comando: `pnpm --filter api test` ou `cd apps/api && npx jest --testPathPattern="response.test.ts"`.

2. **Adicionar testes de bounds para `affinity_score`** em `models.test.ts` na mesma sessão — são 2 casos que fecham uma lacuna real no schema (`min: 0, max: 100` sem teste).

3. **Criar um helper `mockEvent`** em `apps/api/src/__tests__/helpers.ts` antes de escrever qualquer teste de handler. Todos os handlers recebem `APIGatewayProxyEventV2` — um factory que aceita `pathParameters` e `queryStringParameters` evita boilerplate repetido em 10+ testes.

4. **Não bloquear o merge por ausência de testes de handlers.** Os handlers têm lógica real mas ela só faz sentido com dados seed que pertencem às features. Escrever testes com fixtures artificiais agora criaria acoplamento frágil com a estrutura de dados que ainda vai evoluir.

5. **Os 3 casos de validação de input do `search` são exceção à regra acima** — podem e devem ser escritos agora, pois não dependem de seed e cobrem um caso de edge (`q` com apenas espaços após `.trim()`) que é fácil de introduzir uma regressão acidentalmente.

6. **Considerar coverageThreshold no `jest.config.ts`** após as features F02–F04 estarem com testes. Definir `branches: 80, functions: 80` garante que handlers futuros não entrem sem cobertura sem aviso explícito no CI.
