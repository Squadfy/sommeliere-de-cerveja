# Jornada do Cliente

> Mapeamento do ciclo completo de experiência do usuário com o Sommelière de Cerveja.
> Os contextos de uso (supermercado, restaurante, casa, evento) são cenários hipotéticos de ativação.

---

## Estágio 1: Descoberta (Awareness)

### Eventos Gatilho

| Cenário | Descrição |
|---|---|
| **PDV / Supermercado** | Usuário vê QR code na embalagem ou display da Heineken na gondola |
| **Evento Gastronômico** | QR code em mesa, cardápio ou totem em festival, feira ou evento da marca |
| **Campanha Digital** | Link compartilhado por amigo no WhatsApp ou Instagram Stories |
| **Restaurante Parceiro** | QR code no cardápio ou mesa em estabelecimento parceiro Heineken |

### Pergunta Central do Usuário

> "Qual cerveja combina com o que vou comer/preparar hoje?"

### Critério de Sucesso Nesta Etapa

- Curiosidade despertada pelo QR code ou link
- Decisão de escanear/acessar o app

---

## Estágio 2: Acesso e Gate de Maioridade

### Ações do Usuário

1. Escaneia QR code ou acessa link da campanha
2. PWA carrega com splash screen Heineken
3. Informa data de nascimento (ou confirma ser maior de 18 anos)

### Resposta do Sistema

- Se maior de 18: libera acesso à tela inicial
- Se menor de 18: exibe mensagem de bloqueio com comunicação responsável

### Pontos de Fricção Esperados

- Campo de data de nascimento pode ser percebido como burocrático
- **Mitigação:** Interface simplificada com seleção de ano + confirmação visual rápida

### Critério de Sucesso Nesta Etapa

- Usuário passa pelo gate sem abandono
- Experiência de maioridade percebida como simples e não invasiva

---

## Estágio 3: Tela Inicial e Navegação

### Ações do Usuário

- Visualiza categorias de pratos ilustradas (Carnes, Frutos do Mar, Massas, Petiscos, Vegetariano etc.)
- Ou utiliza campo de busca livre para digitar o prato desejado

### Resposta do Sistema

- Layout visual com ícones e ilustrações por categoria
- Campo de busca com sugestões ou autocomplete

### Padrões de Uso Esperados por Persona

| Persona | Comportamento Esperado |
|---|---|
| **Explorador (18-30)** | Navega por categorias, toca no que parece interessante, descobre combinações novas |
| **Apreciador (30-50)** | Busca direta por nome do prato que irá preparar/pedir |

### Critério de Sucesso Nesta Etapa

- Usuário encontra o prato desejado em até 2 interações
- Interface intuitiva — sem necessidade de tutorial

---

## Estágio 4: Seleção do Prato e Recomendação

### Ações do Usuário

1. Toca em uma categoria → seleciona prato específico
2. Visualiza a tela de resultado

### Resposta do Sistema

Exibe até 3 cervejas recomendadas do portfólio Heineken, ordenadas por afinidade:
- Imagem da cerveja + marca
- Título da recomendação
- Explicação sensorial (por que combina: semelhança, contraste ou complementação)
- Dica de serviço (temperatura ideal, tipo de copo)

### Momento de Maior Valor

> Esta é a tela mais importante do app. É aqui que o usuário aprende, se encanta e decide compartilhar.

### Critério de Sucesso Nesta Etapa

- Usuário lê a explicação sensorial (tempo na tela > 15 segundos)
- Compreende o porquê da recomendação
- Considera experimentar um estilo que não conhecia

---

## Estágio 5: Exploração e Engajamento

### Ações do Usuário

- Toca em "Ver mais combinações" para explorar outras cervejas compatíveis com o prato
- Navega pelo portfólio completo de marcas Heineken
- Acessa detalhes de serviço de uma cerveja específica

### Resposta do Sistema

- Exibe combinações alternativas ordenadas por grau de afinidade
- Apresenta página de portfólio com todas as marcas e seus perfis

### Indicadores de Engajamento Profundo

- Usuário consulta mais de 1 prato por sessão
- Usuário acessa a aba de portfólio completo
- Tempo de sessão > 2 minutos

---

## Estágio 6: Compartilhamento

### Ações do Usuário

- Toca em "Compartilhar" na tela de recomendação
- Seleciona plataforma (WhatsApp, Instagram)
- Compartilha card visual gerado automaticamente

### Resposta do Sistema

- Gera card visual com branding Heineken, nome do prato e cerveja recomendada
- Abre sheet nativo de compartilhamento do dispositivo

### Valor de Negócio

> Cada compartilhamento é um ponto de aquisição orgânico. O app se distribui via WOM (word-of-mouth) digital.

### Critério de Sucesso Nesta Etapa

- Taxa de compartilhamento > 15% das sessões
- Cards compartilhados geram novos acessos (ciclo de distribuição)

---

## Estágio 7: Retorno e Retenção

### Padrões de Retorno Esperados

- Usuário volta ao app em próxima ocasião de refeição/compra
- Retorno via link salvo, bookmark do PWA ou novo QR code
- Incentivado por novo compartilhamento recebido

### Indicadores de Retenção

- Usuário instala PWA na tela inicial do dispositivo
- Consultas em sessões distintas (recorrência)
- Diversidade de pratos consultados ao longo do tempo

### Risco de Abandono

- App percebido como "já usei, já vi tudo" após primeira sessão
- **Mitigação:** Conteúdo atualizado (novos pratos, edições sazonais), compartilhamentos que reativam o ciclo

---

## Fluxo Resumido

```
QR Code / Link
       ↓
  Gate de Idade
       ↓
  Tela Inicial
       ↓
 Seleciona Prato
       ↓
 Recomendação de Cerveja
       ↓
 [Explorar mais] ←→ [Compartilhar]
       ↓
  Nova Consulta
```
