## Projeto: Sommelière de Cerveja

### Cliente: Grupo Heineken

### Versão: 1.0 | Data: Março/2026 | Status: Rascunho para Validação

---

## 1. Objetivo do Projeto

Desenvolver um aplicativo digital interativo voltado ao consumidor final (B2C) que atue como um **guia inteligente de harmonização entre pratos e cervejas do portfólio Heineken**, educando e engajando o usuário sobre a cultura cervejeira de forma leve, acessível e personalizada.

O projeto visa fortalecer o relacionamento da marca com o consumidor, aumentar o reconhecimento do portfólio de marcas do Grupo Heineken (Heineken, Amstel, Eisenbahn, entre outras) e estimular a experimentação de novos estilos por meio de uma experiência digital fluida e envolvente.

---

## 2. Objetivo da Entrega

Ao final do projeto, deverá ser entregue um **aplicativo funcional** (plataforma a definir) que permita ao usuário:

- Selecionar um prato ou categoria gastronômica de sua preferência;
- Receber uma recomendação personalizada de qual cerveja do portfólio Heineken melhor harmoniza com aquela escolha;
- Compreender o **porquê** da recomendação, por meio de textos explicativos sobre sabor, aroma e complementaridade.

A entrega contempla também a documentação técnica, os ativos de design validados e o ambiente de produção devidamente homologado.

---

## 3. Descrição da Mecânica

### 3.1 Como Funciona

O aplicativo funciona como um **sommelier digital de bolso**. A experiência é iniciada com uma interface simples e intuitiva, na qual o usuário escolhe o prato que irá consumir — podendo navegar por categorias (Carnes, Frutos do Mar, Massas, Vegetariano, Petiscos etc.) ou realizar uma busca livre.

Após a seleção, o app processa a escolha com base em uma **tabela de harmonização curada** (pré-definida pelo time de especialistas Heineken) e exibe:

1. A(s) cerveja(s) recomendada(s) do portfólio, com nome, imagem e marca;
2. Uma **explicação sensorial**: por que essa cerveja combina com o prato (amargor, dulçor, carbonatação, notas aromáticas etc.);
3. Uma **dica de serviço**: temperatura ideal, tipo de copo recomendado;
4. Opção de **"Ver mais combinações"** ou **"Compartilhar"** nas redes sociais.

### 3.2 Fundamentos Técnicos de Harmonização (Referência de Mercado)

A lógica de recomendação do app será baseada nos **três princípios universais de harmonização cervejeira**, amplamente consolidados no mercado e referenciados por especialistas do setor:

| Princípio | Descrição | Exemplo Prático |
| --- | --- | --- |
| **Semelhança** | Elementos sensoriais parecidos entre a cerveja e o prato se reforçam mutuamente | Cerveja de malte torrado (ex: Eisenbahn Dunkel) + brownie de chocolate |
| **Contraste** | Elementos opostos se equilibram, eliminando excessos de cada lado | Cerveja amarga e lupulada + prato gorduroso ou apimentado |
| **Complementação** | A cerveja adiciona uma sensação ou sabor que completa a experiência do prato | Alta carbonatação limpando o paladar entre mordidas de fritura |

**Regra de ouro de intensidade:** cervejas leves devem acompanhar pratos suaves, e cervejas encorpadas devem acompanhar preparações mais intensas, para que nenhum dos dois se sobreponha ao outro.

### 3.3 Portfólio do Grupo Heineken no Brasil e Perfis de Harmonização

Com base nas informações públicas do Grupo Heineken Brasil, o portfólio disponível para o app inclui marcas com perfis sensoriais distintos, adequados a diferentes categorias gastronômicas:

| Marca | Estilo / Perfil | Harmonizações Indicadas pelo Mercado |
| --- | --- | --- |
| **Heineken®** | Lager Premium, leve, lúpulo floral, refrescante | Frutos do mar, sushi, saladas, queijos brancos, petiscos leves |
| **Amstel** | Puro malte, sabor equilibrado, encorpado e fresco | Carnes grelhadas, hambúrguer, frios, massas com molho leve |
| **Eisenbahn Pilsen** | Pilsen artesanal, amargor médio, leveza com complexidade | Pastéis, coxinha, frango, comidas de boteco, queijos suaves |
| **Eisenbahn Weizenbier** | Trigo, notas frutadas e condimentadas, acidez suave | Culinária oriental, saladas com tomate, queijo de cabra, pratos apimentados |
| **Eisenbahn IPA / Pale Ale** | Lupulada, amargor elevado, alta carbonatação | Carnes assadas, hambúrguer, pizza, molhos fortes, pratos gordurosos |
| **Baden Baden** | Linha gourmet, posicionamento gastronômico premium | Harmonização com culinária nacional e internacional, pratos elaborados |
| **Sol** | Lager leve e tropical, refrescante | Grelhados leves, frutos do mar, petiscos, churrasco de frango |
| **Devassa** | Puro malte, lei de pureza alemã, sabor marcante | Carnes com tempero, feijoada, pratos brasileiros intensos |

> ⚠️ **Campo a preencher:** A tabela de harmonização oficial (prato × marca), com os textos sensoriais validados, deverá ser fornecida ou co-criada com o time de Marketing e especialistas do Grupo Heineken. O portfólio acima é uma referência de mercado e precisa de confirmação e curadoria editorial pelo cliente.
> 

### 3.4 Contexto de Mercado

O mercado de cervejas artesanais e premium no Brasil está em crescimento consistente, e a cultura de harmonização tem sido uma das principais estratégias de diferenciação adotadas pelo setor. O próprio Grupo Heineken já investe nessa frente: a **Baden Baden** tem posicionamento explicitamente gastronômico com foco em harmonização, e a **Eisenbahn** convida o consumidor a "descobrir o mundo das cervejas artesanais" por meio de diferentes estilos. A experiência **Inside The Star**, na Cervejaria de Jacareí (SP), já oferece degustações com harmonização ao vivo — o que valida que o app *Sommelière de Cerveja* está alinhado à estratégia do grupo e tem potencial de ampliar esse conceito para o digital em escala nacional.

### 3.5 Gestão do Conteúdo

O conteúdo do protótipo (pratos, cervejas e tabela de harmonização) será gerenciado via **seed de banco de dados**. Não haverá painel administrativo ou CMS nesta versão — atualizações de conteúdo requerem novo seed ou intervenção técnica direta.

> ✅ **Decisão tomada:** Sem CMS ou painel de gestão para o protótipo. Dados populados via seed.

---

## 5. Escopo do Produto

### ✅ Incluído no Escopo

- Tela de entrada com verificação de maioridade (gate de idade);
- Navegação por categorias de pratos;
- Busca por nome de prato;
- Tela de resultado com recomendação de cerveja, explicação e dica de serviço;
- Opção de compartilhamento via WhatsApp (link com preview rico via OG tags);
- Listagem completa do portfólio de marcas Heineken;
- Design responsivo e alinhado ao guia de marca do Grupo Heineken;
- Conteúdo (pratos, cervejas e harmonizações) populado via seed de banco de dados;
- Documentação técnica e manual de uso.

### ❌ Fora do Escopo (nesta versão)

- E-commerce ou integração com plataformas de venda/delivery;
- Sistema de login ou cadastro de usuário;
- Gamificação ou programa de pontos/fidelidade;
- Integração com PDV ou sistemas internos do cliente;
- Suporte a múltiplos idiomas (versão inicial em português);
- Curadoria de harmonização com rótulos de outras bebidas (fora do portfólio Heineken);
- Painel administrativo ou CMS de gestão de conteúdo (dados via seed);
- Analytics de uso (fora do escopo do protótipo).

---

## 6. Mecânica da Solução — Jornada do Usuário

| Etapa | Ação do Usuário | Resposta do Sistema | Observações |
| --- | --- | --- | --- |
| **1. Acesso** | Abre o app | Exibe splash screen com branding Heineken | — |
| **2. Gate de Idade** | Informa data de nascimento ou confirma maioridade | Libera acesso se maior de 18 anos; bloqueia caso contrário | Obrigatório por legislação |
| **3. Tela Inicial** | Visualiza categorias de pratos ou campo de busca | Exibe categorias ilustradas (Carnes, Peixes, Massas etc.) | Layout visual e intuitivo |
| **4. Seleção do Prato** | Toca em uma categoria e escolhe um prato específico | Carrega tela de resultado com a recomendação | Navegação em até 2 toques |
| **5. Recomendação** | Visualiza a cerveja recomendada | Exibe imagem da cerveja, marca, título e texto explicativo | Pode haver até 3 sugestões |
| **6. Detalhes** | Acessa dica de serviço | Exibe temperatura ideal e tipo de copo recomendado | Conteúdo editorial |
| **7. Exploração** | Toca em "Ver mais combinações" | Exibe outras cervejas que combinam com o prato | Ordenadas por afinidade |
| **8. Compartilhamento** | Toca em "Compartilhar no WhatsApp" | Abre WhatsApp com mensagem pré-formatada e link da recomendação | Link com preview rico via OG tags |
| **9. Nova Consulta** | Toca em "Escolher outro prato" | Retorna à tela inicial | Fluxo contínuo |

---

## 7. Regras de Negócio e Validações

| # | Regra | Detalhe |
| --- | --- | --- |
| RN01 | Verificação de maioridade obrigatória | Usuários com menos de 18 anos não podem acessar o conteúdo |
| RN02 | Toda recomendação deve pertencer ao portfólio ativo do Grupo Heineken | Nenhuma marca externa ou concorrente pode ser citada |
| RN03 | Cada prato deve ter ao menos 1 recomendação cadastrada | Pratos sem recomendação não devem ser exibidos ao usuário |
| RN04 | Limite de recomendações por prato | Máximo de 3 cervejas por resultado, ordenadas por grau de afinidade |
| RN05 | Textos de harmonização devem ser validados pelo cliente | Conteúdo editorial sujeito à aprovação de Marketing e Jurídico |
| RN06 | Atualização de portfólio sem novo deploy | Inclusão/remoção de marcas e pratos via painel, sem necessidade de nova versão |
| RN07 | Rastreamento de dados em conformidade com a LGPD | Analytics apenas com dados agregados e anônimos; sem coleta de dados pessoais sem consentimento |
| RN08 | Comunicação de álcool responsável | Rodapé ou disclaimer fixo com mensagem de consumo consciente |

---

## 8. Responsabilidades

### 🏢 Cliente — Grupo Heineken

| Responsabilidade |
| --- |
| Fornecer e validar a tabela oficial de harmonização (prato × marca) |
| Aprovar os textos editoriais de recomendação e dica de serviço |
| Disponibilizar assets de marca (logos, fotografias de produtos, guia de identidade visual) |
| Validar protótipos de UX/UI em cada etapa |
| Aprovar conteúdo junto à equipe jurídica e de compliance |
| Definir plataforma de gestão de conteúdo preferida |
| Homologar o produto em ambiente de staging antes do go-live |

### 💻 Equipe de Produto & Tecnologia (Fornecedor)

| Responsabilidade |
| --- |
| Conduzir discovery e refinamento de requisitos |
| Elaborar e manter a documentação técnica e de produto |
| Desenvolver o app nas plataformas definidas |
| Implementar a lógica de recomendação com base na tabela do cliente |
| Desenvolver e integrar o painel de gestão de conteúdo |
| Garantir performance, acessibilidade e segurança da solução |
| Realizar testes funcionais, de usabilidade e de regressão |
| Publicar nas lojas (App Store / Google Play) e/ou deploy em produção |

### 🎨 Equipe de Design & UX

| Responsabilidade |
| --- |
| Conduzir pesquisa de UX e mapeamento da jornada |
| Criar wireframes, protótipos e UI final |
| Garantir alinhamento com o branding Heineken |
| Produzir especificações de design para handoff ao desenvolvimento |

---

## 9. Cronograma Estimado

> ⚠️ **Campo a preencher:** Prazo total e data de início a confirmar com o cliente.
> 

### Tabela de Fases

| Fase | Descrição | Duração Estimada | Entregas |
| --- | --- | --- | --- |
| **0. Kick-off & Setup** | Alinhamento inicial, acesso a sistemas, onboarding | 1 semana | Ata de kick-off, acesso a ambientes |
| **1. Discovery & Requisitos** | Levantamento detalhado, validação da tabela de harmonização | 2 semanas | Documento de requisitos, tabela de harmonização validada |
| **2. Design UX/UI** | Wireframes, protótipo navegável, validação visual com cliente | 3 semanas | Protótipo aprovado, guia de componentes |
| **3. Desenvolvimento — MVP** | Implementação das funcionalidades core do app | 4 semanas | Build funcional em staging |
| **4. Painel de Gestão** | Desenvolvimento da interface de administração de conteúdo | 2 semanas | Painel funcional em staging |
| **5. Testes & QA** | Testes funcionais, de usabilidade e de regressão | 2 semanas | Relatório de testes, bugs corrigidos |
| **6. Homologação** | Validação final pelo cliente em ambiente de staging | 1 semana | Aceite formal do cliente |
| **7. Go-live** | Publicação nas lojas / deploy em produção | 1 semana | App publicado, documentação final |
| **Total Estimado** |  | **~16 semanas** |  |

### Marcos Críticos

| Marco | Entrega | Prazo Sugerido |
| --- | --- | --- |
| M1 | Tabela de harmonização aprovada pelo cliente | Fim da Fase 1 |
| M2 | Protótipo de UX/UI aprovado | Fim da Fase 2 |
| M3 | Build MVP disponível em staging para testes internos | Fim da Fase 3 |
| M4 | Homologação completa pelo cliente | Fim da Fase 6 |
| M5 | App publicado nas lojas / em produção | Fim da Fase 7 |

---

## ✅ Decisões Tomadas

| # | Item | Decisão |
| --- | --- | --- |
| P01 | **Plataforma de desenvolvimento** | PWA — Next.js + MongoDB + AWS |
| P02 | **Tabela de harmonização** | Conteúdo disponível — será populado via seed de banco de dados |
| P04 | **Assets de marca** | Assets disponíveis — serão utilizados diretamente no projeto |
| P05 | **Ferramenta de gestão de conteúdo** | Sem CMS para o protótipo — dados gerenciados via seed |
| P06 | **Analytics** | Fora do escopo do protótipo |
| P09 | **Idiomas** | Apenas PT-BR |
| P10 | **Distribuição** | PWA — acesso via link/QR code, sem publicação em lojas |

## ⚠️ Informações Pendentes

| # | Item Pendente | Responsável | Prioridade |
| --- | --- | --- | --- |
| P03 | **Data de início e prazo máximo** do projeto | Cliente | 🔴 Alta |
| P07 | **Integrações externas** — confirmar ausência de integrações (CRM, e-commerce) | Cliente | 🟡 Média |
| P08 | **Aprovação dos textos de harmonização** — validação editorial antes do seed | Cliente (Marketing) | 🟡 Média |

---

*Documento elaborado para fins de alinhamento inicial. Sujeito a revisões conforme validações com o cliente.*

*Versão 1.0 — Março/2026*