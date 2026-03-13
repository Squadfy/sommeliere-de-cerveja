# Architecture Challenges — Sommelière de Cerveja

> Limitações arquiteturais conhecidas, débitos técnicos e áreas de melhoria para versões futuras.
> Este documento registra decisões pragmáticas tomadas para o protótipo e suas consequências.

---

## Desafios Atuais do Protótipo

### 1. Gerenciamento de Conteúdo via Seed

**Situação atual:**
Todo o catálogo (pratos, cervejas, recomendações) é gerenciado exclusivamente via script de seed. Não há painel de administração.

**Impacto:**
- Adicionar ou editar conteúdo requer acesso ao código e execução de script técnico
- Não é viável para o time de Marketing/Produto sem suporte técnico
- Erros de seed podem comprometer toda a base de dados

**Caminho para resolução:**
Implementar F10 (Painel de Gestão) em versão futura — interface web para CRUD de pratos, cervejas e recomendações, com fluxo de publicação e validação editorial.

---

### 2. Ausência de Testes Automatizados

**Situação atual:**
O protótipo não tem testes unitários, de integração ou E2E.

**Impacto:**
- Regressões silenciosas ao refatorar componentes
- Sem garantia de que os endpoints da API retornam dados no formato correto
- Deploy sem validação automatizada

**Caminho para resolução:**
- Testes unitários para handlers da API (Jest + supertest)
- Testes de componentes React críticos (React Testing Library) — especialmente AgeGate e ShareButton
- Smoke tests E2E para o fluxo principal: gate → busca → recomendação → compartilhamento (Playwright)

---

### 3. Deploy Manual

**Situação atual:**
Deploy do frontend (Amplify) e da API (Serverless Framework) são executados manualmente pela linha de comando.

**Impacto:**
- Risco de deploy de código não revisado
- Sem rollback automatizado
- Sem validação de build antes do deploy

**Caminho para resolução:**
Configurar GitHub Actions com pipeline de CI/CD:
- Lint + build em PRs
- Deploy automático para staging em merge no `dev`
- Deploy automático para produção em merge no `main` com aprovação manual

---

### 4. ISR com Seed Desatualizado

**Situação atual:**
Páginas de conteúdo usam ISR (Incremental Static Regeneration). Quando o seed é re-executado, páginas em cache continuam servindo dados antigos até o próximo `revalidate`.

**Impacto:**
- Atualização de conteúdo não reflete imediatamente para usuários
- Requer chamada manual de `res.revalidate()` ou esperar o intervalo de revalidação

**Caminho para resolução:**
Script de seed que automaticamente chama a API de revalidação do Next.js para cada rota afetada após a inserção dos dados.

---

### 5. Ausência de Analytics (F09 Removido)

**Situação atual:**
F09 (Analytics de Uso) foi removido do escopo do protótipo.

**Impacto:**
- Sem visibilidade de quais pratos/cervejas são mais consultados
- Sem rastreamento de termos buscados sem resultado (gap de catálogo)
- UTM params nos links de compartilhamento existem mas não são processados

**Caminho para resolução:**
Implementar F09 com GA4 antes do lançamento público — decisão de ferramenta pendente com o cliente (P06). Ver `master-docs/business-context/features/usage-analytics.md` para especificação completa.

---

### 6. MongoDB Self-Hosted sem Estratégia de Backup

**Situação atual:**
MongoDB rodando localmente em desenvolvimento. Estratégia de hosting em produção não definida.

**Impacto:**
- Sem backup automatizado dos dados de conteúdo
- Latência variável dependendo da localização do servidor

**Caminho para resolução:**
Avaliar MongoDB Atlas como alternativa ao self-hosted para produção — oferece backup automatizado, monitoramento e replica sets nativos. Trade-off: custo vs. operação.

---

### 7. Sem Estratégia de CDN para Assets

**Situação atual:**
`image_url` dos pratos e cervejas são strings armazenadas no MongoDB. A origem dessas imagens não está definida no protótipo.

**Impacto:**
- Performance do carregamento de imagens dependente da origem (S3 vs. outra CDN)
- Sem otimização automática de imagens (resize, WebP)

**Caminho para resolução:**
- Armazenar imagens no AWS S3 com CloudFront como CDN
- Usar `next/image` com `remotePatterns` configurados para otimização automática
- Definir padrão de nomenclatura e organização de assets no S3

---

### 8. Middleware Next.js — Limitações do Edge Runtime

**Situação atual:**
O middleware de verificação do age gate roda no Edge Runtime do Next.js.

**Restrições do Edge Runtime:**
- Não pode usar Node.js APIs (fs, path, crypto nativo)
- Não pode usar mongoose ou conectar ao MongoDB
- Acesso limitado ao `localStorage` (Edge não tem contexto de browser)

**Impacto atual:**
A verificação do gate via `localStorage` só é possível no client-side (via `useEffect` no componente). O middleware pode verificar cookies, mas não localStorage.

**Decisão atual:**
Gate verificado client-side no componente `useAgeGate` — middleware redireciona apenas com base em cookie (se implementado como fallback). Ver ADR-006 para detalhes.

---

## Débitos Técnicos Priorizados

| # | Débito | Prioridade | Feature relacionada |
|---|---|---|---|
| 1 | Pipeline CI/CD | Alta | Todas |
| 2 | Testes de smoke E2E | Alta | F01, F04, F08 |
| 3 | Analytics (GA4) | Alta | F09 |
| 4 | Painel de gestão | Média | F10 |
| 5 | CDN para assets | Média | F04, F07 |
| 6 | MongoDB Atlas ou backup | Média | Infraestrutura |
| 7 | Testes unitários API | Média | F02, F03, F04 |
| 8 | Revalidação automática pós-seed | Baixa | F02, F04 |

---

## Decisões Pragmáticas para o Protótipo

Estas decisões foram tomadas conscientemente para reduzir escopo no protótipo, com plano de revisão em versões futuras:

| Decisão | Razão | Revisão futura |
|---|---|---|
| Sem testes | Velocidade de entrega do protótipo | Antes da fase de produção |
| Sem CI/CD | Equipe pequena, deploy manual suficiente | Antes do lançamento |
| Seed em vez de CMS | Evita complexidade de painel admin | F10 em versão futura |
| MongoDB self-hosted | Controle total, sem custo de Atlas no protótipo | Avaliar Atlas para produção |
| Sem analytics | F09 fora do escopo do protótipo | Antes do lançamento público |
| WhatsApp only (sem Instagram) | Complexidade vs. impacto — WhatsApp é o canal principal no Brasil | Avaliar Instagram Stories em versão 2.0 |
