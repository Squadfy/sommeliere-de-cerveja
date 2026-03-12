# Feature: Gate de Maioridade

**ID:** F01
**Status:** MVP — Escopo Core
**Prioridade:** Alta (requisito legal e de compliance)

---

## Propósito

Garantir que apenas usuários maiores de 18 anos acessem o conteúdo do app, em conformidade com a legislação brasileira e com o posicionamento de consumo responsável do Grupo Heineken.

---

## Benefício ao Usuário

Experiência transparente e fluida. O gate não deve ser percebido como barreira, mas como parte natural do contexto de uma marca de bebida alcoólica responsável.

---

## User Stories

**US-F01-01**
> Como usuário que acessa o app pela primeira vez, quero passar por uma verificação de maioridade rápida para então acessar o conteúdo.

**US-F01-02**
> Como usuário que já verificou minha maioridade em visita anterior, quero acessar o app diretamente sem repetir a verificação.

**US-F01-03**
> Como menor de 18 anos, quero ver uma mensagem clara e respeitosa explicando que o conteúdo não está disponível para mim.

---

## Fluxo

```
Usuário acessa o app (QR code ou link / deep link)
         ↓
Verifica localStorage: chave `sommeliere_age_verified`
         ↓
   [chave existe] → Redireciona para destino (home ou deep link)
         ↓
   [chave ausente] → Exibe splash screen Heineken + Gate de Maioridade
         ↓
   Usuário seleciona ano de nascimento e confirma
         ↓
   [+18] → Grava chave no localStorage → Redireciona para destino
   [-18] → Tela de bloqueio com mensagem de consumo responsável
```

---

## Especificação de Interface

- **Input:** Seleção de ano de nascimento (scroll/dropdown) + botão "Confirmar"
- **Alternativa simplificada:** Checkbox "Confirmo que tenho 18 anos ou mais" + botão "Entrar"
- **Feedback visual:** Transição suave para tela inicial após confirmação
- **Tela de bloqueio:** Mensagem amigável + logo Heineken + disclaimer. Sem botão de retry — página estática.
- **Splash screen:** Exibida durante a verificação do localStorage (< 500ms ideal)

---

## Regras de Negócio

| Código | Regra |
|---|---|
| RN01 | Usuários com menos de 18 anos não podem acessar nenhum conteúdo do app |
| RN08 | Comunicação de álcool responsável deve ser exibida na tela de bloqueio |

**Nota:** Gate declaratório — sem verificação real de identidade, conforme prática padrão do mercado.

---

## Critérios de Aceite

- [ ] Na primeira visita, o gate é exibido antes de qualquer conteúdo do app
- [ ] Após aprovação, a chave `sommeliere_age_verified=true` é gravada no localStorage
- [ ] Em visitas subsequentes, o gate não é exibido — usuário vai direto ao destino
- [ ] Se o destino é um deep link (`/prato/[slug]`), o redirecionamento pós-gate leva para essa URL
- [ ] Usuário com ano de nascimento indicando < 18 anos vê tela de bloqueio sem acesso a conteúdo
- [ ] Tela de bloqueio contém mensagem de consumo responsável (RN08)
- [ ] Gate não é exibido em nenhuma rota após aprovação inicial

---

## Modelo de Dados

Sem persistência em banco — exclusivamente client-side:

```
localStorage:
  key:   "sommeliere_age_verified"
  value: "true"
  expiry: sem expiração (persiste até o usuário limpar dados do browser)
```

---

## Considerações Técnicas (Stack: Next.js / MongoDB / AWS)

- Implementado como **Next.js Middleware** ou como componente wrapper no layout raiz
- Verificação no client-side via `useEffect` + `localStorage.getItem('sommeliere_age_verified')`
- Rota de bloqueio: `/bloqueado` — página estática Next.js, sem acesso a outras rotas
- Deep link preservation: parâmetro `redirect` na URL do gate (ex: `/gate?redirect=/prato/pizza`)
- Sem chamada a API ou MongoDB — gate é 100% client-side declaratório
- SSR/SSG: gate não é renderizado no servidor — evitar flash de conteúdo protegido com loading state

---

## Personas Afetadas

- **Persona 1 — Explorador (18-30):** Nativo digital, confirma rapidamente, sem fricção
- **Persona 2 — Apreciador (30-50):** Compreende o contexto, aceita naturalmente

---

## Métricas de Sucesso

| Métrica | Meta | Observação |
|---|---|---|
| Taxa de abandono no gate | < 10% | Referência para versões com analytics |
| Taxa de aprovação no gate | > 90% | Referência para versões com analytics |
| Incidentes de acesso indevido | Zero | Validável por inspeção manual |

---

## Edge Cases

| Cenário | Comportamento |
|---|---|
| Usuário limpa dados do browser | Gate é exibido novamente na próxima visita |
| Usuário acessa deep link sem aprovação prévia | Gate exibido, pós-aprovação redirecionado para o deep link |
| Usuário tenta navegar diretamente para `/prato/pizza` sem aprovação | Middleware/wrapper redireciona para gate com `?redirect=/prato/pizza` |
| JavaScript desabilitado | App não funciona (PWA exige JS) — não é cenário suportado |

---

## Dependências

- Pré-requisito para acesso a todas as demais features do app
- F08 (Compartilhamento) — deep link preservation no fluxo de gate
