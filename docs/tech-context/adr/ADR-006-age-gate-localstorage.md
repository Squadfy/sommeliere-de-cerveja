# ADR-006: Age Gate via localStorage (client-side)

**Status:** Aceito
**Data:** Março/2026

---

## Contexto

O app exige verificação de maioridade (18+) conforme RN01. A verificação deve ser declaratória (sem validação real de identidade), exibida apenas na primeira visita, e não deve bloquear o carregamento de páginas compartilhadas via deep link.

## Decisão

Implementar o gate **100% client-side** usando `localStorage` para persistir a aprovação entre sessões. O gate é verificado no cliente via `useEffect` antes de renderizar qualquer conteúdo protegido.

## Implementação

```typescript
// Chave no localStorage
const AGE_GATE_KEY = 'sommeliere_age_verified'

// Verificação no componente de gate
useEffect(() => {
  const verified = localStorage.getItem(AGE_GATE_KEY)
  if (verified === 'true') {
    router.replace(redirect || '/')
  }
}, [])

// Após aprovação
function handleApprove() {
  localStorage.setItem(AGE_GATE_KEY, 'true')
  router.replace(redirect || '/')
}
```

## Preservação do Deep Link

Quando novo usuário recebe link compartilhado e acessa `/prato/pizza`:

1. Middleware Next.js verifica `cookie` ou o componente cliente verifica localStorage
2. Se não aprovado: redireciona para `/gate?redirect=/prato/pizza`
3. Após aprovação: redireciona para `/prato/pizza`

```typescript
// apps/web/middleware.ts — proteção de rotas
export function middleware(request: NextRequest) {
  // O gate é client-side; o middleware apenas injeta o redirect param
  // A verificação real ocorre no AgeGateProvider (client component)
}
```

## Alternativas Consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Cookie HTTP-only (server-side) | Complexidade adicional sem benefício — gate é declaratório |
| Session storage | Pede confirmação em cada nova aba/janela — UX ruim |
| Pedir a cada sessão | Fricção desnecessária para usuários recorrentes; gate declaratório não exige isso |
| Sem persistência (sempre exibir) | Abandono alto para usuários recorrentes |

## Consequências

**Positivas:**
- Setup zero — sem cookies, sem backend, sem sessão
- Funciona offline (PWA)
- Sem flash de conteúdo bloqueado em visitas recorrentes

**Negativas:**
- Limpar dados do browser apaga a aprovação — usuário verá o gate novamente (comportamento aceitável)
- Não verifica identidade real — padrão do mercado para gates declaratórios

## Nota de Compliance

Gate declaratório é prática padrão da indústria para conteúdo de bebidas alcoólicas no Brasil. A responsabilidade legal é do usuário ao afirmar maioridade.
