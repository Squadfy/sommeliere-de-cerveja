# Context: IAS-1 — Infraestrutura & Scaffold do Monorepo

## Motivação

O projeto está no estágio zero (apenas documentação). Este Epic cria a fundação técnica completa para que o time possa desenvolver as features F01-F08. Sem esta entrega, nenhum outro desenvolvimento pode começar.

## Meta

Ter um monorepo Turborepo funcional com 4 sub-entregas:

| Sub-issue | Entrega |
|---|---|
| IAS-9 | Scaffold: `apps/web` + `apps/api` + `packages/types` + `turbo.json` |
| IAS-10 | Mongoose models (4 collections) + `db/connection.ts` cacheado + `utils/response.ts` |
| IAS-11 | `scripts/seed.ts` idempotente com 8 categorias, ~50 pratos, 8 cervejas, recomendações |
| IAS-12 | PWA: `manifest.json` + ícones placeholder + `next.config.ts` |

## Decisões Técnicas (desta sessão)

- **Package manager:** pnpm (pnpm workspaces)
- **Serverless Framework:** v3
- **packages/db:** NÃO criar — models ficam em `apps/api/src/models/`
- **Cor Heineken:** `#288154`
- **Node.js:** 18+
- **MongoDB:** 6+ local em `mongodb://localhost:27017/sommeliere`

## Estratégia de Execução

Ordem obrigatória (dependências):
1. **IAS-9** → base de tudo
2. **IAS-10** → depende da estrutura `apps/api` (IAS-9)
3. **IAS-12** → depende da estrutura `apps/web` (IAS-9), independente de IAS-10
4. **IAS-11** → depende dos models (IAS-10)

## Critérios de Aceite (consolidados)

### IAS-9
- [ ] `turbo dev` inicia `apps/web` (porta 3000) e `apps/api` (porta 3001) em paralelo
- [ ] `turbo build` compila sem erros
- [ ] `@sommeliere/types` é importável em ambos os apps
- [ ] `.env.example` documenta `NEXT_PUBLIC_APP_URL` e `API_URL` (web) + `MONGODB_URI` (api)

### IAS-10
- [ ] `mongoose.connect()` nunca chamado diretamente em handlers — sempre via `db/connection.ts`
- [ ] Todos os models têm campo `active: boolean` (default: true)
- [ ] Slugs têm índice `unique: true` em todas as collections
- [ ] Índice `$text` em `dishes` com language `portuguese`

### IAS-11
- [ ] `npx ts-node scripts/seed.ts` executa sem erros
- [ ] Após seed: 8 categorias, ~50 pratos, 8 cervejas, recomendações inseridos
- [ ] Script idempotente (pode ser executado múltiplas vezes sem duplicar dados)
- [ ] Pelo menos 5 pratos com > 3 recomendações (para testar F06)

### IAS-12
- [ ] `manifest.json` referenciado no `<head>` do `layout.tsx`
- [ ] App pode ser instalado como PWA no Android (Chrome) e iOS (Safari)
- [ ] Lighthouse PWA score > 90 em mobile

## Regras Críticas do Projeto

1. Não importar `mongoose` em `apps/web` — toda query MongoDB ocorre exclusivamente em `apps/api`
2. Sempre usar conexão cacheada — nunca `mongoose.connect()` dentro de handler Lambda
3. URLs sempre usam `slug` (kebab-case), nunca `_id` MongoDB
4. Tipos compartilhados APENAS em `packages/types/` — não duplicar entre web e api
5. Sem `"use client"` desnecessário — Server Components por padrão
6. Sem `any` no TypeScript
7. `cn()` para classes condicionais (não string interpolation no Tailwind)

## Conteúdo do Seed (referência)

### 8 Cervejas (portfólio Heineken)
| Slug | Marca | Estilo | Temp | Copo |
|---|---|---|---|---|
| heineken-lager | Heineken | Lager Premium | 2-4°C | Calice/Tulipa |
| amstel-puro-malte | Amstel | Puro Malte | 4-6°C | Copo long neck |
| eisenbahn-pilsen | Eisenbahn | Pilsen Artesanal | 4-6°C | Copo americano |
| eisenbahn-weizenbier | Eisenbahn | Weizen | 6-8°C | Copo de trigo |
| eisenbahn-ipa | Eisenbahn | IPA / Pale Ale | 8-10°C | Copo tulipa |
| baden-baden-premium | Baden Baden | Linha Gourmet Premium | 4-6°C | Taça |
| sol-lager | Sol | Lager Tropical | 2-4°C | Long neck |
| devassa-puro-malte | Devassa | Puro Malte | 4-6°C | Copo americano |

### 8 Categorias
Carnes, Frutos do Mar, Massas, Petiscos, Vegetariano, Sushi/Oriental, Sobremesas, Outros

### Collections MongoDB
- `categories`: slug (unique), name, icon, order, active
- `dishes`: slug (unique), name, category_id, image_url, search_tags[], active + índice $text
- `beers`: slug (unique), name, brand, style, sensory_profile, general_pairings, image_url, serving_temp_min, serving_temp_max, glass_type, display_order, active
- `recommendations`: dish_id, beer_id, affinity_score (0-100), harmony_principle, recommendation_title, sensory_explanation, active

## Dependências Externas

- `next@14` — App Router, ISR, Server Components
- `typescript` — strict mode
- `tailwindcss` — utility CSS
- `mongoose@^8` — ODM MongoDB
- `serverless@^3` + `serverless-offline` — API local e deploy Lambda
- `turbo` — pipeline monorepo
- `ts-node` — execução do seed

## Limitações e Premissas

- MongoDB deve estar rodando localmente antes de executar o seed ou a API
- Imagens das cervejas são placeholder (`/placeholder-beer.jpg`) — assets reais virão em sprints posteriores
- PWA ícones serão placeholders (SVG simples) — design final não está definido neste Epic
- `serverless-offline` simula Lambda localmente; comportamento de cold start não é reproduzido
