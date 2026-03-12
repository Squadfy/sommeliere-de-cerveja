# ADR-002: Next.js 14 com App Router

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O produto é um PWA mobile-first que precisa de:
- OG tags dinâmicas por URL (para preview rico no WhatsApp)
- ISR (Incremental Static Regeneration) para páginas de conteúdo estável
- SSR para páginas que dependem de parâmetros de URL em runtime

## Decisão

Usar **Next.js 14 com App Router** (não Pages Router).

## Motivação

O App Router oferece:
- `generateMetadata` por rota para OG tags dinâmicas (crítico para F08)
- Server Components por padrão — menos JS enviado ao cliente
- `revalidate` por segmento de rota para ISR granular
- Layouts aninhados — ideal para o layout shell do PWA

## Estratégia de Rendering por Rota

| Rota | Estratégia | Justificativa |
|---|---|---|
| `/` | ISR (revalidate: 3600s) | Categorias raramente mudam |
| `/categoria/[slug]` | ISR (revalidate: 3600s) | Lista de pratos estável |
| `/prato/[slug]` | ISR (revalidate: 1800s) | Recomendações podem ser atualizadas |
| `/cervejas` | ISR (revalidate: 3600s) | Portfólio estável |
| `/cervejas/[slug]` | ISR (revalidate: 3600s) | Dados estáveis |
| `/cervejas/[slug]/pratos` | SSR | Parâmetro `?beer=` em runtime |
| `/gate` | Static | Sem dados dinâmicos |

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Next.js Pages Router | App Router é o padrão futuro; sem vantagem em adotar a API legada |
| Vite + React SPA | Sem SSR/ISR nativo; OG tags exigiriam solução adicional |
| Remix | Menor ecossistema de componentes; equipe menos familiar |

## Consequências

**Positivas:**
- OG tags por rota sem configuração adicional
- Menos JavaScript no bundle via Server Components
- ISR reduz carga no MongoDB para páginas de alta frequência

**Negativas:**
- App Router tem mais complexidade conceitual (Server vs Client Components)
- `"use client"` deve ser adicionado conscientemente — risco de enviar lógica desnecessária ao cliente

## Regra Importante

**Server Components por padrão.** Adicionar `"use client"` somente quando necessário:
- Hooks de estado (`useState`, `useEffect`)
- Interações com `localStorage`
- Event handlers de UI
- Context API consumers
