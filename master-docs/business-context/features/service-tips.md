# Feature: Dica de Serviço

**ID:** F05
**Status:** MVP — Escopo Core
**Prioridade:** Média-Alta

---

## Propósito

Complementar a recomendação com orientações práticas sobre como servir a cerveja da melhor forma, elevando a percepção de qualidade e expertise do app.

---

## Benefício ao Usuário

O usuário se sente tratado como alguém que aprecia cerveja de verdade. A dica transforma a experiência de "qual cerveja beber" para "como aproveitar melhor esta cerveja".

---

## User Stories

**US-F05-01**
> Como usuário na tela de recomendação, quero ver automaticamente como servir a cerveja recomendada (temperatura e tipo de copo) sem precisar buscar essa informação em outro lugar.

---

## Integração na Tela de Recomendação

A Dica de Serviço é exibida como seção **sempre visível** dentro da tela de recomendação (F04), logo abaixo da explicação sensorial. Não é uma tela separada, não há interação adicional para acessá-la — o usuário a vê naturalmente ao rolar a tela de resultado.

```
[Explicação Sensorial da Cerveja #1]
         ↓
┌────────────────────────────────────┐
│  🌡️ Sirva entre 6°C e 8°C          │
│  🍺 Copo de trigo (Weizen)         │
└────────────────────────────────────┘
         ↓
[Cervejas #2 e #3 — compactas]
[Ver mais combinações]  [Compartilhar]
```

---

## Conteúdo por Estilo (Referência de Mercado)

| Marca / Estilo | Temperatura Ideal | Copo Recomendado |
|---|---|---|
| Heineken Lager | 4°C – 6°C | Copo caldereta ou long neck |
| Amstel Puro Malte | 4°C – 6°C | Copo americano ou caldereta |
| Eisenbahn Pilsen | 4°C – 6°C | Copo tulipa ou caldereta |
| Eisenbahn Weizenbier | 6°C – 8°C | Copo de trigo (Weizen) — alto e curvo |
| Eisenbahn IPA / Pale Ale | 8°C – 10°C | Copo tulipa ou IPA glass |
| Baden Baden | 6°C – 10°C | Copo tulipa ou caldereta (varia por linha) |
| Sol Lager | 4°C – 6°C | Long neck ou copo americano |
| Devassa | 4°C – 6°C | Copo caldereta ou americano |

> ✅ Dados validados — conteúdo oficial disponível e será populado via seed.

---

## Critérios de Aceite

- [ ] Temperatura e tipo de copo são exibidos abaixo da explicação sensorial da cerveja #1
- [ ] A dica é sempre visível — sem accordion, toggle ou interação adicional
- [ ] Ícones visuais (termômetro e copo) acompanham o texto
- [ ] A dica exibida corresponde à cerveja #1 da recomendação, não às cervejas #2/#3

---

## Modelo de Dados (MongoDB)

Campos armazenados na collection `beers` (definida em F04):

```js
{
  // ... outros campos da cerveja
  serving_temp_min: 6,   // °C
  serving_temp_max: 8,   // °C
  glass_type: "Copo de trigo (Weizen) — alto e curvo"
}
```

Sem collection separada — dados da dica de serviço são parte do cadastro de cada cerveja.

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- Dados carregados junto com a recomendação via `$lookup` em `GET /api/dishes/[slug]/recommendations`
- Sem request adicional — zero overhead de performance
- Ícones: SVG inline ou biblioteca de ícones (ex: Lucide) — leves e consistentes com o design system

---

## Personas Afetadas

- **Persona 2 — Apreciador (30-50):** Principal beneficiária — temperatura e tipo de copo fazem diferença
- **Persona 1 — Explorador (18-30):** Aprecia como curiosidade e aprendizado

---

## Métricas de Sucesso

| Métrica | Proxy |
|---|---|
| Tempo médio na tela de recomendação > 15s | Indica que o usuário leu a dica |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Cerveja sem temperatura cadastrada | Campo não exibido — dica mostra apenas o tipo de copo |
| Cerveja sem copo cadastrado | Campo não exibido — dica mostra apenas a temperatura |
| Ambos ausentes | Seção de dica de serviço não é exibida |

---

## Dependências

- F04 (Recomendação de Cerveja) — contexto onde a dica é exibida
