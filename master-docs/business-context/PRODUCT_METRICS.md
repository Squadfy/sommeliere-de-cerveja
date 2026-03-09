# Métricas do Produto

> Framework de métricas para o MVP do Sommelière de Cerveja.
> Valores de referência são hipóteses iniciais — devem ser calibrados com dados reais após lançamento.

---

## North Star Metric

**Recomendações com Compartilhamento**
> Número de sessões em que o usuário chegou à tela de recomendação E realizou um compartilhamento social.

Justificativa: Captura simultaneamente a entrega de valor (recomendação recebida) e o engajamento social (experimentação estimulada + distribuição orgânica).

---

## Layer 1: Métricas de Aquisição

| Métrica | Descrição | Meta Inicial (Hipótese) |
|---|---|---|
| **Novos acessos por QR code** | Sessões iniciadas via scan de QR code | Volume definido por ativação de campanha |
| **Novos acessos via link compartilhado** | Sessões originadas de compartilhamentos | > 20% do total de acessos |
| **Taxa de aprovação no gate de idade** | % de usuários que passam pelo gate | > 90% |
| **Taxa de abandono no gate** | % que sai antes de confirmar a maioridade | < 10% |

---

## Layer 2: Métricas de Engajamento

| Métrica | Descrição | Meta Inicial (Hipótese) |
|---|---|---|
| **Taxa de chegada à recomendação** | % de sessões que chegam à tela de resultado | > 80% |
| **Tempo na tela de recomendação** | Tempo médio na tela principal de resultado | > 15 segundos |
| **Consultas por sessão** | Número médio de pratos consultados por visita | > 1,5 |
| **Taxa de "Ver mais combinações"** | % de sessões que acessam combinações extras | > 25% |
| **Taxa de acesso ao portfólio** | % de sessões que visitam página de marcas | > 15% |

---

## Layer 3: Métricas de Experimentação (Estilo)

| Métrica | Descrição | Meta Inicial (Hipótese) |
|---|---|---|
| **Diversidade de estilos explorados** | Número médio de estilos distintos visualizados por sessão | > 2 estilos |
| **% de exposição a estilos artesanais** | Sessões em que Eisenbahn ou Baden Baden foram exibidas | > 40% das sessões |
| **% de estilos "não-mainstream" clicados** | Acesso a cervejas além de Heineken e Amstel | > 30% |

---

## Layer 4: Métricas de Compartilhamento

| Métrica | Descrição | Meta Inicial (Hipótese) |
|---|---|---|
| **Taxa de compartilhamento** | % de sessões com pelo menos 1 compartilhamento | > 15% |
| **Canal principal de compartilhamento** | WhatsApp vs Instagram | A monitorar |
| **Acessos gerados por compartilhamento** | Novos usuários via link social | > 20% dos acessos |

---

## Layer 5: Métricas de Conteúdo (Gaps)

| Métrica | Descrição | Ação |
|---|---|---|
| **Buscas sem resultado** | Pratos pesquisados não encontrados no catálogo | Adicionar ao catálogo nas próximas iterações |
| **Pratos mais consultados** | Top 10 pratos por volume de consultas | Priorizar qualidade editorial nesses itens |
| **Pratos nunca consultados** | Pratos cadastrados com zero consultas | Revisar nomenclatura ou remover |
| **Cervejas mais recomendadas** | Distribuição das recomendações por marca | Verificar se portfólio está equilibrado |

---

## Layer 6: Métricas de Qualidade Técnica

| Métrica | Descrição | Meta |
|---|---|---|
| **Tempo de carregamento do PWA** | Até tela inicial estar interativa | < 3 segundos em 4G |
| **Taxa de erro por tela** | Erros de UI ou API por sessão | < 1% |
| **Score de acessibilidade** | Lighthouse Accessibility Score | > 90 |
| **Compatibilidade mobile** | Funcionamento em Android e iOS | 100% nos browsers padrão |

---

## Dashboard Prioritário (MVP)

As 5 métricas mais importantes para acompanhar no lançamento:

1. Total de sessões iniciadas (aquisição)
2. Taxa de chegada à tela de recomendação (conversão core)
3. Taxa de compartilhamento (engajamento social)
4. Pratos buscados sem resultado (gap de conteúdo)
5. Diversidade de estilos explorados por sessão (experimentação)

---

## Ferramenta de Analytics

**Status:** A definir pelo cliente (P06 no pré-PRD)

**Opções consideradas:** Firebase Analytics, Mixpanel, Google Analytics 4 (GA4)

**Requisito obrigatório:** Coleta apenas de dados agregados e anônimos, sem dados pessoais — conformidade com LGPD.
