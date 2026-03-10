# Sommelière de Cerveja — Technical Context

> Documentação técnica do projeto. Fase: Protótipo MVP.
> Stack: Turborepo · Next.js 14 (App Router) · Serverless Framework · MongoDB · AWS

---

## Project Context Profile

| Campo | Valor |
|---|---|
| **Produto** | Sommelière de Cerveja — PWA de harmonização cervejeira |
| **Fase** | Protótipo MVP |
| **Stack Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI |
| **Stack Backend** | Node.js · Serverless Framework |
| **Banco de Dados** | MongoDB (self-hosted) |
| **Monorepo** | Turborepo |
| **Infra atual** | Local |
| **Infra futura** | AWS Amplify (frontend) · AWS Lambda (backend) · AWS S3 (assets) |
| **Deploy** | Manual |
| **Testes** | Nenhum no protótipo |

---

## Features em Escopo (Protótipo)

| ID | Feature | Status |
|---|---|---|
| F01 | Gate de Maioridade | ✅ In scope |
| F02 | Navegação por Categorias | ✅ In scope |
| F03 | Busca por Nome de Prato | ✅ In scope |
| F04 | Recomendação de Cerveja | ✅ In scope |
| F05 | Dica de Serviço | ✅ In scope |
| F06 | Ver Mais Combinações | ✅ In scope |
| F07 | Portfólio de Marcas | ✅ In scope |
| F08 | Compartilhamento Social (WhatsApp) | ✅ In scope |
| F09 | Analytics | ❌ Fora do escopo |
| F10 | Painel de Gestão de Conteúdo | ❌ Fora do escopo |

---

## Layer 1: Core Project Context

- [Project Charter](project_charter.md)
- [Architecture Decision Records](adr/)
  - [ADR-001: Turborepo Monorepo](adr/ADR-001-turborepo-monorepo.md)
  - [ADR-002: Next.js App Router](adr/ADR-002-nextjs-app-router.md)
  - [ADR-003: Serverless Framework](adr/ADR-003-serverless-framework.md)
  - [ADR-004: MongoDB Self-Hosted](adr/ADR-004-mongodb-self-hosted.md)
  - [ADR-005: Tailwind + Shadcn/UI](adr/ADR-005-tailwind-shadcn.md)
  - [ADR-006: Age Gate via localStorage](adr/ADR-006-age-gate-localstorage.md)
  - [ADR-007: ISR para páginas de conteúdo](adr/ADR-007-isr-content-pages.md)
  - [ADR-008: Compartilhamento via wa.me](adr/ADR-008-whatsapp-sharing.md)

## Layer 2: AI-Optimized Context Files

- [AI Development Guide](CLAUDE.meta.md)
- [Codebase Navigation Guide](CODEBASE_GUIDE.md)

## Layer 3: Domain-Specific Context

- [Business Logic Documentation](BUSINESS_LOGIC.md)
- [API Specifications](API_SPECIFICATION.md)

## Layer 4: Development Workflow Context

- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Challenges](ARCHITECTURE_CHALLENGES.md)

---

*Gerado em Março/2026 — Projeto educacional Mentoria Time 4*
