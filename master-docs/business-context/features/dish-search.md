# Feature: Busca por Nome de Prato

**ID:** F03
**Status:** MVP — Escopo Core
**Prioridade:** Alta

---

## Propósito

Permitir acesso direto ao prato desejado sem navegação por categorias. Velocidade e precisão para o usuário que já sabe o que vai comer.

---

## Benefício ao Usuário

O usuário chega ao resultado em 1 ação — digitar o nome do prato — sem deduzir em qual categoria ele se encontra.

---

## User Stories

**US-F03-01**
> Como usuário que já sabe o que vou comer, quero digitar o nome do prato e ver sugestões imediatamente para chegar à recomendação sem navegar por categorias.

**US-F03-02**
> Como usuário que digitou um prato não encontrado, quero ver uma mensagem clara e ser direcionado para a navegação por categorias como alternativa.

**US-F03-03**
> Como usuário, quero que a busca entenda variações regionais e erros de digitação (ex: "feijao" encontra "Feijoada").

---

## Fluxo

```
Tela Inicial
         ↓
Campo de busca em destaque (placeholder: "O que você vai comer?")
         ↓
Usuário digita 2+ caracteres
         ↓
Lista de sugestões em tempo real (debounce 300ms)
         ↓
[Resultado encontrado] → Usuário seleciona prato → Tela de Recomendação (F04)
[Nenhum resultado]     → Mensagem + CTA "Ver categorias" → F02
```

---

## Especificação de Interface

- **Campo de busca:** Proeminente na tela inicial, ao lado ou acima do grid de categorias
- **Ativação:** A partir de 2 caracteres digitados
- **Debounce:** 300ms antes de disparar a busca (evitar requests excessivos)
- **Sugestões:** Lista com nome do prato + ícone da categoria (máx. 8 resultados)
- **Zero resultados:** Mensagem "Ainda não temos '[termo]'. Que tal explorar por categoria?" + botão "Ver categorias"

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN03 | Apenas pratos com ao menos 1 recomendação aparecem nos resultados |
| RN06 | Novos pratos adicionados via painel ficam disponíveis na busca imediatamente |

---

## Critérios de Aceite

- [ ] Campo de busca visível e acessível na tela inicial
- [ ] Sugestões aparecem a partir de 2 caracteres digitados
- [ ] Busca é case-insensitive e ignora acentuação ("feijao" encontra "Feijoada")
- [ ] Variações e sinônimos cadastrados nos `search_tags` do prato são encontrados
- [ ] Apenas pratos ativos com recomendação cadastrada aparecem nos resultados
- [ ] Quando não há resultados, exibe mensagem amigável e CTA para categorias
- [ ] Termos buscados sem resultado são enviados para o analytics (F09)
- [ ] Ao selecionar um prato da lista, navega para a tela de recomendação (F04)

---

## Modelo de Dados (MongoDB)

Reutiliza a collection `dishes` de F02, com índice de busca textual:

```js
// Index de busca textual no MongoDB
db.dishes.createIndex({
  name: "text",
  search_tags: "text"
}, {
  weights: { name: 10, search_tags: 5 },
  default_language: "portuguese"
})

// Exemplos de search_tags por prato
{
  name: "Feijoada",
  search_tags: ["feijao", "feijoada", "feijão", "feijão preto", "prato brasileiro"],
  active: true
}
{
  name: "Filé Mignon",
  search_tags: ["file", "filé", "file mignon", "contrafilé", "carne", "grelhado"],
  active: true
}
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **API:** `GET /api/search?q=[termo]` — query com MongoDB Atlas Search (ou `$text` index)
- **Busca tolerante:** MongoDB `$text` com `$language: "portuguese"` lida com stemming e diacríticos
- **Performance:** Índice textual + limite de 8 resultados — resposta esperada < 100ms
- **Debounce client-side:** 300ms no input antes de disparar `fetch`
- **Sem paginação:** 50 pratos no catálogo MVP — lista completa é viável sem paginação
- **Analytics:** Termos sem resultado enviados via `POST /api/analytics/events` (F09)

---

## Personas Afetadas

- **Persona 2 — Apreciador (30-50):** Principal usuária — chega com prato definido, quer rapidez
- **Persona 1 — Explorador (18-30):** Uso quando tem prato em mente; prefere categorias para explorar

---

## Métricas de Sucesso

| Métrica | Meta | Ação |
|---|---|---|
| Taxa de busca sem resultado | < 20% | Gap de catálogo — adicionar pratos |
| Taxa de conclusão (busca → seleção → recomendação) | > 75% | Indica relevância dos resultados |
| Top 10 termos sem resultado | — | Backlog de expansão de catálogo |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Termo com 1 caractere | Não dispara busca — aguarda 2+ caracteres |
| Busca retorna pratos inativos | Filtrados na query — nunca exibidos |
| Conexão lenta | Spinner no campo + debounce evita requests em cascata |
| Usuário apaga o texto | Lista de sugestões é removida; exibe estado inicial |
| Prato desativado que era resultado frequente | Removido da busca automaticamente via flag `active: false` |

---

## Dependências

- F01 (Gate de Maioridade) — pré-requisito de acesso
- F02 (Navegação por Categorias) — fallback quando busca não tem resultado
- F04 (Recomendação de Cerveja) — destino após seleção
- F09 (Analytics) — registro de termos sem resultado
