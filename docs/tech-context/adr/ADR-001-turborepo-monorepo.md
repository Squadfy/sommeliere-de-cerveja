# ADR-001: Turborepo como ferramenta de monorepo

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O projeto possui dois artefatos distintos: o frontend (Next.js PWA) e o backend (Serverless Framework API). Ambos compartilham tipos TypeScript e constantes de domínio (ex: slugs de cervejas, estrutura das collections). Precisávamos de uma estratégia para gerenciar os dois no mesmo repositório sem duplicação de código.

## Decisão

Usar **Turborepo** como orquestrador do monorepo, com a seguinte estrutura de workspaces:

```
/
├── apps/
│   ├── web/     → Next.js App Router (PWA)
│   └── api/     → Serverless Framework (Node.js)
├── packages/
│   ├── types/   → Tipos TypeScript compartilhados
│   └── db/      → Modelos MongoDB e helpers de conexão
└── turbo.json
```

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| NX | Maior curva de aprendizado, overhead desnecessário para 2 apps |
| Repositórios separados | Duplicação de tipos; sincronização manual entre repos |
| Pasta única sem monorepo | Mistura de responsabilidades; dificulta isolamento de build |

## Consequências

**Positivas:**
- Compartilhamento de tipos entre frontend e backend sem duplicação
- Build incremental via Turborepo cache — `turbo build` só reconstrói o que mudou
- Um único `git clone` para setup completo do projeto

**Negativas:**
- Adiciona complexidade de setup inicial (workspaces npm/yarn/pnpm)
- Versões de dependências devem ser sincronizadas entre os apps

## Configuração de Referência

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```
