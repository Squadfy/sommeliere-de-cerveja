# ADR-005: Tailwind CSS + Shadcn/UI

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O produto requer uma UI premium, visual, alinhada ao branding Heineken — mobile-first, com componentes reutilizáveis como cards, grids, botões e modais.

## Decisão

Usar **Tailwind CSS** como utility-first CSS framework e **Shadcn/UI** como biblioteca de componentes base.

## Motivação

### Tailwind CSS
- Utility-first: estilização inline sem criar classes CSS customizadas desnecessárias
- Purge automático — apenas classes usadas vão para o bundle de produção
- Mobile-first por padrão (`sm:`, `md:`, `lg:` breakpoints)
- Fácil implementação de design tokens (cores Heineken como variáveis CSS)

### Shadcn/UI
- Componentes acessíveis (baseados em Radix UI) — atende o requisito de Lighthouse Accessibility > 90
- **Copy-paste model:** os componentes ficam no projeto (`/components/ui/`) — sem dependência de versão de biblioteca
- Totalmente customizável via Tailwind — fácil de ajustar ao branding Heineken
- TypeScript nativo

## Paleta de Cores Heineken (Tokens)

```css
/* tailwind.config.ts — cores do branding */
colors: {
  heineken: {
    green: '#00A650',      /* Verde Heineken principal */
    dark: '#1A1A1A',       /* Fundo escuro */
    gold: '#C8A951',       /* Dourado para destaques */
    cream: '#F5F0E8',      /* Fundo claro */
  }
}
```

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| styled-components | Runtime CSS-in-JS; incompatível com Server Components do App Router |
| CSS Modules | Mais verboso; sem biblioteca de componentes base acessíveis |
| Material UI | Estilo padrão muito distante do branding Heineken; difícil customização |
| Chakra UI | Runtime CSS-in-JS; incompatível com Server Components |

## Consequências

**Positivas:**
- Bundle CSS mínimo (Tailwind purge)
- Componentes acessíveis out-of-the-box (Radix primitives)
- Velocidade de desenvolvimento com utilitários prontos
- Fácil aplicação do branding via tokens

**Negativas:**
- Classes Tailwind longas nos JSX — usar `cn()` (clsx + tailwind-merge) para legibilidade
- Shadcn components precisam ser adicionados individualmente (`npx shadcn add button`)
