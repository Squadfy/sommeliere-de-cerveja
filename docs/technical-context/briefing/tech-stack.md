# Tech Stack — Sommelière de Cerveja

> Stack tecnológico completo do protótipo MVP.
> Março/2026 — Projeto educacional Mentoria Time 4.

---

## Runtime & Linguagem

| Item | Versão | Uso |
|---|---|---|
| **Node.js** | 18.x (LTS) | Runtime backend + scripts |
| **TypeScript** | Latest | Ambos apps (web + api) |
| **pnpm** / **npm** | — | Package manager (workspace) |

---

## Monorepo

| Item | Versão | Uso |
|---|---|---|
| **Turborepo** | Latest | Orquestração de monorepo, build incremental |

### Workspaces
```
apps/web    → Next.js PWA
apps/api    → Serverless API
packages/types → @sommeliere/types
packages/db    → (opcional) helpers Mongoose
```

---

## Frontend (`apps/web`)

| Pacote | Versão | Propósito |
|---|---|---|
| **Next.js** | 14 | Framework — App Router, ISR, SSR, OG tags |
| **React** | 18 | UI library |
| **TypeScript** | Latest | Tipagem |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Shadcn/UI** | Latest | Componentes acessíveis (Radix UI primitives) |
| **clsx** | Latest | Condicionais de classes CSS |
| **tailwind-merge** | Latest | Merge de classes Tailwind sem conflito |

### Alias de Import
```typescript
import { ... } from '@/components/...'   // maps to apps/web/
import { ... } from '@sommeliere/types'  // maps to packages/types/
```

### Variáveis de Ambiente (`apps/web/.env.local`)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

---

## Backend (`apps/api`)

| Pacote | Versão | Propósito |
|---|---|---|
| **Serverless Framework** | Latest | Deploy Lambda + dev local |
| **serverless-offline** | Latest | Simulação local de Lambda |
| **Mongoose** | Latest | ODM para MongoDB |
| **TypeScript** | Latest | Tipagem |
| **aws-lambda** types | Latest | Tipos para handlers Lambda |

### Variáveis de Ambiente (`apps/api/.env`)
```
MONGODB_URI=mongodb://localhost:27017/sommeliere
```

### Dev Local
```bash
cd apps/api
npx serverless offline  # roda na porta 3001
```

---

## Database

| Item | Versão | Uso |
|---|---|---|
| **MongoDB** | 6.x+ | Banco principal — self-hosted |
| **Mongoose** | 8.x | ODM — modelos, queries, $lookup |

### Collections
| Collection | Volume MVP |
|---|---|
| `categories` | 8 documentos |
| `dishes` | ~50 documentos |
| `beers` | 8 documentos |
| `recommendations` | ~200 documentos |

---

## Infraestrutura

### Desenvolvimento (atual)
| Serviço | Uso |
|---|---|
| **Local MongoDB** | `mongod` ou Docker — `mongodb://localhost:27017/sommeliere` |
| **serverless offline** | API local na porta 3001 |
| **next dev** | Frontend local na porta 3000 |

### Produção (planejada)
| Serviço | Uso |
|---|---|
| **AWS Amplify** | Hosting do Next.js PWA |
| **AWS Lambda + API Gateway** | Hosting da API Serverless |
| **AWS S3 + CloudFront** | Assets / imagens de cervejas e pratos |
| **MongoDB** self-hosted | Instância própria (ou Atlas pós-protótipo) |

---

## Serviços Externos

| Serviço | Uso | API Key? |
|---|---|---|
| **WhatsApp wa.me** | Compartilhamento social | Não — link público |

---

## Ferramentas de Desenvolvimento

| Ferramenta | Uso |
|---|---|
| **turbo dev** | Roda todos os apps em paralelo |
| **scripts/seed.ts** | Popula MongoDB com catálogo inicial |
| **ESLint** | Linting (configurado por app) |
| **Prettier** | Formatação (a configurar) |

### Scripts Raiz (`package.json`)
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "seed": "ts-node scripts/seed.ts"
  }
}
```

---

## Critérios de Performance (Metas do Protótipo)

| Métrica | Meta |
|---|---|
| PWA — tempo até primeira interação | < 3s em 4G |
| API de recomendação | < 200ms |
| Busca de pratos | < 100ms |
| Lighthouse Accessibility Score | > 90 |
| Deep link WhatsApp com gate preservado | ✅ |
| OG tags geram preview WhatsApp | ✅ |
| Funciona Android + iOS (browsers padrão) | ✅ |

---

## Débitos Técnicos Aceitos no Protótipo

| # | Débito | Solução futura |
|---|---|---|
| 1 | Sem CI/CD | GitHub Actions: lint + build em PR |
| 2 | Sem testes | Jest + RTL (unit) · Playwright (E2E) |
| 3 | Sem analytics | GA4 antes do lançamento público |
| 4 | Assets sem CDN | S3 + CloudFront + next/image |
| 5 | MongoDB sem backup | MongoDB Atlas para produção |
| 6 | Revalidação manual pós-seed | Script de seed chama API de revalidação |

---

*Fonte: ADRs 001–008, ARCHITECTURE.md, tech-context/index.md*
*Março/2026 — Projeto educacional Mentoria Time 4*
