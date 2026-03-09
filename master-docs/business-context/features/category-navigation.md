# Feature: Navegação por Categorias de Pratos

**ID:** F02
**Status:** MVP — Escopo Core
**Prioridade:** Alta

---

## Propósito

Permitir que o usuário encontre o prato desejado por meio de categorias visuais intuitivas, sem precisar saber o nome exato. Principal ponto de entrada para descoberta do app.

---

## Benefício ao Usuário

Descoberta visual — o usuário pode se surpreender ao explorar categorias além do que planejava. Não exige que ele saiba o que quer: pode navegar por contexto ("vou comer peixe hoje") e descobrir combinações novas.

---

## User Stories

**US-F02-01**
> Como usuário na tela inicial, quero ver categorias visuais de pratos para escolher o tipo de comida que vou comer e receber uma recomendação de cerveja.

**US-F02-02**
> Como usuário explorando categorias, quero ver a lista de pratos disponíveis dentro de uma categoria para escolher o prato específico.

**US-F02-03**
> Como usuário, quero chegar à tela de recomendação em no máximo 2 toques a partir da tela inicial.

---

## Fluxo

```
Tela Inicial (pós-gate)
         ↓
Grid de Categorias (8 categorias com ícone + nome)
         ↓
Toque em uma categoria (ex: "Frutos do Mar")
         ↓
Lista de pratos da categoria (scroll vertical)
         ↓
Toque em um prato específico (ex: "Salmão Grelhado")
         ↓
Tela de Recomendação (F04)
```

---

## Categorias MVP (8 categorias — ~50 pratos totais)

| Categoria | Ícone sugerido | Qtd. estimada de pratos |
|---|---|---|
| Carnes | 🥩 | 10 |
| Frutos do Mar | 🦐 | 8 |
| Massas | 🍝 | 7 |
| Petiscos | 🧆 | 8 |
| Vegetariano | 🥗 | 5 |
| Sushi / Oriental | 🍱 | 6 |
| Sobremesas | 🍫 | 4 |
| Outros | 🍽️ | 2 |

---

## Especificação de Interface

- **Grid de categorias:** 2 colunas, cards visuais com ícone + nome — mobile-first
- **Lista de pratos:** Scroll vertical, nome do prato + imagem thumbnail (opcional no MVP)
- **Breadcrumb:** "Início > [Categoria]" para facilitar navegação de volta
- **Estado vazio:** Não deve ocorrer — categorias só são exibidas se tiverem ao menos 1 prato ativo (RN03)

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN03 | Apenas pratos com ao menos 1 recomendação cadastrada são exibidos |

---

## Critérios de Aceite

- [ ] Tela inicial exibe as 8 categorias em grid de 2 colunas
- [ ] Ao tocar em uma categoria, exibe apenas os pratos ativos (com recomendação cadastrada)
- [ ] Ao tocar em um prato, navega para a tela de recomendação (F04)
- [ ] O fluxo completo (categoria → prato → recomendação) ocorre em no máximo 2 toques
- [ ] Categorias sem pratos ativos não são exibidas
- [ ] Navegação de volta (breadcrumb ou botão voltar) funciona corretamente

---

## Modelo de Dados (MongoDB)

```js
// Collection: categories
{
  _id: ObjectId,
  slug: "frutos-do-mar",
  name: "Frutos do Mar",
  icon: "🦐",           // emoji ou nome do ícone SVG
  order: 2,             // ordem de exibição
  active: true
}

// Collection: dishes
{
  _id: ObjectId,
  slug: "salmao-grelhado",
  name: "Salmão Grelhado",
  category_id: ObjectId, // ref: categories
  search_tags: ["salmão", "peixe", "grelhado", "salmon"],
  image_url: "https://cdn.../salmao.jpg",
  active: true
}
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **Rota:** `/` (home) com grid de categorias
- **Rota lista de pratos:** `/categoria/[slug]` — página SSG ou ISR (revalidate: 3600s)
- **API:** `GET /api/categories` — retorna categorias com contagem de pratos ativos
- **API:** `GET /api/categories/[slug]/dishes` — retorna pratos ativos da categoria
- **Cache:** Dados de categorias e pratos são altamente estáveis — ideal para ISR (Incremental Static Regeneration) no Next.js
- **Images:** Next.js `<Image>` com lazy loading para thumbnails de pratos

---

## Personas Afetadas

- **Persona 1 — Explorador (18-30):** Principal usuária — prefere navegar por descoberta visual
- **Persona 2 — Apreciador (30-50):** Usa quando não tem prato exato em mente, sabe o contexto

---

## Métricas de Sucesso

| Métrica | Meta | Observação |
|---|---|---|
| Distribuição de consultas entre categorias | Equilibrada — sem categoria com 0 consultas | Referência para versões com analytics |
| Tempo médio até seleção do prato | < 30 segundos | Referência para versões com analytics |
| Taxa de chegada à recomendação via categorias | > 70% das sessões | Referência para versões com analytics |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Categoria sem pratos ativos | Não exibida no grid |
| Prato desativado | Removido do seed — não exibido na lista |
| Imagem do prato não carrega | Placeholder visual neutro |
| Conexão lenta | Skeleton loader nas categorias e pratos |

---

## Dependências

- F01 (Gate de Maioridade) — pré-requisito de acesso
- F04 (Recomendação de Cerveja) — destino após seleção do prato
