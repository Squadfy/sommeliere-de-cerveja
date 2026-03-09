---
name: px-presentations
description: "Criacao de apresentacoes profissionais no padrao visual PX Ativos Judiciais. Use esta skill quando precisar criar apresentacoes (.pptx) para a PX Tech, incluindo: Tech Reports, apresentacoes comerciais, relatorios de projetos, ou qualquer material institucional da PX. A skill aplica automaticamente as cores, tipografia e elementos visuais da identidade PX."
---

# PX Presentations

Skill para criacao de apresentacoes profissionais seguindo o padrao visual da PX Ativos Judiciais / PX Tech.

## Instalacao de Dependencias

### Node.js (Recomendado)

```bash
npm install puppeteer pptxgenjs --save-dev
```

O conversor usa **Puppeteer** para renderizar cada slide HTML como imagem de alta qualidade (1920x1080), garantindo fidelidade visual perfeita.

### Python (Alternativa)

```bash
pip install python-pptx
```

## Temas Disponiveis

A skill suporta multiplos temas visuais. **IMPORTANTE**: Sempre pergunte ao usuario qual tema deseja usar antes de gerar a apresentacao.

| Tema | Descricao | Background | Primary | Accent |
|------|-----------|------------|---------|--------|
| `px` | PX Ativos Judiciais | #1e3a5f (Navy) | #ffffff | #f0a500 (Amber) |
| `cdd` | Curso CDD / AI Frontiers | #1C1C1C (Dark) | #C4E538 (Lime) | #8B5CF6 (Purple) |
| `cortex` | Cortex Framework | #0F172A (Navy escuro) | #A855F7 (Purple) | #22D3EE (Cyan) |
| `minimal` | Tons neutros | #FFFFFF | #1F2937 (Gray) | #3B82F6 (Blue) |
| `dark` | Tema escuro | #0A0A0A (Black) | #FBBF24 (Yellow) | #F97316 (Orange) |

### Paletas Completas por Tema

#### Tema PX (padrao corporativo)
```javascript
const THEME_PX = {
    background: '1E3A5F',
    backgroundGradient: '2D4A6F',
    primary: 'F0A500',
    text: 'FFFFFF',
    textMuted: '94A3B8',
    card: 'FFFFFF',
    cardText: '1E3A5F'
};
```

#### Tema CDD / AI Frontiers (curso)
```javascript
const THEME_CDD = {
    background: '1C1C1C',
    backgroundGradient: '0F0F0F',
    primary: 'C4E538',
    text: 'FFFFFF',
    textMuted: '9CA3AF',
    textDark: '6B7280',
    card: '2D2D2D',
    purple: '8B5CF6'
};
```

#### Tema Cortex (framework)
```javascript
const THEME_CORTEX = {
    background: '0F172A',
    backgroundGradient: '1E293B',
    primary: 'A855F7',
    accent: '22D3EE',
    text: 'FFFFFF',
    textMuted: '94A3B8',
    card: '1E293B'
};
```

#### Tema Minimal (clean)
```javascript
const THEME_MINIMAL = {
    background: 'FFFFFF',
    primary: '1F2937',
    accent: '3B82F6',
    text: '1F2937',
    textMuted: '6B7280',
    card: 'F3F4F6'
};
```

#### Tema Dark (moderno)
```javascript
const THEME_DARK = {
    background: '0A0A0A',
    primary: 'FBBF24',
    accent: 'F97316',
    text: 'FFFFFF',
    textMuted: 'A1A1AA',
    card: '18181B'
};
```

## Identidade Visual PX (Referencia)

### Paleta de Cores Original

```css
--color-primary: #1e3a5f;         /* Azul PX - fundos principais, header */
--color-primary-foreground: #ffffff;
--color-secondary: #f0a500;        /* Amarelo/Dourado PX - destaques, acentos */
--color-secondary-foreground: #1e3a5f;
--color-surface: #ffffff;
--color-muted: #f5f7fa;            /* Backgrounds suaves */
--color-muted-foreground: #4a5568;
--color-border: #e2e8f0;
```

### Elementos Visuais Obrigatorios

1. **Header Bar**: Barra azul (#1e3a5f) no topo, altura 60px
2. **Accent Element**: Retangulo amarelo (#f0a500) no canto superior direito, descendo do header
3. **Footer**: Texto discreto com "Tech Report [ANO] | PX Ativos Judiciais" a esquerda e numero da pagina a direita
4. **Icones de secao**: Quadrado amarelo arredondado (50x50px) antes dos titulos de secao

### Estrutura dos Slides

#### Slide de Capa
- Background: Gradiente azul (#1e3a5f -> #2d4a6f)
- Titulo grande centralizado em branco
- Ano em destaque na cor amarela
- Linha divisoria amarela
- Nome da empresa abaixo

#### Slides de Conteudo
- Header bar azul com accent amarelo
- Titulo da secao com icone amarelo
- Subtitulo em cinza
- Cards com metricas em destaque
- Elementos com border-left amarelo para highlights

#### Slide Final (Obrigado)
- Similar a capa
- Metricas em amarelo
- Mensagem de continuidade

## Workflow de Criacao

### 1. Criar slides HTML

Cada slide e um arquivo HTML separado seguindo o padrao:
- Dimensoes: 960x540px
- Position relative no body
- Usar classes do framework global.css

### 2. Padroes de componentes

**Metric Card (azul)**:
```html
<div style="background: #1e3a5f; padding: 25px; border-radius: 10px;">
  <p style="font-size: 48px; color: #ffffff; font-weight: 700;">500+</p>
  <p style="font-size: 13px; color: rgba(255,255,255,0.8);">Label</p>
</div>
```

**Metric Card (amarelo)**:
```html
<div style="background: #f0a500; padding: 25px; border-radius: 10px;">
  <p style="font-size: 48px; color: #1e3a5f; font-weight: 700;">200+</p>
  <p style="font-size: 13px; color: rgba(30,58,95,0.8);">Label</p>
</div>
```

**Highlight com border**:
```html
<div style="border-left: 4px solid #f0a500; padding-left: 15px;">
  <p style="font-size: 15px; color: #1e3a5f; font-weight: 700;">Titulo</p>
  <p style="font-size: 12px; color: #666;">Descricao</p>
</div>
```

**Feature Card**:
```html
<div style="background: #f5f7fa; padding: 18px 20px; border-radius: 8px; border-left: 4px solid #7ac47a;">
  <p style="font-size: 15px; color: #1e3a5f; font-weight: 700;">Titulo</p>
  <p style="font-size: 12px; color: #666;">Descricao</p>
</div>
```

### 3. Footer padrao

Sempre posicionado a 25px do bottom:
```html
<div style="position: absolute; bottom: 25px; left: 40px;">
  <p style="font-size: 10px; color: #999; margin: 0;">Tech Report [ANO] | PX Ativos Judiciais</p>
</div>
<div style="position: absolute; bottom: 25px; right: 40px;">
  <p style="font-size: 10px; color: #999; margin: 0;">[NUM]</p>
</div>
```

### 4. Gerar PPTX

#### Metodo Recomendado: Geracao Nativa (100% Editavel)

Gerar PPTX programaticamente usando pptxgenjs direto, seguindo a especificacao do Claude.ai.

**Vantagens:**
- Slides 100% editaveis no PowerPoint/Google Slides
- Textos, shapes e cores podem ser modificados
- Menor tamanho de arquivo
- Melhor compatibilidade

**Especificacao pptxgenjs:**
```javascript
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

// Layout 16:9 (10 x 5.625 inches)
pres.layout = 'LAYOUT_16x9';

// Tema
pres.theme = { headFontFace: 'Segoe UI', bodyFontFace: 'Segoe UI' };

// Cores sem # (hex puro)
const COLORS = {
    background: '1C1C1C',
    primary: 'C4E538',
    text: 'FFFFFF'
};

// Conversao px -> inches
// x: (px / 960) * 10
// y: (px / 540) * 5.625
// fontSize: px * 0.75

// Criar slide
const slide = pres.addSlide();
slide.background = { color: COLORS.background };

// Shapes (usar pres.shapes.NOME)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.42, y: 0.1, w: 4, h: 0.5,
    fill: { color: COLORS.primary },
    rectRadius: 0.1
});

// Textos
slide.addText('Titulo', {
    x: 0, y: 2, w: 10, h: 0.7,
    fontSize: 42, color: COLORS.text,
    bold: true, align: 'center', valign: 'middle'
});

// Salvar
pres.writeFile({ fileName: 'output.pptx' });
```

**Workflow:**
1. IA le esta skill e entende a spec pptxgenjs
2. **IA pergunta ao usuario qual tema deseja usar** (px, cdd, cortex, minimal, dark)
3. IA gera script JavaScript customizado para o contexto e tema escolhido
4. IA executa o script gerado
5. PPTX editavel e criado

#### Metodo Alternativo: HTML para Imagens

Usa Puppeteer para renderizar HTML como imagens. Util quando a fidelidade visual e mais importante que editabilidade.

```bash
node .claude/scripts/html2pptx/convert.js --input <dir_html> --output <arquivo.pptx>
```

**Como funciona:**
1. Puppeteer abre cada HTML em viewport 960x540
2. Captura screenshot em 2x (1920x1080) para alta qualidade
3. pptxgenjs monta o PPTX com as imagens como slides

#### Opcao Python (python-pptx)

```bash
python .claude/scripts/reports/pptx_generator.py --type weekly --output weekly_report.pptx --data metrics.json
```

### 5. Validar visualmente

Converter para PDF/imagens e verificar:
```bash
# LibreOffice
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide

# Ou abrir diretamente no PowerPoint/Google Slides
```

## Tipografia

- **Titulos principais**: 28-32px, bold, cor #1e3a5f
- **Subtitulos**: 13-14px, cor #666
- **Metricas grandes**: 48-56px, bold
- **Labels de metricas**: 11-13px
- **Footer**: 10px, cor #999
- **Texto de destaque em cards**: 14-15px, bold

## Observacoes Importantes

- Manter margens de 40px nas laterais
- Usar gap de 15-25px entre elementos
- Cards devem ter border-radius de 8-12px
- Status badges: verde (#7ac47a) para concluido, amarelo (#f0a500) para em andamento
- Indicadores (bullets): 6-8px de diametro, cores por status

## Scripts Disponiveis

| Script | Localizacao | Descricao |
|--------|-------------|-----------|
| convert.js | `.claude/scripts/html2pptx/convert.js` | Converte HTML para PPTX (imagens) |
| pptx_generator.py | `.claude/scripts/reports/pptx_generator.py` | Gera PPTX programaticamente (Python) |

> **Nota**: Para geracao nativa editavel, a IA gera scripts customizados sob demanda usando a spec acima.

## Notas Importantes pptxgenjs

- **Shapes**: Usar `pres.shapes.OVAL` (nao ELLIPSE), `pres.shapes.ROUNDED_RECTANGLE`, etc.
- **Cores**: Hex sem `#` (ex: `'C4E538'` nao `'#C4E538'`)
- **charSpacing**: Evitar - pode causar letras separadas em alguns renderizadores
- **line**: Nao usar `line: null` - omitir a propriedade quando nao necessaria

## Dependencias npm

```json
{
  "devDependencies": {
    "puppeteer": "^23.0.0",
    "pptxgenjs": "^4.0.0"
  }
}
```
