# Contributing Guide — Sommelière de Cerveja

> Guia de desenvolvimento, fluxo de trabalho e padrões de contribuição para o projeto.

---

## Setup de Ambiente

### Pré-requisitos

- **Node.js** 18+
- **pnpm** 8+ — gerenciador de pacotes obrigatório (definido em `engines.pnpm` do `package.json`)
- **MongoDB** 6+ rodando localmente em `mongodb://localhost:27017`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Squadfy/sommeliere-de-cerveja.git
cd sommeliere-de-cerveja

# Instala dependências de todos os workspaces
pnpm install

# Configura variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Editar .env com a URI do MongoDB local
# MONGODB_URI=mongodb://localhost:27017/sommeliere
```

### Seed do Banco de Dados

```bash
# Popula MongoDB com dados iniciais (8 categorias, 43 pratos, 8 cervejas, 32 recomendações)
pnpm seed
```

> O seed deve ser executado antes de qualquer teste de desenvolvimento. Sem dados, a API retorna 404 em todas as rotas.

### Iniciar em Desenvolvimento

```bash
# Inicia apps/web (Next.js) e apps/api (serverless offline) em paralelo via Turborepo
pnpm dev

# Ou individualmente:
cd apps/web && pnpm dev         # → http://localhost:3000
cd apps/api && pnpm dev         # → http://localhost:3001 (serverless offline)
```

### Executar Testes

```bash
# Executa testes em todos os pacotes
pnpm test

# Apenas a API (usa mongodb-memory-server — sem MongoDB local necessário)
cd apps/api && pnpm test
```

---

## Estrutura de Branches

| Branch | Propósito |
|---|---|
| `main` | Código estável — base para releases |
| `dev` | Branch de integração — PRs abertos aqui |
| `feature/[nome]` | Feature ou melhoria individual |
| `fix/[nome]` | Correção de bug |
| `docs/[nome]` | Atualizações de documentação |

### Fluxo

```
feature/minha-feature
        ↓ PR
      dev
        ↓ PR (quando estável)
      main
```

---

## Padrões de Código

### TypeScript

```typescript
// ✅ Correto — sem any
function processRecommendation(data: unknown): Recommendation {
  if (!isRecommendation(data)) throw new Error('Invalid data')
  return data
}

// ❌ Errado
function processRecommendation(data: any) { ... }
```

### Componentes React

```tsx
// ✅ Server Component por padrão — sem "use client"
export default async function DishPage({ params }: { params: { slug: string } }) {
  const data = await getRecommendations(params.slug)
  return <RecommendationCard data={data} />
}

// ✅ Client Component apenas quando necessário
'use client'
export function SearchBar() {
  const [query, setQuery] = useState('')
  // ...
}
```

### Tailwind + cn()

```tsx
// ✅ Classes condicionais com cn()
import { cn } from '@/lib/utils'

<div className={cn(
  "base-class rounded-lg",
  isActive && "bg-green-500",
  isDisabled && "opacity-50"
)} />

// ❌ String interpolation — Tailwind não consegue purgar
<div className={`bg-${color}-500`} />
```

### Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componentes | PascalCase | `BeerCard`, `CategoryGrid` |
| Hooks | camelCase + prefixo `use` | `useAgeGate`, `useSearch` |
| Handlers API | camelCase | `getRecommendations`, `searchDishes` |
| Collections MongoDB | plural + camelCase | `dishes`, `beers`, `recommendations` |
| Slugs | kebab-case | `salmao-grelhado`, `heineken-lager` |
| Arquivos de componente | PascalCase | `BeerCard.tsx`, `ShareButton.tsx` |
| Hooks e utilitários | camelCase | `useSearch.ts`, `utils.ts` |

---

## Regras Críticas — Nunca Viole

1. **Não adicione `"use client"` sem necessidade** — use apenas para `useState`, `useEffect`, `localStorage`, event handlers.
2. **Não importe `mongoose` em `apps/web`** — toda query ao MongoDB ocorre exclusivamente na API (`apps/api`).
3. **Sempre use a conexão cacheada** — nunca `mongoose.connect()` dentro de um handler Lambda.
4. **Não use `_id` MongoDB nas URLs** — sempre `slug`.
5. **Tipos compartilhados em `packages/types/`** — não duplique interfaces entre `web` e `api`.

---

## Adicionando Conteúdo (Seed)

O protótipo não tem painel admin. Todo conteúdo é gerenciado via `scripts/seed.ts`.

Para adicionar um novo prato:
1. Editar `scripts/seed.ts` → array `DISHES`
2. Definir `slug`, `name`, `category_slug`, `search_tags`, `image_url` (o `category_id` é resolvido automaticamente pelo seed a partir do `category_slug`)
3. Adicionar recomendações no array `RECOMMENDATIONS` com `dish_slug` correspondente
4. Rodar `pnpm seed`

Para adicionar uma nova cerveja:
1. Editar `scripts/seed.ts` → array `BEERS`
2. Preencher todos os campos incluindo `serving_temp_min/max`, `glass_type`, `general_pairings` (array de strings) e `display_order`
3. Vincular recomendações no array `RECOMMENDATIONS` com `beer_slug` correspondente
4. Rodar `pnpm seed`

---

## Adicionando Componentes Shadcn/UI

```bash
# Adicionar via CLI — não copiar manualmente
cd apps/web
npx shadcn-ui@latest add [component-name]

# Exemplos:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add accordion
```

> Arquivos gerados ficam em `apps/web/components/ui/`. **Não editar diretamente.**

---

## Processo de Code Review

### Checklist antes de abrir PR

- [ ] Sem `"use client"` desnecessário
- [ ] Sem imports de mongoose ou MongoDB em `apps/web`
- [ ] Tipos definidos em `packages/types/` (não duplicados)
- [ ] `cn()` usado para classes condicionais (não string interpolation)
- [ ] Sem `any` no TypeScript
- [ ] Sem `_id` exposto nas URLs
- [ ] ISR configurado corretamente nas rotas de conteúdo
- [ ] Seed atualizado se novos dados foram adicionados

### Tamanho ideal de PR

- Uma feature ou fix por PR
- PRs grandes (> 400 linhas) devem ser divididos em etapas menores

---

## Deploy (Protótipo)

O deploy no protótipo é **manual**.

### Frontend (apps/web)

```bash
cd apps/web
pnpm build
# Upload para AWS Amplify via console ou Amplify CLI
```

### API (apps/api)

```bash
cd apps/api
serverless deploy --stage prod
# Deploya funções Lambda + API Gateway via Serverless Framework
```

### Variáveis de Ambiente em Produção

| Variável | App | Valor em prod |
|---|---|---|
| `MONGODB_URI` | `apps/api` | URI do MongoDB em produção |
| `NEXT_PUBLIC_APP_URL` | `apps/web` | `https://app.sommeliere.com.br` |
| `API_URL` | `apps/web` | URL do API Gateway em produção |

---

## Troubleshooting de Desenvolvimento

| Problema | Solução |
|---|---|
| API retorna 404 em todas as rotas | Verificar se seed foi executado e MongoDB está rodando |
| Flash de conteúdo no gate | Usar `loading` state antes de ler localStorage no `useEffect` |
| Tailwind classes não aplicadas | Não usar string interpolation — classes devem ser literais |
| `ObjectId is not serializable` | Converter `_id.toString()` antes de retornar da API |
| Cold start lento na API | Usar padrão de conexão cacheada (ver ADR-003) |
| ISR com dados desatualizados após seed | Chamar `res.revalidate('/prato/[slug]')` manualmente |
