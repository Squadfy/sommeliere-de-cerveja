# Project Charter — Sommelière de Cerveja

---

## Visão Técnica

Construir um PWA mobile-first de harmonização cervejeira com arquitetura de monorepo desacoplada: frontend Next.js servindo as páginas públicas via ISR, e backend Node.js serverless expondo as APIs de dados.

O protótipo prioriza **velocidade de entrega** e **simplicidade arquitetural** — sem testes automatizados, sem painel de gestão, com dados populados via seed. Decisões de over-engineering são explicitamente evitadas nesta fase.

---

## Escopo Técnico do Protótipo

### Incluído

| Área | O que está incluído |
|---|---|
| Frontend | PWA Next.js (App Router) com Tailwind + Shadcn — mobile-first |
| Backend | API REST Node.js com Serverless Framework (F01–F08) |
| Banco de dados | MongoDB self-hosted — seed com 50 pratos + 8 cervejas + recomendações |
| Gate de maioridade | Client-side via localStorage (F01) |
| Compartilhamento | WhatsApp via `wa.me` + OG tags para preview rico (F08) |
| Deep link | `/prato/[slug]` com preservação de parâmetros |
| Navegação reversa | `/cervejas/[slug]?beer=` para filtrar recomendação (F07) |

### Excluído

- Testes automatizados (unit, integration, E2E)
- Painel de gestão de conteúdo (F10)
- Analytics de uso (F09)
- CI/CD pipeline — deploy manual
- Autenticação de usuário
- Cache distribuído (Redis)
- Monitoramento e alertas

---

## Constraints Técnicas

| Constraint | Detalhe |
|---|---|
| **Sem testes no protótipo** | Qualidade garantida por revisão manual e critérios de aceite dos feature specs |
| **MongoDB self-hosted** | Sem Atlas no protótipo — conexão direta ao MongoDB local |
| **Deploy manual** | Sem GitHub Actions ou CI/CD nesta fase |
| **Conteúdo via seed** | Sem painel — alterações de conteúdo exigem novo seed/deploy |
| **Context API** | Sem Zustand ou Redux — estado global mínimo no protótipo |
| **AWS futuro** | Código escrito para portabilidade: Amplify-ready (frontend) e Lambda-ready (backend) |

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    Usuário (mobile PWA)                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│              Next.js App Router (apps/web)               │
│  ISR pages: /, /categoria/[slug], /prato/[slug]          │
│  SSR pages: /cervejas/[slug]/pratos                      │
│  Client: Age Gate (localStorage), Busca (debounce)       │
└────────────────────────┬────────────────────────────────┘
                         │ REST API calls
┌────────────────────────▼────────────────────────────────┐
│          Serverless Framework API (apps/api)             │
│  GET /categories · GET /categories/:slug/dishes          │
│  GET /dishes/:slug/recommendations                       │
│  GET /beers · GET /beers/:slug                           │
│  GET /search?q=                                          │
└────────────────────────┬────────────────────────────────┘
                         │ MongoDB driver
┌────────────────────────▼────────────────────────────────┐
│              MongoDB (self-hosted)                        │
│  Collections: categories, dishes, beers, recommendations │
└─────────────────────────────────────────────────────────┘
```

---

## Critérios de Sucesso Técnico (Protótipo)

| Critério | Meta |
|---|---|
| PWA carrega até primeira interação | < 3 segundos em 4G |
| API de recomendação responde | < 200ms |
| Busca de pratos responde | < 100ms |
| Lighthouse Accessibility Score | > 90 |
| Funcionamento em Android e iOS (browsers padrão) | 100% |
| Deep link via WhatsApp funciona com gate | ✅ |
| OG tags geram preview no WhatsApp | ✅ |

---

## Stakeholders Técnicos

| Role | Responsabilidade |
|---|---|
| **Time de Dev (Mentoria Time 4)** | Desenvolvimento do protótipo |
| **Mentor Técnico** | Revisão de arquitetura e code review |
| **Time de Marketing Heineken** | Provedor do conteúdo (seed data) |
