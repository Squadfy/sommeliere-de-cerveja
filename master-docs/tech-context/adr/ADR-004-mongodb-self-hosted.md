# ADR-004: MongoDB Self-Hosted

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O produto precisa de um banco de dados para armazenar pratos, cervejas e recomendações. O catálogo é composto por documentos com estrutura aninhada (prato → recomendações → cerveja) e busca textual em português.

## Decisão

Usar **MongoDB** com instância **self-hosted** (local no desenvolvimento, instância própria no futuro).

## Motivação

### Por MongoDB
- Esquema flexível para documentos de recomendação com estrutura variável (até 3 cervejas por prato, cada uma com textos distintos)
- **Busca textual nativa** com suporte a `$language: "portuguese"` — crítico para F03
- `$lookup` para joins entre collections — usado em F04 para agregar cerveja + recomendação em uma query
- Familiaridade do time com o ecossistema Node.js/MongoDB

### Por Self-Hosted (vs Atlas)
- Sem custo de cloud no protótipo
- Setup local com `mongod` ou Docker é imediato
- Migração para Atlas ou instância EC2 no futuro requer apenas mudança de `MONGODB_URI`

## Collections e Volumes (MVP)

| Collection | Volume MVP | Descrição |
|---|---|---|
| `categories` | 8 documentos | Categorias de pratos |
| `dishes` | ~50 documentos | Pratos com search_tags |
| `beers` | 8 documentos | Cervejas do portfólio |
| `recommendations` | ~200 documentos | Relacionamento prato × cerveja (até 5 por prato) |

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| PostgreSQL | Busca textual em português requer extensão adicional (pg_trgm); joins mais verbosos para o modelo de dados |
| Firebase Firestore | Busca textual limitada; sem suporte nativo a português |
| MongoDB Atlas | Custo desnecessário no protótipo; mesma API — migração trivial depois |
| SQLite | Sem busca textual com suporte a idiomas; sem escalabilidade para cloud |

## Índices Necessários

```js
// Índice textual para busca de pratos (F03)
db.dishes.createIndex(
  { name: "text", search_tags: "text" },
  { weights: { name: 10, search_tags: 5 }, default_language: "portuguese" }
)

// Índice composto para query de recomendações (F04)
db.recommendations.createIndex({ dish_id: 1, active: 1, affinity_score: -1 })

// Índice para navegação reversa (F07)
db.recommendations.createIndex({ beer_id: 1, active: 1, affinity_score: -1 })

// Índice para filtro por categoria (F02)
db.dishes.createIndex({ category_id: 1, active: 1 })
```

## Variável de Ambiente

```
MONGODB_URI=mongodb://localhost:27017/sommeliere
```

Para produção futura:
```
MONGODB_URI=mongodb://user:pass@host:27017/sommeliere
```
