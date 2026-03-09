# Cortex Framework — Squadfy

Framework AI-First para desenvolvimento de software com Claude Code, adaptado das melhores práticas da metodologia Cortex para as necessidades da Squadfy.

---

## O que é o Cortex Framework?

O Cortex é um conjunto de configurações, agentes e comandos que transforma o Claude Code em um assistente de engenharia e produto de alto desempenho. Em vez de dar instruções genéricas ao Claude a cada sessão, o framework encapsula workflows, papéis especializados e processos da Squadfy diretamente na ferramenta.

**O resultado prático:** o Claude já sabe como a Squadfy trabalha — como criar uma spec, como abrir um PR, como gerar um relatório executivo — sem precisar ser explicado do zero a cada vez.

### Pilares

- **Agentes especializados** — Sub-agentes com contexto e ferramentas delimitadas para cada tipo de tarefa
- **Comandos de workflow** — Sequências de produto e engenharia acionáveis via `/comando`
- **Master Docs** — Documentos "DNA" de cada projeto que servem como fonte de verdade para validação
- **Metodologia AI Frontiers** — Inception → Experimentação → Prototipagem → Wrap-up

---

## Estrutura de Pastas

```
squadfy-cortex-framework/
└── .claude/
    ├── agents/          # Sub-agentes especializados (52)
    ├── commands/        # Comandos acionáveis via /categoria:ação
    │   ├── engineer/    # Workflows de engenharia
    │   ├── product/     # Workflows de produto
    │   ├── report/      # Geração de relatórios executivos
    │   ├── docs-commands/   # Geração de documentação
    │   ├── docx/        # Relatórios em DOCX
    │   ├── meta/        # Meta-comandos (ex: criar agentes)
    │   └── master-docs-commands/  # Templates e prompts para master docs
    ├── rules/           # Regras sempre aplicadas ao Claude
    │   └── product-agent.mdc    # Papel PM híbrido (sempre ativo)
    ├── scripts/         # Scripts de automação
    │   ├── reports/     # Gerador de PPTX executivo (pptx_generator.py)
    │   ├── docx/        # Geração de documentos Word
    │   ├── html2pptx/   # Conversão HTML → PPTX
    │   └── productivity/  # Scripts de produtividade
    └── skills/          # Skills invocáveis
        ├── docx/        # Skill de documentos Word
        └── px-presentations/  # Apresentações no design system PX
```

---

## Comandos Disponíveis

### Produto (`/product:*`)

| Comando                | O que faz                                             |
| ---------------------- | ----------------------------------------------------- |
| `/product:warm-up`     | Aquece a sessão revisando master docs e README        |
| `/product:check`       | Valida features contra os master docs do projeto      |
| `/product:collect`     | Coleta e estrutura novas ideias de produto            |
| `/product:spec`        | Leva um requisito de alto nível até uma spec completa |
| `/product:refine`      | Refina requisitos existentes                          |
| `/product:brainstorm`  | Sessão de brainstorm estruturado                      |
| `/product:task`        | Cria issues no Linear                                 |
| `/product:sync-linear` | Sincroniza features documentadas com o Linear         |
| `/product:light-arch`  | Esboço rápido de arquitetura técnica                  |

### Engenharia (`/engineer:*`)

| Comando              | O que faz                                      |
| -------------------- | ---------------------------------------------- |
| `/engineer:warm-up`  | Aquece a sessão de engenharia                  |
| `/engineer:start`    | Inicializa uma nova feature (branch, contexto) |
| `/engineer:work`     | Fluxo de trabalho de desenvolvimento           |
| `/engineer:plan`     | Planeja a implementação antes de codar         |
| `/engineer:pre-pr`   | Checklist pré-PR (qualidade, testes, docs)     |
| `/engineer:pr`       | Abre Pull Request com descrição padronizada    |
| `/engineer:bump`     | Incrementa versão para release                 |
| `/engineer:docs`     | Gera documentação do branch atual              |
| `/engineer:discover` | Mapeia contexto e arquitetura do projeto       |

### Relatórios (`/report:*`)

| Comando           | O que faz                                   |
| ----------------- | ------------------------------------------- |
| `/report:weekly`  | Relatório semanal executivo (5 slides PPTX) |
| `/report:general` | Relatório geral do projeto (6 slides PPTX)  |

### Documentação (`/docs-commands:*`)

| Comando                              | O que faz                    |
| ------------------------------------ | ---------------------------- |
| `/docs-commands:build-tech-docs`     | Gera documentação técnica    |
| `/docs-commands:build-business-docs` | Gera documentação de negócio |
| `/docs-commands:build-index`         | Gera índice da documentação  |
| `/docs-commands:refine-vision`       | Refina a visão do produto    |

### Outros

| Comando              | O que faz                             |
| -------------------- | ------------------------------------- |
| `/docx:report`       | Gera relatório em formato DOCX        |
| `/meta:create-agent` | Cria um novo sub-agente especializado |

---

## Modos do Framework

O Cortex opera em quatro modos que refletem as fases naturais de um projeto. Cada modo agrupa os comandos mais relevantes para aquele momento.

| Modo | Foco | Comandos principais |
| ---- | ---- | ------------------- |
| **Modo 1 — Exploração / Discovery** | Entender o problema, mapear o contexto, levantar oportunidades | `warm-up` · `discover` · `brainstorm` |
| **Modo 2 — Ideação / Produto** | Coletar ideias, validar com master docs, refinar e especificar | `collect` · `check` · `refine` · `spec` · `light-arch` · `task` · `sync-linear` |
| **Modo 3 — Desenvolvimento** | Implementar com contexto claro e qualidade garantida | `start` · `plan` · `work` |
| **Modo 4 — Entrega** | Fechar o ciclo com qualidade, documentação e PR | `pre-pr` · `pr` · `bump` · `docs` |

---

## Exemplos Práticos

Fluxos recomendados para os cenários mais comuns do dia a dia.

### Iniciar uma nova aplicação do zero

```
warm-up → discover → brainstorm → collect → check → refine → spec → light-arch → start → plan → work → pre-pr → pr
```

```bash
/product:warm-up
/engineer:discover
/product:brainstorm
/product:collect
/product:check
/product:refine
/product:spec
/product:light-arch
/engineer:start
/engineer:plan
/engineer:work
/engineer:pre-pr
/engineer:pr
```

---

### Corrigir um bug

```
warm-up → collect (bug) → start → plan → work → pre-pr → pr
```

```bash
/product:warm-up
/product:collect "Descrição do bug"
/engineer:start
/engineer:plan
/engineer:work
/engineer:pre-pr
/engineer:pr
```

---

### Desenvolver uma feature nova

```
warm-up → brainstorm → collect → check → refine → spec → task → start → plan → work → pre-pr → pr
```

```bash
/product:warm-up
/product:brainstorm
/product:collect
/product:check
/product:refine
/product:spec
/product:task
/engineer:start
/engineer:plan
/engineer:work
/engineer:pre-pr
/engineer:pr
```

---

### Registrar uma ideia rapidamente

```bash
/product:collect "Minha ideia"
```

---

### Iniciar novos épicos

```
warm-up → brainstorm → collect → check → refine → spec → light-arch → sync-linear → start → plan → work
```

```bash
/product:warm-up
/product:brainstorm
/product:collect
/product:check
/product:refine
/product:spec
/product:light-arch
/product:sync-linear
/engineer:start
/engineer:plan
/engineer:work
```

---

## Use Cases por Função

### Product Managers

O Cortex é a ferramenta principal de trabalho do PM — desde a coleta de ideias até a entrega em produção.

**Validar uma feature antes de colocar no backlog**
```bash
/product:warm-up
/product:check "Descrição da feature"
```

**Ir de ideia bruta até spec pronta para dev**
```bash
/product:collect "Ideia inicial"
/product:refine
/product:spec
/product:task          # cria a issue no Linear
```

**Preparar o backlog de um novo épico**
```bash
/product:brainstorm    # explorar o espaço do problema
/product:collect       # registrar as ideias geradas
/product:check         # validar alinhamento com master docs
/product:spec          # especificar cada item
/product:sync-linear   # sincronizar tudo com o Linear
```

**Gerar relatório semanal para o board**
```bash
/report:weekly
```

**Registrar uma ideia no meio de uma reunião**
```bash
/product:collect "Ideia capturada agora"
```

---

### Developers

O Cortex elimina o overhead de setup e contexto — o dev entra direto no que importa.

**Pegar uma issue do Linear e implementar**
```bash
/engineer:warm-up
/engineer:start        # configura branch e carrega contexto da issue
/engineer:plan         # plano de implementação antes de codar
/engineer:work         # implementação assistida
/engineer:pre-pr       # checklist de qualidade, testes e docs
/engineer:pr           # PR com descrição padronizada
```

**Investigar e corrigir um bug**
```bash
/engineer:warm-up
/engineer:discover     # mapeia o contexto do problema
/engineer:plan         # identifica a causa raiz e o plano de fix
/engineer:work
/engineer:pre-pr
/engineer:pr
```

**Entrar em um projeto desconhecido**
```bash
/engineer:warm-up
/engineer:discover     # lê toda a arquitetura e gera mapa de contexto
```

**Preparar um release**
```bash
/engineer:bump         # incrementa versão
/engineer:docs         # gera documentação do branch
/engineer:pr
```

---

### Designers

O Cortex conecta o trabalho de design ao ciclo de produto e ao contexto técnico do projeto.

**Contribuir com uma proposta de UX antes da spec**
```bash
/product:warm-up
/product:brainstorm    # explorar soluções com o Claude
/product:collect       # documentar a proposta
/product:check         # validar alinhamento com as personas dos master docs
```

**Gerar um mockup de fluxo para validação**

O agente `ux-mockup-architect` é ativado automaticamente quando você descreve um fluxo de usuário. Basta descrever o que precisa:

```
"Preciso de um mockup do fluxo de onboarding: cadastro → verificação de email → primeiro acesso"
```

**Revisar uma spec do PM pela ótica de UX**
```bash
/product:check         # verifica alinhamento com personas e experiência esperada
```

**Documentar decisões de design**
```bash
/engineer:docs         # gera documentação estruturada da feature em desenvolvimento
```

---

## Agentes Especializados

O framework inclui 52 sub-agentes. Cada um é ativado automaticamente pelo Claude quando a tarefa se encaixa em sua especialidade.

**Backend**
`backend-architect` · `backend-python-specialist` · `python-developer` · `docker-orchestrator`

**Frontend**
`frontend-architect` · `frontend-react-specialist` · `react-developer` · `crossplatform-ui-expert` · `ux-ui-design-expert` · `ux-mockup-architect`

**Banco de dados**
`database-architect` · `database-cleanup-specialist` · `surrealdb-integration-expert` · `zenstack-implementation-lead` · `multi-tenant-isolation-specialist`

**Qualidade e testes**
`test-automation-specialist` · `test-engineer` · `test-planner` · `branch-test-planner` · `quality-assurance-reviewer` · `quality-testing-engineer` · `testing-strategy-architect` · `feature-testing-strategist` · `code-quality-guardian` · `code-reviewer` · `branch-code-reviewer` · `standards-compliance-guardian` · `adr-compliance-checker`

**Documentação**
`documentation-architect` · `documentation-specialist` · `branch-documentation-writer` · `project-documentation-specialist` · `feature-docs-architect`

**Produto e gestão**
`prd-interview-specialist` · `discovery-analyst` · `research-agent` · `delivery-orchestrator` · `task-sync-coordinator` · `linear-project-sync` · `feature-spec-validator` · `feature-code-auditor` · `master-docs-gate-keeper` · `project-blueprint-guardian` · `branch-master-docs-checker`

**AI e geração de código**
`ai-agent-creator` · `lovable-backend-mapper` · `lovable-frontend-prompt-generator` · `workspace-structure-designer`

**Observabilidade e debug**
`observability-engineer` · `fullstack-debugger`

---

## Master Docs

Cada projeto que usa o Cortex tem seus próprios **master docs** — documentos que descrevem o DNA do projeto: contexto de negócio, decisões arquiteturais, personas, critérios de sucesso.

Por convenção, os master docs de um projeto `meu-projeto` ficam em:

```
~/meu-projeto/
└── index.md   # índice dos master docs
```

O Claude lê esses documentos no warm-up e os usa como fonte de verdade para validar features e decisões.