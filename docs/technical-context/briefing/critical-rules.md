# Critical Rules — Sommelière de Cerveja

> Regras não-negociáveis. Copiar para todo `context.md` de feature.
> Violações bloqueiam PR.

---

## 🚨 Regras Críticas (TOP 5)

### R1 — Server Components por Padrão (ADR-002)
`"use client"` somente quando estritamente necessário:
- `useState`, `useEffect`
- `localStorage` / event handlers
- Context API consumers

**Nunca:** adicionar `"use client"` em página ou layout sem justificativa.

---

### R2 — Conexão MongoDB sempre via `db/connection.ts` (ADR-003 + ADR-004)
```typescript
// ✅ CORRETO
import { connectDB } from '../db/connection'
export const handler = async () => { await connectDB(); ... }

// ❌ PROIBIDO
mongoose.connect(process.env.MONGODB_URI!) // dentro do handler
```
**Nunca** chamar `mongoose.connect()` diretamente dentro de um handler Lambda.

---

### R3 — URLs sempre com `slug` kebab-case, nunca `_id` MongoDB (ADR-001/BUSINESS_LOGIC)
```
✅ /prato/salmao-grelhado
❌ /prato/64abc123def456
```
`slug` é o identificador público em toda a aplicação.

---

### R4 — Compartilhamento DEVE incluir "Beba com moderação" (RN08)
```typescript
// ✅ OBRIGATÓRIO
const message = `...Descubra mais: ${url}\n\nBeba com moderação.`

// ❌ PROIBIDO — viola política Heineken
const message = `...Descubra mais: ${url}`
```

---

### R5 — Apenas cervejas do portfólio Heineken (RN02)
- Toda lógica de recomendação retorna somente cervejas do seed Heineken.
- `active: false` exclui qualquer documento de listagens e detalhe (404).
- Nunca citar marcas concorrentes.

---

## 📋 Convenções Obrigatórias

### Formato de Resposta da API
```typescript
{ "data": T }           // sucesso — sempre
{ "error": "mensagem" } // erro — sempre
```
Nunca retornar objeto plano sem wrapper `data`.

### Imports no Frontend
```typescript
import { ... } from '@/components/...'  // ✅
import { ... } from '@/lib/...'         // ✅
import { ... } from '@sommeliere/types' // ✅ types compartilhados
import { ... } from '../../components' // ❌ — sempre usar alias @/
```

### Componentes Shadcn/UI
```bash
npx shadcn-ui@latest add button  # ✅ adicionar via CLI
# Nunca editar arquivos em /components/ui/ diretamente
```

### Age Gate — localStorage
```typescript
const AGE_GATE_KEY = 'sommeliere_age_verified'  // ✅ chave exata
localStorage.setItem(AGE_GATE_KEY, 'true')       // ✅ valor exato
```

### ISR — revalidate por rota
| Rota | revalidate |
|---|---|
| `/` | 3600s |
| `/categoria/[slug]` | 3600s |
| `/prato/[slug]` | 1800s |
| `/cervejas` e `/cervejas/[slug]` | 3600s |
| `/cervejas/[slug]/pratos` | SSR (sem cache) |
| `/gate` | Static |

### Paleta de Cores Heineken (tokens obrigatórios)
```css
heineken-green: #00A650   /* Verde principal */
heineken-dark:  #1A1A1A   /* Fundo escuro */
heineken-gold:  #C8A951   /* Dourado destaques */
heineken-cream: #F5F0E8   /* Fundo claro */
```
Nunca usar hex hardcoded — sempre os tokens `heineken-*`.

### Busca — comportamento obrigatório
- Debounce: 300ms
- Mínimo 2 caracteres para disparar request
- `400` se `q.length < 2`
- Máximo 20 resultados

### Ver Mais Combinações (F06)
- CTA visível somente se prato tem **mais de 3** recomendações ativas.
- Com 1–3 recomendações: exibir todas sem CTA.

---

## ✅ Checklist de Conformidade por Feature

Antes de submeter PR, verificar:

- [ ] Server Components por padrão — `"use client"` justificado?
- [ ] Conexão MongoDB via `connectDB()` cacheado?
- [ ] URLs usando `slug` kebab-case?
- [ ] Mensagem de compartilhamento inclui "Beba com moderação"?
- [ ] Somente cervejas do portfólio Heineken?
- [ ] Respostas da API no formato `{ data: T }` ou `{ error: "..." }`?
- [ ] Imports usando alias `@/` no frontend?
- [ ] Cores usando tokens `heineken-*`?
- [ ] `active: false` filtrando corretamente em todas as queries?

---

*Fonte: ADRs 001–008 + Business Logic + pre-prd.md*
*Março/2026 — Projeto educacional Mentoria Time 4*
