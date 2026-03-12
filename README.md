# Sommelière de Cerveja

> Guia rápido de harmonização entre pratos e estilos de cerveja do portfólio Heineken.

O usuário seleciona um prato e o app recomenda qual cerveja combina melhor — com explicação sensorial da harmonização.

## Requisitos

- **Node.js** 18+
- **pnpm** 8+ (`npm install -g pnpm`)
- **MongoDB** 6+ rodando em `mongodb://localhost:27017`

## Instalação

```bash
pnpm install
```

## Configuração

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Editar `apps/api/.env` com a URI do MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/sommeliere
```

## Seed do Banco

Popula o MongoDB com dados iniciais (8 categorias, 43 pratos, 8 cervejas, 32 recomendações):

```bash
pnpm seed
```

> O seed deve ser executado antes de iniciar o projeto. Sem dados, a API retorna 404 em todas as rotas.

## Desenvolvimento

```bash
# Inicia frontend e API em paralelo
pnpm dev

# Ou individualmente:
cd apps/web && pnpm dev   # http://localhost:3000
cd apps/api && pnpm dev   # http://localhost:3001
```

## Testes

```bash
# Todos os workspaces (usa mongodb-memory-server — sem MongoDB local necessário)
pnpm test
```

## Build

```bash
pnpm build
```

## Stack

| Camada | Tecnologia |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI |
| Backend | Serverless Framework v3 · Node.js 20 · AWS Lambda |
| Banco | MongoDB 6 + Mongoose 8 |
| Testes | Jest + mongodb-memory-server |
| Deploy | AWS Amplify (web) · AWS Lambda (api) |

## Estrutura

```
sommeliere-de-cerveja/
├── apps/
│   ├── web/          Next.js 14 — PWA frontend
│   └── api/          Serverless Framework — Lambda handlers
├── packages/
│   └── types/        Interfaces TypeScript compartilhadas
└── scripts/
    └── seed.ts       Popula o banco com dados iniciais
```

---

Projeto de mentoria multidisciplinar — Time 4
