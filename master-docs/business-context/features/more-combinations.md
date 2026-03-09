# Feature: Ver Mais Combinações

**ID:** F06
**Status:** MVP — Escopo Core
**Prioridade:** Média

---

## Propósito

Exibir todas as cervejas compatíveis com o prato selecionado além das 3 principais, incentivando a descoberta de estilos menos conhecidos do portfólio Heineken.

---

## Benefício ao Usuário

- Descobre cervejas que não estavam no seu radar
- Contexto comparativo: entende por que outras cervejas também funcionam
- Permite escolha mais informada na hora da compra

---

## Valor de Negócio

Principal mecanismo de exposição às marcas premium e artesanais (Eisenbahn, Baden Baden) — aumenta awareness e estimula experimentação além de Heineken e Amstel.

---

## User Stories

**US-F06-01**
> Como usuário na tela de recomendação, quero ver outras cervejas que combinam com o prato que escolhi para descobrir opções além das 3 principais.

**US-F06-02**
> Como usuário explorando combinações alternativas, quero poder compartilhar uma combinação específica que me interessou.

---

## Fluxo

```
Tela de Recomendação (F04)
         ↓
CTA "Ver mais combinações" (visível apenas se existirem > 3 recomendações)
         ↓
Tela / seção expandida com lista completa de combinações
┌─────────────────────────────────────────┐
│  ← Voltar    "Outras combinações para   │
│              [Nome do Prato]"           │
│                                         │
│  [Imagem] Marca #4                      │
│  Breve justificativa (1-2 frases)       │
│  [Compartilhar esta combinação] →       │
│                                         │
│  [Imagem] Marca #5                      │
│  Breve justificativa (1-2 frases)       │
│  [Compartilhar esta combinação] →       │
└─────────────────────────────────────────┘
```

---

## Especificação de Interface

- **Acesso:** CTA "Ver mais combinações" na tela de recomendação — só aparece se `total_recommendations > 3`
- **Layout:** Lista vertical com scroll — item por combinação: imagem da cerveja + nome da marca + justificativa resumida (1-2 frases) + botão compartilhar
- **Ordenação:** `affinity_score` DESC (continuação da ordenação de F04)
- **As 3 primeiras** (já exibidas em F04) não são repetidas nesta lista

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN02 | Apenas marcas do portfólio ativo Heineken |
| RN04 | As 3 cervejas de maior `affinity_score` ficam na tela principal (F04); as demais aparecem aqui |

---

## Critérios de Aceite

- [ ] CTA "Ver mais combinações" só é exibido quando houver mais de 3 recomendações cadastradas para o prato
- [ ] A lista exibe todas as cervejas com `affinity_score > 0` excluindo as 3 já exibidas em F04
- [ ] Cada item exibe: imagem da cerveja, nome da marca e justificativa resumida (max. 2 frases)
- [ ] Cada item tem botão "Compartilhar no WhatsApp" (F08)
- [ ] Ordenação por `affinity_score` descendente
- [ ] Navegação de volta retorna à tela de recomendação (F04)

---

## Modelo de Dados (MongoDB)

Reutiliza a collection `recommendations` definida em F04. A query filtra as cervejas com posição > 3:

```js
// API: GET /api/dishes/[slug]/recommendations?skip=3
db.recommendations.find({
  dish_id: dishId,
  active: true
})
.sort({ affinity_score: -1 })
.skip(3)
// Sem limit — exibe todas as combinações restantes
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **Opção A (preferida):** Expandir na mesma página (`/prato/[slug]`) via toggle/accordion — sem nova rota, sem novo fetch (dados já carregados)
- **Opção B:** Rota separada `/prato/[slug]/mais-combinacoes` — usar se a lista for muito longa
- Para 50 pratos com máx. ~8 cervejas por prato, a Opção A é suficiente
- Os dados das recomendações extras podem ser carregados junto com a tela principal e revelados no toggle

---

## Personas Afetadas

- **Persona 1 — Explorador (18-30):** Alta aderência — gosta de descobrir sem comprometimento
- **Persona 2 — Apreciador (30-50):** Usa para comparar e encontrar a opção mais premium para a ocasião

---

## Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Taxa de acesso a "Ver mais combinações" | > 25% das sessões |
| % sessões com exposição a estilos artesanais | > 40% (Eisenbahn ou Baden Baden) |
| % estilos não-mainstream visualizados | > 30% (além de Heineken e Amstel) |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Prato com ≤ 3 recomendações | CTA "Ver mais combinações" não é exibido |
| Todas as recomendações extras desativadas via painel | CTA não é exibido |
| Imagem de cerveja alternativa não carrega | Placeholder visual com nome da marca |

---

## Dependências

- F04 (Recomendação de Cerveja) — ponto de acesso e contexto
- F08 (Compartilhamento Social) — ação disponível em cada combinação
- F10 (Painel de Gestão) — gerenciar recomendações extras por prato
