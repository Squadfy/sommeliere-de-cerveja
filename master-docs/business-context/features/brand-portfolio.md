# Feature: Portfólio Completo de Marcas

**ID:** F07
**Status:** MVP — Escopo Core
**Prioridade:** Média

---

## Propósito

Apresentar todas as marcas do portfólio Heineken com perfis sensoriais e harmonizações. Funciona como referência consultiva e como ponto de entrada alternativo: a partir de uma cerveja, o usuário descobre quais pratos combinam com ela (navegação reversa).

---

## Benefício ao Usuário

- Referência rápida para entender o portfólio antes de uma compra
- Educação sobre marcas menos conhecidas (Eisenbahn, Baden Baden, Devassa)
- Ponto de entrada alternativo: "tenho uma Eisenbahn em casa — com o que ela combina?"

---

## User Stories

**US-F07-01**
> Como usuário, quero explorar o catálogo completo de cervejas do portfólio Heineken para conhecer as marcas disponíveis e seus perfis.

**US-F07-02**
> Como usuário que já tem uma cerveja específica em mãos, quero ver quais pratos combinam com ela para planejar minha refeição a partir da cerveja.

**US-F07-03**
> Como usuário na página de detalhe de uma cerveja, quero selecionar um prato compatível e ver a tela de recomendação já direcionada para aquela cerveja.

---

## Fluxo Principal (Cerveja → Pratos)

```
Menu/Aba "Cervejas" (navegação principal) ou link contextual em F04
         ↓
Grid de marcas (2 colunas, 8 marcas)
         ↓
Toque em uma marca (ex: Eisenbahn Weizenbier)
         ↓
Página de detalhe da marca
┌────────────────────────────────────┐
│ [Foto do produto em destaque]      │
│ [Nome da marca]                    │
│ [Estilo / Perfil sensorial]        │
│ [Harmonizações gerais]             │
│ 🌡️ Temp: 6-8°C  🍺 Copo: Weizen   │
│                                    │
│ [Ver pratos que combinam] →        │
└────────────────────────────────────┘
         ↓
CTA "Ver pratos que combinam"
         ↓
Lista de pratos compatíveis com aquela cerveja
         ↓
Toque em um prato
         ↓
Tela de Recomendação (F04) com aquela cerveja como resultado em destaque (posição #1)
```

---

## Navegação Reversa (Cerveja → Pratos)

**Decisão de produto:** Aprovada. A navegação reversa faz parte desta feature.

Ao tocar em um prato na lista reversa, o usuário vai para `/prato/[slug]` com a cerveja de origem como parâmetro de destaque:

```
/prato/salmao-grelhado?beer=eisenbahn-weizenbier
```

Na tela de recomendação (F04), a cerveja correspondente ao parâmetro `beer` é exibida em primeiro lugar, independente do seu `affinity_score` padrão.

---

## Conteúdo por Marca

| Marca | Estilo | Perfil Sensorial | Harmonizações Gerais |
|---|---|---|---|
| **Heineken** | Lager Premium | Leve, lúpulo floral, refrescante | Frutos do mar, sushi, saladas, queijos brancos, petiscos leves |
| **Amstel** | Puro Malte | Equilibrado, encorpado, fresco | Carnes grelhadas, hambúrguer, frios, massas com molho leve |
| **Eisenbahn Pilsen** | Pilsen Artesanal | Amargor médio, leveza com complexidade | Pastéis, coxinha, frango, comidas de boteco, queijos suaves |
| **Eisenbahn Weizenbier** | Trigo (Weizen) | Notas frutadas, acidez suave | Culinária oriental, saladas, queijo de cabra, pratos apimentados |
| **Eisenbahn IPA / Pale Ale** | IPA / Pale Ale | Lupulada, alto amargor | Carnes assadas, hambúrguer, pizza, molhos fortes, pratos gordurosos |
| **Baden Baden** | Linha Gourmet Premium | Sofisticado, gastronômico | Culinária nacional e internacional elaborada |
| **Sol** | Lager Tropical | Leve, refrescante, tropical | Grelhados leves, frutos do mar, petiscos, churrasco de frango |
| **Devassa** | Puro Malte | Sabor marcante | Carnes com tempero, feijoada, pratos brasileiros intensos |

> ⚠️ Conteúdo a ser validado pelo time de Marketing do Grupo Heineken.

---

## Especificação de Interface

- **Acesso:** Aba/menu "Cervejas" na navegação principal
- **Lista principal:** Grid 2 colunas — foto do produto + nome da marca
- **Página de detalhe:** `/cervejas/[slug]` — foto em destaque + perfil sensorial + dica de serviço + CTA
- **Lista reversa:** `/cervejas/[slug]/pratos` — lista de pratos com imagem + nome + categoria

---

## Critérios de Aceite

- [ ] Grid exibe todas as cervejas ativas do portfólio
- [ ] Página de detalhe exibe: foto, nome, estilo, perfil sensorial, harmonizações gerais, temperatura e copo
- [ ] CTA "Ver pratos que combinam" navega para lista de pratos compatíveis
- [ ] Na lista de pratos compatíveis, ao tocar em um prato, navega para `/prato/[slug]?beer=[beer-slug]`
- [ ] Em F04, quando o parâmetro `?beer=` está presente, aquela cerveja aparece como #1 na recomendação
- [ ] Cervejas desativadas via painel não aparecem no grid nem na navegação reversa

---

## Modelo de Dados (MongoDB)

```js
// Collection: beers (extensão do modelo de F04)
{
  _id: ObjectId,
  slug: "eisenbahn-weizenbier",
  name: "Eisenbahn Weizenbier",
  brand: "Eisenbahn",
  style: "Weizen",
  sensory_profile: "Notas frutadas e condimentadas, acidez suave",
  general_pairings: "Culinária oriental, saladas com tomate, queijo de cabra",
  image_url: "https://cdn.../eisenbahn-weizen.jpg",
  serving_temp_min: 6,
  serving_temp_max: 8,
  glass_type: "Copo de trigo (Weizen)",
  display_order: 3,   // ordem no grid do portfólio
  active: true
}

// Query reversa: pratos compatíveis com uma cerveja
db.recommendations.find({ beer_id: beerId, active: true })
  .sort({ affinity_score: -1 })
  .populate('dish_id')
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **Rotas:**
  - `/cervejas` — lista do portfólio (SSG)
  - `/cervejas/[slug]` — detalhe da marca (SSG com ISR)
  - `/cervejas/[slug]/pratos` — lista reversa de pratos (SSR ou ISR)
- **Parâmetro de highlight:** `/prato/[slug]?beer=[beer-slug]` — F04 lê o parâmetro e reordena o resultado
- **Cache:** Grid do portfólio e detalhe são dados estáveis — ISR com revalidate de 3600s
- **CDN:** Imagens dos produtos via AWS CloudFront

---

## Personas Afetadas

- **Persona 2 — Apreciador (30-50):** Alta aderência — explora o portfólio antes de decidir o que comprar
- **Persona 1 — Explorador (18-30):** Uso esporádico — consulta para entender o que está bebendo

---

## Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Taxa de acesso ao portfólio por sessão | > 15% |
| Taxa de uso da navegação reversa | A monitorar |
| Marcas menos acessadas | Oportunidade de destaque editorial |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Cerveja sem pratos cadastrados na navegação reversa | Exibe mensagem "Em breve mais combinações" + link para home |
| Parâmetro `?beer=` inválido em F04 | Ignorado — recomendação exibida na ordem padrão |
| Cerveja desativada referenciada em parâmetro | Ignorado — recomendação exibida na ordem padrão |

---

## Dependências

- F04 (Recomendação de Cerveja) — destino da navegação reversa + parâmetro de highlight
- F05 (Dica de Serviço) — dados reutilizados na página de detalhe
- F10 (Painel de Gestão) — ativar/desativar marcas, atualizar perfis
