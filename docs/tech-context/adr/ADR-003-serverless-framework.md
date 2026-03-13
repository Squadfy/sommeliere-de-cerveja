# ADR-003: Serverless Framework para a API

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O backend precisa expor uma API REST para o frontend Next.js consumir. A decisão foi separar o backend do frontend (não usar Next.js API Routes) para independência de deploy e portabilidade para AWS Lambda no futuro.

## Decisão

Usar **Serverless Framework** (Node.js) no `apps/api` para definir e executar as funções da API.

## Motivação

- **Portabilidade:** O mesmo código roda localmente via `serverless offline` e na AWS Lambda sem alteração
- **Isolamento:** Backend e frontend deployados independentemente
- **Lambda-ready:** A migração de local para AWS Amplify + Lambda será apenas uma mudança de configuração, não de código
- **Simplicidade:** Para um projeto com 6-8 endpoints simples de leitura, o Serverless Framework é suficiente sem a complexidade de um framework como Nest.js

## Estrutura da API

```
apps/api/
├── src/
│   ├── handlers/
│   │   ├── categories.ts
│   │   ├── dishes.ts
│   │   ├── beers.ts
│   │   ├── recommendations.ts
│   │   └── search.ts
│   ├── db/
│   │   └── connection.ts     ← pool de conexão MongoDB
│   └── types/
│       └── index.ts
├── serverless.yml
└── package.json
```

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Next.js API Routes | Acoplamento entre frontend e backend; dificulta deploy independente |
| Express.js em EC2 | Sem portabilidade para Lambda; mais infra para gerenciar |
| NestJS | Over-engineering para 6-8 endpoints de leitura simples |
| Fastify serverless | Curva adicional sem benefício no escopo atual |

## Consequências

**Positivas:**
- `serverless offline` simula Lambda localmente — paridade dev/prod
- Zero code change na migração local → AWS Lambda
- Funções isoladas por responsabilidade

**Negativas:**
- Cold start nas funções Lambda (futuro) — mitigável com provisioned concurrency
- Gerenciamento de conexão MongoDB em ambiente serverless exige cuidado (connection pooling)

## Nota sobre MongoDB em Serverless

Funções serverless não mantêm estado entre invocações. A conexão MongoDB deve ser:
1. Criada fora do handler (nível de módulo) para reaproveitamento entre warm invocations
2. Verificada antes de cada uso: `if (mongoose.connection.readyState !== 1) await connect()`

```typescript
// apps/api/src/db/connection.ts
let cached: mongoose.Connection | null = null;

export async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGODB_URI!);
  return cached;
}
```
