# ADR-008: Compartilhamento via wa.me (sem geração de card visual)

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O compartilhamento social é o principal vetor de aquisição orgânica do app (F08). A decisão original considerava geração de card visual (imagem PNG) para compartilhamento. Após análise de custo/benefício, simplificamos para link compartilhado via WhatsApp.

## Decisão

Compartilhamento exclusivamente via **link WhatsApp (`wa.me`)** com mensagem pré-formatada. O preview visual no WhatsApp é gerado pelos **OG tags** da página `/prato/[slug]`, não por uma imagem gerada dinamicamente.

## Implementação

```typescript
// Componente de compartilhamento
function ShareButton({ dish, beer }: ShareProps) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/prato/${dish.slug}?utm_source=whatsapp&utm_medium=share&utm_campaign=recomendacao`

  const message = encodeURIComponent(
    `🍺 Descobri uma combinação incrível!\n\n${dish.name} + ${beer.name}\n\nDescubra mais: ${url}\n\nBeba com moderação.`
  )

  return (
    <a href={`https://wa.me/?text=${message}`} target="_blank" rel="noopener noreferrer">
      Compartilhar no WhatsApp
    </a>
  )
}
```

## OG Tags por Rota (Next.js generateMetadata)

```typescript
// apps/web/app/prato/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getRecommendations(params.slug)
  return {
    title: `${data.dish.name} + ${data.topBeer.name} | Sommelière de Cerveja`,
    description: data.topRecommendation.recommendation_title,
    openGraph: {
      images: [{ url: data.topBeer.image_url, width: 800, height: 800 }],
    },
  }
}
```

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Geração de imagem (Puppeteer/OG Image) | Complexidade elevada (infra de renderização); custo de AWS Lambda para gerar imagem |
| html2canvas (client-side) | Qualidade inconsistente; performance ruim em mobile |
| Web Share API | Incompatível com todos os browsers mobile; exige fallback de qualquer forma |
| Instagram Stories API | Requer app registration na Meta; fora do escopo do protótipo |

## Consequências

**Positivas:**
- Zero dependência de serviço externo — `wa.me` funciona em todos os browsers
- Preview rico no WhatsApp via OG tags (imagem da cerveja + título da recomendação)
- Implementação em ~10 linhas de código
- UTM params no link para rastreamento futuro (quando F09 for implementado)

**Negativas:**
- Preview depende da imagem da cerveja — deve ser uma foto de alta qualidade
- Mensagem pré-formatada pode parecer genérica — oportunidade de personalizar em versões futuras
- Sem controle visual do card — o preview é o OG tag da página, não um card com branding customizado
