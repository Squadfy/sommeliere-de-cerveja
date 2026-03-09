# Feature: Recomendação de Cerveja com Explicação Sensorial

**ID:** F04
**Status:** MVP — Escopo Core
**Prioridade:** Alta (core value do produto)

---

## Propósito

Entregar a recomendação curada de até 3 cervejas do portfólio Heineken para o prato selecionado, com justificativa sensorial que educa enquanto recomenda.

Esta é a tela mais importante do app — onde o valor do produto é percebido e a decisão de compartilhar é tomada.

---

## Benefício ao Usuário

- Recomendação confiável e curada sem esforço
- Entende o **porquê** da harmonização de forma natural
- Descobre estilos que não conhecia
- Sente-se tratado como alguém que aprecia cerveja de verdade

---

## User Stories

**US-F04-01**
> Como usuário que selecionou um prato, quero ver qual cerveja do portfólio Heineken combina melhor com ele para tomar uma decisão de compra informada.

**US-F04-02**
> Como usuário na tela de recomendação, quero entender por que aquela cerveja combina com meu prato para aprender sobre harmonização cervejeira.

**US-F04-03**
> Como usuário que chegou via deep link de um compartilhamento, quero ver a recomendação diretamente (após o gate) sem precisar navegar.

**US-F04-04**
> Como usuário na tela de recomendação, quero poder explorar mais combinações ou compartilhar minha descoberta com um toque.

---

## Fluxo

```
Prato selecionado (via F02, F03 ou deep link)
         ↓
         GET /api/dishes/[slug]/recommendations
         ↓
Tela de Resultado
┌─────────────────────────────────────┐
│  ← Voltar        [Nome do Prato]    │
│                                     │
│  Cerveja #1 (maior afinidade)       │
│  [Imagem] [Nome da marca]           │
│  "[Título da recomendação]"         │
│  [Explicação sensorial — 2-4 frases]│
│                                     │
│  🌡️ Temp: X°C  |  🍺 Copo: [tipo]   │  ← F05
│                                     │
│  ─────────── Mais opções ─────────  │
│  Cerveja #2  [imagem] [nome]        │
│  Cerveja #3  [imagem] [nome]        │
│                                     │
│  [Ver mais combinações]  →          │  ← F06
│  [Compartilhar no WhatsApp]  →      │  ← F08
│  [Escolher outro prato]  →          │
└─────────────────────────────────────┘
```

---

## Estrutura da Tela de Resultado

| Elemento | Conteúdo | Obrigatório |
|---|---|---|
| Nome do prato | Título da tela | Sim |
| Cerveja principal (#1) | Imagem + marca + título + explicação sensorial | Sim |
| Dica de serviço | Temperatura + tipo de copo (F05) | Sim — sempre visível |
| Cervejas #2 e #3 | Imagem + marca — compactas, sem explicação completa | Condicional (se existirem) |
| CTA "Ver mais combinações" | Link para F06 | Condicional (se houver > 3 opções) |
| CTA "Compartilhar no WhatsApp" | Link para F08 | Sim |
| CTA "Escolher outro prato" | Retorna à home | Sim |

---

## Princípios de Harmonização

| Princípio | Descrição | Exemplo |
|---|---|---|
| **Semelhança** | Elementos sensoriais parecidos se reforçam | Eisenbahn Dunkel + brownie |
| **Contraste** | Elementos opostos se equilibram | IPA + prato apimentado |
| **Complementação** | A cerveja completa o que falta ao prato | Alta carbonatação + fritura |

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN02 | Apenas marcas do portfólio ativo Heineken |
| RN03 | Todo prato exibido deve ter ao menos 1 recomendação cadastrada |
| RN04 | Máximo de 3 cervejas na tela de resultado, ordenadas por `affinity_score` |
| RN05 | Textos de harmonização validados pelo cliente (Marketing + Jurídico) |

---

## Critérios de Aceite

- [ ] A tela exibe até 3 cervejas ordenadas por `affinity_score` decrescente
- [ ] A cerveja #1 (maior afinidade) é exibida em destaque com explicação sensorial completa
- [ ] Cervejas #2 e #3 são exibidas de forma compacta (imagem + nome)
- [ ] A dica de serviço (F05) é sempre visível abaixo da explicação da cerveja #1
- [ ] CTA "Ver mais combinações" só aparece se houver > 3 recomendações cadastradas
- [ ] CTA "Compartilhar no WhatsApp" está sempre presente
- [ ] Deep link `/prato/[slug]` renderiza diretamente a tela de recomendação após o gate
- [ ] Prato sem recomendação não é acessível (RN03 — filtrado em F02 e F03)

---

## Modelo de Dados (MongoDB)

```js
// Collection: beers
{
  _id: ObjectId,
  slug: "eisenbahn-weizenbier",
  name: "Eisenbahn Weizenbier",
  brand: "Eisenbahn",
  style: "Weizen",
  sensory_profile: "Notas frutadas e condimentadas, acidez suave",
  image_url: "https://cdn.../eisenbahn-weizen.jpg",
  serving_temp_min: 6,
  serving_temp_max: 8,
  glass_type: "Copo de trigo (Weizen)",
  active: true
}

// Collection: recommendations
{
  _id: ObjectId,
  dish_id: ObjectId,         // ref: dishes
  beer_id: ObjectId,         // ref: beers
  affinity_score: 95,        // 0-100, define ordenação
  harmony_principle: "contraste", // "semelhança" | "contraste" | "complementação"
  recommendation_title: "Refrescância que equilibra os temperos",
  sensory_explanation: "A acidez suave e as notas frutadas da Weizenbier...",
  active: true
}
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **Rota:** `/prato/[slug]` — página dinâmica Next.js com SSR (dados mudam via painel)
- **API:** `GET /api/dishes/[slug]/recommendations` — agrega `recommendations` + `beers` via `$lookup`
- **Ordenação:** `affinity_score` DESC — top 3 exibidos na tela principal, demais disponíveis em F06
- **Deep link:** URL `/prato/[slug]` é a URL compartilhada no WhatsApp (F08)
- **OG Tags:** Cada `/prato/[slug]` tem meta tags com título da recomendação + imagem da cerveja #1
- **Performance:** Dados cacheados no Next.js via `revalidate` — invalidar quando painel atualizar
- **Imagens:** Servidas via AWS CloudFront (CDN), comprimidas e otimizadas

---

## Personas Afetadas

| Persona | Expectativa | Tom da explicação sensorial |
|---|---|---|
| **Explorador (18-30)** | Resultado visual e rápido | Analogias cotidianas: "refrescante como limonada gelada" |
| **Apreciador (30-50)** | Explicação aprofundada | Técnico acessível: "notas maltadas", "lúpulo floral" |

> Nota: O tom é único por texto — curado pelo cliente. A distinção de persona orienta a curadoria editorial, não a lógica técnica do app.

---

## Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Taxa de chegada à tela de recomendação | > 80% das sessões |
| Tempo médio na tela | > 15 segundos |
| Taxa de acesso a "Ver mais combinações" | > 25% |
| % sessões com exposição a Eisenbahn/Baden Baden | > 40% |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Prato com apenas 1 recomendação | Exibe só a cerveja #1; sem CTA "Ver mais" |
| Imagem da cerveja não carrega | Placeholder visual com nome da marca |
| Deep link para prato inexistente (`/prato/slug-invalido`) | 404 com link para a home |
| Recomendação desativada via painel | Não exibida — próxima no score assume a posição |

---

## Dependências

- F02 ou F03 — pré-requisito (prato selecionado)
- F05 (Dica de Serviço) — integrada à tela
- F06 (Ver Mais Combinações) — CTA condicional
- F08 (Compartilhamento) — CTA obrigatório
- F10 (Painel de Gestão) — atualização de textos e recomendações

---

## Pendências Críticas

| # | Item | Responsável |
|---|---|---|
| P02 | Tabela de harmonização oficial (prato × marca + textos sensoriais validados) | Marketing Heineken |
| P04 | Assets visuais dos produtos (fotos oficiais) | Marketing Heineken |
| P05 | Aprovação jurídica dos textos editoriais | Jurídico Heineken |
