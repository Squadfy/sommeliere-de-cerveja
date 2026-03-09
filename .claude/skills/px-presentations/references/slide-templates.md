# Templates de Slides PX

## Slide de Capa

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="col" style="width: 960px; height: 540px; background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); position: relative;">
  <!-- Accent bar -->
  <div style="position: absolute; top: 0; right: 80px; width: 60px; height: 100px; background: #f0a500; border-radius: 0 0 8px 8px;"></div>
  
  <!-- Main content -->
  <div class="col center fill-height" style="padding: 60px;">
    <h1 style="font-size: 72px; color: #ffffff; font-weight: 700; letter-spacing: 2px; margin: 0;">TÍTULO</h1>
    <p style="font-size: 120px; color: #f0a500; font-weight: 800; margin: -10px 0 30px 0; letter-spacing: 4px;">2025</p>
    <div style="width: 120px; height: 4px; background: #f0a500; margin-bottom: 30px;"></div>
    <p style="font-size: 18px; color: rgba(255,255,255,0.8); letter-spacing: 1px;">PX ATIVOS JUDICIAIS</p>
  </div>
</body>
</html>
```

## Slide de Conteúdo com Métricas

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="col" style="width: 960px; height: 540px; background: #ffffff; position: relative;">
  <!-- Header bar -->
  <div style="width: 100%; height: 60px; background: #1e3a5f; position: relative;">
    <div style="position: absolute; top: 0; right: 80px; width: 50px; height: 80px; background: #f0a500; border-radius: 0 0 6px 6px;"></div>
  </div>
  
  <!-- Title section -->
  <div style="padding: 30px 40px 20px 40px;">
    <h1 style="font-size: 32px; color: #1e3a5f; margin: 0;">Título da <span style="color: #f0a500;">Seção</span></h1>
    <p style="font-size: 14px; color: #666; margin: 8px 0 0 0;">Subtítulo descritivo</p>
  </div>
  
  <!-- Metrics row -->
  <div class="row" style="padding: 15px 40px; gap: 20px;">
    <div style="flex: 1; background: #1e3a5f; padding: 25px 20px; border-radius: 8px;">
      <p style="font-size: 48px; color: #ffffff; font-weight: 700; margin: 0;">500+</p>
      <p style="font-size: 13px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">Label</p>
    </div>
    <div style="flex: 1; background: #f0a500; padding: 25px 20px; border-radius: 8px;">
      <p style="font-size: 48px; color: #1e3a5f; font-weight: 700; margin: 0;">200+</p>
      <p style="font-size: 13px; color: rgba(30,58,95,0.8); margin: 5px 0 0 0;">Label</p>
    </div>
    <div style="flex: 1; background: #f5f7fa; padding: 25px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <p style="font-size: 48px; color: #1e3a5f; font-weight: 700; margin: 0;">100%</p>
      <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Label</p>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="position: absolute; bottom: 25px; left: 40px;">
    <p style="font-size: 10px; color: #999; margin: 0;">Tech Report 2025 | PX Ativos Judiciais</p>
  </div>
  <div style="position: absolute; bottom: 25px; right: 40px;">
    <p style="font-size: 10px; color: #999; margin: 0;">01</p>
  </div>
</body>
</html>
```

## Slide com Seção e Ícone

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="col" style="width: 960px; height: 540px; background: #ffffff; position: relative;">
  <!-- Header bar -->
  <div style="width: 100%; height: 60px; background: #1e3a5f; position: relative;">
    <div style="position: absolute; top: 0; right: 80px; width: 50px; height: 80px; background: #f0a500; border-radius: 0 0 6px 6px;"></div>
  </div>
  
  <!-- Title section with icon -->
  <div class="row" style="padding: 25px 40px 15px 40px; gap: 15px; align-items: center;">
    <div style="width: 50px; height: 50px; background: #f0a500; border-radius: 10px;"></div>
    <div>
      <h1 style="font-size: 28px; color: #1e3a5f; margin: 0;">Nome da Seção</h1>
      <p style="font-size: 13px; color: #666; margin: 3px 0 0 0;">Descrição breve</p>
    </div>
  </div>
  
  <!-- Content area -->
  <div class="row" style="padding: 10px 40px; gap: 25px; flex: 1;">
    <!-- Left column -->
    <div class="col" style="flex: 1; gap: 12px;">
      <div style="background: #f5f7fa; padding: 18px 20px; border-radius: 8px; border-left: 4px solid #7ac47a;">
        <p style="font-size: 15px; color: #1e3a5f; font-weight: 700; margin: 0;">Feature 1</p>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Descrição da feature</p>
      </div>
      <div style="background: #f5f7fa; padding: 18px 20px; border-radius: 8px; border-left: 4px solid #f0a500;">
        <p style="font-size: 15px; color: #1e3a5f; font-weight: 700; margin: 0;">Feature 2</p>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Descrição da feature</p>
      </div>
    </div>
    
    <!-- Right column -->
    <div class="col" style="flex: 1; gap: 12px;">
      <div style="background: #1e3a5f; padding: 30px 25px; border-radius: 10px; text-align: center;">
        <p style="font-size: 56px; color: #ffffff; font-weight: 700; margin: 0;">500+</p>
        <p style="font-size: 13px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">Métrica principal</p>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="position: absolute; bottom: 25px; left: 40px;">
    <p style="font-size: 10px; color: #999; margin: 0;">Tech Report 2025 | PX Ativos Judiciais</p>
  </div>
  <div style="position: absolute; bottom: 25px; right: 40px;">
    <p style="font-size: 10px; color: #999; margin: 0;">02</p>
  </div>
</body>
</html>
```

## Slide Final (Obrigado)

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="col" style="width: 960px; height: 540px; background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); position: relative;">
  <!-- Accent bar -->
  <div style="position: absolute; top: 0; right: 80px; width: 60px; height: 100px; background: #f0a500; border-radius: 0 0 8px 8px;"></div>
  
  <!-- Main content -->
  <div class="col center fill-height" style="padding: 60px;">
    <h1 style="font-size: 64px; color: #ffffff; font-weight: 700; margin: 0 0 30px 0;">Obrigado!</h1>
    
    <!-- Metrics row -->
    <div class="row" style="gap: 50px; margin-bottom: 40px;">
      <div style="text-align: center;">
        <p style="font-size: 48px; color: #f0a500; font-weight: 700; margin: 0;">15+</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Métrica 1</p>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 48px; color: #f0a500; font-weight: 700; margin: 0;">8</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Métrica 2</p>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 48px; color: #f0a500; font-weight: 700; margin: 0;">100%</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 5px 0 0 0;">Métrica 3</p>
      </div>
    </div>
    
    <div style="width: 120px; height: 4px; background: #f0a500; margin-bottom: 25px;"></div>
    
    <p style="font-size: 14px; color: rgba(255,255,255,0.8); text-align: center; max-width: 600px; line-height: 1.6; margin: 0;">Mensagem de encerramento com visão de futuro.</p>
  </div>
  
  <!-- Footer -->
  <div style="position: absolute; bottom: 25px; left: 40px; right: 40px; text-align: center;">
    <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">PX ATIVOS JUDICIAIS | 2025</p>
  </div>
</body>
</html>
```
