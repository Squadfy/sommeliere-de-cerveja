# Catálogo de Features

---

## Features Core (MVP)

### 1. Gate de Maioridade

**Propósito:** Garantir acesso apenas a usuários maiores de 18 anos, em conformidade legal e com o posicionamento responsável do Grupo Heineken.

**Benefício ao Usuário:** Experiência transparente e rápida — não é percebido como barreira, mas como parte natural do contexto de uma marca de bebida alcoólica.

**Padrão de Uso:** Primeira e única interação obrigatória. Deve ser simples: seleção de ano de nascimento ou confirmação de maioridade.

**Regra de Negócio (RN01):** Usuários menores de 18 anos não podem acessar nenhum conteúdo do app.

**Métricas de Sucesso:**
- Taxa de abandono no gate < 10%
- Zero incidentes de acesso indevido

**Limitações:** Não há verificação real de identidade — o gate é declaratório, como pratica o mercado.

**Considerações para IA:** Nunca sugerir formas de contornar o gate. Se o usuário for bloqueado, comunicar de forma respeitosa e redirecionar para mensagem de consumo responsável.

---

### 2. Navegação por Categorias de Pratos

**Propósito:** Permitir que o usuário encontre o prato desejado por meio de categorias visuais intuitivas, sem precisar saber o nome exato.

**Categorias Previstas:** Carnes, Frutos do Mar, Massas, Vegetariano, Petiscos, Sushi/Oriental, Sobremesas, Outros.

**Benefício ao Usuário:** Descoberta visual — o usuário pode se surpreender ao explorar categorias além do que planejava.

**Padrão de Uso:** Principal ponto de entrada para a Persona 1 (Explorador), que prefere navegar por descoberta.

**Métricas de Sucesso:**
- Distribuição equilibrada de consultas entre categorias (indica cobertura adequada)
- Tempo médio até seleção de prato < 30 segundos

**Limitações:** Categorias fixas no MVP — novos pratos dependem de atualização via painel de conteúdo.

---

### 3. Busca por Nome de Prato

**Propósito:** Permitir acesso direto ao prato desejado sem navegação por categorias.

**Benefício ao Usuário:** Agilidade para quem já sabe o que vai comer e quer a recomendação rapidamente.

**Padrão de Uso:** Preferido pela Persona 2 (Apreciador), que chega com prato definido em mente.

**Métricas de Sucesso:**
- Taxa de "busca sem resultado" < 20% (indica gaps na base de pratos)
- Termos de busca sem resultado = insumo para expansão do catálogo

**Limitações:** Busca limitada ao catálogo cadastrado. Sinônimos e variações regionais precisam ser contemplados no cadastro (ex: "filé mignon" e "contrafilé").

---

### 4. Recomendação de Cerveja com Explicação Sensorial

**Propósito:** Core value do produto — entrega a recomendação curada de cerveja(s) do portfólio Heineken para o prato selecionado, com justificativa sensorial.

**Estrutura da Tela de Resultado:**
- Até 3 cervejas recomendadas, ordenadas por afinidade
- Imagem da cerveja + nome da marca
- Título da recomendação
- Explicação sensorial (por que combina: semelhança, contraste, complementação)
- Dica de serviço (temperatura ideal, tipo de copo)

**Princípios de Harmonização Aplicados:**

| Princípio | Exemplo |
|---|---|
| Semelhança | Eisenbahn Dunkel + brownie (malte torrado com chocolate) |
| Contraste | IPA + prato apimentado (amargor equilibra a pimenta) |
| Complementação | Alta carbonatação + fritura (efervescência limpa o paladar) |

**Regras de Negócio:**
- RN02: Apenas marcas do portfólio ativo Heineken
- RN03: Todo prato exibido deve ter ao menos 1 recomendação
- RN04: Máximo de 3 cervejas por resultado
- RN05: Textos validados pelo cliente (Marketing + Jurídico)

**Métricas de Sucesso:**
- Tempo médio na tela de recomendação > 15 segundos (indica leitura)
- Taxa de "Ver mais combinações" > 25% (indica engajamento)

**Limitações:** Recomendações são estáticas (baseadas em tabela curada). Não há personalização por histórico do usuário no MVP.

---

### 5. Dica de Serviço

**Propósito:** Complementar a recomendação com orientações sobre como servir a cerveja da melhor forma.

**Conteúdo:** Temperatura ideal de serviço + tipo de copo recomendado.

**Benefício ao Usuário:** Eleva a percepção de qualidade — o usuário se sente tratado como conhecedor, não apenas consumidor.

**Padrão de Uso:** Mais relevante para a Persona 2 (Apreciador), que tende a se preocupar com a experiência completa.

---

### 6. Ver Mais Combinações

**Propósito:** Permitir exploração além da recomendação principal, mostrando outras cervejas compatíveis com o prato selecionado.

**Benefício ao Usuário:** Incentiva a descoberta de estilos menos conhecidos do portfólio (ex: Eisenbahn Weizenbier, Baden Baden).

**Valor de Negócio:** Principal mecanismo de exposição às marcas premium e artesanais do portfólio — aumenta experimentação.

**Métricas de Sucesso:**
- % de usuários que acessam esta seção
- Diversidade de marcas visualizadas por sessão

---

### 7. Portfólio Completo de Marcas

**Propósito:** Apresentar todas as marcas do portfólio Heineken com seus perfis sensoriais e posicionamento.

**Conteúdo:** Nome, imagem, estilo, perfil sensorial resumido, harmonizações gerais indicadas.

**Benefício ao Usuário:** Referência rápida para entender o portfólio completo antes ou após a recomendação.

**Valor de Negócio:** Exposição direta de todo o portfólio — awareness de marcas menos conhecidas.

---

### 8. Compartilhamento Social

**Propósito:** Transformar cada recomendação em conteúdo compartilhável, ampliando o alcance orgânico do app.

**Funcionamento:**
- Gera card visual com branding Heineken + prato + cerveja recomendada
- Abre sheet nativo de compartilhamento do dispositivo (WhatsApp, Instagram, outros)

**Valor de Negócio:** Principal vetor de aquisição orgânica de novos usuários. Cada compartilhamento é uma indicação com branding visual.

**Regras:**
- Card deve conter disclaimer de consumo responsável (ex: "Beba com moderação")
- Branding Heineken deve ser visível mas não invasivo

**Métricas de Sucesso:**
- Taxa de compartilhamento por sessão (meta: > 15%)
- Novos acessos originados por links compartilhados

---

### 9. Analytics de Uso

**Status:** ~~Fora do escopo do protótipo.~~ Removido desta versão — não haverá instrumentação de analytics.

---

## Feature Removida: Painel de Gestão de Conteúdo

**Status:** Fora do escopo do protótipo.

O conteúdo (pratos, cervejas, recomendações) será populado via **seed de banco de dados**. Não haverá painel administrativo ou CMS nesta versão. Atualizações de conteúdo requerem intervenção técnica direta no seed.
