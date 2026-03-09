# Feature: Painel de Gestão de Conteúdo

**ID:** F10
**Status:** Fase 4 — Pós-MVP Core
**Prioridade:** Alta (requisito de negócio RN06)

---

## Propósito

Permitir que o time de Marketing do Grupo Heineken atualize pratos, cervejas, textos e imagens sem necessidade de novo deploy técnico — garantindo autonomia editorial e agilidade para evoluir o catálogo.

---

## Benefício ao Negócio

- Autonomia do cliente: time de marketing atualiza conteúdo sem depender do time técnico
- Agilidade: novos pratos, cervejas e textos publicados em minutos
- Continuidade: app evolui sem friction entre marketing e tecnologia

---

## Ferramenta de Gestão

**Status:** Pendente — P05 (a definir pelo cliente + tech).

| Abordagem | Prós | Contras |
|---|---|---|
| **Painel próprio** (React Admin, Retool) | Customização total | Maior esforço de desenvolvimento |
| **CMS headless** (Strapi, Contentful, Sanity) | Interface amigável pronta, rápido de implementar | Custo (Contentful/Sanity) ou infra (Strapi self-hosted) |
| **Google Sheets via API** | Familiaridade do cliente, zero custo | Frágil, sem validações, sem controle de acesso adequado |

> ⚠️ P05 — Definição da ferramenta ainda pendente. Responsável: Cliente + Tech.
> **Recomendação técnica:** Strapi (self-hosted, open source) — interface amigável + integração nativa com Node.js/MongoDB.

**Decisão deve ser tomada até o início da Fase 3** para que o schema do MongoDB seja desenhado compatível com a ferramenta escolhida.

---

## Usuários do Painel

| Perfil | Permissões |
|---|---|
| **Editor** (Marketing Heineken) | Criar/editar/remover pratos e recomendações, atualizar textos e imagens |
| **Administrador** | Tudo do Editor + ativar/desativar marcas, gerenciar usuários do painel |

---

## Funcionalidades

### Gestão de Pratos

| Funcionalidade | Campos |
|---|---|
| Adicionar prato | Nome, slug, categoria, imagem, search_tags, status (ativo/inativo) |
| Editar prato | Qualquer campo |
| Desativar prato | Flag `active: false` — não exibido no app sem exclusão |

### Gestão de Recomendações (Prato × Cerveja)

| Funcionalidade | Campos |
|---|---|
| Adicionar recomendação | Prato, cerveja, affinity_score (0-100), princípio de harmonização, título, explicação sensorial |
| Editar recomendação | Qualquer campo |
| Reordenar | Ajustar `affinity_score` para mudar a posição na tela de resultado |
| Desativar | Flag `active: false` — sem exclusão permanente |

### Gestão de Cervejas / Portfólio

| Funcionalidade | Campos |
|---|---|
| Adicionar cerveja | Nome, slug, marca, estilo, perfil sensorial, harmonizações gerais, imagem, temperatura, copo, display_order |
| Editar cerveja | Qualquer campo |
| Ativar/Desativar | Remove a cerveja do app sem excluir do banco |

### Relatórios Básicos

| Relatório | Fonte |
|---|---|
| Pratos mais consultados | Analytics (F09) |
| Buscas sem resultado (top 20) | Eventos `dish_search_no_result` (F09) |
| Cervejas nunca recomendadas | Query no MongoDB |

---

## Fluxo de Publicação

A validação editorial ocorre **fora do sistema**. O editor prepara e aprova os textos via processo externo (e-mail, documento compartilhado, reunião) antes de inserir o conteúdo no painel. No painel, o conteúdo é publicado diretamente pelo editor quando já estiver aprovado.

```
Aprovação ocorre fora do sistema (e-mail / processo editorial)
         ↓
Editor acessa o painel
         ↓
Cria/edita conteúdo já aprovado
         ↓
Publica → disponível no app em tempo real (cache invalidado)
```

**Decisão de produto:** Sem workflow de aprovação interno no painel no MVP. Reduz significativamente a complexidade da Fase 4.

---

## User Stories

**US-F10-01**
> Como editor de conteúdo do time Heineken, quero adicionar um novo prato ao catálogo com suas recomendações para que fique disponível no app sem precisar chamar o time técnico.

**US-F10-02**
> Como editor, quero editar o texto de uma explicação sensorial já publicada para corrigir ou melhorar o conteúdo editorial.

**US-F10-03**
> Como editor, quero ver quais termos de busca não têm resultado no app para priorizar quais pratos adicionar ao catálogo.

**US-F10-04**
> Como administrador, quero desativar temporariamente uma cerveja do portfólio sem precisar excluí-la do sistema.

---

## Critérios de Aceite

- [ ] Editor consegue criar prato + recomendações sem assistência técnica em < 30 minutos
- [ ] Conteúdo publicado no painel fica disponível no app em tempo real (ou < 5 minutos via cache ISR)
- [ ] Desativar uma cerveja via painel remove ela do app sem novo deploy
- [ ] Relatório de buscas sem resultado está acessível no painel
- [ ] Acesso ao painel protegido por autenticação (editor e admin com permissões distintas)
- [ ] Upload de imagens funcionando — arquivo enviado vai para o CDN (AWS S3 + CloudFront)

---

## Modelo de Dados (MongoDB)

O painel gerencia as collections já definidas nas features anteriores:

```
collections:
  - categories    (F02) — slug, name, icon, order, active
  - dishes        (F02/F03) — slug, name, category_id, search_tags, image_url, active
  - beers         (F04/F07) — slug, name, brand, style, sensory_profile, image_url, serving_temp, glass_type, active
  - recommendations (F04/F06) — dish_id, beer_id, affinity_score, title, sensory_explanation, active
```

Não há collections exclusivas do painel — ele é apenas uma interface de CRUD sobre o schema existente.

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- **API:** Endpoints REST para CRUD de todas as collections — reutilizados pelo painel
- **Autenticação:** JWT com roles `editor` / `admin` — implementado no backend Node.js
- **Upload de imagens:** Multipart form → AWS S3 → URL pública via CloudFront adicionada ao documento
- **Cache invalidation:** Após publicação, chamar `res.revalidate('/prato/[slug]')` no Next.js para forçar rebuild da página ISR
- **Separação de ambientes:** Painel acessível em subdomínio protegido (ex: `admin.sommeliere.com.br`) — fora do PWA público

---

## Personas Afetadas

- **Time de Marketing Heineken** — usuário principal do painel
- **Time de Produto/Tech** — configuração inicial, manutenção de infra
- **Jurídico Heineken** — aprovação de textos editoriais (fora do sistema)

---

## Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Tempo de onboarding do editor | < 2 horas |
| Tempo para publicar novo prato (do cadastro ao ar) | < 30 minutos |
| Dependência de deploy para atualizações de conteúdo | Zero |

---

## Cronograma

- **Fase 3 (MVP):** Backend API com schema completo que suporta o painel
- **Fase 4:** Desenvolvimento da interface do painel (4 semanas estimadas)
- **Fase 5 (QA):** Testes do fluxo editorial completo end-to-end

---

## Pendências Críticas

| # | Item | Responsável | Prazo |
|---|---|---|---|
| P05 | Ferramenta do painel (próprio vs CMS headless) | Cliente + Tech | Início da Fase 3 |

---

## Dependências

- F04 (Recomendação) — painel gerencia o coração dos dados
- F02 (Categorias/Pratos) — painel adiciona/remove pratos
- F07 (Portfólio) — painel atualiza perfis de marca
- F09 (Analytics) — painel exibe relatórios básicos de buscas sem resultado
