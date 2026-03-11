# Project Briefing — Sommelière de Cerveja

> Índice mestre de contexto técnico. Gerado em Março/2026.
> Projeto educacional Mentoria Time 4 — cliente simulado Grupo Heineken Brasil.

---

## 📊 Status do Projeto

| Campo | Valor |
|---|---|
| **Produto** | Sommelière de Cerveja — PWA B2C de harmonização cervejeira |
| **Fase** | Protótipo MVP (documentação completa, código ainda não iniciado) |
| **Branch atual** | `dev` |
| **Stack** | Turborepo · Next.js 14 (App Router) · Serverless Framework · MongoDB |
| **Deploy** | Local (dev) → AWS Amplify + Lambda (produção futura) |
| **Testes** | Nenhum no protótipo |

### Features em Escopo

| ID | Feature | Status |
|---|---|---|
| F01 | Gate de Maioridade (18+) | Planejado |
| F02 | Navegação por Categorias | Planejado |
| F03 | Busca por Nome de Prato | Planejado |
| F04 | Recomendação de Cerveja | Planejado |
| F05 | Dica de Serviço (temperatura + copo) | Planejado |
| F06 | Ver Mais Combinações | Planejado |
| F07 | Portfólio de Marcas + Navegação Reversa | Planejado |
| F08 | Compartilhamento WhatsApp (wa.me + OG tags) | Planejado |
| F09 | Analytics | ❌ Fora do escopo |
| F10 | Painel de Gestão de Conteúdo | ❌ Fora do escopo |

---

## 📚 Índice de Arquivos do Briefing

| Arquivo | Conteúdo |
|---|---|
| [critical-rules.md](briefing/critical-rules.md) | Regras não-negociáveis e convenções obrigatórias |
| [adrs-summary.md](briefing/adrs-summary.md) | 8 ADRs consolidadas por categoria |
| [backend-conventions.md](briefing/backend-conventions.md) | Estrutura API + padrões de código |
| [tech-stack.md](briefing/tech-stack.md) | Stack tecnológico completo com versões |

> ⚠️ Sem frontend Lovable detectado — frontend será desenvolvido manualmente (Next.js customizado).

---

## 🎯 Guia de Uso por Tipo de Feature

### Para implementar qualquer feature:
1. Ler `briefing/critical-rules.md` — regras que não podem ser violadas
2. Consultar `master-docs/tech-context/ARCHITECTURE.md` — estrutura completa de diretórios
3. Consultar `master-docs/tech-context/API_SPECIFICATION.md` — contratos de API
4. Consultar `master-docs/tech-context/BUSINESS_LOGIC.md` — regras de domínio e casos de borda

### Para features de frontend (Next.js):
- Respeitar ADR-002 (App Router, Server Components por padrão)
- Usar ADR-005 (Tailwind + Shadcn) para estilização
- Verificar estratégia de rendering em `briefing/adrs-summary.md` (ADR-007)

### Para features de backend (Serverless):
- Seguir estrutura em `briefing/backend-conventions.md`
- Conexão MongoDB sempre via `db/connection.ts` cacheado (ADR-003/ADR-004)
- Resposta sempre no formato `{ data: T }` ou `{ error: "mensagem" }`

### Para o Gate de Maioridade (F01):
- localStorage key: `sommeliere_age_verified = 'true'`
- Redirect param preservado: `/gate?redirect=[rota-original]`
- Implementação client-side (`"use client"`) — ver ADR-006

### Para Compartilhamento (F08):
- Apenas via `wa.me` — sem geração de imagem dinâmica
- Mensagem DEVE incluir "Beba com moderação" (RN08)
- OG tags via `generateMetadata` no App Router (ADR-008)

---

## 🏗️ Arquitetura Resumida

```
Usuário (mobile PWA)
    │ HTTPS
Next.js App Router (apps/web)        ← ISR + SSR + Static
    │ REST fetch
Serverless Framework API (apps/api)  ← Node.js handlers
    │ Mongoose
MongoDB self-hosted                  ← 4 collections
```

### Monorepo Turborepo

```
sommeliere-de-cerveja/
├── apps/
│   ├── web/     → Next.js 14 (App Router) PWA
│   └── api/     → Serverless Framework (Node.js)
├── packages/
│   ├── types/   → @sommeliere/types — contratos TypeScript compartilhados
│   └── db/      → (Opcional) Modelos Mongoose compartilhados
├── scripts/
│   └── seed.ts  → Popula MongoDB com dados iniciais
├── master-docs/ → Documentação completa do projeto
└── turbo.json
```

---

## 🔄 Instruções de Manutenção

Este briefing é atualizado via `/discover` (não-destrutivo, incremental).

Para atualizar manualmente:
- `project-briefing.md` — índice e status
- `briefing/critical-rules.md` — ao adicionar novas regras obrigatórias
- `briefing/adrs-summary.md` — ao criar novas ADRs em `master-docs/tech-context/adr/`
- `briefing/tech-stack.md` — ao atualizar dependências

---

*Gerado por /discover — Março/2026*
