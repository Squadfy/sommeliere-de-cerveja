# Feature: Compartilhamento Social

**ID:** F08
**Status:** MVP — Escopo Core
**Prioridade:** Alta (principal KPI de engajamento e vetor de distribuição orgânica)

---

## Propósito

Transformar cada recomendação em conteúdo compartilhável via WhatsApp, criando ciclos de aquisição orgânica de novos usuários via word-of-mouth digital.

---

## Benefício ao Usuário

Compartilha uma descoberta relevante com amigos e família com um único toque — sem precisar copiar URL ou escrever mensagem manualmente.

---

## Valor de Negócio

Principal vetor de distribuição do app sem custo de mídia — cada compartilhamento é uma indicação com contexto e branding Heineken.

---

## User Stories

**US-F08-01**
> Como usuário na tela de recomendação, quero compartilhar a combinação que descobri no WhatsApp com um único toque para recomendar a um amigo.

**US-F08-02**
> Como novo usuário que recebeu um link no WhatsApp, quero abrir o app, passar pelo gate de maioridade e ver a recomendação diretamente sem precisar navegar.

---

## Fluxo — Quem Compartilha

```
Tela de Recomendação (F04) ou Ver Mais Combinações (F06)
         ↓
Botão "Compartilhar no WhatsApp"
         ↓
Abre https://wa.me/?text=[mensagem+link]
         ↓
WhatsApp abre com mensagem pré-preenchida
         ↓
Usuário seleciona contato ou grupo e envia
```

---

## Fluxo — Quem Recebe o Link

```
Destinatário recebe mensagem no WhatsApp
         ↓
Toca no link → abre PWA em /prato/[slug]
         ↓
Next.js Middleware verifica localStorage
         ↓
[Primeira visita] → Gate de maioridade → pós-aprovação → /prato/[slug]
[Visita recorrente] → /prato/[slug] diretamente
```

---

## Mecanismo de Compartilhamento

O compartilhamento ocorre exclusivamente por **link via WhatsApp**. Não há geração de card visual.

| Elemento | Conteúdo |
|---|---|
| **Link** | `https://app.sommeliere.com.br/prato/[slug]?utm_source=whatsapp&utm_medium=share&utm_campaign=recomendacao` |
| **Mensagem pré-formatada** | "Olha que combinação incrível! [Nome do Prato] + [Nome da Cerveja] 🍺 Descubra pelo link:" |
| **Disclaimer** | "Beba com moderação" — incluído na mensagem pré-formatada (RN08) |
| **Preview WhatsApp (OG)** | Título da recomendação + imagem da cerveja #1 + nome do prato |

---

## OG Tags (Open Graph)

Configuradas em cada página `/prato/[slug]` para enriquecer o preview no WhatsApp:

```html
<meta property="og:title" content="[Título da recomendação]" />
<meta property="og:description" content="[Prato] + [Cerveja] — Descubra a combinação perfeita" />
<meta property="og:image" content="[URL da imagem da cerveja #1]" />
<meta property="og:url" content="https://app.sommeliere.com.br/prato/[slug]" />
```

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN08 | Mensagem de compartilhamento deve incluir disclaimer de consumo responsável |
| RN02 | Apenas cervejas do portfólio Heineken podem ser referenciadas |

---

## Critérios de Aceite

- [ ] Botão "Compartilhar no WhatsApp" está presente na tela de recomendação (F04)
- [ ] Toque no botão abre WhatsApp com mensagem pré-formatada contendo o link com UTM params
- [ ] A mensagem pré-formatada inclui nome do prato, nome da cerveja e disclaimer "Beba com moderação"
- [ ] O link gerado aponta para `/prato/[slug]` com parâmetros UTM corretos
- [ ] Quando novo usuário clica no link, passa pelo gate de maioridade antes da recomendação
- [ ] Pós-gate, o usuário é redirecionado exatamente para `/prato/[slug]` (não para a home)
- [ ] OG tags de cada `/prato/[slug]` exibem preview rico no WhatsApp (título + imagem + descrição)
- [ ] O evento de compartilhamento é registrado no analytics (F09)

---

## Estrutura da URL

```
# URL canônica da recomendação (deep link)
https://app.sommeliere.com.br/prato/[slug]

# URL compartilhada via WhatsApp (com UTM)
https://app.sommeliere.com.br/prato/[slug]
  ?utm_source=whatsapp
  &utm_medium=share
  &utm_campaign=recomendacao

# URL com navegação reversa (de F07)
https://app.sommeliere.com.br/prato/[slug]?beer=[beer-slug]
  &utm_source=whatsapp
  &utm_medium=share
  &utm_campaign=portfolio
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **Implementação:** `window.open('https://wa.me/?text=' + encodeURIComponent(mensagem), '_blank')`
- **Sem dependência de API externa:** `wa.me` funciona em todos os browsers mobile modernos
- **OG Tags:** Geradas server-side no Next.js (`generateMetadata` por rota `/prato/[slug]`)
- **Deep link preservation no gate:** URL de destino passada via query param `?redirect=/prato/[slug]` e preservada durante o fluxo do gate
- **Analytics:** Evento `share_initiated` + `share_completed` via F09

---

## Personas Afetadas

- **Persona 1 — Explorador (18-30):** Principal usuária — compartilha descobertas naturalmente no WhatsApp
- **Persona 2 — Apreciador (30-50):** Compartilha para grupos de família/amigos no contexto de jantar/churrasco

---

## Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Taxa de compartilhamento por sessão | > 15% |
| Novos acessos originados por links compartilhados | > 20% do total |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Usuário em desktop (sem WhatsApp instalado) | `wa.me` abre WhatsApp Web — funciona normalmente |
| WhatsApp não instalado no mobile | Sistema operacional sugere instalar ou abre wa.me no browser |
| Novo usuário recebe link e já passou pelo gate anteriormente | Vai direto para `/prato/[slug]` sem gate |
| Link com `?beer=` da navegação reversa compartilhado | Deep link preserva o parâmetro `beer` — recomendação exibe aquela cerveja como #1 |

---

## Dependências

- F04 (Recomendação de Cerveja) — ponto de acionamento principal
- F06 (Ver Mais Combinações) — ponto de acionamento alternativo
- F01 (Gate de Maioridade) — fluxo do novo usuário que recebe o link
- F09 (Analytics) — rastreamento de compartilhamentos e acessos via UTM
