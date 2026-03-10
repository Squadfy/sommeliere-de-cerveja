# Business Logic Documentation — Sommelière de Cerveja

> Regras de negócio, fluxos de domínio e casos de borda relevantes para o desenvolvimento.

---

## Domínio Central

O app é um **guia de harmonização cerveja × prato** para o portfólio Heineken. A lógica de negócio gira em torno de três conceitos:

1. **Harmonização** — relação curada entre prato e cerveja com score de afinidade
2. **Gate de maioridade** — barreira legal obrigatória antes de qualquer conteúdo
3. **Portfólio fechado** — apenas cervejas da família Heineken

---

## Regras de Negócio

### RN01 — Gate de Maioridade Obrigatório
- Todo usuário na **primeira visita** deve confirmar ter 18+ anos.
- Após aprovação, a confirmação fica em `localStorage` com chave `sommeliere_age_verified = 'true'`.
- Em visitas subsequentes, o gate **não** é exibido novamente.
- Qualquer rota acessada sem aprovação redireciona para `/gate?redirect=[rota-original]`.
- Quem nega a maioridade não acessa o conteúdo (sem retry na mesma sessão).

### RN02 — Portfólio Fechado Heineken
- Apenas cervejas da família Heineken podem ser recomendadas.
- Cervejas com `active: false` não aparecem em nenhuma tela.
- Não há funcionalidade de sugestão de cervejas externas.

### RN03 — Slugs como Identificadores de URL
- URLs sempre usam `slug` legível (kebab-case), nunca `_id` MongoDB.
- Exemplo: `/prato/salmao-grelhado`, não `/prato/64abc123`.
- `slug` é único por collection (índice `unique: true`).

### RN04 — Conteúdo via Seed (Sem CMS no Protótipo)
- Todo o catálogo (categorias, pratos, cervejas, recomendações) é inserido via script de seed.
- Não há painel de administração no protótipo.
- Adição/edição de conteúdo requer execução do script de seed.

### RN05 — Score de Afinidade Define a Ordem
- A cerveja #1 na recomendação é sempre a de maior `affinity_score` (0–100).
- Em caso de empate, a ordem é indefinida (sem critério de desempate obrigatório).
- A API retorna sempre por `affinity_score DESC`.

### RN06 — Ver Mais Combinações Condicional
- O CTA "Ver mais combinações" só é exibido se o prato tiver mais de 3 recomendações ativas.
- Com 1–3 recomendações, todas são exibidas diretamente (sem o CTA).

### RN07 — Privacidade e LGPD
- Sem coleta de dados pessoais (F09 removido do protótipo).
- `localStorage` armazena apenas `sommeliere_age_verified` — sem identificação do usuário.

### RN08 — Disclaimer de Consumo Responsável
- Mensagem de compartilhamento WhatsApp deve incluir "Beba com moderação".
- Obrigatório por políticas da Heineken para comunicação alcoólica.

### RN09 — Navegação Reversa Cerveja → Pratos
- A partir do portfólio, o usuário pode ver quais pratos combinam com uma cerveja específica.
- Ao navegar para `/prato/[slug]?beer=[beer-slug]`, a cerveja especificada é movida para posição #1 na exibição (client-side).
- UTM param `?utm_campaign=portfolio` aplicado nos links desta navegação.

---

## Fluxos de Domínio

### Fluxo: Usuário Novo Recebe Link WhatsApp

```
1. Usuário recebe link: /prato/salmao-grelhado?utm_source=whatsapp&...
2. Toca no link → PWA abre
3. Middleware verifica localStorage → sommeliere_age_verified ausente
4. Redireciona: /gate?redirect=/prato/salmao-grelhado
5. Usuário confirma maioridade
6. localStorage.setItem('sommeliere_age_verified', 'true')
7. Redireciona para: /prato/salmao-grelhado
8. Usuário vê a recomendação exata que foi compartilhada
```

**Invariante:** O deep link é preservado durante todo o fluxo do gate.

### Fluxo: Busca de Prato

```
1. Usuário digita na SearchBar
2. Após 300ms de inatividade (debounce): fetch GET /search?q=[termo]
3. MongoDB executa $text search com stemming português
4. Resultados exibidos em lista (máximo 20)
5. Usuário toca em prato → navega para /prato/[slug]
6. Se sem resultados: exibe mensagem "Prato não encontrado. Sugestão: navegue por categoria."
```

### Fluxo: Compartilhamento de Recomendação

```
1. Usuário está em /prato/salmao-grelhado
2. Toca em "Compartilhar no WhatsApp"
3. ShareButton monta URL:
   https://app.sommeliere.com.br/prato/salmao-grelhado
     ?utm_source=whatsapp&utm_medium=share&utm_campaign=recomendacao
4. Monta mensagem:
   "🍺 Descobri uma combinação incrível!
   Salmão Grelhado + Eisenbahn Weizenbier
   Descubra mais: [URL]
   Beba com moderação."
5. Abre: https://wa.me/?text=[encodeURIComponent(mensagem)]
6. WhatsApp abre com mensagem pré-preenchida
```

### Fluxo: Navegação Reversa (F07)

```
1. Usuário está em /cervejas/heineken-lager/pratos
2. Vê lista de pratos que combinam com Heineken Lager
3. Toca em "Salmão Grelhado"
4. Navega para /prato/salmao-grelhado?beer=heineken-lager
5. Server Component recebe searchParams.beer = "heineken-lager"
6. API retorna todas as recomendações (ordenadas por affinity_score)
7. Client reordena: move heineken-lager para posição #1
8. Usuário vê a recomendação com Heineken em destaque
```

---

## Modelo de Domínio

### Princípios de Harmonização

Cada recomendação tem um `harmony_principle`:

| Princípio | Descrição | Exemplo |
|---|---|---|
| `semelhança` | Cerveja e prato compartilham perfil sensorial | Weizen cremosa + risoto cremoso |
| `contraste` | Cerveja equilibra o prato por oposição | IPA amarga + prato gorduroso |
| `complementação` | Cerveja adiciona dimensão ausente no prato | Lager limpa + feijoada pesada |

### Campos de Qualidade do Conteúdo

Para que a tela de recomendação seja exibida corretamente:

| Campo | Onde | Impacto se ausente |
|---|---|---|
| `beer.image_url` | MongoDB `beers` | Sem imagem no card + preview WhatsApp comprometido |
| `beer.serving_temp_min/max` | MongoDB `beers` | Seção de temperatura não exibida (F05) |
| `beer.glass_type` | MongoDB `beers` | Seção de copo não exibida (F05) |
| `recommendation.sensory_explanation` | MongoDB `recommendations` | Explicação sensorial vazia |
| `recommendation.recommendation_title` | MongoDB `recommendations` | Sem título da recomendação + OG tag incompleto |

---

## Relacionamentos entre Collections

```
categories  (1) ──────── (N)  dishes
dishes      (1) ──────── (N)  recommendations
beers       (1) ──────── (N)  recommendations
```

- Uma categoria tem muitos pratos.
- Um prato tem múltiplas recomendações (1 a N cervejas).
- Uma cerveja aparece em múltiplas recomendações (de diferentes pratos).
- `recommendations` é a tabela de junção com metadados ricos (score, título, explicação).

---

## Regras de Ativação de Conteúdo

Todos os documentos têm campo `active: boolean`. Um item inativo:
- Não aparece em listagens
- Não pode ser acessado por slug (retorna `404`)
- Não contamina contagem de recomendações (para lógica do F06)

Sequência de verificação ao acessar `/prato/[slug]`:
1. `dishes.findOne({ slug, active: true })` → se não encontrar, 404
2. `recommendations.find({ dish_id, active: true })` → se vazio, 404
3. Retorna lista ordenada por `affinity_score DESC`

---

## Casos de Borda Documentados

| Cenário | Comportamento esperado |
|---|---|
| Prato com apenas 1 recomendação ativa | Exibe somente aquela cerveja; sem CTA "Ver mais" |
| Prato com exatamente 3 recomendações | Exibe as 3; sem CTA "Ver mais" |
| Prato com 4+ recomendações | Exibe 3; CTA "Ver mais" expande as demais |
| Cerveja sem temperatura cadastrada | Seção F05 exibe apenas o tipo de copo |
| Cerveja sem copo cadastrado | Seção F05 exibe apenas a temperatura |
| Cerveja sem temperatura E sem copo | Seção F05 não é exibida |
| Busca retorna 0 resultados | Lista vazia + mensagem de fallback |
| `?beer=` com slug inexistente | Ignora o parâmetro; exibe ordem normal por affinity_score |
| Gate: usuário nega maioridade | Não armazena nada; página de bloqueio permanece |
| Link WhatsApp em desktop sem WhatsApp | `wa.me` abre WhatsApp Web no browser |
