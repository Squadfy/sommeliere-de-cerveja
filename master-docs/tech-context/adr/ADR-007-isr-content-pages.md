# ADR-007: ISR (Incremental Static Regeneration) para páginas de conteúdo

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

As páginas de categorias, pratos e cervejas têm conteúdo gerenciado via seed (sem painel de gestão no protótipo). O conteúdo é altamente estável — não muda em tempo real. Precisamos de performance máxima para o carregamento do PWA em 4G, sem sobrecarregar o MongoDB a cada request.

## Decisão

Usar **ISR** (Incremental Static Regeneration) do Next.js App Router para as páginas de conteúdo, com `revalidate` configurado por segmento de rota.

## Implementação no App Router

```typescript
// apps/web/app/prato/[slug]/page.tsx
export const revalidate = 1800 // 30 minutos

export default async function PratoPage({ params }) {
  const recommendations = await fetch(
    `${process.env.API_URL}/dishes/${params.slug}/recommendations`,
    { next: { revalidate: 1800 } }
  )
  // ...
}

// Pré-gerar os 50 pratos no build
export async function generateStaticParams() {
  const dishes = await fetch(`${process.env.API_URL}/dishes`)
  return dishes.map(d => ({ slug: d.slug }))
}
```

## Configuração de Revalidação por Rota

| Rota | `revalidate` | Justificativa |
|---|---|---|
| `/` | 3600s (1h) | Categorias raramente mudam |
| `/categoria/[slug]` | 3600s | Lista de pratos estável |
| `/prato/[slug]` | 1800s (30min) | Recomendações podem ser atualizadas |
| `/cervejas` | 3600s | Portfólio estável |
| `/cervejas/[slug]` | 3600s | Dados de marca estáveis |
| `/cervejas/[slug]/pratos` | SSR (sem cache) | Parâmetros de query em runtime |

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| SSR em todas as páginas | Latência alta; MongoDB consultado a cada request |
| SSG puro (sem revalidate) | Conteúdo nunca atualizado sem rebuild completo |
| Client-side fetch (SPA) | Sem OG tags no servidor; SEO/WhatsApp preview quebrado |
| Cache Redis | Over-engineering para o volume do protótipo |

## Consequências

**Positivas:**
- Primeira carga serve HTML pré-renderizado — TTFB mínimo
- MongoDB só é consultado quando o cache expira (não a cada request)
- OG tags presentes no HTML (crítico para preview WhatsApp)
- `generateStaticParams` pré-gera todas as 50 páginas de prato no build

**Negativas:**
- Após um seed de dados, as páginas antigas ficam em cache por até 30-60min antes de revalidar
- No protótipo (conteúdo via seed), isso é aceitável — revalidação manual via `res.revalidate()` se necessário
